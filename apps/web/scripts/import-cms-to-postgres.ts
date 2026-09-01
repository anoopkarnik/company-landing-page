import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@workspace/database/client";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, "..");

async function loadEnvFile(filePath: string) {
  try {
    const contents = await readFile(filePath, "utf8");
    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const normalizedLine = line.startsWith("export ")
        ? line.slice("export ".length).trim()
        : line;
      const separatorIndex = normalizedLine.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = normalizedLine.slice(0, separatorIndex).trim();
      const rawValue = normalizedLine.slice(separatorIndex + 1).trim();
      process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch (error: any) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await loadEnvFile(path.join(appDir, ".env"));
await loadEnvFile(path.join(appDir, ".env.local"));

const [
  notionModule,
  blogNotionModule,
  documentationNotionModule,
  blockModule,
  landingPageModule,
  databaseModule,
] = await Promise.all([
  import("../lib/functions/fetchLandingPageDataFromNotion"),
  import("../lib/functions/fetchBlogFromNotion"),
  import("../lib/functions/fetchDocumentationFromNotion copy"),
  import("@workspace/cms/notion/block/retrieveBlockChildren"),
  import("../lib/functions/landing-page-db"),
  import("@workspace/database/client"),
]);

const { fetchLandingPageData } = notionModule;
const { fetchBlog } = blogNotionModule;
const { fetchDocumentation } = documentationNotionModule;
const { retrieveBlocksTree } = blockModule;
const { updateLandingPageInPostgres } = landingPageModule;
const { blocksToMdx } = await import("../lib/functions/notion-blocks-to-mdx");
const db: PrismaClient =
  (databaseModule.default as any)?.default ??
  databaseModule.default ??
  databaseModule;

console.log("Reading the current CMS content from Notion...");
const data = await fetchLandingPageData();

await updateLandingPageInPostgres({
  title: data.navbarSection?.title ?? "",
  logo: data.navbarSection?.logo ?? "",
  darkLogo: data.navbarSection?.darkLogo ?? "",
  githubLink: data.navbarSection?.githubLink ?? "",
  githubUsername: data.navbarSection?.githubUsername ?? "",
  githubRepositoryName: data.navbarSection?.githubRepositoryName ?? "",
  donateNowLink: data.navbarSection?.donateNowLink ?? "",
  tagline: data.heroSection?.tagline ?? "",
  description: data.heroSection?.description ?? "",
  appointmentLink: data.heroSection?.appointmentLink ?? "",
  codeSnippet: data.heroSection?.codeSnippet ?? "",
  about: data.aboutSection?.companyDetails ?? "",
  users: Number(data.aboutSection?.users ?? 0),
  subscribers: Number(data.aboutSection?.subscribers ?? 0),
  downloads: Number(data.aboutSection?.downloads ?? 0),
  productsCount: Number(data.aboutSection?.products ?? 0),
  serviceHeading: data.serviceSection?.heading ?? "",
  serviceDescription: data.serviceSection?.description ?? "",
  services: (data.serviceSection?.services ?? []).map((item: any) => ({
    id: item.id,
    title: item.title ?? "",
    description: item.description ?? "",
    imageUrl: item.imageUrl ?? "",
  })),
  productHeading: data.projectSection?.heading ?? "",
  productDescription: data.projectSection?.description ?? "",
  products: (data.projectSection?.projects ?? []).map((item: any) => ({
    id: item.id,
    title: item.title ?? "",
    description: item.description ?? "",
    imageUrl: item.demoImage ?? "",
    type: item.type ?? "",
    githubLink: item.openSourceDetails?.link ?? "",
    npmPackageLink: item.openSourceDetails?.npmPackageLink ?? "",
    githubRepoStars: Number(item.openSourceDetails?.stars ?? 0),
    weeklyGithubClones: Number(item.openSourceDetails?.weeklyClones ?? 0),
    weeklyNpmDownloads: Number(item.openSourceDetails?.weeklyDownloads ?? 0),
    notionTemplateLink: item.notionDetails?.templateLink ?? "",
    notionViews: Number(item.notionDetails?.views ?? 0),
    notionDownloads: Number(item.notionDetails?.downloads ?? 0),
    notionRating: Number(item.notionDetails?.rating ?? 0),
    websiteLink: item.websiteDetails?.websiteLink ?? "",
    websiteViews: Number(item.websiteDetails?.websiteViews ?? 0),
    monthlyActiveUsers: Number(item.websiteDetails?.websiteUsers ?? 0),
    youtubeVideoLink: item.contentDetails?.videoLink ?? "",
  })),
  testimonialHeading: data.testimonialSection?.heading ?? "",
  testimonialDescription: data.testimonialSection?.description ?? "",
  testimonials: (data.testimonialSection?.testimonials ?? []).map(
    (item: any) => ({
      id: item.id,
      name: item.name ?? "",
      position: item.position ?? "",
      comment: item.comment ?? "",
      imageUrl: item.image ?? "",
    }),
  ),
  teamHeading: data.teamSection?.heading ?? "",
  teamDescription: data.teamSection?.description ?? "",
  team: (data.teamSection?.teamList ?? []).map((item: any) => ({
    id: item.id,
    name: item.name ?? "",
    position: item.position ?? "",
    comment: item.description ?? "",
    imageUrl: item.imageUrl ?? "",
  })),
  creator: data.footerSection?.creator ?? "",
  creatorLink: data.footerSection?.creatorLink ?? "",
  footer: (data.footerSection?.footerList ?? []).map((item: any) => ({
    id: item.id,
    title: item.label ?? item.title ?? "",
    href: item.href ?? "",
    type: item.type ?? "",
  })),
  supportEmailAddress: data.contactUs?.supportEmailAddress ?? "",
  companyLegalName: data.contactUs?.companyLegalName ?? "",
  websiteUrl: data.termsOfService?.websiteUrl ?? "",
  country: data.privacyPolicy?.country ?? "",
  contactNumber: data.contactUs?.contactNumber ?? "",
  address: data.contactUs?.address ?? "",
  version: data.termsOfService?.version ?? "",
  lastUpdated: data.contactUs?.lastUpdated ?? "",
});

const key = process.env.NEXT_PUBLIC_SAAS_NAME?.trim() || "company-landing-page";
const landingPage = await db.landingPage.findUnique({
  where: { key },
  include: {
    services: true,
    projects: true,
    testimonials: true,
    teamMembers: { orderBy: { order: "asc" } },
    footerLinks: true,
  },
});

if (!landingPage) {
  throw new Error("PostgreSQL landing page was not created");
}

const teamMemberIds = landingPage.teamMembers.map((member) => member.id);
await db.$transaction(async (tx) => {
  await tx.socialNetwork.deleteMany({
    where: { teamMemberId: { in: teamMemberIds } },
  });

  for (const [teamIndex, member] of landingPage.teamMembers.entries()) {
    const sourceMember = data.teamSection?.teamList?.[teamIndex];
    for (const [order, social] of (
      sourceMember?.socialNetworks ?? []
    ).entries()) {
      await tx.socialNetwork.create({
        data: {
          teamMemberId: member.id,
          name: social.name ?? "",
          url: social.url ?? "",
          order,
        },
      });
    }
  }
});

const socialNetworkCount = await db.socialNetwork.count({
  where: { teamMemberId: { in: teamMemberIds } },
});

console.log("Reading blog and documentation content from Notion...");
const [blogData, documentationData] = await Promise.all([
  fetchBlog(),
  fetchDocumentation(),
]);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const blogPosts = await Promise.all(
  (blogData.blogs ?? []).map(async (post: any, index: number) => ({
    sourceId: post.id,
    name: post.Name ?? `Blog Post ${index + 1}`,
    slug: slugify(post.slug ?? post.Name ?? `blog-post-${index + 1}`),
    type: post.Type ?? "General",
    order: Number(post.order ?? index),
    mdx: blocksToMdx(
      await retrieveBlocksTree({
        apiToken: process.env.NOTION_API_TOKEN!,
        block_id: post.id,
      }),
    ),
    sourceCreatedAt: post["Created time"],
    sourceUpdatedAt: post["Last edited time"],
  })),
);

const documentationPages = await Promise.all(
  (documentationData.docs ?? []).map(async (page: any, index: number) => ({
    sourceId: page.id,
    name: page.Name ?? `Documentation Page ${index + 1}`,
    slug: slugify(page.slug ?? page.Name ?? `documentation-page-${index + 1}`),
    type: page.Type ?? "General",
    order: Number(page.order ?? index),
    mdx: blocksToMdx(
      await retrieveBlocksTree({
        apiToken: process.env.NOTION_API_TOKEN!,
        block_id: page.id,
      }),
    ),
    sourceCreatedAt: page["Created time"],
    sourceUpdatedAt: page["Last edited time"],
  })),
);

await db.$transaction(
  async (tx) => {
    await tx.blogPost.deleteMany({
      where: { landingPageId: landingPage.id },
    });
    await tx.documentationPage.deleteMany({
      where: { landingPageId: landingPage.id },
    });

    await tx.blogPost.createMany({
      data: blogPosts.map((post) => ({
        ...post,
        sourceCreatedAt: post.sourceCreatedAt
          ? new Date(post.sourceCreatedAt)
          : null,
        sourceUpdatedAt: post.sourceUpdatedAt
          ? new Date(post.sourceUpdatedAt)
          : null,
        landingPageId: landingPage.id,
      })),
    });
    await tx.documentationPage.createMany({
      data: documentationPages.map((page) => ({
        ...page,
        sourceCreatedAt: page.sourceCreatedAt
          ? new Date(page.sourceCreatedAt)
          : null,
        sourceUpdatedAt: page.sourceUpdatedAt
          ? new Date(page.sourceUpdatedAt)
          : null,
        landingPageId: landingPage.id,
      })),
    });
  },
  { maxWait: 10_000, timeout: 60_000 },
);

console.log("CMS migration completed.");
console.table({
  landingPages: 1,
  services: landingPage.services.length,
  projects: landingPage.projects.length,
  testimonials: landingPage.testimonials.length,
  teamMembers: landingPage.teamMembers.length,
  socialNetworks: socialNetworkCount,
  footerLinks: landingPage.footerLinks.length,
  blogPosts: blogPosts.length,
  documentationPages: documentationPages.length,
});

await db.$disconnect();
