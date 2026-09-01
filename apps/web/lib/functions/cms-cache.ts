import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";

import {
  getBlogFromPostgres,
  getDocumentationFromPostgres,
} from "@/lib/functions/content-page-db";
import { getLandingPageDataFromPostgres } from "@/lib/functions/landing-page-db";
import {
  landingPageSnapshot,
  landingPageSnapshotSyncedAt,
} from "@/lib/constants/landing-page/generated";
import { getRedis } from "@/server/redis";
import type { BlogsProps } from "@/lib/ts-types/blog";
import type { DocumentationProps } from "@/lib/ts-types/doc";

type LandingPageData = Awaited<
  ReturnType<typeof getLandingPageDataFromPostgres>
>;

const CACHE_TTL_SECONDS = 50 * 60;
const cacheNamespace =
  (process.env.NEXT_PUBLIC_SAAS_NAME || "company-landing")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "company-landing";

export const LANDING_PAGE_CACHE_KEY = `company-landing:${cacheNamespace}:landing-page:postgres:v1`;
export const LANDING_PAGE_CACHE_TAG = `company-landing:${cacheNamespace}:landing-page`;
export const BLOG_PAGE_CACHE_KEY = `company-landing:${cacheNamespace}:blog-page:postgres:v1`;
export const BLOG_PAGE_CACHE_TAG = `company-landing:${cacheNamespace}:blog-page`;
export const DOCUMENTATION_PAGE_CACHE_KEY = `company-landing:${cacheNamespace}:documentation-page:postgres:v1`;
export const DOCUMENTATION_PAGE_CACHE_TAG = `company-landing:${cacheNamespace}:documentation-page`;
export const PUBLIC_CMS_CACHE_TTL_SECONDS = CACHE_TTL_SECONDS;

async function readRedisCache<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  try {
    return await redis.get<T>(key);
  } catch (error) {
    console.error(`[cms-cache] Redis read failed for ${key}`, error);
    return null;
  }
}

async function writeRedisCache<T>(key: string, value: T) {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  try {
    await redis.set(key, value, { ex: CACHE_TTL_SECONDS });
  } catch (error) {
    console.error(`[cms-cache] Redis write failed for ${key}`, error);
  }
}

async function deleteRedisCache(key: string) {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  try {
    await redis.del(key);
  } catch (error) {
    console.error(`[cms-cache] Redis delete failed for ${key}`, error);
  }
}

const getLandingPageDataFromNextCache = unstable_cache(
  async () => getLandingPageDataFromPostgres(),
  [LANDING_PAGE_CACHE_KEY],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [LANDING_PAGE_CACHE_TAG],
  },
);

const getBlogFromNextCache = unstable_cache(
  async () => getBlogFromPostgres(),
  [BLOG_PAGE_CACHE_KEY],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [BLOG_PAGE_CACHE_TAG],
  },
);

const getDocumentationFromNextCache = unstable_cache(
  async () => getDocumentationFromPostgres(),
  [DOCUMENTATION_PAGE_CACHE_KEY],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [DOCUMENTATION_PAGE_CACHE_TAG],
  },
);

export async function getCachedLandingPageData(): Promise<LandingPageData> {
  const cached = await readRedisCache<LandingPageData>(LANDING_PAGE_CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    const data = await getLandingPageDataFromNextCache();
    await writeRedisCache(LANDING_PAGE_CACHE_KEY, data);
    return data;
  } catch (error) {
    console.error(
      `[cms-cache] PostgreSQL CMS fetch failed; using generated snapshot from ${landingPageSnapshotSyncedAt}`,
      error,
    );
    return landingPageSnapshot;
  }
}

export async function getCachedBlog(): Promise<BlogsProps> {
  const cached = await readRedisCache<BlogsProps>(BLOG_PAGE_CACHE_KEY);
  if (cached) {
    return cached;
  }

  const data = await getBlogFromNextCache();
  await writeRedisCache(BLOG_PAGE_CACHE_KEY, data);
  return data;
}

export async function getCachedDocumentation(): Promise<DocumentationProps> {
  const cached = await readRedisCache<DocumentationProps>(
    DOCUMENTATION_PAGE_CACHE_KEY,
  );
  if (cached) {
    return cached;
  }

  const data = await getDocumentationFromNextCache();
  await writeRedisCache(DOCUMENTATION_PAGE_CACHE_KEY, data);
  return data;
}

export async function invalidateLandingPageCache() {
  revalidateTag(LANDING_PAGE_CACHE_TAG);
  await deleteRedisCache(LANDING_PAGE_CACHE_KEY);
}

export async function invalidateBlogCache() {
  revalidateTag(BLOG_PAGE_CACHE_TAG);
  await deleteRedisCache(BLOG_PAGE_CACHE_KEY);
}

export async function invalidateDocumentationCache() {
  revalidateTag(DOCUMENTATION_PAGE_CACHE_TAG);
  await deleteRedisCache(DOCUMENTATION_PAGE_CACHE_KEY);
}
