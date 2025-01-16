import { RouteProps, FeatureWithDescriptionProps,
    TestimonialProps, 
    PricingProps,
    FAQProps,
    FooterListProps,
    TeamProps,
    ProjectProps,
    ServiceProps} from "@repo/ts-types/landing-page/v1";



export const routeList: RouteProps[] = [

    {
        href: "#about",
        label: "About",
    },
    {
      href: "#services",
      label: "Services",
    },
    {
      href: "#products",
      label: "Products",
    },
    {
      href: "#team",
      label: "Team",
    }
]

export const featuresWithDescription: FeatureWithDescriptionProps[] = [
  ];
  
  export const featureList: string[] = [
  ];

  export const testimonials: TestimonialProps[] = [
    {
      image: "./anoop.jpg",
      name: "Anoop Karnik Dasika",
      userName: "@anooplegend1992",
      comment: "This is the best boilerplate for micro SaaS monerepo code out there!",
    },
    {
      image: "./batman.jpg",
      name: "Batman",
      userName: "@batman",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to save gotham by creating a surveillance AI.",
    },
  
    {
      image: "./einstein.jpg",
      name: "Albert Einstein",
      userName: "@alberteinstein",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me solve the equation of the universe.",
    },
    {
      image: "./newton.jpg",
      name: "Issac Newton",
      userName: "@issacnewton",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me understand the thousands of laws of motion insteadf of just 3.",
    },
    {
      image: "./buddha.jpeg",
      name: "Gautum Buddha",
      userName: "@gautumbuddha",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me understand the meaning of life.",
    },
    {
      image: "./ironman.jpeg",
      name: "Iron Man",
      userName: "@ironman",
      comment:
        "If I had used this boilerplate code earlier, I would have created a software to help me save the world from Thanos.",
    },
  ];
  
export const projects: ProjectProps[] = [
  {
    "title": "Turborepo SaaS Boilerplate Code",
    "description": "The best boilerplate code for creating a micro SaaS monorepo codebase.",
    "demo": "https://boilerplate.bayesian-labs.com",
    "github": "https://github.com/anoopkarnik/turborepo-saas-boilerplate-code",
    "image": "/projects/turborepo-saas-boilerplate-code.png"

  },
  {
    "title": "Company Landing Page Boilerplate Code",
    "description": "The best boilerplate code for creating a company landing page.",
    "demo": "https://bayesian-labs.com",
    "github": "https://github.com/anoopkarnik/company-landing-page",
    "image": "/projects/company-landing-page.png"
  },
  {
    "title": "Personal Finance System Template",
    "description": "This dashboard is used to put your monthly budgets, yearly budgets, assets and liabilities, financial transactions, FIRE and funds with a sample list of all budgets a person above 25 faces.",
    "notion": "https://www.notion.so/marketplace/templates/personal-finance-system",
    "image": "/projects/personal-finance-system.webp"
  },
  {
    "title": "Social & Relationship System Template",
    "description": "This is a template to maintain all my relationships - friends, family, acquantances and professional.",
    "notion": "https://www.notion.so/marketplace/templates/social-relationship-system",
    "image": "/projects/social-relationship-system.jpeg"
  },
  {
    "title": "Solopreneur Project Management System Template",
    "description": "This dashboard is perfect for planning production level projects which a very small team or solopreneur builds, it includes databases for projects, sprints, bugs, features, team, etc.",
    "notion": "https://www.notion.so/marketplace/templates/solopreneur-projects-dashboard",
    "image": "/projects/solopreneur-projects-dashboard.webp"
  }
]

export const pricingList: PricingProps[] = [
   
  ];

    
  export const FAQList: FAQProps[] = [
  ];

  export const footerList: FooterListProps = {
    "Follow Us": [
        {
            label: "Twitter",
            href: "https://x.com/anooplegend1992"
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/anoopkarnik/"
        },
        {
            label: "Github",
            href: "https://github.com/anoopkarnik"
        },
        {
            label: "Youtube",
            href: "https://youtube.com/@bayesianlabs"
        },
        {
            label: "Discord",
            href: "https://discord.gg/ephjwba9"
        }
    ],
    "Legal": [
        {
            label: "Terms & Conditions",
            href: "/landing/terms-of-service"
        },
        {
            label: "Privacy Policy",
            href: "/landing/privacy-policy"
        },
        {
          label: "Contact Us",
          href: "/landing/contact-us"
        }
    ],
  }

export const services: ServiceProps[] = [
    {
      title: "AI Integration",
      description:
        "Be it chatbots, recommendation engines, or predictive analytics, we can help you integrate AI into your business.",
    },
    {
      title: "MVP Development",
      description:
        "We can help you build a Minimum Viable Product (MVP) to validate your idea and get feedback from your users .",
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


  export const teamList: TeamProps[] = [
    {
      imageUrl: "/anoop.jpg",
      name: "Anoop Karnik Dasika",
      position: "Founder",
      description: "Just into creating Sci-Fi stuff. Currently working on automation and gamifying the boring stuff, we do in life.",
      socialNetworks: [
        {
          name: "Linkedin",
          url: "https://www.linkedin.com/in/anoopkarnik/",
        },
        {
          name: "Facebook",
          url: "https://www.facebook.com/anoop.karnik1",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/anoopkarnik",
        },
        {
          name: "Twitter",
          url: "https://twitter.com/anooplegend1992",
        },
        {
          name: "Github",
          url: "https://github.com/anoopkarnik",
        },
        {
          name: "Youtube",
          url: "https://www.youtube.com/@bayesianlabs",
        }
      ]
    }
  ];