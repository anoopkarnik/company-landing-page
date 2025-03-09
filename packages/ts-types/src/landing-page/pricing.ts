export enum PopularPlanType {
    NO = 0,
    YES = 1,
  }

  export interface BenefitProps {
    title: string;
  }
  
  export interface PricingProps {
    title: string;
    popular: PopularPlanType;
    price: string;
    priceType: string;
    href: string;
    description: string;
    buttonText: string;
    benefitList: BenefitProps[];
  }

export interface PricingSectionProps {
    pricingList: PricingProps[];
    heading: string;
    description: string;
    supportEmailAddress: string;
}