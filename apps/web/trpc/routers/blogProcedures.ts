import { fetchBlog } from "@/lib/functions/fetchBlogFromNotion";
import { BlogsProps } from "@/lib/ts-types/blog";
import { redis } from "@/server/redis";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { retrieveBlocksTree } from "@workspace/cms/notion/block/retrieveBlockChildren";
import { z } from "zod";

const BLOG_PAGE_CACHE_KEY = "company-landing:blog-page:notion:v1";
const BLOG_CACHE_TTL_SECONDS = 3600; // 10 minutes

export const blogRouter = createTRPCRouter({
    getBlogInfoFromNotion: baseProcedure
    .query(async () => {
      if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      const data = await fetchBlog()
       return data;
      }

      const cached = await redis.get<BlogsProps>(BLOG_PAGE_CACHE_KEY);
      if (cached) {
        return cached;
      }

      const data = await fetchBlog();

      await redis.set(BLOG_PAGE_CACHE_KEY, data, { ex: BLOG_CACHE_TTL_SECONDS });
      return data;

    }),
    queryBlogBySlug: baseProcedure
    .input(z.object({slug: z.string().min(1, "Slug is required")}))
    .query(async ({ input }) => {
      // We need to fetch the documentation list to find the ID corresponding to the slug
      
      let documentation: BlogsProps | null = null;
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
         documentation = await redis.get<BlogsProps>(BLOG_PAGE_CACHE_KEY);
      }

      if (!documentation) {
         documentation = await fetchBlog();
         if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
            await redis.set(BLOG_PAGE_CACHE_KEY, documentation, { ex: BLOG_CACHE_TTL_SECONDS });
         }
      }

      const doc = documentation.blogs.find((d) => d.slug === input.slug);

      if (!doc) {
        throw new Error("Blog not found");
      }

      const blocks = await retrieveBlocksTree({
        apiToken: process.env.NOTION_API_TOKEN!,
        block_id: doc.id
      });

      return blocks;
    })
});