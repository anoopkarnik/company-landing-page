import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@workspace/database/client";

import { blocksToMdx } from "../lib/functions/notion-blocks-to-mdx";
import { serializeMdx } from "../lib/functions/serialize-mdx";

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
      const rawValue = normalizedLine.slice(separatorIndex + 1).trim();
      process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
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

type LegacyContentRow = { id: string; mdx: string };

async function convertTable(table: "blog_post" | "documentation_page") {
  const rows = await db.$queryRawUnsafe<LegacyContentRow[]>(
    `SELECT id, mdx FROM company_landing_cms.${table}`,
  );
  let converted = 0;

  for (const row of rows) {
    const source = row.mdx.trim();
    if (!source.startsWith("[")) continue;

    try {
      const blocks = JSON.parse(source);
      if (!Array.isArray(blocks)) continue;
      const mdx = blocksToMdx(blocks);
      await db.$executeRawUnsafe(
        `UPDATE company_landing_cms.${table} SET mdx = $1 WHERE id = $2`,
        mdx,
        row.id,
      );
      converted += 1;
    } catch {
      // Already-authored MDX that starts with `[` should remain unchanged.
    }
  }

  const mdxRows = await db.$queryRawUnsafe<LegacyContentRow[]>(
    `SELECT id, mdx FROM company_landing_cms.${table}`,
  );
  for (const row of mdxRows) {
    if (!row.mdx.trim()) continue;
    try {
      await serializeMdx(row.mdx);
    } catch (error) {
      throw new Error(`Invalid MDX in ${table} row ${row.id}`, {
        cause: error,
      });
    }
  }

  return {
    rows: rows.length,
    converted,
    validated: mdxRows.filter((row) => row.mdx.trim()).length,
  };
}

const [blogs, documentation] = await Promise.all([
  convertTable("blog_post"),
  convertTable("documentation_page"),
]);

console.log("MDX content conversion completed.");
console.table({
  blogRows: blogs.rows,
  blogRowsConverted: blogs.converted,
  blogRowsValidated: blogs.validated,
  documentationRows: documentation.rows,
  documentationRowsConverted: documentation.converted,
  documentationRowsValidated: documentation.validated,
});

await db.$disconnect();
