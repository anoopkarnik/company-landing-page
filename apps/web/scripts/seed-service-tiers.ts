/**
 * Defines the Service Packages tab as four priced ladders.
 *
 *   pnpm --filter web seed:service-tiers -- --dry-run
 *   pnpm --filter web seed:service-tiers
 *
 * Each capability has an entry tier and two tiers above it, following a
 * ~2.5x / 5x ladder. The three original packages (ai-automation,
 * mvp-development, data-ai-integration) are the entry tier of their ladder:
 * their authored copy and price are left exactly as they are, and their
 * position, service heading, and level are set to keep each ladder together.
 *
 * Each package stores its service heading and Basic/Medium/Advanced level.
 * The public section groups by heading and sorts by level; `order` controls
 * heading order. Packages start unfeatured, with equal visual priority.
 *
 * Idempotent: upserted on (landingPageId, slug), so re-running updates copy in
 * place rather than creating duplicates.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@workspace/database/client";

import { SERVICE_LEVELS } from "../lib/service-packages";

import { loadEnvFile, parseArgs } from "./lib/cover-backfill";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");

await loadEnvFile(path.join(appDir, ".env"));
await loadEnvFile(path.join(appDir, ".env.local"));

const { dryRun } = parseArgs(process.argv.slice(2));

type TierCopy = {
  title: string;
  shortDescription: string;
  idealFor: string;
  deliverables: string[];
  technologies: string[];
  timeline: string;
  priceFrom: number;
  ctaLabel: string;
};

type Tier = {
  slug: string;
  /** Omitted for the pre-existing packages, whose copy is left untouched. */
  copy?: TierCopy;
};

/** Ladders in display order; within a ladder, cheapest first. */
const LADDERS: Array<{ name: string; tiers: Tier[] }> = [
  {
    name: "Automation",
    tiers: [
      { slug: "ai-automation" },
      {
        slug: "automation-ai-extraction",
        copy: {
          title: "AI Document Processing",
          shortDescription:
            "Turn PDFs, screenshots, and call transcripts into organized, usable data, with validation and a review step before it reaches your business systems.",
          idealFor:
            "Teams manually reading documents or recordings and entering the same information into spreadsheets or databases.",
          deliverables: [
            "Text extraction from documents, screenshots, or transcripts",
            "Consistent fields and formatting for extracted data",
            "Validation rules and calculated fields",
            "A review step in Sheets, a database, or an inbox",
            "Automatic retries, alerts, and error tracking",
          ],
          technologies: ["n8n", "PaddleOCR", "AI/LLMs", "Google Sheets", "PostgreSQL"],
          timeline: "2–5 weeks",
          priceFrom: 1200,
          ctaLabel: "Discuss document processing",
        },
      },
      {
        slug: "automation-platform",
        copy: {
          title: "Connected Automation Platform",
          shortDescription:
            "Bring multiple workflows together in one coordinated system, with shared monitoring, approval paths, and reporting across your team.",
          idealFor:
            "Operations teams managing several automations that need clearer ownership, reliable monitoring, and a shared history of activity.",
          deliverables: [
            "An automation plan covering workflows across teams",
            "Connected workflows with reusable steps",
            "Human approval and escalation paths",
            "Monitoring, alerts, and workflow history",
            "Scheduled reports and automated delivery",
            "Documentation, team training, and handover",
          ],
          technologies: ["n8n", "AI/LLMs", "APIs", "PostgreSQL", "Google Workspace"],
          timeline: "6–10 weeks",
          priceFrom: 2500,
          ctaLabel: "Plan your automation platform",
        },
      },
    ],
  },
  {
    name: "Data & AI",
    tiers: [
      { slug: "data-ai-integration" },
      {
        slug: "validated-data-pipeline",
        copy: {
          title: "Data Quality & Validation",
          shortDescription:
            "Check incoming data before it reaches your applications, route invalid records for review, and make it clear where errors started.",
          idealFor:
            "Teams dealing with inconsistent data from multiple sources and spending too much time tracing errors after they cause problems.",
          deliverables: [
            "Clear requirements for data formats and required fields",
            "Validation checks as data enters your system",
            "Separate paths for valid records and records needing review",
            "A dashboard to inspect validation failures",
            "Source-level feedback to help resolve recurring errors",
            "Monitoring, alerts, and documentation",
          ],
          technologies: ["Kafka", "FHIR", "PostgreSQL", "Next.js", "Python"],
          timeline: "5–9 weeks",
          priceFrom: 2000,
          ctaLabel: "Improve your data quality",
        },
      },
      {
        slug: "data-platform-ai",
        copy: {
          title: "Unified Data & AI Platform",
          shortDescription:
            "Bring data from across your business into a shared foundation for AI assistants, search, and reporting, with access controls and monitoring built in.",
          idealFor:
            "Companies that need a consistent view of data across products and vendors, with AI answers grounded in their own records.",
          deliverables: [
            "Connected data pipelines across your sources",
            "A shared warehouse or operational data model",
            "Search and retrieval that connect AI to your records",
            "AI assistants or reporting tools for your team",
            "Access permissions, monitoring, and cost controls",
            "Performance testing and technical documentation",
          ],
          technologies: ["Python", "PostgreSQL", "Kafka", "LLMs", "Next.js"],
          timeline: "8–14 weeks",
          priceFrom: 4000,
          ctaLabel: "Plan your data platform",
        },
      },
    ],
  },
  {
    name: "Product Development",
    tiers: [
      { slug: "mvp-development" },
      {
        slug: "production-mvp",
        copy: {
          title: "Production-ready Product",
          shortDescription:
            "Build the foundations for a product people rely on, with user permissions, subscription billing, automated tests, and monitoring to support day-to-day operations.",
          idealFor:
            "Founders with early users who need stronger billing, access controls, and operational reliability as their product grows.",
          deliverables: [
            "Product scope, architecture, and database design",
            "Sign-in, user roles, and access permissions",
            "Payments, subscriptions, and billing workflows",
            "Automated tests and deployment pipelines",
            "Error tracking, analytics, and alerts",
            "Deployment, documentation, and handover",
          ],
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Vercel"],
          timeline: "8–14 weeks",
          priceFrom: 2500,
          ctaLabel: "Prepare your product for growth",
        },
      },
      {
        slug: "scaling-mvp",
        copy: {
          title: "Product Scaling & Integrations",
          shortDescription:
            "Prepare your existing product for more customers and more complex workflows, with separate customer workspaces, deeper integrations, and targeted performance improvements.",
          idealFor:
            "Teams with a working product that needs to support more customers, connect to more tools, and become easier to operate and maintain.",
          deliverables: [
            "Separate customer workspaces with secure data boundaries",
            "Third-party integrations and webhook handling",
            "Background tasks, queues, and scheduled jobs",
            "Performance analysis and database query improvements",
            "Monitoring, operating guides, and incident procedures",
            "Technical handover to your in-house team",
          ],
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Vercel"],
          timeline: "10–16 weeks",
          priceFrom: 5000,
          ctaLabel: "Scale your product",
        },
      },
    ],
  },
  {
    name: "Web Presence",
    tiers: [
      {
        slug: "landing-page-starter",
        copy: {
          title: "Landing Page",
          shortDescription:
            "A single-page site that loads fast, reads well on a phone, and turns visitors into enquiries. Content changes come to me.",
          idealFor:
            "Founders who need a credible presence online this week, without taking on a CMS.",
          deliverables: [
            "Single-page responsive site on Next.js",
            "Hero, services, proof, and contact sections",
            "Enquiry form with email notification",
            "SEO metadata, sitemap, and analytics",
            "Deployment, custom domain, and handover",
          ],
          technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
          timeline: "About 1 week",
          priceFrom: 200,
          ctaLabel: "Start a landing page",
        },
      },
      {
        slug: "landing-page-cms",
        copy: {
          title: "Landing Page with CMS",
          shortDescription:
            "Everything in the landing page, plus an admin CMS so your team edits content, services, and testimonials without waiting on a redeploy.",
          idealFor:
            "Teams whose copy, pricing, or offers change often enough that waiting on a developer has become the bottleneck.",
          deliverables: [
            "Multi-section marketing site on the Next.js App Router",
            "Admin CMS for content, services, testimonials, and team",
            "Image uploads backed by Cloudflare R2 or Vercel Blob",
            "Lead capture with email notification and a lead inbox",
            "SEO metadata, sitemap, structured data, and analytics",
            "Deployment, custom domain, documentation, and handover",
          ],
          technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "tRPC", "Vercel"],
          timeline: "1–3 weeks",
          priceFrom: 500,
          ctaLabel: "Discuss a CMS site",
        },
      },
      {
        slug: "marketing-site-cms",
        copy: {
          title: "Marketing Site with CMS and Blog",
          shortDescription:
            "A multi-audience site with case studies, a blog, and documented enquiry routing — the setup this site itself runs on.",
          idealFor:
            "Companies selling to more than one audience — the shape built for HRS Hikers, where individuals, parents, and schools each need their own path.",
          deliverables: [
            "Multi-page site with audience-specific journeys",
            "Case study and portfolio publishing with cover images",
            "MDX blog and documentation with crawlable routing",
            "Enquiry segmentation, lead routing, and email notifications",
            "Structured data, sitemap, and Google Analytics",
            "Deployment behind Cloudflare, documentation, and handover",
          ],
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "tRPC", "MDX", "Vercel", "Cloudflare"],
          timeline: "3–6 weeks",
          priceFrom: 1000,
          ctaLabel: "Plan a marketing site",
        },
      },
    ],
  },
];

const databaseModule = await import("@workspace/database/client");
const db: PrismaClient =
  (databaseModule.default as any)?.default ??
  databaseModule.default ??
  databaseModule;

const cmsKey = process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page";
const landingPage = await db.landingPage.findUnique({ where: { key: cmsKey } });

if (!landingPage) {
  throw new Error(`No landing page CMS record for key "${cmsKey}"`);
}

const flattened = LADDERS.flatMap((ladder) =>
  ladder.tiers.map((tier, index) => ({
    ...tier,
    ladder: ladder.name,
    level: SERVICE_LEVELS[index]!,
  })),
);

let position = 0;
let failures = 0;

for (const tier of flattened) {
  const order = position;
  position += 1;

  const where = {
    landingPageId_slug: { landingPageId: landingPage.id, slug: tier.slug },
  };
  const existing = await db.servicePackage.findUnique({
    where,
    select: { id: true, title: true, priceFrom: true },
  });

  // A tier with no copy is one of the original packages: reposition it, but
  // leave the authored copy and price alone.
  if (!tier.copy) {
    if (!existing) {
      failures += 1;
      console.error(
        `failed\t${tier.slug}\texpected an existing package to reposition, found none`,
      );
      continue;
    }
    if (dryRun) {
      console.log(
        `would reposition\t${order}\t${tier.ladder}\t${tier.slug}\t$${existing.priceFrom}\t${existing.title}`,
      );
      continue;
    }
    await db.servicePackage.update({
      where,
      data: { order, isFeatured: false, category: tier.ladder, level: tier.level },
    });
    console.log(
      `repositioned\t${order}\t${tier.ladder}\t${tier.slug}\t$${existing.priceFrom}\t${existing.title}`,
    );
    continue;
  }

  const data = {
    ...tier.copy,
    category: tier.ladder,
    level: tier.level,
    priceCurrency: "USD",
    ctaLink: "#start-project",
    isFeatured: false,
    isPublished: true,
    order,
  };

  if (dryRun) {
    console.log(
      `would ${existing ? "update" : "create"}\t${order}\t${tier.ladder}\t${tier.slug}\t$${tier.copy.priceFrom}\t${tier.copy.title}`,
    );
    continue;
  }

  await db.servicePackage.upsert({
    where,
    create: { ...data, slug: tier.slug, landingPageId: landingPage.id },
    update: data,
  });

  console.log(
    `${existing ? "updated" : "created"}\t${order}\t${tier.ladder}\t${tier.slug}\t$${tier.copy.priceFrom}\t${tier.copy.title}`,
  );
}

await db.$disconnect();

if (failures) {
  throw new Error(`${failures} service tier(s) failed`);
}
