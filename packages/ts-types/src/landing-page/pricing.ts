export enum PopularPlanType {
    NO = 0,
    YES = 1,
  }
  
  export interface PricingProps {
    title: string;
    popular: PopularPlanType;
    price: string;
    priceType: string;
    href: string;
    description: string;
    buttonText: string;
    benefitList: string[];
  }

export interface PricingSectionProps {
    pricingList: PricingProps[];
    heading: string;
    description: string;
    supportEmailAddress: string;
}