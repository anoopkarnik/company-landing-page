/**
 * Shared plumbing for the cover backfill scripts: env loading, argument
 * parsing, and publishing a rendered PNG to Cloudflare R2.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/** Marks objects these scripts own, so they never overwrite a hand-uploaded image. */
export const OWNER_METADATA = {
  purpose: "case-study-cover",
  source: "backfill-script",
};

export const REQUIRED_R2_VARS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "NEXT_PUBLIC_R2_PUBLIC_URL",
] as const;

export async function loadEnvFile(filePath: string) {
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

export type BackfillArgs = {
  dryRun: boolean;
  force: boolean;
  slugFilter?: string;
};

export function parseArgs(argv: string[]): BackfillArgs {
  return {
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    slugFilter: argv
      .find((arg) => arg.startsWith("--slug="))
      ?.slice("--slug=".length)
      .trim(),
  };
}

export function requireR2Env() {
  for (const key of REQUIRED_R2_VARS) {
    if (!process.env[key]?.trim()) throw new Error(`${key} is required`);
  }
}

export function createR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/** A short content hash, so regenerated artwork never reuses a cached URL. */
export function fingerprint(png: Buffer): string {
  return createHash("sha256").update(png).digest("hex").slice(0, 10);
}

/**
 * Refuse to overwrite an object these scripts did not create. Regenerating our
 * own cover is expected; clobbering a hand-uploaded image at the same key is
 * not.
 */
async function assertSafeToWrite(client: S3Client, bucket: string, key: string) {
  try {
    const existing = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key }),
    );
    if (existing.Metadata?.purpose !== OWNER_METADATA.purpose) {
      throw new Error(
        `Refusing to overwrite ${key}: existing object was not created by this script`,
      );
    }
  } catch (error: any) {
    const status = error?.$metadata?.httpStatusCode;
    if (status !== 404 && error?.name !== "NotFound") throw error;
  }
}

export async function uploadCover(
  client: S3Client,
  bucket: string,
  key: string,
  png: Buffer,
) {
  await assertSafeToWrite(client, bucket, key);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: png,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: OWNER_METADATA,
    }),
  );
}
