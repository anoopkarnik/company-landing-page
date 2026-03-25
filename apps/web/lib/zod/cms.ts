import { z } from "zod";

// --- Navbar ---
export const navbarFormSchema = z.object({
    title: z.string().optional(),
    logo: z.string().optional(),
    darkLogo: z.string().optional(),
    githubLink: z.string().optional(),
    githubUsername: z.string().optional(),
    githubRepositoryName: z.string().optional(),
    donateNowLink: z.string().optional(),
});
export type NavbarFormValues = z.infer<typeof navbarFormSchema>;

// --- Hero ---
export const heroFormSchema = z.object({
    tagline: z.string().optional(),
    description: z.string().optional(),
    appointmentLink: z.string().optional(),
});
export type HeroFormValues = z.infer<typeof heroFormSchema>;

// --- About ---
export const aboutFormSchema = z.object({
    about: z.string().optional(),
    users: z.string().optional(),
    subscribers: z.string().optional(),
    downloads: z.string().optional(),
    totalProducts: z.string().optional(),
});
export type AboutFormValues = z.infer<typeof aboutFormSchema>;

// --- Services ---
const serviceItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().optional(),
});
export type ServiceItem = z.infer<typeof serviceItemSchema>;

export const servicesFormSchema = z.object({
    serviceHeading: z.string().optional(),
    serviceDescription: z.string().optional(),
    services: z.array(serviceItemSchema).optional(),
});
export type ServicesFormValues = z.infer<typeof servicesFormSchema>;

// --- Projects ---
const projectItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().optional(),
    type: z.string().optional(),
    githubLink: z.string().optional(),
    npmPackageLink: z.string().optional(),
    websiteLink: z.string().optional(),
    youtubeVideoLink: z.string().optional(),
    notionTemplateLink: z.string().optional(),
});
export type ProjectItem = z.infer<typeof projectItemSchema>;

export const projectsFormSchema = z.object({
    productHeading: z.string().optional(),
    productDescription: z.string().optional(),
    products: z.array(projectItemSchema).optional(),
});
export type ProjectsFormValues = z.infer<typeof projectsFormSchema>;

// --- Testimonials ---
const testimonialItemSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    position: z.string().min(1, "Position is required"),
    comment: z.string().min(1, "Comment is required"),
    imageUrl: z.string().optional(),
});
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;

export const testimonialsFormSchema = z.object({
    testimonialHeading: z.string().optional(),
    testimonialDescription: z.string().optional(),
    testimonials: z.array(testimonialItemSchema).optional(),
});
export type TestimonialsFormValues = z.infer<typeof testimonialsFormSchema>;

// --- Team ---
const teamItemSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    position: z.string().min(1, "Position is required"),
    comment: z.string().optional(),
    imageUrl: z.string().optional(),
});
export type TeamItem = z.infer<typeof teamItemSchema>;

export const teamFormSchema = z.object({
    teamHeading: z.string().optional(),
    teamDescription: z.string().optional(),
    team: z.array(teamItemSchema).optional(),
});
export type TeamFormValues = z.infer<typeof teamFormSchema>;

// --- Footer ---
const footerItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Label is required"),
    href: z.string().optional(),
    type: z.string().optional(),
});
export type FooterItem = z.infer<typeof footerItemSchema>;

export const footerFormSchema = z.object({
    creator: z.string().optional(),
    creatorLink: z.string().optional(),
    footer: z.array(footerItemSchema).optional(),
});
export type FooterFormValues = z.infer<typeof footerFormSchema>;

// --- Legal ---
export const legalFormSchema = z.object({
    supportEmailAddress: z.string().optional(),
    companyLegalName: z.string().optional(),
    websiteUrl: z.string().optional(),
    country: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    version: z.string().optional(),
    lastUpdated: z.string().optional(),
});
export type LegalFormValues = z.infer<typeof legalFormSchema>;

// --- Combined type for onSave ---
export type CmsFormValues =
    | NavbarFormValues
    | HeroFormValues
    | AboutFormValues
    | ServicesFormValues
    | ProjectsFormValues
    | TestimonialsFormValues
    | TeamFormValues
    | FooterFormValues
    | LegalFormValues;

// --- Shared tab component props ---
export interface SectionTabProps {
    initialData: any;
    onSave: (values: any) => void;
    isSaving: boolean;
}
