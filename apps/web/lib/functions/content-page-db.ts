import db, { Prisma } from "@workspace/database/client";

export interface ContentPageInput {
  id?: string;
  sourceId?: string;
  name: string;
  slug: string;
  type: string;
  order: number;
  mdx: string;
  excerpt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  tags?: string[];
  status?: "draft" | "published";
  publishedAt?: string;
  author?: string;
  includeInSitemap?: boolean;
  relatedServiceSlugs?: string[];
  relatedCaseStudySlugs?: string[];
  sourceCreatedAt?: string;
  sourceUpdatedAt?: string;
}

function cmsKey() {
  return process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page";
}

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function optionalString(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function jsonStrings(value: Prisma.JsonValue): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

const publishedContentWhere = () => ({
  status: "published",
  OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
});

async function getLandingPageIdentity() {
  const landingPage = await db.landingPage.findUnique({
    where: { key: cmsKey() },
    select: { id: true, title: true, logo: true, darkLogo: true },
  });

  if (!landingPage) {
    throw new Error("Landing page CMS record not found");
  }

  return landingPage;
}

function toListItem(item: {
  id: string;
  name: string;
  slug: string;
  type: string;
  order: number;
  sourceCreatedAt: Date | null;
  sourceUpdatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  excerpt: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  coverImageCaption: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  tags: Prisma.JsonValue;
  status: string;
  publishedAt: Date | null;
  author: string | null;
  includeInSitemap: boolean;
  relatedServiceSlugs: Prisma.JsonValue;
  relatedCaseStudySlugs: Prisma.JsonValue;
}) {
  return {
    id: item.id,
    Name: item.name,
    Type: item.type,
    order: item.order,
    slug: item.slug,
    "Created time": (item.sourceCreatedAt ?? item.createdAt).toISOString(),
    "Last edited time": (item.sourceUpdatedAt ?? item.updatedAt).toISOString(),
    excerpt: item.excerpt ?? "",
    coverImage: item.coverImage ?? "",
    coverImageAlt: item.coverImageAlt ?? "",
    coverImageCaption: item.coverImageCaption ?? "",
    seoTitle: item.seoTitle ?? "",
    seoDescription: item.seoDescription ?? "",
    canonicalUrl: item.canonicalUrl ?? "",
    ogImageUrl: item.ogImageUrl ?? "",
    tags: jsonStrings(item.tags),
    status: item.status,
    publishedAt: item.publishedAt?.toISOString() ?? null,
    author: item.author ?? "",
    includeInSitemap: item.includeInSitemap,
    relatedServiceSlugs: jsonStrings(item.relatedServiceSlugs),
    relatedCaseStudySlugs: jsonStrings(item.relatedCaseStudySlugs),
  };
}

export async function getBlogFromPostgres() {
  const landingPage = await getLandingPageIdentity();
  const posts = await db.blogPost.findMany({
    where: { landingPageId: landingPage.id, ...publishedContentWhere() },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return {
    title: landingPage.title ?? "",
    logo: landingPage.logo ?? "",
    darkLogo: landingPage.darkLogo ?? "",
    blogs: posts.map(toListItem),
  };
}

export async function getDocumentationFromPostgres() {
  const landingPage = await getLandingPageIdentity();
  const pages = await db.documentationPage.findMany({
    where: { landingPageId: landingPage.id, ...publishedContentWhere() },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  return {
    title: landingPage.title ?? "",
    logo: landingPage.logo ?? "",
    darkLogo: landingPage.darkLogo ?? "",
    docs: pages.map(toListItem),
  };
}

export async function getBlogMdxBySlug(slug: string) {
  const landingPage = await getLandingPageIdentity();
  const post = await db.blogPost.findFirst({
    where: {
      landingPageId: landingPage.id,
      slug,
      ...publishedContentWhere(),
    },
    select: { mdx: true },
  });

  if (!post) throw new Error("Blog not found");
  return post.mdx;
}

export async function getDocumentationMdxBySlug(slug: string) {
  const landingPage = await getLandingPageIdentity();
  const page = await db.documentationPage.findFirst({
    where: {
      landingPageId: landingPage.id,
      slug,
      ...publishedContentWhere(),
    },
    select: { mdx: true },
  });

  if (!page) throw new Error("Documentation not found");
  return page.mdx;
}

const contentSeoSelect = {
  name: true,
  excerpt: true,
  seoTitle: true,
  seoDescription: true,
  canonicalUrl: true,
  ogImageUrl: true,
  coverImage: true,
  coverImageAlt: true,
  coverImageCaption: true,
  tags: true,
  author: true,
  publishedAt: true,
  updatedAt: true,
} satisfies Prisma.BlogPostSelect;

export interface ContentSeoRecord {
  name: string;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  coverImageCaption: string | null;
  tags: Prisma.JsonValue;
  author: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
}

export async function getBlogSeoBySlug(
  slug: string,
): Promise<ContentSeoRecord | null> {
  const landingPage = await getLandingPageIdentity();
  return db.blogPost.findFirst({
    where: {
      landingPageId: landingPage.id,
      slug,
      ...publishedContentWhere(),
    },
    select: contentSeoSelect,
  });
}

export async function getDocumentationSeoBySlug(
  slug: string,
): Promise<ContentSeoRecord | null> {
  const landingPage = await getLandingPageIdentity();
  return db.documentationPage.findFirst({
    where: {
      landingPageId: landingPage.id,
      slug,
      ...publishedContentWhere(),
    },
    select: contentSeoSelect,
  });
}

export async function getBlogPostsForAdmin() {
  const landingPage = await getLandingPageIdentity();
  return db.blogPost.findMany({
    where: { landingPageId: landingPage.id },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export async function getDocumentationPagesForAdmin() {
  const landingPage = await getLandingPageIdentity();
  return db.documentationPage.findMany({
    where: { landingPageId: landingPage.id },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
}

export async function updateBlogPosts(items: ContentPageInput[]) {
  const landingPage = await getLandingPageIdentity();
  const existing = await db.blogPost.findMany({
    where: { landingPageId: landingPage.id },
  });
  const byId = new Map(existing.map((item) => [item.id, item]));
  const bySourceId = new Map(
    existing.flatMap((item) =>
      item.sourceId ? [[item.sourceId, item] as const] : [],
    ),
  );
  const retainedIds = items.flatMap((item) => {
    const match =
      (item.id && byId.get(item.id)) ||
      (item.sourceId && bySourceId.get(item.sourceId));
    return match ? [match.id] : [];
  });

  await db.$transaction(
    async (tx) => {
      await tx.blogPost.deleteMany({
        where: {
          landingPageId: landingPage.id,
          ...(retainedIds.length ? { id: { notIn: retainedIds } } : {}),
        },
      });

      for (const item of items) {
        const match =
          (item.id && byId.get(item.id)) ||
          (item.sourceId && bySourceId.get(item.sourceId));
        const data = {
          name: item.name,
          slug: item.slug,
          type: item.type,
          order: item.order,
          mdx: item.mdx,
          ...(item.excerpt !== undefined
            ? { excerpt: optionalString(item.excerpt) }
            : {}),
          ...(item.coverImage !== undefined
            ? { coverImage: optionalString(item.coverImage) }
            : {}),
          ...(item.coverImageAlt !== undefined
            ? { coverImageAlt: optionalString(item.coverImageAlt) }
            : {}),
          ...(item.coverImageCaption !== undefined
            ? { coverImageCaption: optionalString(item.coverImageCaption) }
            : {}),
          ...(item.seoTitle !== undefined
            ? { seoTitle: optionalString(item.seoTitle) }
            : {}),
          ...(item.seoDescription !== undefined
            ? { seoDescription: optionalString(item.seoDescription) }
            : {}),
          ...(item.canonicalUrl !== undefined
            ? { canonicalUrl: optionalString(item.canonicalUrl) }
            : {}),
          ...(item.ogImageUrl !== undefined
            ? { ogImageUrl: optionalString(item.ogImageUrl) }
            : {}),
          ...(item.tags !== undefined
            ? { tags: item.tags as Prisma.InputJsonValue }
            : {}),
          ...(item.status !== undefined ? { status: item.status } : {}),
          ...(item.publishedAt !== undefined
            ? { publishedAt: parseDate(item.publishedAt) }
            : {}),
          ...(item.author !== undefined
            ? { author: optionalString(item.author) }
            : {}),
          ...(item.includeInSitemap !== undefined
            ? { includeInSitemap: item.includeInSitemap }
            : {}),
          ...(item.relatedServiceSlugs !== undefined
            ? {
                relatedServiceSlugs:
                  item.relatedServiceSlugs as Prisma.InputJsonValue,
              }
            : {}),
          ...(item.relatedCaseStudySlugs !== undefined
            ? {
                relatedCaseStudySlugs:
                  item.relatedCaseStudySlugs as Prisma.InputJsonValue,
              }
            : {}),
          ...(item.sourceId !== undefined ? { sourceId: item.sourceId } : {}),
          ...(item.sourceCreatedAt !== undefined
            ? { sourceCreatedAt: parseDate(item.sourceCreatedAt) }
            : {}),
          ...(item.sourceUpdatedAt !== undefined
            ? { sourceUpdatedAt: parseDate(item.sourceUpdatedAt) }
            : {}),
        };

        if (match) {
          await tx.blogPost.update({ where: { id: match.id }, data });
        } else {
          await tx.blogPost.create({
            data: { ...data, landingPageId: landingPage.id },
          });
        }
      }
    },
    { maxWait: 10_000, timeout: 60_000 },
  );
}

export async function updateDocumentationPages(items: ContentPageInput[]) {
  const landingPage = await getLandingPageIdentity();
  const existing = await db.documentationPage.findMany({
    where: { landingPageId: landingPage.id },
  });
  const byId = new Map(existing.map((item) => [item.id, item]));
  const bySourceId = new Map(
    existing.flatMap((item) =>
      item.sourceId ? [[item.sourceId, item] as const] : [],
    ),
  );
  const retainedIds = items.flatMap((item) => {
    const match =
      (item.id && byId.get(item.id)) ||
      (item.sourceId && bySourceId.get(item.sourceId));
    return match ? [match.id] : [];
  });

  await db.$transaction(
    async (tx) => {
      await tx.documentationPage.deleteMany({
        where: {
          landingPageId: landingPage.id,
          ...(retainedIds.length ? { id: { notIn: retainedIds } } : {}),
        },
      });

      for (const item of items) {
        const match =
          (item.id && byId.get(item.id)) ||
          (item.sourceId && bySourceId.get(item.sourceId));
        const data = {
          name: item.name,
          slug: item.slug,
          type: item.type,
          order: item.order,
          mdx: item.mdx,
          ...(item.excerpt !== undefined
            ? { excerpt: optionalString(item.excerpt) }
            : {}),
          ...(item.coverImage !== undefined
            ? { coverImage: optionalString(item.coverImage) }
            : {}),
          ...(item.coverImageAlt !== undefined
            ? { coverImageAlt: optionalString(item.coverImageAlt) }
            : {}),
          ...(item.coverImageCaption !== undefined
            ? { coverImageCaption: optionalString(item.coverImageCaption) }
            : {}),
          ...(item.seoTitle !== undefined
            ? { seoTitle: optionalString(item.seoTitle) }
            : {}),
          ...(item.seoDescription !== undefined
            ? { seoDescription: optionalString(item.seoDescription) }
            : {}),
          ...(item.canonicalUrl !== undefined
            ? { canonicalUrl: optionalString(item.canonicalUrl) }
            : {}),
          ...(item.ogImageUrl !== undefined
            ? { ogImageUrl: optionalString(item.ogImageUrl) }
            : {}),
          ...(item.tags !== undefined
            ? { tags: item.tags as Prisma.InputJsonValue }
            : {}),
          ...(item.status !== undefined ? { status: item.status } : {}),
          ...(item.publishedAt !== undefined
            ? { publishedAt: parseDate(item.publishedAt) }
            : {}),
          ...(item.author !== undefined
            ? { author: optionalString(item.author) }
            : {}),
          ...(item.includeInSitemap !== undefined
            ? { includeInSitemap: item.includeInSitemap }
            : {}),
          ...(item.relatedServiceSlugs !== undefined
            ? {
                relatedServiceSlugs:
                  item.relatedServiceSlugs as Prisma.InputJsonValue,
              }
            : {}),
          ...(item.relatedCaseStudySlugs !== undefined
            ? {
                relatedCaseStudySlugs:
                  item.relatedCaseStudySlugs as Prisma.InputJsonValue,
              }
            : {}),
          ...(item.sourceId !== undefined ? { sourceId: item.sourceId } : {}),
          ...(item.sourceCreatedAt !== undefined
            ? { sourceCreatedAt: parseDate(item.sourceCreatedAt) }
            : {}),
          ...(item.sourceUpdatedAt !== undefined
            ? { sourceUpdatedAt: parseDate(item.sourceUpdatedAt) }
            : {}),
        };

        if (match) {
          await tx.documentationPage.update({ where: { id: match.id }, data });
        } else {
          await tx.documentationPage.create({
            data: { ...data, landingPageId: landingPage.id },
          });
        }
      }
    },
    { maxWait: 10_000, timeout: 60_000 },
  );
}
