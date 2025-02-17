import { FeatureWithDescriptionProps } from "./features";
import { PricingProps } from "./pricing";
import { ProjectProps } from "./projects";
import { ServiceProps } from "./services";
import { TeamProps } from "./team";
import { TestimonialProps } from "./testimonials";

export interface HeroSectionProps extends HeroCardsProps {
    loginFunction?: () => void;
    documentationLink?: string;
    appointmentLink?: string;
    tagline: string;
    description: string;
  }

  export interface HeroCardsProps {
    testimonials: TestimonialProps[];
    pricingList?: PricingProps[];
    featuresWithDescription?: FeatureWithDescriptionProps[];
    teamList: TeamProps[];
    projects?: ProjectProps[];
    services?: ServiceProps[];
  }