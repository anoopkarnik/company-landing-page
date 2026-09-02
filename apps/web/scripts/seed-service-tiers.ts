/**
 * Defines the Service Packages tab as four priced ladders.
 *
 *   pnpm --filter web seed:service-tiers -- --dry-run
 *   pnpm --filter web seed:service-tiers
 *
 * Each capability has an entry tier and two tiers above it, following a
 * ~2.5x / 5x ladder. The three original packages (ai-automation,
 * mvp-development, data-ai-integration) are the entry tier of their ladder:
 * their authored copy and price are left exactly as they are, and only their
 * position is set, so the tiers of one ladder sit together.
 *
 * Every package is unfeatured on purpose. The public query orders by
 * `isFeatured desc, order asc`, so leaving three entry tiers featured would
 * hoist them above every upper tier and break the ladders apart. Ordering is
 * therefore carried entirely by `order`.
 *
 * Idempotent: upserted on (landingPageId, slug), so re-running updates copy in
 * place rather than creating duplicates.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@workspace/database/client";

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
          title: "Automation with AI Extraction",
          shortDescription:
            "Automations that read messy inputs — documents, screenshots, call transcripts — and turn them into structured rows your team can review.",
          idealFor:
            "Teams whose bottleneck is re-keying data out of PDFs, terminal screenshots, or recorded calls.",
          deliverables: [
            "Layout-aware OCR or transcript extraction",
            "Structured schema and normalization step",
            "Derived fields and validation rules",
            "Review-first destination in Sheets, a database, or an inbox",
            "Retries, alerting, and failure logging",
          ],
          technologies: ["n8n", "PaddleOCR", "AI/LLMs", "Google Sheets", "PostgreSQL"],
          timeline: "2–5 weeks",
          priceFrom: 1200,
          ctaLabel: "Discuss an extraction workflow",
        },
      },
      {
        slug: "automation-platform",
        copy: {
          title: "Automation Platform",
          shortDescription:
            "Several workflows running as one system: shared orchestration, human approval where it matters, and observability you can act on.",
          idealFor:
            "Operations teams running enough automations that failures, ownership, and audit trails have become the real problem.",
          deliverables: [
            "Workflow discovery and automation map across teams",
            "Parent and sub-workflow orchestration",
            "Human approval and escalation paths",
            "Monitoring, alerting, and run history",
            "Scheduled reporting and delivery",
            "Documentation, training, and handover",
          ],
          technologies: ["n8n", "AI/LLMs", "APIs", "PostgreSQL", "Google Workspace"],
          timeline: "6–10 weeks",
          priceFrom: 2500,
          ctaLabel: "Plan an automation platform",
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
          title: "Validated Data Pipeline",
          shortDescription:
            "Catch bad records at the boundary instead of downstream: explicit contracts, validation, and diagnostics that name the source.",
          idealFor:
            "Teams where invalid records reach downstream systems and nobody finds out until something breaks.",
          deliverables: [
            "Source and schema contract definition",
            "Validation service at the ingestion boundary",
            "Valid and invalid routing with a result contract",
            "Operations UI for inspecting failures",
            "Feedback loop identifying the offending provider",
            "Monitoring, alerting, and documentation",
          ],
          technologies: ["Kafka", "FHIR", "PostgreSQL", "Next.js", "Python"],
          timeline: "5–9 weeks",
          priceFrom: 2000,
          ctaLabel: "Review a validation problem",
        },
      },
      {
        slug: "data-platform-ai",
        copy: {
          title: "Data Platform with AI",
          shortDescription:
            "A consolidated data layer with retrieval, assistants, and reporting built on top — governed, monitored, and documented.",
          idealFor:
            "Companies whose data is spread across products and vendors, and who want AI grounded in real records rather than guessing.",
          deliverables: [
            "Consolidated ingestion across sources",
            "Warehouse or operational data model",
            "Retrieval layer grounding AI in real records",
            "Assistant or reporting surfaces for the team",
            "Access control, monitoring, and cost controls",
            "Performance testing and technical documentation",
          ],
          technologies: ["Python", "PostgreSQL", "Kafka", "LLMs", "Next.js"],
          timeline: "8–14 weeks",
          priceFrom: 4000,
          ctaLabel: "Scope a data platform",
        },
      },
    ],
  },
  {
    name: "Product",
    tiers: [
      { slug: "mvp-development" },
      {
        slug: "production-mvp",
        copy: {
          title: "Production MVP",
          shortDescription:
            "The first product with the operational parts real users need: billing, roles, tests, and monitoring — not just the happy path.",
          idealFor:
            "Founders with early users, where downtime, billing errors, or missing permissions now cost real money.",
          deliverables: [
            "Product scope, architecture, and data model",
            "Authentication, roles, and permissions",
            "Payments, subscriptions, and billing flows",
            "Automated tests and CI/CD",
            "Error tracking, analytics, and alerting",
            "Deployment, documentation, and handover",
          ],
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Vercel"],
          timeline: "8–14 weeks",
          priceFrom: 2500,
          ctaLabel: "Scope a production MVP",
        },
      },
      {
        slug: "scaling-mvp",
        copy: {
          title: "Scaling MVP",
          shortDescription:
            "Taking a working product to multi-tenant, integrated, and operable — the stage where architecture decisions start compounding.",
          idealFor:
            "Teams whose product works but is straining: more customers, more integrations, more people touching the codebase.",
          deliverables: [
            "Multi-tenant data model and access boundaries",
            "Third-party integrations and webhook handling",
            "Background jobs, queues, and scheduled work",
            "Performance profiling and query optimization",
            "Observability, runbooks, and on-call documentation",
            "Handover to an in-house team",
          ],
          technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Vercel"],
          timeline: "10–16 weeks",
          priceFrom: 5000,
          ctaLabel: "Plan a scaling engagement",
        },
      },
    ],
  },
  {
    name: "Web presence",
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
  ladder.tiers.map((tier) => ({ ...tier, ladder: ladder.name })),
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
      data: { order, isFeatured: false },
    });
    console.log(
      `repositioned\t${order}\t${tier.ladder}\t${tier.slug}\t$${existing.priceFrom}\t${existing.title}`,
    );
    continue;
  }

  const data = {
    ...tier.copy,
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
