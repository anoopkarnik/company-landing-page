import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");
const workspaceDir = path.resolve(appDir, "../..");
const assetsDir = path.join(workspaceDir, "content/blog-assets/web");

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

const required = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "NEXT_PUBLIC_R2_PUBLIC_URL",
] as const;

for (const key of required) {
  if (!process.env[key]?.trim()) throw new Error(`${key} is required`);
}

const bucket = process.env.R2_BUCKET_NAME!;
const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!.replace(/\/$/, "");
const prefix = (process.env.BLOG_ASSET_PREFIX || "cms-images/blog/2026-09")
  .replace(/^\/+/, "")
  .replace(/\/+$/, "");
const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const files = (await readdir(assetsDir))
  .filter((file) => file.endsWith(".webp"))
  .sort();

if (!files.length) throw new Error(`No WebP assets found in ${assetsDir}`);

for (const file of files) {
  const filePath = path.join(assetsDir, file);
  const fileStat = await stat(filePath);
  const objectKey = `${prefix}/${file}`;
  let existsWithSameSize = false;

  try {
    const existing = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: objectKey }),
    );
    existsWithSameSize = existing.ContentLength === fileStat.size;
    if (!existsWithSameSize) {
      throw new Error(
        `Refusing to overwrite existing R2 object with a different size: ${objectKey}`,
      );
    }
  } catch (error: any) {
    if (
      error?.$metadata?.httpStatusCode !== 404 &&
      error?.name !== "NotFound"
    ) {
      throw error;
    }
  }

  if (!existsWithSameSize) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: await readFile(filePath),
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: {
          purpose: "blog-cover",
          source: "bayesian-labs-cms",
        },
      }),
    );
  }

  console.log(
    `${existsWithSameSize ? "reused" : "uploaded"}\t${path.basename(file, ".webp")}\t${publicBase}/${objectKey}`,
  );
}
