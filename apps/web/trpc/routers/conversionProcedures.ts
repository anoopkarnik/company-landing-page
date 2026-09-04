import { TRPCError } from "@trpc/server";
import db, { Prisma } from "@workspace/database/client";
import { headers } from "next/headers";
import { z } from "zod";

import { sendSupportEmail } from "@workspace/email/resend/index";
import { getRatelimit } from "@/server/ratelimit";
import { portfolioScreenshotsSchema } from "@/lib/zod/cms";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/trpc/init";

function cmsKey() {
  return process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page";
}

async function getLandingPage() {
  const landingPage = await db.landingPage.findUnique({
    where: { key: cmsKey() },
  });
  if (!landingPage) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Landing page CMS record not found",
    });
  }
  return landingPage;
}

function strings(value: Prisma.JsonValue): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function records(value: Prisma.JsonValue): Array<Record<string, unknown>> {
  return Array.isArray(value)
    ? value
        .filter(
          (item) =>
            Boolean(item) && typeof item === "object" && !Array.isArray(item),
        )
        .map((item) => item as Record<string, unknown>)
    : [];
}

function publicUrl(value?: string | null) {
  const candidate = value?.trim();
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function publicHref(value?: string | null) {
  const candidate = value?.trim();
  if (!candidate) return null;
  if (candidate.startsWith("#") || candidate.startsWith("/")) return candidate;
  return publicUrl(candidate);
}

function priceLabel(value: number | null, currency: string | null) {
  if (value === null) return null;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency || "USD"} ${value.toLocaleString("en")}`;
  }
}

function caseStudyIsPublic(study: {
  isPublished: boolean;
  confidentiality: string;
  clientConsentGranted: boolean;
}) {
  return (
    study.isPublished &&
    (study.confidentiality === "ANONYMIZED" ||
      (study.confidentiality === "PUBLIC" && study.clientConsentGranted))
  );
}

function toPublicCaseStudy(study: any) {
  const media = records(study.gallery)
    .map((item) => ({
      type: typeof item.type === "string" ? item.type : "image",
      url: publicUrl(typeof item.url === "string" ? item.url : null),
      alt: typeof item.alt === "string" ? item.alt : null,
      caption: typeof item.caption === "string" ? item.caption : null,
    }))
    .filter((item): item is typeof item & { url: string } => Boolean(item.url));
  const metrics = records(study.metrics)
    .map((item) => ({
      value: typeof item.value === "string" ? item.value : "",
      label: typeof item.label === "string" ? item.label : "",
      context: typeof item.context === "string" ? item.context : null,
      verified: item.verified === true,
    }))
    .filter((item) => item.value && item.label);

  return {
    id: study.id,
    slug: study.slug,
    title: study.title,
    clientName: study.clientName,
    clientLogoUrl: publicUrl(study.clientLogoUrl),
    industry: study.industry,
    summary: study.summary,
    challenge: study.challenge,
    solution: study.solutionMdx,
    solutionMdx: study.solutionMdx,
    outcome: study.outcomeMdx,
    outcomeMdx: study.outcomeMdx,
    architectureMdx: study.architectureMdx,
    contribution: study.contributionMdx,
    contributionMdx: study.contributionMdx,
    metrics,
    technologies: strings(study.technologies),
    serviceSlugs: strings(study.serviceSlugs),
    timeline: study.timeline,
    coverImageUrl: publicUrl(study.coverImageUrl),
    videoUrl: publicUrl(study.demoVideoUrl),
    demoVideoUrl: publicUrl(study.demoVideoUrl),
    projectUrl: publicUrl(study.projectUrl),
    media,
    gallery: media,
    testimonialQuote:
      study.confidentiality === "PUBLIC" && study.clientConsentGranted
        ? study.testimonialQuote
        : null,
    featured: study.isFeatured,
    published: true,
    seoTitle: study.seoTitle,
    seoDescription: study.seoDescription,
    updatedAt: study.updatedAt.toISOString(),
  };
}

const publicCaseStudyWhere: Prisma.CaseStudyWhereInput = {
  isPublished: true,
  OR: [
    { confidentiality: "ANONYMIZED" },
    { confidentiality: "PUBLIC", clientConsentGranted: true },
  ],
};

export async function getPublicCaseStudies() {
  const landingPage = await getLandingPage();
  const studies = await db.caseStudy.findMany({
    where: { landingPageId: landingPage.id, ...publicCaseStudyWhere },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { updatedAt: "desc" }],
  });
  return studies.filter(caseStudyIsPublic).map(toPublicCaseStudy);
}

export async function getPublicCaseStudyBySlug(slug: string) {
  const landingPage = await getLandingPage();
  const study = await db.caseStudy.findFirst({
    where: {
      landingPageId: landingPage.id,
      slug,
      ...publicCaseStudyWhere,
    },
  });
  return study && caseStudyIsPublic(study) ? toPublicCaseStudy(study) : null;
}

// Shape returned when the CMS row or database is unavailable. The landing page
// still server-renders: `publicData()` on the client normalises this to nulls
// and empty arrays, and `ConversionLanding` falls back to `landing.getLandingInfo`
// data (which has its own baked-snapshot fallback).
const EMPTY_CONVERSION_DATA: Record<string, unknown> = {
  hero: null,
  appointmentLink: null,
  headings: null,
  clientLogos: [],
  proofMetrics: [],
  servicePackages: [],
  featuredCaseStudies: [],
  caseStudies: [],
  portfolioProjects: [],
  processSteps: [],
  founderProfile: null,
  verifiedTestimonials: [],
};

export async function getPublicConversionData() {
  try {
    return await buildPublicConversionData();
  } catch (error) {
    console.error(
      "[conversion] Failed to load public conversion data; serving empty fallback so the landing page still renders",
      error,
    );
    return EMPTY_CONVERSION_DATA;
  }
}

async function buildPublicConversionData() {
  const landingPage = await getLandingPage();
  const [servicePackages, caseStudies, projects, proofMetrics, clientLogos, testimonials] =
    await Promise.all([
      db.servicePackage.findMany({
        where: { landingPageId: landingPage.id, isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      }),
      db.caseStudy.findMany({
        where: { landingPageId: landingPage.id, ...publicCaseStudyWhere },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      }),
      db.project.findMany({
        where: {
          landingPageId: landingPage.id,
          isPublished: true,
          confidentiality: { in: ["PUBLIC", "ANONYMIZED"] },
        },
        include: {
          caseStudies: {
            where: publicCaseStudyWhere,
            select: { slug: true },
            take: 1,
          },
        },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      }),
      db.proofMetric.findMany({
        where: {
          landingPageId: landingPage.id,
          isPublished: true,
          verificationStatus: "VERIFIED",
        },
        orderBy: { order: "asc" },
      }),
      db.clientLogo.findMany({
        where: {
          landingPageId: landingPage.id,
          isPublished: true,
          consentGranted: true,
        },
        orderBy: { order: "asc" },
      }),
      db.testimonial.findMany({
        where: {
          landingPageId: landingPage.id,
          isPublished: true,
          isVerified: true,
          consentGranted: true,
        },
        orderBy: { order: "asc" },
      }),
    ]);

  const safeCaseStudies = caseStudies
    .filter(caseStudyIsPublic)
    .map(toPublicCaseStudy);

  return {
    hero: {
      eyebrow: landingPage.heroEyebrow,
      headline: landingPage.tagline,
      subheadline:
        landingPage.valueProposition || landingPage.description,
      targetAudience: landingPage.targetAudience,
      primaryCtaLabel: landingPage.primaryCtaLabel,
      primaryCtaHref: publicHref(landingPage.primaryCtaLink),
      secondaryCtaLabel: landingPage.secondaryCtaLabel,
      secondaryCtaHref: publicHref(landingPage.secondaryCtaLink),
      availability: landingPage.availability,
      responseTime: landingPage.responseTime,
    },
    appointmentLink: publicHref(landingPage.appointmentLink),
    headings: {
      trust: landingPage.trustHeading,
      proof: landingPage.proofHeading,
      servicePackages: landingPage.servicePackagesHeading,
      servicePackagesDescription: landingPage.servicePackagesDescription,
      caseStudies: landingPage.caseStudiesHeading,
      caseStudiesDescription: landingPage.caseStudiesDescription,
      portfolio: landingPage.portfolioHeading,
      portfolioDescription: landingPage.portfolioDescription,
      process: landingPage.processHeading,
      processDescription: landingPage.processDescription,
      founder: landingPage.founderHeading,
      lead: landingPage.leadHeading,
      leadDescription: landingPage.leadDescription,
      leadSuccessMessage: landingPage.leadSuccessMessage,
    },
    clientLogos: clientLogos.flatMap((logo) => {
      const logoUrl = publicUrl(logo.logoUrl);
      if (!logoUrl) return [];
      return [{
        id: logo.id,
        name: logo.name,
        logoUrl,
        websiteUrl: publicUrl(logo.websiteUrl),
        approved: true,
      }];
    }),
    proofMetrics: proofMetrics.map((metric) => ({
      id: metric.id,
      value: metric.value,
      label: metric.label,
      context: metric.context,
      tooltip: metric.tooltip,
      verified: true,
    })),
    servicePackages: servicePackages.map((service) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      description: service.shortDescription,
      descriptionMdx: service.descriptionMdx,
      idealFor: service.idealFor,
      deliverables: strings(service.deliverables),
      technologies: strings(service.technologies),
      timeline: service.timeline,
      priceFrom: priceLabel(service.priceFrom, service.priceCurrency),
      ctaLabel: service.ctaLabel,
      ctaHref: publicHref(service.ctaLink),
      featured: service.isFeatured,
    })),
    featuredCaseStudies: safeCaseStudies.filter((study) => study.featured),
    caseStudies: safeCaseStudies,
    portfolioProjects: projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.publicDescription || project.description,
      category: project.category,
      disciplines: project.type
        ? project.type.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      technologies: strings(project.technologies),
      imageUrl: publicUrl(project.imageUrl),
      caseStudySlug: project.caseStudies[0]?.slug ?? null,
      websiteUrl: publicUrl(project.websiteLink),
      repositoryUrl: publicUrl(project.githubLink),
      featured: project.isFeatured,
      published: true,
    })),
    processSteps: records(landingPage.processSteps)
      .map((step, index) => ({
        id: String(index + 1),
        title: typeof step.title === "string" ? step.title : "",
        description:
          typeof step.description === "string" ? step.description : "",
      }))
      .filter((step) => step.title && step.description),
    founderProfile: landingPage.founderName
      ? {
          name: landingPage.founderName,
          title: landingPage.founderTitle,
          shortBio: landingPage.founderShortBio,
          longBio: landingPage.founderLongBio,
          imageUrl: publicUrl(landingPage.founderImageUrl),
          education: landingPage.founderEducation,
          location: landingPage.founderLocation,
          socialLinks: records(landingPage.founderSocialLinks)
            .map((link) => ({
              label: typeof link.label === "string" ? link.label : "",
              url: publicUrl(typeof link.url === "string" ? link.url : null),
            }))
            .filter((link): link is { label: string; url: string } =>
              Boolean(link.label && link.url),
            ),
          journey: records(landingPage.founderTimeline)
            .map((entry) => ({
              label: typeof entry.label === "string" ? entry.label : null,
              title: typeof entry.title === "string" ? entry.title : "",
              description:
                typeof entry.description === "string"
                  ? entry.description
                  : null,
            }))
            .filter((entry) => entry.title),
        }
      : null,
    verifiedTestimonials: testimonials.map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.position,
      company: testimonial.company,
      quote: testimonial.comment,
      imageUrl: publicUrl(testimonial.imageUrl),
      companyLogoUrl: publicUrl(testimonial.companyLogoUrl),
      sourceUrl: publicUrl(testimonial.sourceUrl),
      verified: true,
      consentGranted: true,
    })),
  };
}

const optionalText = (max = 5000) => z.string().trim().max(max).optional();
const optionalUrl = z.string().trim().url().or(z.literal("")).optional();
const id = z.string().trim().min(1).optional();
const slug = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const jsonRecords = z.array(z.record(z.string(), z.unknown())).max(100);
const stringList = z.array(z.string().trim().min(1).max(200)).max(100);

const servicePackageSchema = z.object({
  id,
  slug,
  title: z.string().trim().min(1).max(160),
  shortDescription: z.string().trim().min(1).max(1200),
  descriptionMdx: optionalText(30000),
  idealFor: optionalText(2000),
  deliverables: stringList,
  technologies: stringList,
  faqs: jsonRecords,
  timeline: optionalText(120),
  priceFrom: z.number().int().nonnegative().optional(),
  priceCurrency: optionalText(10),
  icon: optionalText(80),
  imageUrl: optionalUrl,
  ctaLabel: optionalText(120),
  ctaLink: optionalText(1000),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  order: z.number().int().nonnegative(),
});

const caseStudySchema = z
  .object({
    id,
    slug,
    title: z.string().trim().min(1).max(200),
    clientName: optionalText(160),
    clientLogoUrl: optionalUrl,
    industry: optionalText(120),
    summary: z.string().trim().min(1).max(2400),
    challenge: optionalText(10000),
    solutionMdx: z.string().max(60000),
    outcomeMdx: optionalText(30000),
    architectureMdx: optionalText(30000),
    contributionMdx: optionalText(30000),
    serviceSlugs: stringList,
    technologies: stringList,
    metrics: jsonRecords,
    gallery: jsonRecords,
    timeline: optionalText(120),
    coverImageUrl: optionalUrl,
    demoVideoUrl: optionalUrl,
    projectUrl: optionalUrl,
    testimonialQuote: optionalText(3000),
    clientConsentGranted: z.boolean(),
    confidentiality: z.enum(["PUBLIC", "ANONYMIZED", "PRIVATE"]),
    isFeatured: z.boolean(),
    isPublished: z.boolean(),
    seoTitle: optionalText(160),
    seoDescription: optionalText(360),
    projectId: optionalText(100),
    order: z.number().int().nonnegative(),
  })
  .superRefine((study, context) => {
    if (study.isPublished && study.confidentiality === "PRIVATE") {
      context.addIssue({
        code: "custom",
        path: ["isPublished"],
        message: "Private case studies cannot be published",
      });
    }
    if (
      study.isPublished &&
      study.confidentiality === "PUBLIC" &&
      !study.clientConsentGranted
    ) {
      context.addIssue({
        code: "custom",
        path: ["clientConsentGranted"],
        message: "Public client-identifying case studies require consent",
      });
    }
  });

const portfolioProjectSchema = z.object({
  id,
  sourceId: optionalText(160),
  slug: slug.optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  publicDescription: optionalText(5000),
  type: optionalText(300),
  category: optionalText(100),
  clientName: optionalText(160),
  clientLogoUrl: optionalUrl,
  technologies: stringList,
  imageUrl: optionalUrl,
  screenshots: portfolioScreenshotsSchema,
  approvedMetrics: jsonRecords,
  contribution: optionalText(10000),
  githubLink: optionalUrl,
  websiteLink: optionalUrl,
  demoVideoUrl: optionalUrl,
  confidentiality: z.enum(["PUBLIC", "ANONYMIZED", "PRIVATE"]),
  isClientWork: z.boolean(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  order: z.number().int().nonnegative(),
});

const proofMetricSchema = z.object({
  id,
  value: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(200),
  context: optionalText(2000),
  tooltip: optionalText(1000),
  source: optionalText(1000),
  sourceProjectId: optionalText(100),
  verificationStatus: z.enum(["UNVERIFIED", "VERIFIED"]),
  isPublished: z.boolean(),
  order: z.number().int().nonnegative(),
});

const clientLogoSchema = z.object({
  id,
  name: z.string().trim().min(1).max(160),
  logoUrl: z.string().trim().url(),
  websiteUrl: optionalUrl,
  altText: optionalText(240),
  consentGranted: z.boolean(),
  isPublished: z.boolean(),
  order: z.number().int().nonnegative(),
});

const testimonialSchema = z.object({
  id,
  name: z.string().trim().min(1).max(160),
  position: optionalText(160),
  comment: z.string().trim().min(1).max(5000),
  imageUrl: optionalUrl,
  company: optionalText(160),
  companyLogoUrl: optionalUrl,
  sourceUrl: optionalUrl,
  isVerified: z.boolean(),
  consentGranted: z.boolean(),
  isPublished: z.boolean(),
  projectId: optionalText(100),
  order: z.number().int().nonnegative(),
});

const conversionSettingsSchema = z.object({
  heroEyebrow: optionalText(200),
  targetAudience: optionalText(500),
  tagline: optionalText(300),
  valueProposition: optionalText(1600),
  description: optionalText(3000),
  availability: optionalText(200),
  responseTime: optionalText(200),
  primaryCtaLabel: optionalText(120),
  primaryCtaLink: optionalText(1000),
  secondaryCtaLabel: optionalText(120),
  secondaryCtaLink: optionalText(1000),
  trustHeading: optionalText(300),
  proofHeading: optionalText(300),
  servicePackagesHeading: optionalText(300),
  servicePackagesDescription: optionalText(1200),
  caseStudiesHeading: optionalText(300),
  caseStudiesDescription: optionalText(1200),
  portfolioHeading: optionalText(300),
  portfolioDescription: optionalText(1200),
  processHeading: optionalText(300),
  processDescription: optionalText(1200),
  processSteps: jsonRecords,
  founderHeading: optionalText(300),
  founderName: optionalText(160),
  founderTitle: optionalText(200),
  founderShortBio: optionalText(3000),
  founderLongBio: optionalText(20000),
  founderImageUrl: optionalUrl,
  founderEducation: optionalText(1000),
  founderLocation: optionalText(300),
  founderTimeline: jsonRecords,
  founderSocialLinks: jsonRecords,
  leadHeading: optionalText(300),
  leadDescription: optionalText(2000),
  leadSuccessMessage: optionalText(1000),
  seoTitle: optionalText(160),
  seoDescription: optionalText(360),
  ogImageUrl: optionalUrl,
  organizationName: optionalText(240),
  organizationLogoUrl: optionalUrl,
});

function nullable(value?: string) {
  const clean = value?.trim();
  return clean ? clean : null;
}

async function replaceServicePackages(items: z.infer<typeof servicePackageSchema>[]) {
  const landingPage = await getLandingPage();
  const existing = new Set(
    (await db.servicePackage.findMany({
      where: { landingPageId: landingPage.id },
      select: { id: true },
    })).map((item) => item.id),
  );
  const retained = items.flatMap((item) =>
    item.id && existing.has(item.id) ? [item.id] : [],
  );
  await db.$transaction(async (tx) => {
    await tx.servicePackage.deleteMany({
      where: {
        landingPageId: landingPage.id,
        ...(retained.length ? { id: { notIn: retained } } : {}),
      },
    });
    for (const [order, item] of items.entries()) {
      const data = {
        slug: item.slug,
        title: item.title,
        shortDescription: item.shortDescription,
        descriptionMdx: nullable(item.descriptionMdx),
        idealFor: nullable(item.idealFor),
        deliverables: item.deliverables as Prisma.InputJsonValue,
        technologies: item.technologies as Prisma.InputJsonValue,
        faqs: item.faqs as Prisma.InputJsonValue,
        timeline: nullable(item.timeline),
        priceFrom: item.priceFrom ?? null,
        priceCurrency: nullable(item.priceCurrency),
        icon: nullable(item.icon),
        imageUrl: nullable(item.imageUrl),
        ctaLabel: nullable(item.ctaLabel),
        ctaLink: nullable(item.ctaLink),
        isFeatured: item.isFeatured,
        isPublished: item.isPublished,
        order,
      };
      if (item.id && existing.has(item.id)) {
        await tx.servicePackage.update({ where: { id: item.id }, data });
      } else {
        await tx.servicePackage.create({
          data: { ...data, landingPageId: landingPage.id },
        });
      }
    }
  });
}

async function replaceCaseStudies(items: z.infer<typeof caseStudySchema>[]) {
  const landingPage = await getLandingPage();
  const [caseIds, projectIds] = await Promise.all([
    db.caseStudy.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } }),
    db.project.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } }),
  ]);
  const existing = new Set(caseIds.map((item) => item.id));
  const allowedProjects = new Set(projectIds.map((item) => item.id));
  const retained = items.flatMap((item) => item.id && existing.has(item.id) ? [item.id] : []);
  await db.$transaction(async (tx) => {
    await tx.caseStudy.deleteMany({
      where: { landingPageId: landingPage.id, ...(retained.length ? { id: { notIn: retained } } : {}) },
    });
    for (const [order, item] of items.entries()) {
      const data = {
        slug: item.slug,
        title: item.title,
        clientName: nullable(item.clientName),
        clientLogoUrl: nullable(item.clientLogoUrl),
        industry: nullable(item.industry),
        summary: item.summary,
        challenge: nullable(item.challenge),
        solutionMdx: item.solutionMdx,
        outcomeMdx: nullable(item.outcomeMdx),
        architectureMdx: nullable(item.architectureMdx),
        contributionMdx: nullable(item.contributionMdx),
        serviceSlugs: item.serviceSlugs as Prisma.InputJsonValue,
        technologies: item.technologies as Prisma.InputJsonValue,
        metrics: item.metrics as Prisma.InputJsonValue,
        gallery: item.gallery as Prisma.InputJsonValue,
        timeline: nullable(item.timeline),
        coverImageUrl: nullable(item.coverImageUrl),
        demoVideoUrl: nullable(item.demoVideoUrl),
        projectUrl: nullable(item.projectUrl),
        testimonialQuote: nullable(item.testimonialQuote),
        clientConsentGranted: item.clientConsentGranted,
        confidentiality: item.confidentiality,
        isFeatured: item.isFeatured,
        isPublished: item.isPublished,
        seoTitle: nullable(item.seoTitle),
        seoDescription: nullable(item.seoDescription),
        projectId: item.projectId && allowedProjects.has(item.projectId) ? item.projectId : null,
        order,
      };
      if (item.id && existing.has(item.id)) {
        await tx.caseStudy.update({ where: { id: item.id }, data });
      } else {
        await tx.caseStudy.create({ data: { ...data, landingPageId: landingPage.id } });
      }
    }
  });
}

async function replacePortfolio(items: z.infer<typeof portfolioProjectSchema>[]) {
  const landingPage = await getLandingPage();
  const existing = new Set(
    (await db.project.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } })).map((item) => item.id),
  );
  const retained = items.flatMap((item) => item.id && existing.has(item.id) ? [item.id] : []);
  await db.$transaction(async (tx) => {
    await tx.project.deleteMany({
      where: { landingPageId: landingPage.id, ...(retained.length ? { id: { notIn: retained } } : {}) },
    });
    for (const [order, item] of items.entries()) {
      const data = {
        sourceId: nullable(item.sourceId),
        slug: item.slug ?? null,
        title: item.title,
        description: item.description,
        publicDescription: nullable(item.publicDescription),
        type: nullable(item.type),
        category: nullable(item.category),
        clientName: nullable(item.clientName),
        clientLogoUrl: nullable(item.clientLogoUrl),
        technologies: item.technologies as Prisma.InputJsonValue,
        imageUrl: nullable(item.imageUrl),
        screenshots: item.screenshots as Prisma.InputJsonValue,
        approvedMetrics: item.approvedMetrics as Prisma.InputJsonValue,
        contribution: nullable(item.contribution),
        githubLink: nullable(item.githubLink),
        websiteLink: nullable(item.websiteLink),
        demoVideoUrl: nullable(item.demoVideoUrl),
        confidentiality: item.confidentiality,
        isClientWork: item.isClientWork,
        isFeatured: item.isFeatured,
        isPublished: item.isPublished && item.confidentiality !== "PRIVATE",
        order,
      };
      if (item.id && existing.has(item.id)) {
        await tx.project.update({ where: { id: item.id }, data });
      } else {
        await tx.project.create({ data: { ...data, landingPageId: landingPage.id } });
      }
    }
  });
}

async function replaceProofMetrics(items: z.infer<typeof proofMetricSchema>[]) {
  const landingPage = await getLandingPage();
  const [metricIds, projectIds] = await Promise.all([
    db.proofMetric.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } }),
    db.project.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } }),
  ]);
  const existing = new Set(metricIds.map((item) => item.id));
  const allowedProjects = new Set(projectIds.map((item) => item.id));
  const retained = items.flatMap((item) => item.id && existing.has(item.id) ? [item.id] : []);
  await db.$transaction(async (tx) => {
    await tx.proofMetric.deleteMany({
      where: { landingPageId: landingPage.id, ...(retained.length ? { id: { notIn: retained } } : {}) },
    });
    for (const [order, item] of items.entries()) {
      const data = {
        value: item.value,
        label: item.label,
        context: nullable(item.context),
        tooltip: nullable(item.tooltip),
        source: nullable(item.source),
        sourceProjectId: item.sourceProjectId && allowedProjects.has(item.sourceProjectId) ? item.sourceProjectId : null,
        verificationStatus: item.verificationStatus,
        isPublished: item.isPublished && item.verificationStatus === "VERIFIED",
        order,
      };
      if (item.id && existing.has(item.id)) {
        await tx.proofMetric.update({ where: { id: item.id }, data });
      } else {
        await tx.proofMetric.create({ data: { ...data, landingPageId: landingPage.id } });
      }
    }
  });
}

async function replaceSocialProof(input: {
  clientLogos: z.infer<typeof clientLogoSchema>[];
  testimonials: z.infer<typeof testimonialSchema>[];
}) {
  const landingPage = await getLandingPage();
  const [logoIds, testimonialIds, projectIds] = await Promise.all([
    db.clientLogo.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } }),
    db.testimonial.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } }),
    db.project.findMany({ where: { landingPageId: landingPage.id }, select: { id: true } }),
  ]);
  const existingLogos = new Set(logoIds.map((item) => item.id));
  const existingTestimonials = new Set(testimonialIds.map((item) => item.id));
  const allowedProjects = new Set(projectIds.map((item) => item.id));
  const keptLogos = input.clientLogos.flatMap((item) => item.id && existingLogos.has(item.id) ? [item.id] : []);
  const keptTestimonials = input.testimonials.flatMap((item) => item.id && existingTestimonials.has(item.id) ? [item.id] : []);
  await db.$transaction(async (tx) => {
    await tx.clientLogo.deleteMany({ where: { landingPageId: landingPage.id, ...(keptLogos.length ? { id: { notIn: keptLogos } } : {}) } });
    await tx.testimonial.deleteMany({ where: { landingPageId: landingPage.id, ...(keptTestimonials.length ? { id: { notIn: keptTestimonials } } : {}) } });
    for (const [order, item] of input.clientLogos.entries()) {
      const data = {
        name: item.name,
        logoUrl: item.logoUrl,
        websiteUrl: nullable(item.websiteUrl),
        altText: nullable(item.altText),
        consentGranted: item.consentGranted,
        isPublished: item.isPublished && item.consentGranted,
        order,
      };
      if (item.id && existingLogos.has(item.id)) await tx.clientLogo.update({ where: { id: item.id }, data });
      else await tx.clientLogo.create({ data: { ...data, landingPageId: landingPage.id } });
    }
    for (const [order, item] of input.testimonials.entries()) {
      const data = {
        name: item.name,
        position: nullable(item.position),
        comment: item.comment,
        imageUrl: nullable(item.imageUrl),
        company: nullable(item.company),
        companyLogoUrl: nullable(item.companyLogoUrl),
        sourceUrl: nullable(item.sourceUrl),
        isVerified: item.isVerified,
        consentGranted: item.consentGranted,
        isPublished: item.isPublished && item.isVerified && item.consentGranted,
        projectId: item.projectId && allowedProjects.has(item.projectId) ? item.projectId : null,
        order,
      };
      if (item.id && existingTestimonials.has(item.id)) await tx.testimonial.update({ where: { id: item.id }, data });
      else await tx.testimonial.create({ data: { ...data, landingPageId: landingPage.id } });
    }
  });
}

const leadInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  company: optionalText(200),
  phone: optionalText(80),
  service: z.string().trim().min(2).max(200),
  problem: z.string().trim().min(20).max(5000),
  currentSystems: optionalText(2000),
  budget: optionalText(120),
  timeline: optionalText(120),
  contactConsent: z.literal(true),
  sourcePath: optionalText(1000),
  referrer: optionalText(1000),
  utmSource: optionalText(300),
  utmMedium: optionalText(300),
  utmCampaign: optionalText(300),
  utmContent: optionalText(300),
  utmTerm: optionalText(300),
});

const fallbackLeadAttempts = new Map<string, number[]>();
async function enforceLeadRateLimit() {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const identifier = `project-lead:${ip}`;
  const ratelimit = getRatelimit();
  if (ratelimit) {
    const { success } = await ratelimit.limit(identifier);
    if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many enquiries. Please try again shortly." });
    return;
  }
  const cutoff = Date.now() - 10 * 60 * 1000;
  const recent = (fallbackLeadAttempts.get(identifier) ?? []).filter((time) => time > cutoff);
  if (recent.length >= 5) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many enquiries. Please try again shortly." });
  recent.push(Date.now());
  fallbackLeadAttempts.set(identifier, recent);
}

async function createLead(input: z.infer<typeof leadInputSchema>) {
  await enforceLeadRateLimit();
  const landingPage = await getLandingPage();
  const lead = await db.lead.create({
    data: {
      landingPageId: landingPage.id,
      name: input.name,
      email: input.email.toLowerCase(),
      company: nullable(input.company),
      phone: nullable(input.phone),
      service: input.service,
      problem: input.problem,
      currentSystems: nullable(input.currentSystems),
      budget: nullable(input.budget),
      timeline: nullable(input.timeline),
      contactConsent: true,
      sourcePath: nullable(input.sourcePath),
      referrer: nullable(input.referrer),
      utmSource: nullable(input.utmSource),
      utmMedium: nullable(input.utmMedium),
      utmCampaign: nullable(input.utmCampaign),
      utmContent: nullable(input.utmContent),
      utmTerm: nullable(input.utmTerm),
    },
  });

  if (process.env.RESEND_API_KEY && landingPage.supportEmailAddress?.trim()) {
    const message = [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company || "—"}`,
      `Service: ${lead.service}`,
      `Budget: ${lead.budget || "—"}`,
      `Timeline: ${lead.timeline || "—"}`,
      `Current systems: ${lead.currentSystems || "—"}`,
      "",
      lead.problem,
    ].join("\n");
    void sendSupportEmail(
      landingPage.supportEmailAddress.trim(),
      `New project enquiry from ${lead.name}`,
      message,
    ).catch((error) => console.error("Lead notification failed", error));
  }

  return { success: true, leadId: lead.id };
}

async function getAdminConversionData() {
  const landingPage = await getLandingPage();
  const [servicePackages, caseStudies, portfolioProjects, proofMetrics, clientLogos, testimonials, leads] = await Promise.all([
    db.servicePackage.findMany({ where: { landingPageId: landingPage.id }, orderBy: { order: "asc" } }),
    db.caseStudy.findMany({ where: { landingPageId: landingPage.id }, orderBy: { order: "asc" } }),
    db.project.findMany({ where: { landingPageId: landingPage.id }, orderBy: { order: "asc" } }),
    db.proofMetric.findMany({ where: { landingPageId: landingPage.id }, orderBy: { order: "asc" } }),
    db.clientLogo.findMany({ where: { landingPageId: landingPage.id }, orderBy: { order: "asc" } }),
    db.testimonial.findMany({ where: { landingPageId: landingPage.id }, orderBy: { order: "asc" } }),
    db.lead.findMany({ where: { landingPageId: landingPage.id }, orderBy: { createdAt: "desc" }, take: 250 }),
  ]);
  return { landingPage, servicePackages, caseStudies, portfolioProjects, proofMetrics, clientLogos, testimonials, leads };
}

export const conversionRouter = createTRPCRouter({
  getPublicConversionData: baseProcedure.query(getPublicConversionData),
  listCaseStudies: baseProcedure.query(getPublicCaseStudies),
  getCaseStudyBySlug: baseProcedure
    .input(z.object({ slug }))
    .query(({ input }) => getPublicCaseStudyBySlug(input.slug)),
  createLead: baseProcedure.input(leadInputSchema).mutation(({ input }) => createLead(input)),
  getAdminConversionData: adminProcedure.query(getAdminConversionData),
  updateServicePackages: adminProcedure
    .input(z.object({ servicePackages: z.array(servicePackageSchema).max(100) }))
    .mutation(async ({ input }) => {
      await replaceServicePackages(input.servicePackages);
      return { success: true };
    }),
  updateCaseStudies: adminProcedure
    .input(z.object({ caseStudies: z.array(caseStudySchema).max(100) }))
    .mutation(async ({ input }) => {
      await replaceCaseStudies(input.caseStudies);
      return { success: true };
    }),
  updatePortfolioProjects: adminProcedure
    .input(z.object({ portfolioProjects: z.array(portfolioProjectSchema).max(500) }))
    .mutation(async ({ input }) => {
      await replacePortfolio(input.portfolioProjects);
      return { success: true };
    }),
  updateProofMetrics: adminProcedure
    .input(z.object({ proofMetrics: z.array(proofMetricSchema).max(100) }))
    .mutation(async ({ input }) => {
      await replaceProofMetrics(input.proofMetrics);
      return { success: true };
    }),
  updateSocialProof: adminProcedure
    .input(z.object({ clientLogos: z.array(clientLogoSchema).max(100), testimonials: z.array(testimonialSchema).max(200) }))
    .mutation(async ({ input }) => {
      await replaceSocialProof(input);
      return { success: true };
    }),
  updateConversionSettings: adminProcedure
    .input(conversionSettingsSchema)
    .mutation(async ({ input }) => {
      const landingPage = await getLandingPage();
      const jsonFields = new Set(["processSteps", "founderTimeline", "founderSocialLinks"]);
      const data: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(input)) {
        data[key] = jsonFields.has(key)
          ? (value as Prisma.InputJsonValue)
          : typeof value === "string"
            ? nullable(value)
            : value;
      }
      await db.landingPage.update({ where: { id: landingPage.id }, data });
      return { success: true };
    }),
  updateLead: adminProcedure
    .input(z.object({
      id: z.string().min(1),
      status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST", "SPAM"]),
      priority: z.enum(["LOW", "NORMAL", "HIGH"]),
      notes: optionalText(10000),
    }))
    .mutation(async ({ input }) => {
      const landingPage = await getLandingPage();
      const result = await db.lead.updateMany({
        where: { id: input.id, landingPageId: landingPage.id },
        data: { status: input.status, priority: input.priority, notes: nullable(input.notes) },
      });
      if (!result.count) throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
      return { success: true };
    }),
});
