import db, { Prisma } from "@workspace/database/client";

import { landingPageSnapshot } from "../constants/landing-page/generated";

const landingPageInclude = {
  services: { orderBy: { order: "asc" as const } },
  projects: { orderBy: { order: "asc" as const } },
  testimonials: { orderBy: { order: "asc" as const } },
  teamMembers: {
    orderBy: { order: "asc" as const },
    include: { socialNetworks: { orderBy: { order: "asc" as const } } },
  },
  footerLinks: { orderBy: { order: "asc" as const } },
} satisfies Prisma.LandingPageInclude;

type LandingPageRecord = Prisma.LandingPageGetPayload<{
  include: typeof landingPageInclude;
}>;

type CollectionItem = { id?: string };

export interface LandingPageUpdateInput {
  title?: string;
  logo?: string;
  darkLogo?: string;
  githubLink?: string;
  githubUsername?: string;
  githubRepositoryName?: string;
  donateNowLink?: string;
  tagline?: string;
  description?: string;
  appointmentLink?: string;
  codeSnippet?: string;
  about?: string;
  users?: number;
  subscribers?: number;
  downloads?: number;
  productsCount?: number;
  serviceHeading?: string;
  serviceDescription?: string;
  services?: Array<
    CollectionItem & { title: string; description: string; imageUrl?: string }
  >;
  productHeading?: string;
  productDescription?: string;
  products?: Array<
    CollectionItem & {
      title: string;
      description: string;
      imageUrl?: string;
      type?: string;
      githubLink?: string;
      npmPackageLink?: string;
      githubRepoStars?: number;
      weeklyGithubClones?: number;
      weeklyNpmDownloads?: number;
      notionTemplateLink?: string;
      notionViews?: number;
      notionDownloads?: number;
      notionRating?: number;
      websiteLink?: string;
      websiteViews?: number;
      monthlyActiveUsers?: number;
      youtubeVideoLink?: string;
    }
  >;
  testimonialHeading?: string;
  testimonialDescription?: string;
  testimonials?: Array<
    CollectionItem & {
      name: string;
      position: string;
      comment: string;
      imageUrl?: string;
    }
  >;
  teamHeading?: string;
  teamDescription?: string;
  team?: Array<
    CollectionItem & {
      name: string;
      position: string;
      comment?: string;
      imageUrl?: string;
    }
  >;
  creator?: string;
  creatorLink?: string;
  footer?: Array<
    CollectionItem & { title: string; href?: string; type?: string }
  >;
  supportEmailAddress?: string;
  companyLegalName?: string;
  websiteUrl?: string;
  country?: string;
  contactNumber?: string;
  address?: string;
  version?: string;
  lastUpdated?: string;
}

function cmsKey() {
  return process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page";
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function findLandingPage(): Promise<LandingPageRecord | null> {
  return db.landingPage.findUnique({
    where: { key: cmsKey() },
    include: landingPageInclude,
  });
}

async function createLandingPageFromSnapshot() {
  const snapshot = landingPageSnapshot as any;
  const navbar = snapshot.navbarSection ?? {};
  const hero = snapshot.heroSection ?? {};
  const about = snapshot.aboutSection ?? {};
  const service = snapshot.serviceSection ?? {};
  const project = snapshot.projectSection ?? {};
  const testimonial = snapshot.testimonialSection ?? {};
  const team = snapshot.teamSection ?? {};
  const footer = snapshot.footerSection ?? {};
  const legal = snapshot.contactUs ?? {};
  const privacy = snapshot.privacyPolicy ?? {};
  const terms = snapshot.termsOfService ?? {};
  const newsletter = snapshot.newsletterSection ?? {};

  try {
    return await db.landingPage.create({
      data: {
        key: cmsKey(),
        title: optionalString(navbar.title),
        logo: optionalString(navbar.logo),
        darkLogo: optionalString(navbar.darkLogo),
        githubLink: optionalString(navbar.githubLink),
        githubUsername: optionalString(navbar.githubUsername),
        githubRepositoryName: optionalString(navbar.githubRepositoryName),
        donateNowLink: optionalString(navbar.donateNowLink),
        tagline: optionalString(hero.tagline),
        description: optionalString(hero.description),
        appointmentLink: optionalString(hero.appointmentLink),
        codeSnippet: optionalString(hero.codeSnippet),
        aboutHeading: optionalString(about.heading) ?? "About",
        about: optionalString(about.companyDetails),
        users: optionalNumber(about.users),
        subscribers: optionalNumber(about.subscribers),
        downloads: optionalNumber(about.downloads),
        productsCount: optionalNumber(about.products),
        serviceHeading: optionalString(service.heading),
        serviceDescription: optionalString(service.description),
        productHeading: optionalString(project.heading),
        productDescription: optionalString(project.description),
        testimonialHeading: optionalString(testimonial.heading),
        testimonialDescription: optionalString(testimonial.description),
        teamHeading: optionalString(team.heading),
        teamDescription: optionalString(team.description),
        creator: optionalString(footer.creator),
        creatorLink: optionalString(footer.creatorLink),
        supportEmailAddress: optionalString(legal.supportEmailAddress),
        companyLegalName: optionalString(legal.companyLegalName),
        websiteUrl: optionalString(terms.websiteUrl),
        country: optionalString(privacy.country),
        contactNumber: optionalString(legal.contactNumber),
        address: optionalString(legal.address),
        version: optionalString(terms.version),
        lastUpdated: optionalString(legal.lastUpdated),
        newsletterHeading: optionalString(newsletter.heading),
        newsletterDescription: optionalString(newsletter.description),
        services: {
          create: (service.services ?? []).map((item: any, order: number) => ({
            title: item.title ?? "",
            description: item.description ?? "",
            imageUrl: optionalString(item.imageUrl),
            order,
          })),
        },
        projects: {
          create: (project.projects ?? []).map((item: any, order: number) => ({
            title: item.title ?? "",
            description: item.description ?? "",
            imageUrl: optionalString(item.demoImage),
            type: optionalString(item.type),
            githubLink: optionalString(item.openSourceDetails?.link),
            npmPackageLink: optionalString(
              item.openSourceDetails?.npmPackageLink,
            ),
            githubRepoStars: optionalNumber(item.openSourceDetails?.stars),
            weeklyGithubClones: optionalNumber(
              item.openSourceDetails?.weeklyClones,
            ),
            weeklyNpmDownloads: optionalNumber(
              item.openSourceDetails?.weeklyDownloads,
            ),
            notionTemplateLink: optionalString(
              item.notionDetails?.templateLink,
            ),
            notionViews: optionalNumber(item.notionDetails?.views),
            notionDownloads: optionalNumber(item.notionDetails?.downloads),
            notionRating: optionalNumber(item.notionDetails?.rating),
            websiteLink: optionalString(item.websiteDetails?.websiteLink),
            websiteViews: optionalNumber(item.websiteDetails?.websiteViews),
            monthlyActiveUsers: optionalNumber(
              item.websiteDetails?.websiteUsers,
            ),
            youtubeVideoLink: optionalString(item.contentDetails?.videoLink),
            order,
          })),
        },
        testimonials: {
          create: (testimonial.testimonials ?? []).map(
            (item: any, order: number) => ({
              name: item.name ?? "",
              position: optionalString(item.position),
              comment: item.comment ?? "",
              imageUrl: optionalString(item.image),
              order,
            }),
          ),
        },
        teamMembers: {
          create: (team.teamList ?? []).map((item: any, order: number) => ({
            name: item.name ?? "",
            position: optionalString(item.position),
            description: optionalString(item.description),
            imageUrl: optionalString(item.imageUrl),
            order,
            socialNetworks: {
              create: (item.socialNetworks ?? []).map(
                (social: any, socialOrder: number) => ({
                  name: social.name ?? "",
                  url: social.url ?? "",
                  order: socialOrder,
                }),
              ),
            },
          })),
        },
        footerLinks: {
          create: (footer.footerList ?? []).map((item: any, order: number) => ({
            title: item.label ?? item.title ?? "",
            href: optionalString(item.href),
            type: optionalString(item.type),
            order,
          })),
        },
      },
      include: landingPageInclude,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existing = await findLandingPage();
      if (existing) return existing;
    }
    throw error;
  }
}

async function getOrCreateLandingPage() {
  return (await findLandingPage()) ?? createLandingPageFromSnapshot();
}

function toLandingPageData(page: LandingPageRecord) {
  return {
    navbarSection: {
      title: page.title ?? "",
      logo: page.logo ?? "",
      darkLogo: page.darkLogo ?? "",
      githubLink: page.githubLink ?? "",
      githubUsername: page.githubUsername ?? "",
      githubRepositoryName: page.githubRepositoryName ?? "",
      donateNowLink: page.donateNowLink ?? "",
    },
    heroSection: {
      tagline: page.tagline ?? "",
      description: page.description ?? "",
      appointmentLink: page.appointmentLink ?? "",
      codeSnippet: page.codeSnippet ?? "",
    },
    aboutSection: {
      heading: page.aboutHeading ?? "About",
      companyDetails: page.about ?? "",
      users: String(page.users ?? 0),
      subscribers: String(page.subscribers ?? 0),
      products: String(page.productsCount ?? 0),
      downloads: String(page.downloads ?? 0),
    },
    serviceSection: {
      heading: page.serviceHeading ?? "",
      description: page.serviceDescription ?? "",
      services: page.services.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl ?? "",
      })),
    },
    projectSection: {
      heading: page.productHeading ?? "",
      description: page.productDescription ?? "",
      projects: page.projects.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        demoImage: item.imageUrl ?? "",
        type: item.type ?? "",
        openSourceDetails: {
          link: item.githubLink,
          npmPackageLink: item.npmPackageLink,
          stars: String(item.githubRepoStars ?? ""),
          weeklyDownloads: String(item.weeklyNpmDownloads ?? ""),
          weeklyClones: String(item.weeklyGithubClones ?? ""),
        },
        notionDetails: {
          templateLink: item.notionTemplateLink,
          views: String(item.notionViews ?? ""),
          downloads: String(item.notionDownloads ?? ""),
          rating: String(item.notionRating ?? ""),
        },
        websiteDetails: {
          websiteLink: item.websiteLink,
          websiteViews: String(item.websiteViews ?? ""),
          websiteUsers: String(item.monthlyActiveUsers ?? ""),
        },
        contentDetails: {
          blogLink: "",
          videoLink: item.youtubeVideoLink,
        },
      })),
    },
    testimonialSection: {
      heading: page.testimonialHeading ?? "",
      description: page.testimonialDescription ?? "",
      testimonials: page.testimonials.map((item) => ({
        id: item.id,
        name: item.name,
        userName: item.name,
        position: item.position ?? "",
        comment: item.comment,
        image: item.imageUrl ?? "",
      })),
    },
    teamSection: {
      heading: page.teamHeading ?? "",
      description: page.teamDescription ?? "",
      teamList: page.teamMembers.map((item) => ({
        id: item.id,
        name: item.name,
        position: item.position ?? "",
        description: item.description ?? "",
        imageUrl: item.imageUrl ?? "",
        socialNetworks: item.socialNetworks.map((social) => ({
          name: social.name,
          url: social.url,
        })),
      })),
    },
    footerSection: {
      title: page.title ?? "",
      logo: page.logo ?? "",
      darkLogo: page.darkLogo ?? "",
      creator: page.creator ?? "",
      creatorLink: page.creatorLink ?? "",
      footerList: page.footerLinks.map((item) => ({
        id: item.id,
        label: item.title,
        href: item.href ?? "",
        type: item.type ?? "",
      })),
    },
    cancellationRefundPolicies: {
      supportEmailAddress: page.supportEmailAddress ?? "",
      siteName: page.title ?? "",
      companyLegalName: page.companyLegalName ?? "",
      websiteUrl: page.websiteUrl ?? "",
      lastUpdated: page.lastUpdated ?? "",
    },
    privacyPolicy: {
      supportEmailAddress: page.supportEmailAddress ?? "",
      siteName: page.title ?? "",
      companyLegalName: page.companyLegalName ?? "",
      country: page.country ?? "",
      websiteUrl: page.websiteUrl ?? "",
      lastUpdated: page.lastUpdated ?? "",
    },
    contactUs: {
      supportEmailAddress: page.supportEmailAddress ?? "",
      companyLegalName: page.companyLegalName ?? "",
      lastUpdated: page.lastUpdated ?? "",
      contactNumber: page.contactNumber ?? "",
      address: page.address ?? "",
    },
    termsOfService: {
      supportEmailAddress: page.supportEmailAddress ?? "",
      siteName: page.title ?? "",
      companyLegalName: page.companyLegalName ?? "",
      country: page.country ?? "",
      websiteUrl: page.websiteUrl ?? "",
      lastUpdated: page.lastUpdated ?? "",
      version: page.version ?? "",
      address: page.address ?? "",
    },
    newsletterSection: {
      heading: page.newsletterHeading ?? "Subscribe to our Newsletter",
      description:
        page.newsletterDescription ??
        "Stay updated with our latest features and releases.",
      supportEmailAddress: page.supportEmailAddress ?? "hello@example.com",
    },
  };
}

export async function getLandingPageDataFromPostgres() {
  return toLandingPageData(await getOrCreateLandingPage());
}

export async function updateLandingPageInPostgres(
  input: LandingPageUpdateInput,
) {
  const page = await getOrCreateLandingPage();

  await db.$transaction(
    async (tx) => {
      const scalarData: Prisma.LandingPageUpdateInput = {};
      const scalarFields = [
        "title",
        "logo",
        "darkLogo",
        "githubLink",
        "githubUsername",
        "githubRepositoryName",
        "donateNowLink",
        "tagline",
        "description",
        "appointmentLink",
        "codeSnippet",
        "about",
        "users",
        "subscribers",
        "downloads",
        "productsCount",
        "serviceHeading",
        "serviceDescription",
        "productHeading",
        "productDescription",
        "testimonialHeading",
        "testimonialDescription",
        "teamHeading",
        "teamDescription",
        "creator",
        "creatorLink",
        "supportEmailAddress",
        "companyLegalName",
        "websiteUrl",
        "country",
        "contactNumber",
        "address",
        "version",
        "lastUpdated",
      ] as const;

      for (const field of scalarFields) {
        if (input[field] !== undefined) {
          (scalarData as Record<string, unknown>)[field] = input[field];
        }
      }

      if (Object.keys(scalarData).length > 0) {
        await tx.landingPage.update({
          where: { id: page.id },
          data: scalarData,
        });
      }

      if (input.services) {
        const existing = new Set(page.services.map((item) => item.id));
        const retained = input.services.flatMap((item) =>
          item.id && existing.has(item.id) ? [item.id] : [],
        );
        await tx.service.deleteMany({
          where: {
            landingPageId: page.id,
            ...(retained.length > 0 ? { id: { notIn: retained } } : {}),
          },
        });
        for (const [order, item] of input.services.entries()) {
          const data = {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl ?? "",
            order,
          };
          if (item.id && existing.has(item.id)) {
            await tx.service.update({ where: { id: item.id }, data });
          } else {
            await tx.service.create({
              data: { ...data, landingPageId: page.id },
            });
          }
        }
      }

      if (input.products) {
        const existing = new Set(page.projects.map((item) => item.id));
        const retained = input.products.flatMap((item) =>
          item.id && existing.has(item.id) ? [item.id] : [],
        );
        await tx.project.deleteMany({
          where: {
            landingPageId: page.id,
            ...(retained.length > 0 ? { id: { notIn: retained } } : {}),
          },
        });
        for (const [order, item] of input.products.entries()) {
          const data = {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl ?? "",
            type: item.type ?? "",
            githubLink: item.githubLink ?? "",
            npmPackageLink: item.npmPackageLink ?? "",
            githubRepoStars: item.githubRepoStars,
            weeklyGithubClones: item.weeklyGithubClones,
            weeklyNpmDownloads: item.weeklyNpmDownloads,
            notionTemplateLink: item.notionTemplateLink ?? "",
            notionViews: item.notionViews,
            notionDownloads: item.notionDownloads,
            notionRating: item.notionRating,
            websiteLink: item.websiteLink ?? "",
            websiteViews: item.websiteViews,
            monthlyActiveUsers: item.monthlyActiveUsers,
            youtubeVideoLink: item.youtubeVideoLink ?? "",
            order,
          };
          if (item.id && existing.has(item.id)) {
            await tx.project.update({ where: { id: item.id }, data });
          } else {
            await tx.project.create({
              data: { ...data, landingPageId: page.id },
            });
          }
        }
      }

      if (input.testimonials) {
        const existing = new Set(page.testimonials.map((item) => item.id));
        const retained = input.testimonials.flatMap((item) =>
          item.id && existing.has(item.id) ? [item.id] : [],
        );
        await tx.testimonial.deleteMany({
          where: {
            landingPageId: page.id,
            ...(retained.length > 0 ? { id: { notIn: retained } } : {}),
          },
        });
        for (const [order, item] of input.testimonials.entries()) {
          const data = {
            name: item.name,
            position: item.position,
            comment: item.comment,
            imageUrl: item.imageUrl ?? "",
            order,
          };
          if (item.id && existing.has(item.id)) {
            await tx.testimonial.update({ where: { id: item.id }, data });
          } else {
            await tx.testimonial.create({
              data: { ...data, landingPageId: page.id },
            });
          }
        }
      }

      if (input.team) {
        const existing = new Set(page.teamMembers.map((item) => item.id));
        const retained = input.team.flatMap((item) =>
          item.id && existing.has(item.id) ? [item.id] : [],
        );
        await tx.teamMember.deleteMany({
          where: {
            landingPageId: page.id,
            ...(retained.length > 0 ? { id: { notIn: retained } } : {}),
          },
        });
        for (const [order, item] of input.team.entries()) {
          const data = {
            name: item.name,
            position: item.position,
            description: item.comment ?? "",
            imageUrl: item.imageUrl ?? "",
            order,
          };
          if (item.id && existing.has(item.id)) {
            await tx.teamMember.update({ where: { id: item.id }, data });
          } else {
            await tx.teamMember.create({
              data: { ...data, landingPageId: page.id },
            });
          }
        }
      }

      if (input.footer) {
        const existing = new Set(page.footerLinks.map((item) => item.id));
        const retained = input.footer.flatMap((item) =>
          item.id && existing.has(item.id) ? [item.id] : [],
        );
        await tx.footerLink.deleteMany({
          where: {
            landingPageId: page.id,
            ...(retained.length > 0 ? { id: { notIn: retained } } : {}),
          },
        });
        for (const [order, item] of input.footer.entries()) {
          const data = {
            title: item.title,
            href: item.href ?? "",
            type: item.type ?? "",
            order,
          };
          if (item.id && existing.has(item.id)) {
            await tx.footerLink.update({ where: { id: item.id }, data });
          } else {
            await tx.footerLink.create({
              data: { ...data, landingPageId: page.id },
            });
          }
        }
      }
    },
    { maxWait: 10_000, timeout: 30_000 },
  );

  return getLandingPageDataFromPostgres();
}
