import { getCachedBlog } from "@/lib/functions/cms-cache";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { retrieveBlocksTree } from "@workspace/cms/notion/block/retrieveBlockChildren";
import { z } from "zod";

export const blogRouter = createTRPCRouter({
  getBlogInfoFromNotion: baseProcedure.query(async () => {
    return getCachedBlog();
  }),
  queryBlogBySlug: baseProcedure
    .input(z.object({ slug: z.string().min(1, "Slug is required") }))
    .query(async ({ input }) => {
      const documentation = await getCachedBlog();

      const doc = documentation.blogs.find((d) => d.slug === input.slug);

      if (!doc) {
        throw new Error("Blog not found");
      }

      const blocks = await retrieveBlocksTree({
        apiToken: process.env.NOTION_API_TOKEN!,
        block_id: doc.id,
      });

      return blocks;
    }),
});
