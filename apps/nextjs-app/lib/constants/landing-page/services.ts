import { ServiceProps, ServiceSectionProps } from "@repo/ts-types/landing-page/services";

export const services: ServiceProps[] = [
    {
      title: "AI Integration",
      description:
        `Be it chatbots, recommendation engines, or predictive analytics, we can help you integrate AI into your
         business.`,
    },
    {
      title: "MVP Development",
      description:
        `We can help you build a Minimum Viable Product (MVP) to validate your idea and get feedback from your users .`,
    },
    {
      title: "Notion Templates Creation",
      description:
        "Create Notion Templates for any kind of documentation or process improvement in a company."
    },
    {
      title: "Automation of your repetitive tasks",
      description:
        "Automate the boring stuff in your life and business using code."
    }
  ];

export const servicesSection:ServiceSectionProps = {
    heading: "Client-Centric Services",
    description: `These are some of the services that I offer to my clients. I am always looking to improve and 
    add more services`,
    services
}