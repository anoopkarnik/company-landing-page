import { NewsletterSectionProps } from "@repo/ts-types/landing-page/newsletter";
import { supportEmailAddress } from "../appDetails";
import { createContactAction } from "../../../app/_actions/email";

export const newsletterSection:NewsletterSectionProps  = {
    heading: "Join Our Weekly Newsletter",
    description: `We send updates on new technologies, tips, and tricks to help you grow your own solopreneur business.
     We also share our journey and the lessons we have learned along the way.`,
    supportEmailAddress,
    createContactAction
}