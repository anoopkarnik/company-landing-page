
export interface FAQProps {
    question: string;
    answer: string;
    value: string;
  }

export interface FAQSectionProps {
    faqList: FAQProps[];
    heading: string;
    description: string;
    supportEmailAddress: string;
}