"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import NavbarSection from "@/components/landing/NavbarSection";
import FooterSection from "@/components/landing/FooterSection";
import type {
  PublicCaseStudy,
  PublicConversionData,
  PublicFounderProfile,
  PublicPortfolioProject,
  PublicServicePackage,
} from "@/lib/ts-types/conversion";
import { useTRPC } from "@/trpc/client";

import { ConversionHero } from "./ConversionHero";
import { ProofSection, ServicePackagesSection } from "./CredibilitySections";
import { ProjectEnquiryForm } from "./ProjectEnquiryForm";
import {
  FounderSection,
  InsightsSection,
  ProcessSection,
  VerifiedTestimonialsSection,
} from "./TrustSections";
import {
  FeaturedCaseStudiesSection,
  FlagshipProductsSection,
  PortfolioExplorer,
} from "./WorkSections";

function publicData(value: unknown): PublicConversionData {
  const data = (value ?? {}) as Record<string, any>;
  return {
    hero: data.hero ?? data.conversionHero ?? null,
    clientLogos: data.clientLogos ?? data.clients ?? [],
    proofMetrics: data.proofMetrics ?? data.metrics ?? [],
    servicePackages: data.servicePackages ?? data.services ?? [],
    featuredCaseStudies:
      data.featuredCaseStudies ??
      (data.caseStudies ?? []).filter(
        (study: PublicCaseStudy) => study.featured,
      ),
    caseStudies: data.caseStudies ?? [],
    portfolioProjects:
      data.portfolioProjects ?? data.portfolio ?? data.projects ?? [],
    processSteps: data.processSteps ?? data.process ?? [],
    founderProfile: data.founderProfile ?? data.founder ?? null,
    verifiedTestimonials: data.verifiedTestimonials ?? data.testimonials ?? [],
    appointmentLink: data.appointmentLink ?? null,
    headings: data.headings ?? null,
  };
}

function fallbackCategory(type?: string | null) {
  const value = type?.toLowerCase() ?? "";
  if (value.includes("open") || value.includes("github")) return "Open Source";
  if (value.includes("client") || value.includes("freelance"))
    return "Client Work";
  if (value.includes("experiment")) return "Experiments";
  return "Products";
}

function externalUrl(value?: string | null) {
  const candidate = value?.trim();
  return candidate && /^https?:\/\//.test(candidate) ? candidate : null;
}

export default function ConversionLanding() {
  const trpc = useTRPC();
  const { data: landing } = useSuspenseQuery(
    trpc.landing.getLandingInfo.queryOptions(),
  );
  const conversionQuery = useSuspenseQuery(
    trpc.conversion.getPublicConversionData.queryOptions(),
  );
  const conversion = publicData(conversionQuery.data);

  const services: PublicServicePackage[] =
    conversion.servicePackages && conversion.servicePackages.length > 0
      ? conversion.servicePackages
      : (landing.serviceSection?.services ?? []).map((service: any) => ({
          id: service.id,
          title: service.title,
          description: service.description,
          deliverables: [] as string[],
        }));

  const caseStudies = [
    ...(conversion.featuredCaseStudies ?? []),
    ...(conversion.caseStudies ?? []).filter(
      (study) =>
        !(conversion.featuredCaseStudies ?? []).some(
          (featured) => featured.slug === study.slug,
        ),
    ),
  ];

  const projects: PublicPortfolioProject[] =
    conversion.portfolioProjects && conversion.portfolioProjects.length > 0
      ? conversion.portfolioProjects
      : (landing.projectSection?.projects ?? []).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          imageUrl: project.demoImage,
          category: fallbackCategory(project.type),
          disciplines: project.type ? [project.type] : [],
          technologies: (project.techStack ?? []).map(
            (technology: any) => technology.title ?? technology,
          ),
          websiteUrl: project.websiteDetails?.websiteLink,
          repositoryUrl: project.openSourceDetails?.link,
          published: true,
        }));

  const founder: PublicFounderProfile | null =
    conversion.founderProfile ??
    (landing.teamSection?.teamList?.[0]
      ? {
          name: landing.teamSection.teamList[0].name,
          title: landing.teamSection.teamList[0].position,
          shortBio: landing.teamSection.teamList[0].description,
          imageUrl: landing.teamSection.teamList[0].imageUrl,
          socialLinks: landing.teamSection.teamList[0].socialNetworks?.map(
            (social: any) => ({ label: social.name, url: social.url }),
          ),
        }
      : null);

  const featuredStudy = caseStudies.find(
    (study) => study.featured && study.published !== false,
  );
  const appointmentLink =
    externalUrl(conversion.appointmentLink) ||
    externalUrl(landing.heroSection?.appointmentLink) ||
    null;
  const headings = conversion.headings ?? {};

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <ConversionStructuredData
        title={landing.navbarSection?.title}
        logo={landing.navbarSection?.logo}
        founder={founder}
        services={services}
      />
      <NavbarSection />
      <main>
        <ConversionHero
          hero={conversion.hero}
          fallbackHeadline={landing.heroSection?.tagline}
          fallbackDescription={landing.heroSection?.description}
          services={services}
          featuredStudy={featuredStudy}
        />
        <ProofSection
          logos={conversion.clientLogos ?? []}
          metrics={conversion.proofMetrics ?? []}
          trustHeading={headings.trust}
          proofHeading={headings.proof}
        />
        <ServicePackagesSection
          services={services}
          heading={headings.servicePackages || landing.serviceSection?.heading}
          description={
            headings.servicePackagesDescription ||
            landing.serviceSection?.description
          }
        />
        <FlagshipProductsSection caseStudies={caseStudies} />
        <FeaturedCaseStudiesSection
          caseStudies={caseStudies}
          heading={headings.caseStudies}
          description={headings.caseStudiesDescription}
        />
        <PortfolioExplorer
          projects={projects}
          heading={headings.portfolio}
          description={headings.portfolioDescription}
        />
        <ProcessSection
          steps={conversion.processSteps ?? []}
          heading={headings.process}
          description={headings.processDescription}
        />
        <FounderSection founder={founder} heading={headings.founder} />
        <VerifiedTestimonialsSection
          testimonials={conversion.verifiedTestimonials ?? []}
        />
        <InsightsSection />
        <ProjectEnquiryForm
          services={services}
          appointmentLink={appointmentLink}
          heading={headings.lead}
          description={headings.leadDescription}
          successMessage={headings.leadSuccessMessage}
        />
      </main>
      <FooterSection />
    </div>
  );
}

function ConversionStructuredData({
  title,
  logo,
  founder,
  services,
}: {
  title?: string | null;
  logo?: string | null;
  founder?: PublicFounderProfile | null;
  services: PublicServicePackage[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "");
  const graph: Array<Record<string, unknown>> = [];

  if (title) {
    graph.push({
      "@type": "Organization",
      "@id": baseUrl ? `${baseUrl}/#organization` : undefined,
      name: title,
      url: baseUrl || undefined,
      logo: logo || undefined,
    });
  }
  if (founder?.name) {
    graph.push({
      "@type": "Person",
      "@id": baseUrl ? `${baseUrl}/#founder` : undefined,
      name: founder.name,
      jobTitle: founder.title || undefined,
      description: founder.shortBio || undefined,
      image: founder.imageUrl || undefined,
      sameAs: (founder.socialLinks ?? []).map((link) => link.url),
      worksFor: title
        ? { "@id": baseUrl ? `${baseUrl}/#organization` : undefined }
        : undefined,
    });
  }
  services.forEach((service) => {
    graph.push({
      "@type": "Service",
      name: service.title,
      description: service.description,
      provider: title
        ? { "@id": baseUrl ? `${baseUrl}/#organization` : undefined }
        : undefined,
    });
  });

  if (graph.length === 0) return null;
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
