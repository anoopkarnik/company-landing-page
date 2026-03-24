import { queryAllNotionDatabase } from "@workspace/cms/notion/database/queryDatabase";
import { BlogsProps } from "../ts-types/blog";

export async function fetchBlog():Promise<BlogsProps> {
    const landingPageResults = await queryAllNotionDatabase({
        apiToken: process.env.NOTION_API_TOKEN!,
        database_id: process.env.LANDING_DATABASE_ID!,
        filters: [{name: "title", type: "title", condition: "contains", value: process.env.NEXT_PUBLIC_SAAS_NAME!}],
        filter_condition: "and",
        sorts: [],
    })
    const landingPageData = landingPageResults.results[0];

    const blogResults = await queryAllNotionDatabase({
        apiToken: process.env.NOTION_API_TOKEN!,
        database_id: process.env.BLOG_DATABASE_ID!,
        filters: [{name: "Tech Company Landing Page", type: "relation", condition: "contains", value: landingPageData.id}],
        filter_condition: "and",
        sorts: [{name: "order", type: "number", direction: "ascending" }],
    })

    const blog:BlogsProps = {
        title: landingPageData.title,
        logo: landingPageData.logo[0],
        darkLogo: landingPageData.darkLogo[0],
        blogs: blogResults.results.map((doc: any) => ({
            ...doc,
            slug: doc.Name.toLowerCase().replace(/ /g, "-")
        }))
    }
    

    return blog;
}