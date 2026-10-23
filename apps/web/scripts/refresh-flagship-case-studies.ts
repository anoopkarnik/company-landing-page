/**
 * Refresh only the editorial fields of the two existing flagship case studies.
 * Preview: pnpm --filter web exec jiti scripts/refresh-flagship-case-studies.ts
 * Apply:   pnpm --filter web exec jiti scripts/refresh-flagship-case-studies.ts --apply
 * Keeps media, project links, ordering, consent, and publication state intact.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import type { PrismaClient } from "@workspace/database/client";
import { lifeOsCaseStudy } from "../lib/constants/case-studies/life-os";
import { saasForgeCaseStudy } from "../lib/constants/case-studies/saas-forge";
import { serializeMdx } from "../lib/functions/serialize-mdx";
import { loadEnvFile } from "./lib/cover-backfill";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await loadEnvFile(path.join(appDir, ".env.local"));
await loadEnvFile(path.join(appDir, ".env"));
const entries = [
  { slug: "life-os", content: lifeOsCaseStudy },
  { slug: "saas-forge", content: saasForgeCaseStudy },
];

// Fail before connecting or writing if any article cannot be rendered.
for (const { content } of entries) {
  await Promise.all(
    [
      content.solutionMdx,
      content.contributionMdx,
      content.architectureMdx,
      content.outcomeMdx,
    ].map(serializeMdx),
  );
}
const module = await import("@workspace/database/client");
const db: PrismaClient =
  (module.default as any)?.default ?? module.default ?? module;
try {
  const key =
    process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page";
  const page = await db.landingPage.findUniqueOrThrow({
    where: { key },
    select: { id: true },
  });
  const current = await db.caseStudy.findMany({
    where: {
      landingPageId: page.id,
      slug: { in: entries.map((entry) => entry.slug) },
    },
  });
  if (current.length !== entries.length)
    throw new Error(
      "Both existing flagship case studies must be present; no records were changed.",
    );
  console.table(
    entries.map(({ slug, content }) => ({
      slug,
      words: [
        content.solutionMdx,
        content.contributionMdx,
        content.architectureMdx,
        content.outcomeMdx,
      ]
        .join(" ")
        .split(/\s+/).length,
      technicalSections:
        (content.solutionMdx + content.architectureMdx).match(/<details>/g)
          ?.length ?? 0,
    })),
  );
  if (!process.argv.includes("--apply")) {
    console.log(
      "MDX validated. Preview only; pass --apply to update the two existing records.",
    );
  } else {
    const dir = path.join(appDir, ".generated/case-study-backups");
    await mkdir(dir, { recursive: true });
    const backup = path.join(
      dir,
      `${new Date().toISOString().replaceAll(":", "-")}.json`,
    );
    await writeFile(backup, JSON.stringify(current, null, 2), {
      mode: 0o600,
      flag: "wx",
    });
    await db.$transaction(async (tx) => {
      for (const { slug, content } of entries) {
        const previous = current.find((row) => row.slug === slug)!;
        const result = await tx.caseStudy.updateMany({
          where: { id: previous.id, updatedAt: previous.updatedAt },
          data: {
            ...content,
            seoTitle: `${content.title} | Bayesian Labs`,
            seoDescription: content.summary,
          },
        });
        if (result.count !== 1)
          throw new Error(
            `${slug} changed during the refresh; transaction rolled back.`,
          );
      }
    });
    const saved = await db.caseStudy.findMany({
      where: { id: { in: current.map((row) => row.id) } },
    });
    for (const { slug, content } of entries) {
      const row = saved.find((record) => record.slug === slug)!;
      for (const [field, expected] of Object.entries(content)) {
        if (!isDeepStrictEqual(row[field as keyof typeof row], expected)) {
          throw new Error(`Read-back verification failed for ${slug}.${field}`);
        }
      }
    }
    console.log(`Updated and verified both case studies. Backup: ${backup}`);
  }
} finally {
  await db.$disconnect();
}
