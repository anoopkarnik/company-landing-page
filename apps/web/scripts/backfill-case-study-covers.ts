/**
 * Generate workflow-diagram cover images for case studies that have none,
 * upload them to Cloudflare R2, and write the public URL back to Postgres.
 *
 *   pnpm --filter web backfill:case-study-covers
 *   pnpm --filter web backfill:case-study-covers -- --dry-run
 *   pnpm --filter web backfill:case-study-covers -- --slug=life-os --force
 *
 * The diagram is read from each case study's own `architectureMdx`, with a
 * curated spec taking precedence where one exists.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@workspace/database/client";

import { buildCoverObjectKey, needsCoverImage } from "../lib/functions/case-study-cover";
import { buildCoverDiagram } from "../lib/functions/case-study-diagram";
import { CASE_STUDY_DIAGRAMS } from "../lib/constants/case-study-diagrams";
import { buildR2PublicUrl } from "../lib/functions/r2-public-url";
import { renderCardSizePreview, renderCoverPng } from "./lib/cover-renderer";
import {
  createR2Client,
  fingerprint,
  loadEnvFile,
  parseArgs,
  requireR2Env,
  uploadCover,
} from "./lib/cover-backfill";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");

await loadEnvFile(path.join(appDir, ".env"));
await loadEnvFile(path.join(appDir, ".env.local"));

const { dryRun, force, slugFilter } = parseArgs(process.argv.slice(2));
const outDir = path.join(appDir, ".generated/case-study-covers");

if (!dryRun) requireR2Env();

const databaseModule = await import("@workspace/database/client");
const db: PrismaClient =
  (databaseModule.default as any)?.default ??
  databaseModule.default ??
  databaseModule;

const bucket = process.env.R2_BUCKET_NAME!;
const s3Client = dryRun ? null : createR2Client();

const caseStudies = await db.caseStudy.findMany({
  where: slugFilter ? { slug: slugFilter } : undefined,
  select: {
    id: true,
    slug: true,
    title: true,
    industry: true,
    clientName: true,
    technologies: true,
    architectureMdx: true,
    coverImageUrl: true,
  },
  orderBy: { order: "asc" },
});

const targets = caseStudies.filter(
  (caseStudy) => force || needsCoverImage(caseStudy),
);

if (!targets.length) {
  console.log("Every case study already has a cover image. Nothing to do.");
} else if (dryRun) {
  await mkdir(outDir, { recursive: true });
}

const wordmark = process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "Case study";
let failures = 0;

for (const caseStudy of targets) {
  try {
    const diagram = buildCoverDiagram(caseStudy, {
      curatedStages: CASE_STUDY_DIAGRAMS[caseStudy.slug],
      wordmark,
    });

    // Render first: the key carries a hash of the bytes, so a changed diagram
    // publishes at a new URL instead of hiding behind an immutable cache entry.
    const png = await renderCoverPng(diagram, "caseStudy");
    const key = buildCoverObjectKey(caseStudy.slug, fingerprint(png));

    if (dryRun) {
      const filePath = path.join(outDir, path.basename(key));
      await writeFile(filePath, png);
      // Also emit the image at grid-card width, where legibility is decided.
      await writeFile(
        filePath.replace(/\.png$/, ".card.png"),
        await renderCardSizePreview(png, "caseStudy"),
      );
      console.log(
        `rendered\t${caseStudy.slug}\t${diagram.source}\t${diagram.stages.length} stages\t${filePath}`,
      );
      continue;
    }

    await uploadCover(s3Client!, bucket, key, png);

    const publicUrl = buildR2PublicUrl(key);
    await db.caseStudy.update({
      where: { id: caseStudy.id },
      data: { coverImageUrl: publicUrl },
    });

    console.log(
      `uploaded\t${caseStudy.slug}\t${diagram.source}\t${diagram.stages.length} stages\t${publicUrl}`,
    );
  } catch (error: any) {
    failures += 1;
    console.error(`failed\t${caseStudy.slug}\t${error?.message ?? error}`);
  }
}

await db.$disconnect();

if (failures) {
  throw new Error(`${failures} case study cover(s) failed to generate`);
}
