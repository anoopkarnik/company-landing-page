import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@workspace/database/client";

import { serializeMdx } from "../lib/functions/serialize-mdx";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const workspaceDir = path.resolve(appDir, "../..");
const draftsRoot = path.join(workspaceDir, "content/blog-drafts");

async function loadEnvFile(filePath: string) {
  try {
    const contents = await readFile(filePath, "utf8");
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const normalized = line.startsWith("export ")
        ? line.slice("export ".length).trim()
        : line;
      const separator = normalized.indexOf("=");
      if (separator === -1) continue;
      const key = normalized.slice(0, separator).trim();
      const value = normalized.slice(separator + 1).trim();
      process.env[key] ??= value.replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch (error: any) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await loadEnvFile(path.join(appDir, ".env"));
await loadEnvFile(path.join(appDir, ".env.local"));

const databaseModule = await import("@workspace/database/client");
const db: PrismaClient =
  (databaseModule.default as any)?.default ??
  databaseModule.default ??
  databaseModule;

interface DraftMetadata {
  title: string;
  slug: string;
  type?: string;
  category?: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  tags?: string[];
  author?: string;
  includeInSitemap?: boolean;
  relatedServiceSlugs?: string[];
  relatedCaseStudySlugs?: string[];
  altText?: string;
  imageCaption?: string;
  coverAsset?: string;
  cover?: {
    alt?: string;
    caption?: string;
  };
}

interface DraftPost {
  metadata: DraftMetadata;
  mdx: string;
  coverUrl: string;
  coverImageAlt: string;
  coverImageCaption: string;
}

const editorialOrder = [
  "ai-automation-cost-india-2026",
  "what-should-your-business-automate-25-workflows",
  "how-to-choose-ai-automation-partner",
  "production-ready-mvp-cost-india-2026",
  "vibe-coding-vs-saas-boilerplate-vs-custom-development",
  "production-saas-launch-checklist",
  "ai-agents-vs-workflows-vs-traditional-automation",
  "production-ready-n8n-retries-idempotency-monitoring-handover",
  "india-ready-saas-stack-better-auth-postgresql-payments-cms-multi-platform",
  "upgrade-customized-saas-boilerplate-without-losing-changes",
  "nextjs-web-app-to-desktop-mobile-without-rebuilding-core",
  "textract-vs-paddleocr-financial-tables",
  "tool-first-voice-agents-vapi-n8n",
  "automate-ga4-search-console-reporting-n8n",
  "fhir-r4-validation-kafka-flask",
  "habit-apps-resilience-gamification",
  "building-personal-life-os-from-notion",
  "create-a-desktop-app-of-your-site-and-publish-to-ubuntu-snapstore",
  "how-to-install-coolify-locally-in-ubuntu-machine-and-use-it-to-deploy-nextjs-app-in-a-aws-ec2-ubuntu-server",
];

const allowedCategories = new Set([
  "AI Automation",
  "MVP & SaaS",
  "Data & AI",
  "Product Engineering",
  "DevOps",
]);

function normalizedCategory(metadata: DraftMetadata) {
  const category = (metadata.type || metadata.category || "").trim();
  return category.toLowerCase() === "devops" ? "DevOps" : category;
}

function absoluteCanonical(slug: string, value?: string) {
  if (value?.startsWith("http://") || value?.startsWith("https://")) {
    return value;
  }
  return `https://bayesian-labs.com/blog/${slug}`;
}

function coverAssetName(metadata: DraftMetadata) {
  if (metadata.coverAsset) {
    return metadata.coverAsset.replace(/\.(png|jpe?g|webp)$/i, "");
  }
  return metadata.slug;
}

async function readDrafts() {
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!publicBase) throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL is required");
  const prefix = (process.env.BLOG_ASSET_PREFIX || "cms-images/blog/2026-09")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const waveDirs = (await readdir(draftsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const posts: DraftPost[] = [];

  for (const waveDir of waveDirs) {
    const directory = path.join(draftsRoot, waveDir);
    const files = await readdir(directory);
    for (const mdxFile of files
      .filter((file) => file.endsWith(".mdx"))
      .sort()) {
      const basename = mdxFile.slice(0, -".mdx".length);
      const metadataFilename = files.includes(`${basename}.metadata.json`)
        ? `${basename}.metadata.json`
        : `${basename}.json`;
      if (!files.includes(metadataFilename)) {
        throw new Error(`Missing metadata for ${path.join(waveDir, mdxFile)}`);
      }
      const [mdx, metadataSource] = await Promise.all([
        readFile(path.join(directory, mdxFile), "utf8"),
        readFile(path.join(directory, metadataFilename), "utf8"),
      ]);
      const metadata = JSON.parse(metadataSource) as DraftMetadata;
      const category = normalizedCategory(metadata);
      if (!metadata.title?.trim() || !metadata.slug?.trim() || !mdx.trim()) {
        throw new Error(`Incomplete draft: ${path.join(waveDir, mdxFile)}`);
      }
      if (!allowedCategories.has(category)) {
        throw new Error(
          `Unsupported category "${category}" for ${metadata.slug}`,
        );
      }
      if (
        metadata.seoTitle.length > 70 ||
        metadata.seoDescription.length > 170
      ) {
        throw new Error(`SEO metadata is too long for ${metadata.slug}`);
      }
      await serializeMdx(mdx);

      posts.push({
        metadata: { ...metadata, type: category },
        mdx,
        coverUrl: `${publicBase}/${prefix}/${coverAssetName(metadata)}.webp`,
        coverImageAlt:
          metadata.altText ||
          metadata.cover?.alt ||
          `Illustration for ${metadata.title}`,
        coverImageCaption:
          metadata.imageCaption ||
          metadata.cover?.caption ||
          "Conceptual illustration.",
      });
    }
  }

  return posts.sort(
    (a, b) =>
      editorialOrder.indexOf(a.metadata.slug) -
      editorialOrder.indexOf(b.metadata.slug),
  );
}

try {
  const posts = await readDrafts();
  const duplicateSlugs = posts
    .map((post) => post.metadata.slug)
    .filter((slug, index, all) => all.indexOf(slug) !== index);
  if (duplicateSlugs.length) {
    throw new Error(`Duplicate draft slugs: ${duplicateSlugs.join(", ")}`);
  }

  const landingPage = await db.landingPage.findUnique({
    where: {
      key: process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page",
    },
    select: { id: true },
  });
  if (!landingPage) throw new Error("Landing page CMS record not found");

  const [services, caseStudies, existingPosts, imageChecks] = await Promise.all(
    [
      db.servicePackage.findMany({
        where: { landingPageId: landingPage.id },
        select: { slug: true },
      }),
      db.caseStudy.findMany({
        where: { landingPageId: landingPage.id },
        select: { slug: true },
      }),
      db.blogPost.findMany({
        where: {
          landingPageId: landingPage.id,
          slug: { in: posts.map((post) => post.metadata.slug) },
        },
      }),
      Promise.all(
        posts.map(async (post) => ({
          slug: post.metadata.slug,
          response: await fetch(post.coverUrl, { method: "HEAD" }),
        })),
      ),
    ],
  );

  const serviceSlugs = new Set(services.map((service) => service.slug));
  const caseStudySlugs = new Set(caseStudies.map((study) => study.slug));
  const existingBySlug = new Map(
    existingPosts.map((post) => [post.slug, post]),
  );

  for (const post of posts) {
    for (const slug of post.metadata.relatedServiceSlugs || []) {
      if (!serviceSlugs.has(slug)) {
        throw new Error(
          `Unknown service slug "${slug}" in ${post.metadata.slug}`,
        );
      }
    }
    for (const slug of post.metadata.relatedCaseStudySlugs || []) {
      if (!caseStudySlugs.has(slug)) {
        throw new Error(
          `Unknown case-study slug "${slug}" in ${post.metadata.slug}`,
        );
      }
    }
  }
  for (const check of imageChecks) {
    if (
      !check.response.ok ||
      !check.response.headers.get("content-type")?.startsWith("image/")
    ) {
      throw new Error(
        `Cover image check failed for ${check.slug}: ${check.response.status}`,
      );
    }
  }

  console.table(
    posts.map((post, order) => ({
      action: existingBySlug.has(post.metadata.slug) ? "update" : "create",
      order,
      slug: post.metadata.slug,
      category: post.metadata.type,
    })),
  );

  if (process.env.BLOG_PUBLISH_DRY_RUN === "1") {
    console.log(
      `Validated ${posts.length} blog drafts; dry run made no database changes.`,
    );
  } else {
    const publishedAt = new Date();
    await db.$transaction(
      posts.map((post, order) => {
        const existing = existingBySlug.get(post.metadata.slug);
        const data = {
          name: post.metadata.title.trim(),
          slug: post.metadata.slug,
          type: post.metadata.type!,
          order,
          mdx: post.mdx.trim(),
          excerpt: post.metadata.excerpt.trim(),
          coverImage: post.coverUrl,
          coverImageAlt: post.coverImageAlt.trim(),
          coverImageCaption: post.coverImageCaption.trim(),
          seoTitle: post.metadata.seoTitle.trim(),
          seoDescription: post.metadata.seoDescription.trim(),
          canonicalUrl: absoluteCanonical(
            post.metadata.slug,
            post.metadata.canonicalUrl,
          ),
          ogImageUrl: post.coverUrl,
          tags: post.metadata.tags || [],
          status: "published",
          publishedAt: existing?.publishedAt || publishedAt,
          author: post.metadata.author?.trim() || "Anoop Karnik Dasika",
          includeInSitemap: post.metadata.includeInSitemap !== false,
          relatedServiceSlugs: post.metadata.relatedServiceSlugs || [],
          relatedCaseStudySlugs: post.metadata.relatedCaseStudySlugs || [],
        };
        return db.blogPost.upsert({
          where: {
            landingPageId_slug: {
              landingPageId: landingPage.id,
              slug: post.metadata.slug,
            },
          },
          create: { ...data, landingPageId: landingPage.id },
          update: data,
        });
      }),
    );
    console.log(
      `Published ${posts.length} validated blog posts to PostgreSQL.`,
    );
  }
} finally {
  await db.$disconnect();
}
