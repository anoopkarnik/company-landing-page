import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

/**
 * Keep the public renderer, CMS validation, and migration scripts on the same
 * MDX feature set. Blog articles use GFM tables, task lists, and autolinks.
 */
export function serializeMdx(source: string) {
  return serialize(source, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });
}
