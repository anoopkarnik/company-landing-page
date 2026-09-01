import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for the PostgreSQL CMS");
  }

  const url = new URL(databaseUrl);
  url.searchParams.set(
    "connection_limit",
    process.env.PRISMA_CONNECTION_LIMIT ?? "1",
  );
  url.searchParams.set("pool_timeout", process.env.PRISMA_POOL_TIMEOUT ?? "20");

  return new PrismaClient({
    datasources: { db: { url: url.toString() } },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

declare global {
  // eslint-disable-next-line no-var
  var companyLandingPrisma: ReturnType<typeof createPrismaClient> | undefined;
}

const db = globalThis.companyLandingPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.companyLandingPrisma = db;
}

export default db;
