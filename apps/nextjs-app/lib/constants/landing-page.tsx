import { RouteProps, FeatureWithDescriptionProps,
    TestimonialProps, 
    PricingProps,
    FAQProps,
    FooterListProps,
    TeamProps} from "@repo/ts-types/landing-page/v1";



export const routeList: RouteProps[] = [
    {
        href: "#features",
        label: "Features",
    },
    {
        href: "#testimonials",
        label: "Testimonials",
    },
    {
        href: "#pricing",
        label: "Pricing",
    },
    {
        href: "#faq",
        label: "FAQ",
    }
]

export const featuresWithDescription: FeatureWithDescriptionProps[] = [
    {
      title: "Aesthetic Landing Page",
      description:
        "The landing page is designed to be minimalist and aesthetic inspired from https://github.com/leoMirandaa/shadcn-landing-page. It is designed to be responsive and mobile-friendly and easily customizable.",
      href:"./features/landing.png"
    },
    {
      title: "Atomic Design Shadcn Components",
      description:
        "All the Shadcn Components are stored in a atomic design manner as atoms, molecules. We have created organisms and templates using these components and some custom ones",
      href:"./features/shadcn.png"
    },
    {
      title: "Shadcn Themes",
      description:
        "All the Shadcn Themes can be used to change the look and feel of the landing page by just changing a import statement. We have created a dark and light theme for the landing page.",
      href:"./features/shadcn-themes.webp"
    },
    {
      title: "Authv5 Authentication",
      description:
        "Email Authentication with verification, forgot password, etc. Social Logins with Google, Github, Linkedin, etc. All the authentication is done using Authv5.",
      href:"./features/authv5.png"
    },
    {
      title: "Razorpay Payments",
      description:
        "Razorpay Payments are integrated into the landing page.",
      href:"./features/razorpay.webp"
    },
    {
      title: "Vercel Blob Storage",
      description:
        "Vercel Blob Storage is used to store the profile images of the users and also modify them.",
      href:"./features/vercel.jpg"
    },
    {
      title: "Prisma ORM",
      description:
        "Prisma ORM is used to store the user data.",
      href:"./features/prismaorm.jpg"
    },
    {
      title: "Profile Management Settings",
      description:
        "Profile Management Settings are used to change the user profile details.",
      href:"./features/settings.png"
    },
    {
      title: "Resend Email",
      description:
        "Resend Email is used to resend the verification and reset password email to the user.",
      href: "./features/resend.png"
    },
    {
      title: "Sidebar Navigation",
      description:
        "Sidebar Navigation is used to navigate to the different sections of the home page and also profile settings.",
      href: "./features/sidebar.png"
    },
    {
      title: "Notification System",
      description:
        "Notification System is used to see notifications of the user.",
      href: "./features/notifications.png"
    },
    {
      title: "Customized Pricing for API Credits using Cashfree Payments",
      description:
        "Customized Pricing for API Credits is used to show the pricing of the API Credits.",
      href: "./features/cashfree.avif"
    },
    {
      title: "Notion Client Library",
      description:
        "Notion Client Library is used to fetch the data from the Notion API.",
      href: "./features/notion.png"
    },
    {
      title: "OpenAI Client Library",
      description:
        "OpenAI Client Library is used to fetch the data from the OpenAI API.",
      href: "./features/openai.png"
    }

  ];
  
  export const featureList: string[] = [
    "Landing Page",
    "Dark/Light theme",
    "Docusaurus Documentation",
    "Razorpay Payments",
    "NextAuth Authentication",
    "Social Logins",
    "Shadcn Atomic Design Components",
    "Shadcn Themes",
    "Shadcn Templates",
    "Profile Management Settings",
    "Prisma ORM",
    "Resend Email",
    "Vercel Blob Storage",
    "Responsive design",
    "Minimalist",
    "Session Management",
    "Third Party Integrations",
    "Notification System",
    "Customized Pricing for API Credits",
    "Notion Client Library",
    "OpenAI Client Library",
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
  

export const pricingList: PricingProps[] = [
    {
      title: "Trial",
      popular: 1,
      price: "Rs 0",
      priceType: "/one-time",
      href: "/auth/login",
      description:
        "To test live how this project works, you can use this trial plan and perform 20 credits worth of operations.",
      buttonText: "Get Started",
      benefitList: [
        "Open Source Code",
        "Testing how it works live",
        "Latest Tools and Technologies",
        "20 credits",
        "Mail Support",
      ],
    },
    {
      title: "Pro",
      popular: 0,
      price: "Rs 20",
      priceType: "/one-time",
      href: "/auth/login",
      description:
        "To test live how this project works, you can use this trial plan and perform 200 credits worth of operations.",
      buttonText: "Upgrade (Only after Login)",
      benefitList: [
        "Open Source Code",
        "Testing how it works live",
        "Latest Tools and Technologies",
        "200 credits",
        "Mail Support",
      ],
    },
    {
      title: "Enterprise",
      popular: 0,
      price: "",
      priceType: "/Customized Pricing",
      href: "https://mail.google.com/mail?view=cm&fs=1&to=support@bsamaritan.com&su=Support",
      description:
        "Customize this boilerplate code to your own startup needs.",
      buttonText: "Contact Us",
      benefitList: [
        "Open Source Code",
        "Testing how it works live",
        "Latest Tools and Technologies",
        "All Future Updates",
        "Mail Support",
      ],
    },
  ];

    
  export const FAQList: FAQProps[] = [
    {
      question: "Is this boilerplate code free?",
      answer: "Yes. It is a free and open-source boilerplate code.",
      value: "item-1",
    },
    {
      question: "What are the tools and languages used in this boilerplate code?",
      answer:
        "Nexjs, React, Typescript, Tailwind CSS, Turborepo, Docusaurus, Prisma, Vercel, Razorpay, NextAuth, Shadcn Atomic Design Components, Shadcn Themes, Shadcn Templates, and many more.",
      value: "item-2",
    },
    {
      question:
        "What level of coding expertise is required to use this boilerplate code?",
      answer:
        "This boilerplate code is beginner-friendly. You can start building your project with minimal coding expertise, if you go through the documentation properly.",
      value: "item-3",
    },
    {
      question: "What kind of support is provided for this boilerplate code?",
      answer: "You can contant us from below link on email on chat with AI trained on our documentation in the bottom right corner.",
      value: "item-4",
    },
    {
      question:
        "How can I contribute to this boilerplate code?",
      answer:
        "You can contribute to this boilerplate code by forking the repository, making changes, and creating a pull request.",
      value: "item-5",
    },
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
        }
    ],
    "Documentation": [
        {
            label: "Overview",
            href: "https://docs.bsamaritan.com/docs/overview/"
        },
        {
            label: "Getting Started",
            href: "https://docs.bsamaritan.com/docs/category/getting-started"
        },
        {
            label: "Deployment",
            href: "https://docs.bsamaritan.com/docs/category/deployment"
        },
        {
            label: "Troubleshooting",
            href: "https://docs.bsamaritan.com/docs/troubleshooting"
        },
        {
            label: "FAQs",
            href: "https://docs.bsamaritan.com/docs/faqs"
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
            label: "Cancellation/Refund Policies",
            href: "/landing/cancellation-refund-policies"
        },
        {
          label: "Contact Us",
          href: "/landing/contact-us"
        }
    ],
  }

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