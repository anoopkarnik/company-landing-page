import { fetchLandingPageData } from "@/lib/functions/fetchLandingPageDataFromNotion";
import { LandingPageProps } from "@/lib/ts-types/landing";
import { redis } from "@/server/redis";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";
import { updateNotionPage } from "@workspace/cms/notion/page/updatePage";
import { createNotionPage } from "@workspace/cms/notion/page/createPage";
import { trashPage } from "@workspace/cms/notion/page/trashPage";
import { queryAllNotionDatabase } from "@workspace/cms/notion/database/queryDatabase";
import { getDatabaseProperties } from "@workspace/cms/notion/database/retrieveDatabase";

const LANDING_PAGE_CACHE_KEY = "saas-company:landing-page:notion:v1";
const LANDING_CACHE_TTL_SECONDS = 3600; // 10 minutes

export const landingRouter = createTRPCRouter({
    getLandingInfoFromNotion: baseProcedure
    .query(async () => {
      if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      const data = await fetchLandingPageData()
       return data;
      }

      const cached = await redis.get<LandingPageProps>(LANDING_PAGE_CACHE_KEY);
      if (cached) {
        return cached;
      }

      const data = await fetchLandingPageData();

      await redis.set(LANDING_PAGE_CACHE_KEY, data, { ex: LANDING_CACHE_TTL_SECONDS });
      return data;

    }),
    updateLandingInfo: baseProcedure
        .input(z.object({
            // Navbar & Brand
            title: z.string().optional(),
            logo: z.string().optional(),
            darkLogo: z.string().optional(),
            githubLink: z.string().optional(),
            githubUsername: z.string().optional(),
            githubRepositoryName: z.string().optional(),
            donateNowLink: z.string().optional(),
            
            // Hero
            tagline: z.string().optional(),
            description: z.string().optional(),
            appointmentLink: z.string().optional(),
            codeSnippet: z.string().optional(),

            //About Section
            about: z.string().optional(),
            users: z.number().optional(),
            subscribers: z.number().optional(),
            downloads: z.number().optional(),
            productsCount: z.number().optional(),

            // Services
            serviceHeading: z.string().optional(),
            serviceDescription: z.string().optional(),
            services: z.array(z.object({
                id: z.string().optional(),
                title: z.string(),
                description: z.string(),
                imageUrl: z.string()
            })).optional(),

            // Product Section
            productHeading: z.string().optional(),
            productDescription: z.string().optional(),
            products: z.array(z.object({
                id: z.string().optional(),
                title: z.string(),
                description: z.string(),
                imageUrl: z.string(),
                githubLink: z.string().optional(),
                npmPackageLink: z.string().optional(),
                githubRepoStarts: z.number().optional(),
                weeklyGithubClones: z.number().optional(),
                weeklyNpmDownloads: z.number().optional(),
                notionTemplateLink: z.string().optional(),
                notionViews: z.number().optional(),
                notionDownloads: z.number().optional(),
                notionRating: z.number().optional(),
                type: z.string().optional(),
                websiteLink: z.string().optional(),
                websiteViews: z.number().optional(),
                monthlyActiveUsers: z.number().optional(),
                youtubeVideoLink: z.string().optional()
            })).optional(),

            //Testimonials
            testimonialHeading: z.string().optional(),
            testimonialDescription: z.string().optional(),
            testimonials: z.array(z.object({
                id: z.string().optional(),
                name: z.string(),
                position: z.string(),
                comment: z.string(),
                imageUrl: z.string(),
            })).optional(),

            //Team
            teamHeading: z.string().optional(),
            teamDescription: z.string().optional(),
            team: z.array(z.object({
                id: z.string().optional(),
                name: z.string(),
                position: z.string(),
                comment: z.string().optional(),
                imageUrl: z.string(),
            })).optional(),


            // Footer
            creator: z.string().optional(),
            creatorLink: z.string().optional(),
            footer: z.array(z.object({
                id: z.string().optional(),
                title: z.string(),
                href: z.string().optional(),
                type: z.string().optional(),
                
            })).optional(),

            //Legal
            supportEmailAddress: z.string().optional(),
            companyLegalName: z.string().optional(),
            websiteUrl: z.string().optional(),
            country: z.string().optional(),
            contactNumber: z.string().optional(),
            address: z.string().optional(),
            version: z.string().optional(),
            lastUpdated: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            if (!process.env.NOTION_API_TOKEN || !process.env.LANDING_DATABASE_ID) {
                throw new Error("Missing Notion API config");
            }
            
            // 1. Fetch the exact ID of the Landing Page being used.
            const landingPageResults = await queryAllNotionDatabase({
                apiToken: process.env.NOTION_API_TOKEN,
                database_id: process.env.LANDING_DATABASE_ID,
                filters: [{name: "title", type: "title", condition: "contains", value: process.env.NEXT_PUBLIC_SAAS_NAME!}],
                filter_condition: "and",
                sorts: [],
            });
            const landingPageData = landingPageResults.results[0];
            if (!landingPageData) throw new Error("Landing Page Notion entry not found");

            const pageId = landingPageData.id;

            // 2. Build properties array
            const properties = [];
            // Navbar & Brand
            if (input.title !== undefined) properties.push({ name: "title", type: "title", value: input.title });
            if (input.logo !== undefined) properties.push({ name: "logo", type: "file_url", value: input.logo });
            if (input.darkLogo !== undefined) properties.push({ name: "darkLogo", type: "file_url", value: input.darkLogo });
            if (input.githubLink !== undefined) properties.push({ name: "githubLink", type: "url", value: input.githubLink });
            if (input.githubUsername !== undefined) properties.push({ name: "githubUsername", type: "text", value: input.githubUsername });
            if (input.githubRepositoryName !== undefined) properties.push({ name: "githubRepositoryName", type: "text", value: input.githubRepositoryName });
            if (input.donateNowLink !== undefined) properties.push({ name: "donateNowLink", type: "url", value: input.donateNowLink });

            // Hero
            if (input.tagline !== undefined) properties.push({ name: "tagline", type: "text", value: input.tagline });
            if (input.description !== undefined) properties.push({ name: "description", type: "text", value: input.description });
            if (input.appointmentLink !== undefined) properties.push({ name: "appointmentLink", type: "url", value: input.appointmentLink });
            if (input.codeSnippet !== undefined) properties.push({ name: "codeSnippet", type: "text", value: input.codeSnippet });

            // Sections
            if (input.about !== undefined) properties.push({ name: "about", type: "text", value: input.about });
            if (input.users !== undefined) properties.push({ name: "users", type: "number", value: input.users });
            if (input.subscribers !== undefined) properties.push({ name: "subscribers", type: "number", value: input.subscribers });
            if (input.downloads !== undefined) properties.push({ name: "downloads", type: "number", value: input.downloads });
            if (input.productsCount !== undefined) properties.push({ name: "products", type: "number", value: input.productsCount });

            if (input.serviceHeading !== undefined) properties.push({ name: "serviceHeading", type: "text", value: input.serviceHeading });
            if (input.serviceDescription !== undefined) properties.push({ name: "serviceDescription", type: "text", value: input.serviceDescription });
            if (input.productHeading !== undefined) properties.push({ name: "productHeading", type: "text", value: input.productHeading });
            if (input.productDescription !== undefined) properties.push({ name: "productDescription", type: "text", value: input.productDescription });
            if (input.testimonialHeading !== undefined) properties.push({ name: "testimonialHeading", type: "text", value: input.testimonialHeading });
            if (input.testimonialDescription !== undefined) properties.push({ name: "testimonialDescription", type: "text", value: input.testimonialDescription });
            if (input.teamHeading !== undefined) properties.push({ name: "teamHeading", type: "text", value: input.teamHeading });
            if (input.teamDescription !== undefined) properties.push({ name: "teamDescription", type: "text", value: input.teamDescription });

            // Legal & Footer
            if (input.creator !== undefined) properties.push({ name: "creator", type: "text", value: input.creator });
            if (input.creatorLink !== undefined) properties.push({ name: "creatorLink", type: "url", value: input.creatorLink });
            if (input.supportEmailAddress !== undefined) properties.push({ name: "supportEmailAddress", type: "text", value: input.supportEmailAddress });
            if (input.companyLegalName !== undefined) properties.push({ name: "companyLegalName", type: "text", value: input.companyLegalName });
            if (input.websiteUrl !== undefined) properties.push({ name: "websiteUrl", type: "text", value: input.websiteUrl });
            if (input.country !== undefined) properties.push({ name: "country", type: "text", value: input.country });
            if (input.contactNumber !== undefined) properties.push({ name: "contactNumber", type: "text", value: input.contactNumber });
            if (input.address !== undefined) properties.push({ name: "address", type: "text", value: input.address });
            if (input.version !== undefined) properties.push({ name: "version", type: "text", value: input.version });
            if (input.lastUpdated !== undefined) properties.push({ name: "lastUpdated", type: "text", value: input.lastUpdated });

            if (properties.length > 0) {
                await updateNotionPage({
                    apiToken: process.env.NOTION_API_TOKEN,
                    page_id: pageId,
                    properties
                });
            }

            // --- Array Synchronization ---
            const apiToken = process.env.NOTION_API_TOKEN;

            // Helper to sync an array to Notion
            async function syncArray<T extends { id?: string }>(
                dbId: string | undefined,
                items: T[] | undefined,
                mapToProperties: (item: T) => any[]
            ) {
                console.log(`[syncArray] dbId=${dbId}, items count=${items?.length ?? 'undefined'}`);
                if (!items || !dbId) return;

                // Fetch current state
                const currentRecords = await queryAllNotionDatabase({
                     apiToken, database_id: dbId,
                     filters: [{name: "Landing Page", type: "relation", condition: "contains", value: pageId}],
                     filter_condition: "and", sorts: []
                });
                const currentIds = currentRecords.results.map((r:any) => r.id);
                const inputIds = items.filter(i => i.id).map(i => i.id);

                // Trash removed
                const toTrash = currentIds.filter((id: string) => !inputIds.includes(id));
                for (const id of toTrash) {
                    await trashPage({ apiToken, page_id: id });
                }

                // Add or Update
                for (const item of items) {
                    const mappedProps = mapToProperties(item);
                    // Append parent relation
                    mappedProps.push({ name: "Landing Page", type: "relation", value: [pageId] });

                    if (item.id) {
                        try {
                            await updateNotionPage({ apiToken, page_id: item.id, properties: mappedProps });
                        } catch (err: any) {
                            // If the page was archived/trashed (stale cache), create a new one instead
                            const errMsg = err?.message || err?.body?.message || "";
                            if (err?.code === "validation_error" && errMsg.includes("archived")) {
                                await createNotionPage({ apiToken, database_id: dbId, properties: mappedProps });
                            } else {
                                throw err;
                            }
                        }
                    } else {
                         await createNotionPage({ apiToken, database_id: dbId, properties: mappedProps });
                    }
                }
            }

            // Sync services
            await syncArray(process.env.SERVICE_DATABASE_ID, input.services, (s) => [
                { name: "title", type: "title", value: s.title },
                { name: "description", type: "text", value: s.description },
                { name: "image", type: "file_url", value: s.imageUrl || "" }
            ].filter((prop: any) => prop.value !== ""));

            // Sync products
            await syncArray(process.env.PRODUCT_DATABASE_ID, input.products, (p) => [
                { name: "Name", type: "title", value: p.title },
                { name: "Description", type: "text", value: p.description },
                { name: "Image", type: "file_url", value: p.imageUrl },
                { name: "Github Link", type: "url", value: p.githubLink || "" },
                { name: "Npm Package Link", type: "url", value: p.npmPackageLink || "" },
                { name: "Github Repo Stars", type: "number", value: p.githubRepoStarts || 0 },
                { name: "Weekly Github Clones", type: "number", value: p.weeklyGithubClones || 0 },
                { name: "Weekly Npm Downloads", type: "number", value: p.weeklyNpmDownloads || 0 },
                { name: "Notion Template Link", type: "url", value: p.notionTemplateLink || "" },
                { name: "Notion Views", type: "number", value: p.notionViews || 0 },
                { name: "Notion Downloads", type: "number", value: p.notionDownloads || 0 },
                { name: "Notion Rating", type: "number", value: p.notionRating || 0 },
                { name: "Type", type: "select", value: p.type || "" },
                { name: "Website Link", type: "url", value: p.websiteLink || "" },
                { name: "Website Views", type: "number", value: p.websiteViews || 0 },
                { name: "Monthly Active Users", type: "number", value: p.monthlyActiveUsers || 0 },
                { name: "Youtube Video Link", type: "url", value: p.youtubeVideoLink || "" }
            ].filter((prop: any) => prop.value !== "" && prop.value !== 0));

            // Sync testimonials
            await syncArray(process.env.TESTIMONIAL_DATABASE_ID, input.testimonials, (t) => [
                { name: "name", type: "title", value: t.name },
                { name: "position", type: "text", value: t.position },
                { name: "comment", type: "text", value: t.comment },
                { name: "image", type: "file_url", value: t.imageUrl }
            ]);

            // Sync team
            await syncArray(process.env.TEAM_DATABASE_ID, input.team, (t) => [
                { name: "name", type: "title", value: t.name },
                { name: "position", type: "text", value: t.position },
                { name: "comment", type: "text", value: t.comment || "" },
                { name: "image", type: "file_url", value: t.imageUrl }
            ].filter((prop: any) => prop.value !== ""));

            // Sync footer
            await syncArray(process.env.FOOTER_DATABASE_ID, input.footer, (f) => [
                { name: "label", type: "label", value: f.title },
                { name: "href", type: "url", value: f.href || "" },
                { name: "type", type: "select", value: f.type || "" }
            ].filter((prop: any) => prop.value !== ""));

            // 3. Invalidate Cache
            if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                await redis.del(LANDING_PAGE_CACHE_KEY);
            }

            return { success: true };
        }),
});