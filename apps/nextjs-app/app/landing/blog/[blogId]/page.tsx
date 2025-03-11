import { blockProps } from "@repo/ts-types/landing-page/blog";
import { getBlogPost } from "../../../_actions/strapi";
import BlogPostPage from "@repo/ui/templates/landing/v1/BlogPostPage";
import { serialize } from "next-mdx-remote/serialize";


export default async function BlogPost({params}:{params:{blogId:string}}) {
    const { blogId } = params;
    const blogPost = await getBlogPost(blogId);
    if (!blogPost){
        return (
            <div>
                <h1>Something went wrong</h1>
            </div>
        )
    }
    const richTextBlock = blogPost[0].blocks.find((block:blockProps) => block.__component === "shared.rich-text");
    const mdxSource = await serialize(richTextBlock ? richTextBlock.body : "");

    return (
        <BlogPostPage blogPost={blogPost[0]} mdxSource={mdxSource}/>
    )

}