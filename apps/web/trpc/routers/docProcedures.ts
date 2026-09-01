import { z } from "zod";

import {
  getDocumentationMdxBySlug,
  getDocumentationPagesForAdmin,
  updateDocumentationPages,
} from "@/lib/functions/content-page-db";
import {
  getCachedDocumentation,
  invalidateDocumentationCache,
} from "@/lib/functions/cms-cache";
import { serializeMdx } from "@/lib/functions/serialize-mdx";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";

const contentPageSchema = z.object({
  id: z.string().optional(),
  sourceId: z.string().optional(),
  name: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug"),
  type: z.string().trim().min(1, "Category is required"),
  order: z.number().int().nonnegative(),
  mdx: z.string(),
  excerpt: z.string().max(1000).optional(),
  coverImage: z.string().url().or(z.literal("")).optional(),
  coverImageAlt: z.string().max(500).optional(),
  coverImageCaption: z.string().max(1000).optional(),
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(320).optional(),
  canonicalUrl: z.string().url().or(z.literal("")).optional(),
  ogImageUrl: z.string().url().or(z.literal("")).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
  status: z.enum(["draft", "published"]).optional(),
  publishedAt: z.string().datetime().optional(),
  author: z.string().max(120).optional(),
  includeInSitemap: z.boolean().optional(),
  relatedServiceSlugs: z.array(z.string()).max(20).optional(),
  relatedCaseStudySlugs: z.array(z.string()).max(20).optional(),
  sourceCreatedAt: z.string().optional(),
  sourceUpdatedAt: z.string().optional(),
});

export const documentationRouter = createTRPCRouter({
  getDocumentationInfo: baseProcedure.query(() => getCachedDocumentation()),
  queryDocumentationBySlug: baseProcedure
    .input(z.object({ slug: z.string().min(1, "Slug is required") }))
    .query(async ({ input }) => {
      const mdx = await getDocumentationMdxBySlug(input.slug);
      return mdx.trim() ? serializeMdx(mdx) : null;
    }),
  getDocumentationPagesForAdmin: adminProcedure.query(() =>
    getDocumentationPagesForAdmin(),
  ),
  updateDocumentationPages: adminProcedure
    .input(z.object({ pages: z.array(contentPageSchema) }))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.pages
          .filter((page) => page.mdx.trim())
          .map((page) => serializeMdx(page.mdx)),
      );
      await updateDocumentationPages(input.pages);
      await invalidateDocumentationCache();
      return { success: true };
    }),
});
