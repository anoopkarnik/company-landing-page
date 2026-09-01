import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient, type Prisma } from "@workspace/database/client";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");

async function loadEnvFile(filePath: string) {
  try {
    const contents = await readFile(filePath, "utf8");
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const normalizedLine = line.startsWith("export ")
        ? line.slice("export ".length).trim()
        : line;
      const separatorIndex = normalizedLine.indexOf("=");
      if (separatorIndex === -1) continue;
      const key = normalizedLine.slice(0, separatorIndex).trim();
      if (process.env[key]) continue;
      const rawValue = normalizedLine.slice(separatorIndex + 1).trim();
      process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch (error: any) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await loadEnvFile(path.join(appDir, ".env"));
await loadEnvFile(path.join(appDir, ".env.local"));

const lifeForgeDatabaseUrl = process.env.LIFEFORGE_DATABASE_URL?.trim();
if (!lifeForgeDatabaseUrl) {
  throw new Error(
    "LIFEFORGE_DATABASE_URL is required for the public portfolio sync",
  );
}

const databaseModule = await import("@workspace/database/client");
const cmsDb: PrismaClient =
  (databaseModule.default as any)?.default ??
  databaseModule.default ??
  databaseModule;
const lifeForgeDb = new PrismaClient({
  datasources: { db: { url: lifeForgeDatabaseUrl } },
});

type SourceProfile = {
  id: string;
  accountName: string;
  fullName: string | null;
  title: string | null;
  details: string | null;
  about: string | null;
  journey: string | null;
  location: string | null;
  profileImage: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  websiteUrl: string | null;
};

type SourceProject = {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  projectTypes: string[];
  workType: string | null;
  impact: string | null;
  contribution: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  demoUrl: string | null;
  youtubeUrl: string | null;
  demoImageUrls: string[];
  githubRepoStars: number | null;
  monthlyActiveUsers: number | null;
  notionDownloads: number | null;
  notionViews: number | null;
  websiteViews: number | null;
  weeklyNpmDownloads: number | null;
  clientNames: string[];
};

const profileName = process.env.LIFEFORGE_PROFILE_NAME?.trim() || "Anoop%";
const profiles = await lifeForgeDb.$queryRawUnsafe<SourceProfile[]>(
  `
    SELECT
      p.id,
      u.name AS "accountName",
      p."indieHackerFullName" AS "fullName",
      p."indieHackerTitle" AS title,
      p."indieHackerDetails" AS details,
      p."indieHackerAboutMe" AS about,
      p."indieHackerMyJourney" AS journey,
      p."indieHackerLocation" AS location,
      p."indieHackerProfilePic" AS "profileImage",
      p."indieHackerGithubLink" AS "githubUrl",
      p."indieHackerLinkedInLink" AS "linkedinUrl",
      p."indieHackerTwitterLink" AS "twitterUrl",
      p."indieHackerYoutubeLink" AS "youtubeUrl",
      p."indieHackerWebsiteLink" AS "websiteUrl"
    FROM "user_schema"."UserProfile" p
    JOIN "user_schema"."User" u ON u.id = p.id
    WHERE u.name ILIKE $1 OR p."indieHackerFullName" ILIKE $1
    ORDER BY u."updatedAt" DESC
    LIMIT 1
  `,
  profileName,
);
const profile = profiles[0];
if (!profile) throw new Error(`No LifeForge profile matched ${profileName}`);

const selectedProjectNames = [
  "Life Forge",
  "SaaS Forge",
  "HRS Hikers Website",
  "Financial Documents OCR",
  "n8n Workflow Listing",
  "Google Analytics and Search Report Generation",
  "Restaurant Order Vapi Call",
  "Portfolio Boilerplate",
  "Fhir Data Validation Service",
  "Support Bot using rules and chatgpt",
  "Git Grasp",
];

const projects = await lifeForgeDb.$queryRawUnsafe<SourceProject[]>(
  `
    SELECT
      p.id,
      p.name,
      p.description,
      p.status,
      p."projectTypes" AS "projectTypes",
      p."workType" AS "workType",
      p.impact,
      p.contribution,
      p."githubUrl" AS "githubUrl",
      p."websiteUrl" AS "websiteUrl",
      p."demoUrl" AS "demoUrl",
      p."youtubeUrl" AS "youtubeUrl",
      p."demoImageUrls" AS "demoImageUrls",
      p."githubRepoStars" AS "githubRepoStars",
      p."monthlyActiveUsers" AS "monthlyActiveUsers",
      p."notionDownloads" AS "notionDownloads",
      p."notionViews" AS "notionViews",
      p."websiteViews" AS "websiteViews",
      p."weeklyNpmDownloads" AS "weeklyNpmDownloads",
      COALESCE(
        array_remove(array_agg(DISTINCT c."companyName"), NULL),
        ARRAY[]::TEXT[]
      ) AS "clientNames"
    FROM "indie_hacker_schema".projects p
    LEFT JOIN "indie_hacker_schema".project_clients pc ON pc."projectId" = p.id
    LEFT JOIN "indie_hacker_schema".clients c ON c.id = pc."clientId"
    WHERE p."profileId" = $1 AND p.name = ANY($2::TEXT[])
    GROUP BY p.id
  `,
  profile.id,
  selectedProjectNames,
);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function plainSummary(value: string | null, fallback: string) {
  if (!value) return fallback;
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);
}

function stableMediaUrls(urls: string[]) {
  return urls.filter(
    (url) =>
      /^https?:\/\//.test(url) &&
      !url.includes("X-Amz-") &&
      !url.includes("prod-files-secure") &&
      !url.includes("notion-static"),
  );
}

function portfolioCategory(project: SourceProject) {
  if (project.workType?.includes("Freelance")) return "Client Work";
  if (project.workType?.includes("Full Time")) return "Client Work";
  if (
    project.status === "Cancelled" ||
    project.workType?.includes("Practise")
  ) {
    return "Experiments";
  }
  if (project.githubUrl) return "Open Source";
  return "Products";
}

function approvedClientName(project: SourceProject) {
  if (project.name === "HRS Hikers Website") return "HRS Hikers";
  if (project.name === "Fhir Data Validation Service") return "Mpowered Health";
  if (project.workType?.includes("Freelance")) return "Automation client";
  if (project.workType?.includes("Full Time")) return "Healthcare platform";
  return null;
}

function confidentiality(project: SourceProject) {
  if (
    project.name === "HRS Hikers Website" ||
    project.name === "Fhir Data Validation Service"
  ) {
    return "PUBLIC";
  }
  if (
    project.workType?.includes("Freelance") ||
    project.workType?.includes("Full Time")
  ) {
    return "ANONYMIZED";
  }
  return "PUBLIC";
}

type ProjectOverride = {
  title: string;
  slug: string;
  description: string;
  type: string;
  category: string;
  clientName: string;
  technologies: string[];
  contribution: string;
  githubLink?: string;
  websiteLink: string;
  youtubeVideoLink?: string;
  screenshots?: string[];
  approvedMetrics: Array<{
    value: string;
    label: string;
    verified: boolean;
  }>;
};

const projectOverrides: Record<string, ProjectOverride> = {
  "Life Forge": {
    title: "Life OS",
    slug: "life-os",
    description:
      "A self-hosted personal operating system that brings thirteen life domains, resilient gamification, learning tools, and long-running AI agents into one multi-platform product.",
    type: "Full-stack product, AI, personal productivity",
    category: "Products",
    clientName: "Bayesian Labs",
    technologies: [
      "Next.js",
      "PostgreSQL",
      "FastAPI",
      "LangGraph",
      "Electron",
      "Expo",
    ],
    contribution:
      "Product strategy, experience design, full-stack architecture, domain systems, data migration, AI-agent services, and cross-platform delivery.",
    websiteLink: "https://game.bayesian-labs.com",
    approvedMetrics: [
      { value: "13", label: "life domains in the product", verified: true },
      {
        value: "5",
        label: "web, desktop, mobile, browser and VS Code surfaces",
        verified: true,
      },
    ],
  },
  "SaaS Forge": {
    title: "SaaS Forge",
    slug: "saas-forge",
    description:
      "An open-source, India-ready SaaS foundation for shipping web, desktop, and mobile products without surrendering the code, infrastructure, or upgrade path.",
    type: "Open-source SaaS platform",
    category: "Open Source",
    clientName: "Bayesian Labs",
    technologies: [
      "Next.js",
      "Better Auth",
      "PostgreSQL",
      "tRPC",
      "Electron",
      "Expo",
    ],
    contribution:
      "Product architecture and end-to-end implementation across auth, payments, CMS, scaffolding, shared packages, multi-platform applications, documentation, and AI-assisted upgrades.",
    githubLink: "https://github.com/anoopkarnik/saas-forge",
    websiteLink: "https://boilerplate.bayesian-labs.com",
    youtubeVideoLink: "https://youtu.be/0zpQTtcsPtk?si=Lx5FZdsYd1CL_Dlt",
    screenshots: [
      "https://pub-540add8b8ece44cab4963a5fe4abbf37.r2.dev/cms-images/1788183430255-g8r1ltv-turborepo-saas-boilerplate-code.png",
    ],
    approvedMetrics: [
      {
        value: "3",
        label: "web, desktop and mobile app surfaces",
        verified: true,
      },
      {
        value: "18",
        label: "public template tags in the Sep 2026 repository audit",
        verified: true,
      },
    ],
  },
};

const cmsKey =
  process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page";
const cacheNamespace =
  cmsKey
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "company-landing";
const landingPageRedisCacheKey = `company-landing:${cacheNamespace}:landing-page:postgres:v1`;
const landingPage = await cmsDb.landingPage.findUnique({
  where: { key: cmsKey },
  select: { id: true },
});
if (!landingPage) throw new Error(`CMS landing page ${cmsKey} was not found`);

const socialLinks = [
  ["GitHub", profile.githubUrl],
  ["LinkedIn", profile.linkedinUrl],
  ["Twitter", profile.twitterUrl],
  ["YouTube", profile.youtubeUrl],
  ["Website", profile.websiteUrl],
]
  .filter((item): item is [string, string] => Boolean(item[1]))
  .map(([label, url]) => ({ label, url }));

await cmsDb.landingPage.update({
  where: { id: landingPage.id },
  data: {
    logo: "/logo.png",
    darkLogo: "/logo.png",
    heroEyebrow: "AI automation · MVPs · data systems",
    tagline: "AI automation and production-ready products, built end-to-end",
    targetAudience: "Founders and operations teams",
    valueProposition:
      "I design, build, and ship AI automations, n8n workflows, full-stack MVPs, and data integrations without the handoff overhead of a large agency.",
    description:
      "Turn a manual workflow or product idea into a reliable deployed system—from discovery and architecture through implementation, launch, and handover.",
    availability: "Accepting selected client projects",
    responseTime: "Replies within 1 business day",
    primaryCtaLabel: "Start a project",
    primaryCtaLink: "#start-project",
    secondaryCtaLabel: "View client work",
    secondaryCtaLink: "#case-studies",
    donateNowLink: null,
    trustHeading: "Selected client and product work",
    proofHeading: "Evidence, not promises",
    servicePackagesHeading: "Ways I can help",
    servicePackagesDescription:
      "Focused engagements with clear deliverables, practical timelines, and production handover.",
    caseStudiesHeading: "Client problems turned into working systems",
    caseStudiesDescription:
      "A selection of public and anonymized work across automation, AI, full-stack products, and data engineering.",
    portfolioHeading: "Selected work",
    portfolioDescription:
      "Filter a curated set of client work, products, open-source builds, and experiments.",
    processHeading: "A direct path from problem to production",
    processDescription:
      "You work directly with the person designing and building the system.",
    processSteps: [
      {
        title: "Discover",
        description:
          "Clarify the business problem, users, constraints, success measure, and smallest valuable scope.",
      },
      {
        title: "Design",
        description:
          "Map the workflow, architecture, data boundaries, milestones, and delivery plan before implementation.",
      },
      {
        title: "Build",
        description:
          "Ship in visible increments with working demos, practical feedback loops, tests, and deployment automation.",
      },
      {
        title: "Launch & hand over",
        description:
          "Deploy, document, train your team, measure the outcome, and agree on any ongoing support.",
      },
    ],
    founderHeading: "Founder-led delivery",
    founderName: profile.fullName || profile.accountName,
    founderTitle: "AI Automation & Full-Stack Product Builder",
    founderShortBio:
      profile.details ||
      "I take ideas from ambiguous requirements to deployed products with a builder's bias and a researcher's mindset.",
    founderLongBio: profile.journey || profile.about,
    founderImageUrl: profile.profileImage,
    founderEducation:
      "M.S. Computer Science (AI), IIIT Hyderabad · B.E. Mechanical Engineering, BITS Pilani",
    founderLocation: profile.location,
    founderTimeline: [
      {
        label: "2015–2017",
        title: "Analytics foundation",
        description:
          "Built an applied analytics foundation while working with enterprise data and product problems.",
      },
      {
        label: "2018–2022",
        title: "Computer Science & AI",
        description:
          "Completed an M.S. in Computer Science with an AI specialization at IIIT Hyderabad and worked on applied research systems.",
      },
      {
        label: "2021–2024",
        title: "Production engineering",
        description:
          "Built backend services, data platforms, AI assistants, and full-stack systems for healthcare products.",
      },
      {
        label: "2025–Now",
        title: "Bayesian Labs",
        description:
          "Founder-led delivery across AI automation, n8n, full-stack MVPs, and productized systems.",
      },
    ],
    founderSocialLinks: socialLinks,
    leadHeading: "Tell me what you want to improve or launch",
    leadDescription:
      "Share the problem, current tools, budget range, and target timeline. I will reply with the most practical next step.",
    leadSuccessMessage:
      "Thanks—your project brief is in. I will reply within one business day.",
    seoTitle: "Bayesian Labs — AI Automation & Full-Stack Product Development",
    seoDescription:
      "AI automation, n8n workflows, production-ready MVPs, and data integrations built end-to-end for founders and operations teams.",
    organizationName: "Bayesian Labs (OPC) Private Limited",
  },
});

const servicePackages = [
  {
    slug: "ai-automation",
    title: "AI & n8n Automation",
    shortDescription:
      "Replace repetitive operational work with reliable, observable workflows and human review where it matters.",
    idealFor:
      "Teams moving data between inboxes, documents, CRMs, spreadsheets, analytics tools, and internal systems.",
    deliverables: [
      "Workflow discovery and automation map",
      "n8n or custom orchestration",
      "AI extraction, classification, or generation",
      "Retries, alerts, logging, and human approval paths",
      "Deployment, documentation, and handover",
    ],
    technologies: ["n8n", "AI/LLMs", "APIs", "PostgreSQL", "Next.js"],
    timeline: "2–6 weeks",
    ctaLabel: "Discuss an automation",
    ctaLink: "#start-project",
  },
  {
    slug: "mvp-development",
    title: "Production-ready MVP Development",
    shortDescription:
      "Go from a validated idea to a deployed product with authentication, data, payments, analytics, and operations included.",
    idealFor:
      "Founders who need a credible first product without coordinating multiple specialist vendors.",
    deliverables: [
      "Scope and architecture",
      "Responsive product UI",
      "Backend APIs and PostgreSQL data model",
      "Authentication, billing, analytics, and email",
      "CI/CD, deployment, documentation, and handover",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "AI"],
    timeline: "4–10 weeks",
    ctaLabel: "Scope an MVP",
    ctaLink: "#start-project",
  },
  {
    slug: "data-ai-integration",
    title: "Data & AI Integration",
    shortDescription:
      "Connect fragmented data, validate it early, and make AI useful inside the systems your team already operates.",
    idealFor:
      "Product and operations teams with ingestion, validation, OCR, search, reporting, or assistant requirements.",
    deliverables: [
      "Data-flow and quality assessment",
      "Ingestion and validation pipelines",
      "OCR, retrieval, or assistant integration",
      "Monitoring and failure handling",
      "Performance testing and technical documentation",
    ],
    technologies: ["Python", "Kafka", "PostgreSQL", "OCR", "LLMs"],
    timeline: "3–8 weeks",
    ctaLabel: "Review a data problem",
    ctaLink: "#start-project",
  },
];

for (const [order, service] of servicePackages.entries()) {
  await cmsDb.servicePackage.upsert({
    where: {
      landingPageId_slug: {
        landingPageId: landingPage.id,
        slug: service.slug,
      },
    },
    update: { ...service, order, isFeatured: true, isPublished: true },
    create: {
      ...service,
      order,
      isFeatured: true,
      isPublished: true,
      landingPageId: landingPage.id,
    },
  });
}

const projectByName = new Map(
  projects.map((project) => [project.name, project]),
);
const syncedProjects = new Map<string, string>();
const legacyProjectTitles = [
  ...selectedProjectNames,
  ...Object.values(projectOverrides).map((project) => project.title),
];

// Keep the migrated legacy records for audit/editing, but avoid showing a
// second card when the same project is now backed by a LifeForge source ID.
await cmsDb.project.updateMany({
  where: {
    landingPageId: landingPage.id,
    sourceId: null,
    title: { in: legacyProjectTitles },
  },
  data: { isPublished: false },
});

for (const [order, projectName] of selectedProjectNames.entries()) {
  const project = projectByName.get(projectName);
  if (!project) continue;
  const override = projectOverrides[projectName];
  const screenshots =
    override?.screenshots ?? stableMediaUrls(project.demoImageUrls ?? []);
  const sourceMetrics = [
    project.impact
      ? {
          value: project.impact.match(/\d+(?:\.\d+)?%?/)?.[0] ?? "Outcome",
          label: project.impact,
          verified: true,
        }
      : null,
  ].filter(Boolean) as Prisma.InputJsonValue[];
  const title = override?.title ?? project.name;
  const slug = override?.slug ?? slugify(project.name);
  const description =
    override?.description ?? plainSummary(project.description, project.name);
  const type = override?.type ?? project.projectTypes.join(", ");
  const category = override?.category ?? portfolioCategory(project);
  const clientName = override?.clientName ?? approvedClientName(project);
  const technologies = override?.technologies ?? project.projectTypes;
  const contribution = override?.contribution ?? project.contribution;
  const githubLink = override?.githubLink ?? project.githubUrl;
  const websiteLink =
    override?.websiteLink ?? project.websiteUrl ?? project.demoUrl;
  const youtubeVideoLink = override?.youtubeVideoLink ?? project.youtubeUrl;
  const approvedMetrics = override?.approvedMetrics ?? sourceMetrics;
  const record = await cmsDb.project.upsert({
    where: {
      landingPageId_sourceId: {
        landingPageId: landingPage.id,
        sourceId: project.id,
      },
    },
    update: {
      title,
      slug,
      description,
      publicDescription: description,
      type,
      category,
      clientName,
      technologies,
      screenshots,
      imageUrl: screenshots[0] ?? null,
      approvedMetrics,
      contribution,
      githubLink,
      websiteLink,
      youtubeVideoLink,
      confidentiality: confidentiality(project),
      isClientWork: category === "Client Work",
      isFeatured: order < 6,
      isPublished: true,
      syncedAt: new Date(),
      order,
    },
    create: {
      landingPageId: landingPage.id,
      sourceId: project.id,
      title,
      slug,
      description,
      publicDescription: description,
      type,
      category,
      clientName,
      technologies,
      screenshots,
      imageUrl: screenshots[0] ?? null,
      approvedMetrics,
      contribution,
      githubLink,
      websiteLink,
      youtubeVideoLink,
      confidentiality: confidentiality(project),
      isClientWork: category === "Client Work",
      isFeatured: order < 6,
      isPublished: true,
      syncedAt: new Date(),
      order,
    },
  });
  syncedProjects.set(project.name, record.id);
}

type CaseStudySeed = {
  projectName: string;
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  summary: string;
  challenge: string;
  solutionMdx: string;
  outcomeMdx?: string;
  architectureMdx?: string;
  contributionMdx?: string;
  serviceSlugs: string[];
  technologies: string[];
  timeline?: string;
  coverImageUrl?: string;
  projectUrl?: string;
  demoVideoUrl?: string;
  gallery?: Array<{
    type: "image" | "video" | "architecture";
    url: string;
    alt: string;
    caption?: string;
  }>;
  confidentiality: "PUBLIC" | "ANONYMIZED";
  metrics?: Array<{ value: string; label: string; verified: boolean }>;
};

const caseStudies: CaseStudySeed[] = [
  {
    projectName: "Life Forge",
    slug: "life-os",
    title: "Life OS: designing a personal system that rewards resilience",
    clientName: "Bayesian Labs",
    industry: "Personal productivity and learning",
    summary:
      "A self-hosted, experimental life operating system that consolidates thirteen personal domains, replaces a fragmented tool stack, and uses gamification to encourage recovery—not perfection.",
    challenge:
      "Personal and professional workflows were spread across Notion, YouTube, Taskade, TV Time, n8n, and other tools. The first gamified versions also punished missed habits so heavily that returning after a bad week felt impossible—the opposite of the discipline and resilience the product was meant to encourage.",
    solutionMdx: `
### Start with real workflows, not a feature checklist

The product began with Notion systems already used for productivity, finance, and relationships. Those working habits became the first models, then the scope expanded only when an immediate need justified it: a second brain, skill trees for learning, an indie-hacker workspace for resumes and applications, entertainment tracking, content creation, health, and other life domains.

That approach made Life OS a consolidation project rather than a collection of speculative dashboards. It now spans **thirteen domain areas**, while shared account, billing, content, and application infrastructure comes from SaaS Forge.

### Rebuild the motivation loop

Early versions tied experience points too closely to results. Missing several daily habits created so much negative progress that recovery felt unrealistic and motivation disappeared. The model was redesigned around three ideas:

- reward showing up and building discipline;
- make recovery after failure visible as resilience;
- provide small, slow dopamine hits without pretending to measure the exact improvement of every part of a person's body or life.

This also removed a harmful setup burden. The system should help someone exercise or learn now, not require hours of reading, testing, and data entry before they can begin.

### Separate the product from long-running AI work

The main experience remains a typed Next.js application. Long-running agents run in a separate FastAPI service using LangChain and LangGraph, behind a signed server boundary. That keeps agent execution and memory pressure isolated from the web request process and makes it easier to evolve model providers independently.

The same core product is delivered across web, Electron desktop, Expo mobile, a browser extension, and a VS Code extension. The objective is not five unrelated clients; it is one set of life data and workflows available in the context where the user needs them.
`.trim(),
    contributionMdx: `
I conceived and built the product end-to-end: product discovery from my own routines, domain modeling, UX, full-stack implementation, cross-platform packaging, AI-agent architecture, and the data work needed to bring existing systems into one place.

The most difficult product work included an editable AI-assisted PDF resume where the editor and rendered PDF had to agree, LinkedIn authentication and publishing, and preserving entertainment history while importing TV Time-style data before access disappeared.
`.trim(),
    architectureMdx: `
1. **Product clients:** Next.js web, Electron desktop, Expo mobile, browser extension, and VS Code extension.
2. **Application boundary:** Better Auth and tRPC expose typed product capabilities without duplicating domain rules across clients.
3. **System of record:** Prisma and PostgreSQL store the shared account, progress, knowledge, finance, entertainment, career, and other domain data.
4. **Agent boundary:** the Next.js server sends signed jobs to a separate FastAPI service.
5. **Agent runtime:** LangChain and LangGraph coordinate longer-running work such as knowledge capture and resume tailoring, then return durable results to the application.
`.trim(),
    outcomeMdx: `
Life OS is deliberately presented as an **experimental personal platform**, not a finished commercial product. It consolidated the workflows its builder actually uses; most modules are used at least weekly and several daily. The breadth is useful for discovering what deserves to become a focused standalone product, but it also creates the next design challenge: the interface makes sense to someone who has lived with earlier Notion versions for a year and can overwhelm a newcomer.

The next iteration will introduce beginner-friendly paths based on how much time someone wants to spend each day or week, with complexity revealed gradually. Commercialization will happen by extracting the strongest individual workflows into smaller products rather than trying to price the entire life system at once.
`.trim(),
    serviceSlugs: ["mvp-development", "data-ai-integration"],
    technologies: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "FastAPI",
      "LangGraph",
      "Electron",
      "Expo",
    ],
    timeline: "Personal product · active development",
    projectUrl: "https://game.bayesian-labs.com",
    confidentiality: "PUBLIC",
    metrics: [
      { value: "13", label: "life domains in the product", verified: true },
      {
        value: "5",
        label: "web, desktop, mobile, browser and VS Code surfaces",
        verified: true,
      },
    ],
  },
  {
    projectName: "SaaS Forge",
    slug: "saas-forge",
    title: "SaaS Forge: owning the code, deployment, and upgrade path",
    clientName: "Bayesian Labs",
    industry: "Developer tools and SaaS infrastructure",
    summary:
      "An open-source, India-ready SaaS foundation designed to grow from a web MVP into desktop and mobile products without surrendering infrastructure control or rebuilding the core.",
    challenge:
      "Vibe-coding platforms often tied deployment, costs, and code ownership to one vendor, while many boilerplates depended on authentication or payment modules that were limited or unsuitable in India. A useful starter also had to survive a harder problem: how does a customized downstream product receive later boilerplate improvements without being overwritten by them?",
    solutionMdx: `
### Build a foundation that can leave the demo stage

SaaS Forge was designed for people building micro-SaaS products who want full control of their code and infrastructure. The foundation favors strong open-source modules such as Better Auth and keeps the system modular enough that increased usage can be handled by extending the architecture instead of rewriting a tightly coupled prototype.

The build followed the dependency order a real product needs:

1. web application and landing experience;
2. authentication and database;
3. payments;
4. CMS and administration;
5. scaffold generation;
6. desktop and mobile applications;
7. experimental AI modules;
8. a separate backend service where Python is the better fit.

The first usable version did not include scaffold forms, admin and guest roles, or AI modules. Those were added after the core could already authenticate users, persist data, and support a product workflow.

### Make the starter portable

The source is a pnpm and Turborepo monorepo spanning Next.js web, Electron desktop, Expo mobile, shared authentication, database and UI packages, and a staged download/scaffold flow. A founder can start with the web surface and add desktop or mobile without replacing the account and data model.

The public starter includes production-oriented modules for auth, PostgreSQL data, payments, CMS, email, storage, observability, and scaffold/download workflows. AI modules are clearly treated as experimental. Multi-tenancy, API keys, and notifications are not presented as finished features where the current registry still marks them incomplete.

### Treat template drift as a product feature

The hardest part was upgrading an application after its downloaded boilerplate had been customized. Plain git merges worked at first, but large changes created intimidating conflicts. The solution became an explicit upgrade workflow: generate staged upgrade files and a machine-readable specification, then give an AI coding agent instructions to merge intent into the customized application instead of overwriting it.

This workflow was refined while upgrading Life OS. Current repository evidence is strongest for the Claude Code command and merge skill; the broader authoring guidance is also written so Codex can reason about the same repository boundaries and upgrade intent.

[Explore the source on GitHub](https://github.com/anoopkarnik/saas-forge) or [watch the product demo](https://www.youtube.com/watch?v=0zpQTtcsPtk).
`.trim(),
    contributionMdx: `
I owned product direction and implementation across the landing and product UI, Better Auth integration, PostgreSQL schema, payments, CMS, admin roles, storage and email, scaffold generation, web/desktop/mobile applications, documentation, and the AI-assisted upgrade workflow.

That ownership included the less visible work that makes a starter maintainable: keeping shared packages and the released template aligned, documenting editing boundaries for coding agents, testing generated variants, and using a real downstream product to expose upgrade conflicts.
`.trim(),
    architectureMdx: `
1. **Monorepo foundation:** pnpm and Turborepo coordinate applications, shared packages, and the released starter.
2. **Product surfaces:** Next.js serves web and administration; Electron and Expo reuse the same product contracts for desktop and mobile.
3. **Core services:** Better Auth, tRPC, Prisma, and PostgreSQL provide identity, typed APIs, and persistence.
4. **Operational modules:** payment providers, email, object storage, analytics, rate limiting, and observability are replaceable integrations rather than platform lock-in.
5. **Scaffold pipeline:** the server builds selected variants and stages downloadable output.
6. **Upgrade pipeline:** tree diffs and an upgrade specification describe upstream changes; an agent-assisted merge applies the intent to customized downstream code and resolves conflicts with context.
`.trim(),
    outcomeMdx: `
SaaS Forge now provides one controlled starting point for web, desktop, and mobile SaaS delivery. Its non-AI foundation is used as production-oriented infrastructure; the AI modules remain experimental and are labelled accordingly.

The most important outcome is architectural leverage: improvements to the shared foundation can flow into products such as Life OS without forcing those products back to a clean template. A September 2026 repository audit found **18 public template tags** and **195 commits**—evidence of an evolving upgrade path, not a claim that every downstream merge is automatic or conflict-free. Current CI is also not represented as fully green.
`.trim(),
    serviceSlugs: ["mvp-development", "data-ai-integration"],
    technologies: [
      "Next.js",
      "Better Auth",
      "PostgreSQL",
      "tRPC",
      "Turborepo",
      "Electron",
      "Expo",
    ],
    timeline: "Open-source product · active development",
    coverImageUrl:
      "https://pub-540add8b8ece44cab4963a5fe4abbf37.r2.dev/cms-images/1788183430255-g8r1ltv-turborepo-saas-boilerplate-code.png",
    projectUrl: "https://boilerplate.bayesian-labs.com",
    demoVideoUrl: "https://www.youtube.com/watch?v=0zpQTtcsPtk",
    gallery: [
      {
        type: "image",
        url: "https://pub-540add8b8ece44cab4963a5fe4abbf37.r2.dev/cms-images/1788183430255-g8r1ltv-turborepo-saas-boilerplate-code.png",
        alt: "SaaS Forge landing page and product interface",
        caption: "The public SaaS Forge product experience.",
      },
    ],
    confidentiality: "PUBLIC",
    metrics: [
      {
        value: "3",
        label: "web, desktop and mobile app surfaces",
        verified: true,
      },
      {
        value: "18",
        label: "public template tags as of Sep 2026",
        verified: true,
      },
    ],
  },
  {
    projectName: "Financial Documents OCR",
    slug: "financial-document-ocr-pipeline",
    title: "Financial document OCR: from terminal screenshots to Google Sheets",
    clientName: "Automation client",
    industry: "Financial operations automation",
    summary:
      "A table-aware OCR workflow that turns six visually different financial-terminal layouts into structured, reviewable Google Sheets rows instead of manual re-keying.",
    challenge:
      "A data-entry operator was manually reading dense screenshots for curves, spots, volatility, inflation, seasonality, and forward points. A generic OCR pass was not enough: the tables mixed charts and data, truncated headings, red and green values, negative signs, bid/ask pairs, placeholders, and layout-specific context that had to reach the output sheet.",
    solutionMdx: `
### Evaluate the extraction route before committing to a host

The project compared managed and self-hosted options—including Textract and PaddleOCR deployments—against accuracy, tunability, runtime, and cost. The design-time prices in that research are historical planning estimates, so they are not presented here as current cloud pricing.

Textract was reliable on four of the six sample layouts but offered little room to tune the two difficult formats. PaddleOCR exposed the controls needed for table-specific preprocessing, box thresholds, unclip ratios, and row grouping. The result was not one universal OCR preset: the upload UI collected the context each table needed and routed it with the image.

### Preserve meaning that pixels alone cannot provide

Each layout had its own contract:

- curves prepend a numeric curve identifier;
- volatility supplies a currency pair;
- inflation supplies the base index;
- forward points enforce date and term fields;
- spots and seasonality remove irrelevant currency inputs.

The active n8n workflow receives the upload through a webhook, posts it to a container-addressable PaddleOCR API, normalizes OCR text into a fixed schema with an LLM and structured parser, splits the returned rows, calculates requested derived fields, and appends them to Google Sheets.

The volatility surface was the hardest example: twenty-four expiries, five slash-delimited bid/ask pairs per row, several negative values, and color used inside a single numeric column. Solving it required layout-specific recognition rather than assuming color or spacing behaved consistently across all tables.
`.trim(),
    contributionMdx: `
I owned the cloud/OCR option research, the table-specific Next.js upload experience, PaddleOCR API and parameter tuning, n8n orchestration, structured normalization contract, and Google Sheets delivery.

The work also included translating client feedback into per-layout fields and identifying where a managed OCR service stopped being configurable enough. Raw workflow identifiers, credentials references, licensed terminal screenshots, and market data are deliberately excluded from this public case.
`.trim(),
    architectureMdx: `
1. A user selects the financial table type and uploads a screenshot in the Next.js interface.
2. The UI sends the image and layout-specific context to an n8n webhook.
3. n8n posts the image to the internal PaddleOCR FastAPI service.
4. OCR text is normalized into the table's structured row schema.
5. Derived values and identifiers are calculated, rows are split, and the result is appended to Google Sheets.
6. The sheet is a reviewable destination, but the supplied workflow does not prove a formal confidence gate, retry policy, or duplicate-prevention layer; those remain explicit hardening work.
`.trim(),
    outcomeMdx: `
The client received a reusable upload-to-sheet workflow across six materially different table layouts instead of a one-off extraction script.

The builder recalls Textract reaching 100% on four layouts and falling below 95% on two, with tuned PaddleOCR approaching 99.9% on the difficult cases. Those figures are **builder-reported project validation**, not independently reproducible benchmarks because execution logs were not retained.

For scale, the six supplied screens contain roughly **750 visible fields**. A conservative workflow estimate suggests that converting and spot-checking a representative six-screen batch could remove about **20–40 minutes**, or **50–80% of active handling time**, compared with manual transcription. This is an explicit scenario estimate—not a measured client KPI.
`.trim(),
    serviceSlugs: ["ai-automation", "data-ai-integration"],
    technologies: ["Next.js", "n8n", "AWS Textract", "PaddleOCR", "OCR"],
    timeline: "OCR automation engagement",
    confidentiality: "ANONYMIZED",
    metrics: [
      { value: "6", label: "distinct financial table layouts", verified: true },
      {
        value: "~750",
        label: "visible fields across the supplied sample screens",
        verified: true,
      },
    ],
  },
  {
    projectName: "Google Analytics and Search Report Generation",
    slug: "automated-ga4-search-reporting",
    title: "Automating GA4 and search reporting from collection to delivery",
    clientName: "Automation client",
    industry: "Marketing analytics automation",
    summary:
      "An n8n reporting system that replaces repeated exports, chart building, first-pass analysis, and document assembly with a review-first reporting workflow.",
    challenge:
      "Recurring reports meant opening Google Analytics, re-selecting date ranges, dimensions, filters, and comparisons, downloading data, analyzing it, and then writing and formatting the same document structure again. The work was valuable, but much of the preparation was repetitive.",
    solutionMdx: `
### Turn a recurring report into composable stages

The workflow was designed as a parent orchestration with smaller sub-workflows so collection, analysis, visualization, and document delivery could change independently. A scheduled or manual run supplies the reporting period and configured filters, then requests the relevant GA4 and Google Search Console data.

The analysis plan covers the questions a stakeholder is likely to act on:

- acquisition and source/medium movement;
- engagement and conversion changes;
- landing-page performance;
- organic queries, clicks, impressions, CTR, and average position;
- period-over-period trends, anomalies, and pages that merit investigation.

These analysis categories are design assumptions agreed for the case study; the retained artifacts do not prove that every category ran for every client report.

Normalized datasets feed deterministic chart specifications through QuickChart and a constrained AI step produces a first-pass narrative. The model drafts observations and possible explanations, while the human editor remains responsible for context, causal claims, prioritization, and the final recommendation.

### Keep document formatting out of the model

The hardest implementation constraint was producing a readable stakeholder document with free-tier APIs. Instead of asking a model to invent layout, the workflow separates content from presentation: fixed sections, tables, chart placements, paragraph styles, and ordered document updates are assembled through Google Docs. This makes formatting problems debuggable and allows the insight prompt to focus on analysis.
`.trim(),
    contributionMdx: `
I mapped the manual reporting process, designed the parent/sub-workflow boundaries, connected analytics and search data, defined the analysis schema, generated charts, integrated the AI drafting step, and built the Google Docs assembly flow.

I also kept the human review boundary explicit: automation prepares evidence and a useful first draft; the final report still requires someone who understands the business to edit and add context.
`.trim(),
    architectureMdx: `
1. A schedule or operator starts the parent n8n workflow with dates and report configuration.
2. Data sub-workflows request GA4 and Search Console dimensions and metrics.
3. A normalization layer aligns periods, labels, and chart-ready series.
4. QuickChart creates deterministic visual assets.
5. A constrained AI step drafts evidence-linked observations and questions.
6. Google Docs assembly applies the template, tables, images, headings, and styles.
7. A human reviews, edits, and delivers the report.
`.trim(),
    outcomeMdx: `
The recurring task changed from **collect, export, chart, analyze, write, and format** to **review, correct, contextualize, and deliver**. That is the durable outcome: the analyst spends time on judgment instead of rebuilding the reporting pipeline.

No retained time study supports a public KPI. For planning purposes, a report that previously took roughly two to four hours could plausibly become thirty to sixty minutes of editorial review once the integrations are stable—an estimated **60–80% reduction in active preparation time**. That range is an explicit implementation assumption, not a measured result.
`.trim(),
    serviceSlugs: ["ai-automation", "data-ai-integration"],
    technologies: ["n8n", "GA4", "QuickChart", "Google Docs", "AI"],
    timeline: "Recurring reporting automation",
    confidentiality: "ANONYMIZED",
  },
  {
    projectName: "Restaurant Order Vapi Call",
    slug: "voice-driven-restaurant-ordering",
    title: "Voice restaurant ordering grounded in menu tools",
    clientName: "Automation client",
    industry: "Restaurant operations and conversational AI",
    summary:
      "A Vapi and n8n proof of concept that lets a caller explore and customize a pizza order while restricting every item, option, and price to backend menu data.",
    challenge:
      "A natural voice interface must feel flexible, but a restaurant cannot accept an agent inventing menu items, prices, availability, toppings, discounts, fees, or delivery promises. The prototype needed to separate conversation from operational truth and stop the order whenever required data could not be validated.",
    solutionMdx: `
### Make lookup mandatory, not optional

The Vapi prompt treats the menu tool as the only source of truth. Every item mentioned by a caller is looked up before it can be added or modified. The workflow canonicalizes the item name, checks availability, validates the requested size and toppings, and uses only tool-returned prices to calculate line subtotals and the final total.

If a menu lookup is empty, a size is unsupported, a topping is unavailable, or a required price is missing, the agent does not continue optimistically. It asks one focused clarification at a time or offers a valid alternative.

### Separate reads from writes

The prototype separates menu retrieval from order creation. Vapi passes structured intent and session context to an n8n webhook. The menu route reads the Menu Items sheet; the order route writes the order and its normalized line items only after customer details and the order have been read back for confirmation.

Spoken output is deliberately short and derived from backend results. Internal tool names, JSON, and chain-of-thought-style reasoning never belong in the call.

### Design the unhappy paths explicitly

The supplied specifications cover valid customization, adding another item, changing a size, rejecting an unsupported topping, a failed lookup, and gathering missing contact or delivery details one at a time. Modifications go through menu validation again instead of editing trusted data in place.

The POC artifacts contain schema and naming differences between prompt versions and workbook tabs. Those are recorded as prototype debt rather than hidden: the menu price model, tool names, confirmation timing, and normalized order schema must be reconciled before production deployment.
`.trim(),
    contributionMdx: `
I designed the tool-first conversation contract, Vapi prompt, n8n orchestration, menu and order tools, deterministic validation rules, confirmation flow, and the Google Sheets prototype data model.

The public case uses only aggregate fixture counts. Raw prompts and spreadsheets contain sample personal details and are intentionally not published.
`.trim(),
    architectureMdx: `
1. **Caller and Vapi:** speech is transcribed and the current intent is captured.
2. **n8n webhook:** session context and structured intent are routed to the correct tool flow.
3. **Menu read path:** Get Menu reads the Menu Items sheet and returns canonical availability, customization, and price data.
4. **Validation and confirmation:** the agent requests one missing detail at a time and reads the validated order back.
5. **Order write path:** Add Order writes the order and normalized order-item rows only after confirmation.
6. **Response path:** the backend result is converted into a concise spoken confirmation or recovery message.
`.trim(),
    outcomeMdx: `
The result is an evidence-backed **proof of concept**, not a production call-center claim. It demonstrates how a voice agent can handle menu discovery, customization, clarification, confirmation, and modification while keeping prices and availability grounded in tools.

The fixture model includes twelve menu items and twenty-five representative order lines. There are no retained production call logs, completion-rate measurements, latency benchmarks, or real restaurant traffic, so none are claimed. Production hardening would add idempotent writes, webhook retries, timeout recovery, interruption and dropped-call testing, reconciled schemas, and measured call-level quality.
`.trim(),
    serviceSlugs: ["ai-automation", "data-ai-integration"],
    technologies: ["Vapi", "n8n", "AI", "Google Sheets"],
    timeline: "Tool-first voice POC",
    confidentiality: "ANONYMIZED",
    metrics: [
      { value: "12", label: "menu items in the POC fixture", verified: true },
      {
        value: "25",
        label: "representative order lines in the fixture",
        verified: true,
      },
    ],
  },
  {
    projectName: "Fhir Data Validation Service",
    slug: "fhir-data-validation-service",
    title: "FHIR validation before bad records reached downstream systems",
    clientName: "Mpowered Health",
    industry: "Healthcare interoperability",
    summary:
      "A configurable FHIR R4 validation platform covering almost fifty resource types, with a separate Flask validator and a Next.js diagnostics interface for finding data problems early.",
    challenge:
      "FHIR resources from multiple providers varied in completeness and conformance. When invalid records travelled further through the data platform, the resulting failures were separated from their source and much harder to diagnose. Validation needed to cover many resource types without forcing every rule change through a backend deployment.",
    solutionMdx: `
### Validate at the ingestion boundary

Imported provider resources arrived on Kafka. The import-to-producer connectors were owned by other teams; my scope began with the validation platform consuming those records and ended with clear validation results for operators and downstream systems.

A separate Flask service ran the FHIR R4 profile validator across almost fifty resource types. It checked profile conformance and produced structured diagnostics rather than a binary pass/fail response, so a bad record could be traced to a missing or invalid field and the rule that rejected it.

### Put validation operations in a product interface

A Next.js UI surfaced invalid records and their diagnostics and allowed validation rules to be configured without editing the validator code for every operational change. Keeping the UI separate from the Python service made the validator independently deployable and kept healthcare-specific processing out of the web process.

The platform established a clear contract: valid resources continue through the pipeline; invalid resources and their diagnostics become visible immediately enough to investigate the provider, profile, and rule that caused the problem.
`.trim(),
    contributionMdx: `
As Founding Senior Software Engineer at Mpowered Health, I owned the validation system end-to-end apart from importing provider FHIR resources into the Kafka producer. My work covered the R4 validator service, rule configuration model, Kafka-side processing, diagnostics contract, Next.js operations UI, invalid-record experience, and integration with downstream handling.

This was part of three years of full-time product engineering at Mpowered Health, not a short external engagement.
`.trim(),
    architectureMdx: `
~~~text
Provider connectors (outside my scope)
                │
                ▼
              Kafka
                │
                ▼
      Flask FHIR R4 validator ◄──── configured rules
                │                         ▲
        ┌───────┴────────┐                │
        ▼                ▼                │
 valid resources   invalid + diagnostics ─┴─► Next.js operations UI
        │
        ▼
 downstream systems
~~~

1. **Provider connectors — outside my scope:** source healthcare records are converted/imported and published to Kafka.
2. **Kafka boundary:** incoming FHIR resources provide a durable handoff to validation.
3. **Flask validator:** a separately deployed Python service applies FHIR R4 profiles and configured rules across almost fifty resource types.
4. **Result contract:** valid records proceed; invalid records carry structured diagnostics and rule context.
5. **Next.js operations UI:** teams inspect failures and configure validation rules without coupling operational changes to the ingestion connector.
6. **Feedback loop:** diagnostics identify the provider, resource type, field, profile, and rule to address before the same defect spreads downstream.
`.trim(),
    outcomeMdx: `
The source project record reports an **80% reduction in data-related bugs** after validation moved earlier in the pipeline. The original measurement protocol is no longer retained, so the figure is published as a source-recorded outcome—not reconstructed with an invented calculation.

The durable engineering outcome is easier to verify: invalid healthcare records became visible with actionable diagnostics near ingestion, validation rules became operationally configurable, and one service could apply consistent FHIR R4 checks across almost fifty resource types.
`.trim(),
    serviceSlugs: ["data-ai-integration", "mvp-development"],
    technologies: ["Python", "Flask", "Kafka", "FHIR", "Data Engineering"],
    timeline: "3-year full-time role · platform initiative",
    confidentiality: "PUBLIC",
    metrics: [
      {
        value: "~50",
        label: "FHIR R4 resource types covered",
        verified: true,
      },
      {
        value: "80%",
        label: "source-recorded reduction in data-related bugs",
        verified: true,
      },
    ],
  },
  {
    projectName: "HRS Hikers Website",
    slug: "hrs-hikers-website",
    title:
      "HRS Hikers: turning adventure operations into a trustworthy web journey",
    clientName: "HRS Hikers",
    industry: "Outdoor education and adventure travel",
    summary:
      "A multi-page marketing and enquiry platform that helps individuals, parents, schools, and institutions understand HRS Hikers' programs, safety practices, operating proof, and next steps.",
    challenge:
      "HRS Hikers serves audiences with very different questions. An individual wants to compare treks; a parent or school needs safety, supervision, documentation, logistics, and risk information; every visitor needs a clear way to enquire. The site had to make a broad adventure catalog feel credible rather than overwhelming.",
    solutionMdx: `
### Design around decisions, not company departments

The information architecture separates Home, About, For Schools, Programs, Studio, Testimonials, and Contact. Public program pages cover Himalayan camps and treks alongside Confidence Park and other adventure experiences, while galleries and written/video testimonials make the work tangible.

The school journey receives its own content rather than a generic contact-page link. It explains the guide-to-student ratio, trained first aiders, risk assessments and consent forms, transport assistance, mapped hospitals, dietary and accommodation planning, and campus safety. A dedicated enquiry asks for enough context to prepare an itinerary, risk assessment, and costing.

### Put trust beside the conversion path

The homepage and supporting pages combine program discovery with founder context, safety and logistics proof, FAQs, participant stories, phone and email actions, and inline enquiry forms. Visitors do not have to choose between a marketing page and operational detail; the evidence appears close to the decision it supports.

The responsive experience uses direct calls to action and progressive detail so the main route remains scannable on mobile while deeper program and institutional information stays available.
`.trim(),
    contributionMdx: `
I built and evolved the full web platform, including the responsive application structure, program and school journeys, reusable interface components, content integration, enquiry paths, analytics integration, and deployment.

The public site proves what is live today. It does not establish an SEO lift, enquiry conversion increase, or traffic result, so those outcomes are not invented here.
`.trim(),
    architectureMdx: `
1. **Next.js App Router:** server-rendered public routes for the core marketing and program journeys.
2. **Reusable content/UI layer:** common navigation, program cards, trust sections, media, FAQs, and enquiry components stay consistent across audiences.
3. **Typed application layer:** tRPC supports application interactions while the public experience remains fast and crawlable.
4. **Analytics and deployment:** Google Analytics captures usage; Vercel serves the application behind Cloudflare.
5. **Conversion paths:** homepage, school-specific, and contact enquiries connect content discovery to a concrete next step.
`.trim(),
    outcomeMdx: `
HRS Hikers now has a deployed platform that presents programs, safety credentials, business proof, media, testimonials, and enquiries to both individual and institutional audiences.

The live site displays **50+ Himalayan treks, 175+ adventure camps, 25+ schools and institutes, and 5,500+ participants**. These are HRS Hikers' published operating figures and are shown as evidence of the business the site represents—not as growth caused by the website.
`.trim(),
    serviceSlugs: ["mvp-development"],
    technologies: ["Next.js", "TypeScript", "tRPC", "Responsive UI", "Vercel"],
    timeline: "2025–2026 · ongoing site evolution",
    projectUrl: "https://hrshikers.com",
    confidentiality: "PUBLIC",
    metrics: [
      {
        value: "25+",
        label: "schools and institutes shown by HRS",
        verified: true,
      },
      { value: "5,500+", label: "participants shown by HRS", verified: true },
    ],
  },
];

for (const [order, study] of caseStudies.entries()) {
  const sourceProject = projectByName.get(study.projectName);
  const projectId = syncedProjects.get(study.projectName);
  const stableImages = stableMediaUrls(sourceProject?.demoImageUrls ?? []);
  const gallery =
    study.gallery ??
    stableImages.map((url) => ({
      type: "image" as const,
      url,
      alt: `${study.title} screenshot`,
    }));
  const data = {
    title: study.title,
    clientName: study.clientName,
    industry: study.industry,
    summary: study.summary,
    challenge: study.challenge,
    solutionMdx: study.solutionMdx,
    outcomeMdx: study.outcomeMdx,
    architectureMdx: study.architectureMdx,
    contributionMdx: study.contributionMdx ?? sourceProject?.contribution,
    serviceSlugs: study.serviceSlugs,
    technologies: study.technologies,
    metrics: study.metrics ?? [],
    gallery,
    timeline: study.timeline,
    coverImageUrl: study.coverImageUrl ?? stableImages[0] ?? null,
    projectUrl:
      study.projectUrl ?? sourceProject?.websiteUrl ?? sourceProject?.githubUrl,
    demoVideoUrl: study.demoVideoUrl ?? sourceProject?.youtubeUrl,
    clientConsentGranted: study.confidentiality === "PUBLIC",
    confidentiality: study.confidentiality,
    isFeatured: order < 5,
    isPublished: true,
    seoTitle: `${study.title} | Bayesian Labs`,
    seoDescription: study.summary,
    order,
    projectId,
  };
  await cmsDb.caseStudy.upsert({
    where: {
      landingPageId_slug: {
        landingPageId: landingPage.id,
        slug: study.slug,
      },
    },
    update: data,
    create: { ...data, slug: study.slug, landingPageId: landingPage.id },
  });
}

await cmsDb.proofMetric.deleteMany({
  where: { landingPageId: landingPage.id },
});
await cmsDb.proofMetric.createMany({
  data: [
    {
      landingPageId: landingPage.id,
      value: "80%",
      label: "fewer data-related bugs",
      context: "FHIR validation service",
      source: "LifeForge project record",
      verificationStatus: "VERIFIED",
      isPublished: true,
      order: 0,
      sourceProjectId: syncedProjects.get("Fhir Data Validation Service"),
    },
    {
      landingPageId: landingPage.id,
      value: "144",
      label: "projects documented",
      context: "Across AI, automation, full-stack, data, and product work",
      source: "LifeForge portfolio",
      verificationStatus: "VERIFIED",
      isPublished: true,
      order: 1,
    },
    {
      landingPageId: landingPage.id,
      value: "5",
      label: "freelance builds",
      context: "Client engagements recorded in LifeForge",
      source: "LifeForge portfolio",
      verificationStatus: "VERIFIED",
      isPublished: true,
      order: 2,
    },
    {
      landingPageId: landingPage.id,
      value: "6%",
      label: "tracking accuracy improvement",
      context: "Air-surveillance ML project recorded in LifeForge",
      source: "LifeForge project record",
      verificationStatus: "VERIFIED",
      isPublished: true,
      order: 3,
    },
  ],
});

// Existing template testimonials are deliberately not treated as client proof.
await cmsDb.testimonial.updateMany({
  where: {
    landingPageId: landingPage.id,
    OR: [{ isVerified: false }, { consentGranted: false }],
  },
  data: { isPublished: false },
});

await cmsDb.blogPost.updateMany({
  where: { landingPageId: landingPage.id },
  data: {
    author: profile.fullName || profile.accountName,
    status: "published",
  },
});
await cmsDb.documentationPage.updateMany({
  where: { landingPageId: landingPage.id },
  data: {
    author: profile.fullName || profile.accountName,
    status: "published",
  },
});

let redisCacheInvalidated = false;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  await redis.del(landingPageRedisCacheKey);
  redisCacheInvalidated = true;
}

console.log("LifeForge public CMS sync completed.");
console.table({
  sourceProjectsSelected: projects.length,
  portfolioProjectsPublished: syncedProjects.size,
  servicePackagesPublished: servicePackages.length,
  caseStudiesPublished: caseStudies.length,
  proofMetricsPublished: 4,
  redisCacheInvalidated,
  signedOrPrivateMediaExcluded: projects.reduce(
    (total, project) =>
      total +
      Math.max(
        0,
        (project.demoImageUrls?.length ?? 0) -
          stableMediaUrls(project.demoImageUrls ?? []).length,
      ),
    0,
  ),
});

await Promise.all([lifeForgeDb.$disconnect(), cmsDb.$disconnect()]);
