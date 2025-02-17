export interface NewsletterSectionProps {
    heading: string;
    description: string;
    supportEmailAddress: string;
    createContactAction?: (email: string) => Promise<{ success?: string; error?: string }>;
}