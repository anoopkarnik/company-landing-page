import db, { Prisma } from "@workspace/database/client";
import type { MetadataRoute } from "next";

import { BLOG_CATEGORIES } from "@/lib/blog-categories";

export const dynamic = "force-dynamic";

function siteUrl() {
  return (process.env.NEXT_PUBLIC_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl();
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...BLOG_CATEGORIES.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
    {
      url: `${baseUrl}/doc`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/legal/contact-us`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/legal/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  try {
    const landingPage = await db.landingPage.findUnique({
      where: {
        key:
          process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page",
      },
      select: { id: true },
    });
    if (!landingPage) return staticRoutes;

    const blogWhere: Prisma.BlogPostWhereInput = {
      landingPageId: landingPage.id,
      status: "published",
      includeInSitemap: true,
      OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
    };
    const documentationWhere: Prisma.DocumentationPageWhereInput = {
      landingPageId: landingPage.id,
      status: "published",
      includeInSitemap: true,
      OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
    };
    const [blogs, documentation, caseStudies] = await Promise.all([
      db.blogPost.findMany({
        where: blogWhere,
        select: { slug: true, updatedAt: true },
      }),
      db.documentationPage.findMany({
        where: documentationWhere,
        select: { slug: true, updatedAt: true },
      }),
      db.caseStudy.findMany({
        where: {
          landingPageId: landingPage.id,
          isPublished: true,
          confidentiality: { in: ["PUBLIC", "ANONYMIZED"] },
        },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...caseStudies.map((item) => ({
        url: `${baseUrl}/case-studies/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...blogs.map((item) => ({
        url: `${baseUrl}/blog/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.65,
      })),
      ...documentation.map((item) => ({
        url: `${baseUrl}/doc/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.55,
      })),
    ];
  } catch {
    // The site should still expose its stable routes during a transient DB outage.
    return staticRoutes;
  }
}
