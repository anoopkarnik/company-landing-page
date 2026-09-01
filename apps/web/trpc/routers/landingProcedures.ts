import { z } from "zod";

import {
  getCachedLandingPageData,
  invalidateLandingPageCache,
} from "@/lib/functions/cms-cache";
import { updateLandingPageInPostgres } from "@/lib/functions/landing-page-db";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/trpc/init";

const collectionId = z.string().min(1).optional();

export const landingUpdateSchema = z.object({
  title: z.string().optional(),
  logo: z.string().optional(),
  darkLogo: z.string().optional(),
  githubLink: z.string().optional(),
  githubUsername: z.string().optional(),
  githubRepositoryName: z.string().optional(),
  donateNowLink: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  appointmentLink: z.string().optional(),
  codeSnippet: z.string().optional(),
  about: z.string().optional(),
  users: z.number().int().nonnegative().optional(),
  subscribers: z.number().int().nonnegative().optional(),
  downloads: z.number().int().nonnegative().optional(),
  productsCount: z.number().int().nonnegative().optional(),
  serviceHeading: z.string().optional(),
  serviceDescription: z.string().optional(),
  services: z
    .array(
      z.object({
        id: collectionId,
        title: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().optional(),
      }),
    )
    .optional(),
  productHeading: z.string().optional(),
  productDescription: z.string().optional(),
  products: z
    .array(
      z.object({
        id: collectionId,
        title: z.string().min(1),
        description: z.string().min(1),
        imageUrl: z.string().optional(),
        githubLink: z.string().optional(),
        npmPackageLink: z.string().optional(),
        githubRepoStars: z.number().int().nonnegative().optional(),
        weeklyGithubClones: z.number().int().nonnegative().optional(),
        weeklyNpmDownloads: z.number().int().nonnegative().optional(),
        notionTemplateLink: z.string().optional(),
        notionViews: z.number().int().nonnegative().optional(),
        notionDownloads: z.number().int().nonnegative().optional(),
        notionRating: z.number().nonnegative().optional(),
        type: z.string().optional(),
        websiteLink: z.string().optional(),
        websiteViews: z.number().int().nonnegative().optional(),
        monthlyActiveUsers: z.number().int().nonnegative().optional(),
        youtubeVideoLink: z.string().optional(),
      }),
    )
    .optional(),
  testimonialHeading: z.string().optional(),
  testimonialDescription: z.string().optional(),
  testimonials: z
    .array(
      z.object({
        id: collectionId,
        name: z.string().min(1),
        position: z.string(),
        comment: z.string().min(1),
        imageUrl: z.string().optional(),
      }),
    )
    .optional(),
  teamHeading: z.string().optional(),
  teamDescription: z.string().optional(),
  team: z
    .array(
      z.object({
        id: collectionId,
        name: z.string().min(1),
        position: z.string(),
        comment: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .optional(),
  creator: z.string().optional(),
  creatorLink: z.string().optional(),
  footer: z
    .array(
      z.object({
        id: collectionId,
        title: z.string().min(1),
        href: z.string().optional(),
        type: z.string().optional(),
      }),
    )
    .optional(),
  supportEmailAddress: z.string().optional(),
  companyLegalName: z.string().optional(),
  websiteUrl: z.string().optional(),
  country: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  version: z.string().optional(),
  lastUpdated: z.string().optional(),
});

export const landingRouter = createTRPCRouter({
  getLandingInfo: baseProcedure.query(() => getCachedLandingPageData()),
  updateLandingInfo: adminProcedure
    .input(landingUpdateSchema)
    .mutation(async ({ input }) => {
      await updateLandingPageInPostgres(input);
      await invalidateLandingPageCache();
      return { success: true };
    }),
});
