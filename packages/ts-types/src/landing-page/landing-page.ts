import { AboutSectionProps } from "./about";
import { FAQSectionProps } from "./faq";
import { FeatureSectionProps } from "./features";
import { FooterSectionProps } from "./footer";
import { HeroSectionProps } from "./hero";
import { NavbarSectionProps } from "./navbar";
import { NewsletterSectionProps } from "./newsletter";
import { PricingSectionProps } from "./pricing";
import { ProjectSectionProps } from "./projects";
import { ServiceSectionProps } from "./services";
import { TeamSectionProps } from "./team";
import { TestimonialSectionProps } from "./testimonials";

export interface LandingPageProps  {
  navbarSection: NavbarSectionProps;
  heroSection: HeroSectionProps;
  aboutSection?: AboutSectionProps;
  servicesSection?: ServiceSectionProps;
  featureSection?: FeatureSectionProps;
  testimonialsSection?: TestimonialSectionProps;
  projectsSection?: ProjectSectionProps;
  teamSection?: TeamSectionProps;
  FAQSection?: FAQSectionProps;
  newsletterSection?: NewsletterSectionProps;
  pricingSection?: PricingSectionProps;
  footerSection: FooterSectionProps
}
