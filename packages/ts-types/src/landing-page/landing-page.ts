import { AboutSectionProps } from "./about";
import { faqSectionProps } from "./faq";
import { FeatureSectionProps } from "./features";
import { FooterSectionProps } from "./footer";
import { HeroSectionProps } from "./hero";
import { NewsletterSectionProps } from "./newsletter";
import { PricingSectionProps } from "./pricing";
import { ProjectSectionProps } from "./projects";
import { ServiceSectionProps } from "./services";
import { TeamSectionProps } from "./team";
import { TestimonialSectionProps } from "./testimonials";

export interface LandingPageProps  {
  heroSection: HeroSectionProps;
  aboutSection?: AboutSectionProps;
  serviceSection?: ServiceSectionProps;
  featureSection?: FeatureSectionProps;
  testimonialSection?: TestimonialSectionProps;
  projectSection?: ProjectSectionProps;
  teamSection?: TeamSectionProps;
  faqSection?: faqSectionProps;
  newsletterSection?: NewsletterSectionProps;
  pricingSection?: PricingSectionProps;
  footerSection: FooterSectionProps;
  functionsToUse?: {
    createContactAction?: any;
  };
}
