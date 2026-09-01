export type PublicHero = {
  eyebrow?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  availability?: string | null;
  responseTime?: string | null;
};

export type PublicClientLogo = {
  id?: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  approved?: boolean | null;
};

export type PublicProofMetric = {
  id?: string;
  value: string;
  label: string;
  context?: string | null;
  verified?: boolean | null;
};

export type PublicServicePackage = {
  id?: string;
  slug?: string | null;
  title: string;
  description: string;
  idealFor?: string | null;
  deliverables?: string[] | null;
  timeline?: string | null;
  priceFrom?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  featured?: boolean | null;
  technologies?: string[] | null;
};

export type PublicMedia = {
  id?: string;
  type?: "image" | "video" | "architecture" | string | null;
  url: string;
  alt?: string | null;
  caption?: string | null;
};

export type PublicCaseStudy = {
  id?: string;
  slug: string;
  title: string;
  clientName?: string | null;
  clientLogoUrl?: string | null;
  summary?: string | null;
  challenge?: string | null;
  solution?: string | null;
  solutionMdx?: string | null;
  contribution?: string | null;
  outcome?: string | null;
  outcomes?: string[] | null;
  metrics?: PublicProofMetric[] | null;
  technologies?: string[] | null;
  timeline?: string | null;
  coverImageUrl?: string | null;
  architectureImageUrl?: string | null;
  videoUrl?: string | null;
  demoVideoUrl?: string | null;
  projectUrl?: string | null;
  media?: PublicMedia[] | null;
  testimonial?: PublicTestimonial | null;
  featured?: boolean | null;
  published?: boolean | null;
};

export type PortfolioCategory =
  | "Client Work"
  | "Products"
  | "Open Source"
  | "Experiments"
  | string;

export type PublicPortfolioProject = {
  id?: string;
  slug?: string | null;
  title: string;
  description?: string | null;
  category?: PortfolioCategory | null;
  disciplines?: string[] | null;
  technologies?: string[] | null;
  imageUrl?: string | null;
  caseStudySlug?: string | null;
  websiteUrl?: string | null;
  repositoryUrl?: string | null;
  featured?: boolean | null;
  published?: boolean | null;
};

export type PublicProcessStep = {
  id?: string;
  title: string;
  description: string;
};

export type PublicFounderProfile = {
  name?: string | null;
  title?: string | null;
  shortBio?: string | null;
  longBio?: string | null;
  imageUrl?: string | null;
  education?: string | null;
  location?: string | null;
  socialLinks?: Array<{ label: string; url: string }> | null;
  journey?: Array<{
    label?: string | null;
    title: string;
    description?: string | null;
  }> | null;
};

export type PublicTestimonial = {
  id?: string;
  name: string;
  role?: string | null;
  company?: string | null;
  quote: string;
  imageUrl?: string | null;
  companyLogoUrl?: string | null;
  sourceUrl?: string | null;
  verified?: boolean | null;
  consentGranted?: boolean | null;
};

export type PublicConversionData = {
  hero?: PublicHero | null;
  clientLogos?: PublicClientLogo[] | null;
  proofMetrics?: PublicProofMetric[] | null;
  servicePackages?: PublicServicePackage[] | null;
  featuredCaseStudies?: PublicCaseStudy[] | null;
  caseStudies?: PublicCaseStudy[] | null;
  portfolioProjects?: PublicPortfolioProject[] | null;
  processSteps?: PublicProcessStep[] | null;
  founderProfile?: PublicFounderProfile | null;
  verifiedTestimonials?: PublicTestimonial[] | null;
  appointmentLink?: string | null;
  headings?: {
    trust?: string | null;
    proof?: string | null;
    servicePackages?: string | null;
    servicePackagesDescription?: string | null;
    caseStudies?: string | null;
    caseStudiesDescription?: string | null;
    portfolio?: string | null;
    portfolioDescription?: string | null;
    process?: string | null;
    processDescription?: string | null;
    founder?: string | null;
    lead?: string | null;
    leadDescription?: string | null;
    leadSuccessMessage?: string | null;
  } | null;
};

export type LeadInput = {
  name: string;
  email: string;
  company?: string;
  service: string;
  problem: string;
  currentSystems?: string;
  budget?: string;
  timeline?: string;
  contactConsent: boolean;
  sourcePath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};
