/**
 * Fill the "Screenshot / cover URL" field (`Project.imageUrl`) for portfolio
 * projects that have none, using the same workflow-diagram language as the
 * case study covers, and upload the results to Cloudflare R2.
 *
 *   pnpm --filter web backfill:portfolio-images
 *   pnpm --filter web backfill:portfolio-images -- --dry-run
 *   pnpm --filter web backfill:portfolio-images -- --slug=git-grasp --force
 *
 * Stage source, in order of preference:
 *   1. the linked case study's curated diagram,
 *   2. stages derived from that case study's `architectureMdx`,
 *   3. a curated project diagram (for projects with no case study).
 * A project matching none of these is reported rather than guessed at — the
 * Project model has no architecture field of its own, and its `technologies`
 * column holds coarse categories that would make a misleading pipeline.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@workspace/database/client";

import {
  buildCoverObjectKey,
  PORTFOLIO_KEY_PREFIX,
} from "../lib/functions/case-study-cover";
import { buildCoverDiagram } from "../lib/functions/case-study-diagram";
import {
  CASE_STUDY_DIAGRAMS,
  PROJECT_DIAGRAMS,
} from "../lib/constants/case-study-diagrams";
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
const outDir = path.join(appDir, ".generated/portfolio-images");

if (!dryRun) requireR2Env();

const databaseModule = await import("@workspace/database/client");
const db: PrismaClient =
  (databaseModule.default as any)?.default ??
  databaseModule.default ??
  databaseModule;

const bucket = process.env.R2_BUCKET_NAME!;
const s3Client = dryRun ? null : createR2Client();

/** Blank, whitespace-only, and null all mean "no screenshot yet". */
function needsImage(project: { imageUrl?: string | null }): boolean {
  return !String(project.imageUrl ?? "").trim();
}

const projects = await db.project.findMany({
  where: slugFilter ? { slug: slugFilter } : undefined,
  select: {
    id: true,
    slug: true,
    title: true,
    category: true,
    clientName: true,
    technologies: true,
    imageUrl: true,
    caseStudies: {
      select: { slug: true, architectureMdx: true, technologies: true },
      orderBy: { order: "asc" },
      take: 1,
    },
  },
  orderBy: { order: "asc" },
});

const targets = projects.filter(
  (project) => project.slug && (force || needsImage(project)),
);

if (!targets.length) {
  console.log("Every portfolio project already has an image. Nothing to do.");
} else if (dryRun) {
  await mkdir(outDir, { recursive: true });
}

const wordmark = process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "Portfolio";
let failures = 0;

for (const project of targets) {
  try {
    const caseStudy = project.caseStudies[0];

    // A linked case study is the only place a real architecture is written
    // down, so prefer it; otherwise fall back to a curated project spec.
    const curatedStages = caseStudy
      ? CASE_STUDY_DIAGRAMS[caseStudy.slug]
      : PROJECT_DIAGRAMS[project.slug!];

    const diagram = buildCoverDiagram(
      {
        slug: project.slug,
        title: project.title,
        // The project card leads with its category badge, so the eyebrow
        // echoes that rather than the case study's industry.
        industry: project.category,
        clientName: project.clientName,
        technologies: caseStudy?.technologies ?? project.technologies,
        architectureMdx: caseStudy?.architectureMdx,
      },
      { curatedStages, wordmark },
    );

    const png = await renderCoverPng(diagram, "portfolio");
    const key = buildCoverObjectKey(
      project.slug!,
      fingerprint(png),
      PORTFOLIO_KEY_PREFIX,
    );
    const origin = caseStudy ? `case-study:${caseStudy.slug}` : "project-spec";

    if (dryRun) {
      const filePath = path.join(outDir, path.basename(key));
      await writeFile(filePath, png);
      await writeFile(
        filePath.replace(/\.png$/, ".card.png"),
        await renderCardSizePreview(png, "portfolio"),
      );
      console.log(
        `rendered\t${project.slug}\t${origin}\t${diagram.source}\t${filePath}`,
      );
      continue;
    }

    await uploadCover(s3Client!, bucket, key, png);

    const publicUrl = buildR2PublicUrl(key);
    await db.project.update({
      where: { id: project.id },
      data: { imageUrl: publicUrl },
    });

    console.log(`uploaded\t${project.slug}\t${origin}\t${publicUrl}`);
  } catch (error: any) {
    failures += 1;
    console.error(`failed\t${project.slug}\t${error?.message ?? error}`);
  }
}

await db.$disconnect();

if (failures) {
  throw new Error(`${failures} portfolio image(s) failed to generate`);
}
