export interface LandingPageProps  {
  heroSection: HeroSectionProps;
  aboutSection?: AboutSectionProps;
  serviceSection?: ServiceSectionProps;
  testimonialSection?: TestimonialSectionProps;
  projectSection?: ProjectSectionProps;
  teamSection?: TeamSectionProps;
  faqSection?: faqSectionProps;
  newsletterSection?: NewsletterSectionProps;
  footerSection: FooterSectionProps;
}

export interface AboutSectionProps  extends StatisticsProps{
    heading: string;
    companyDetails: string;

}

export interface StatisticsProps {
    users: string;
    subscribers: string;
    products: string;
    downloads: string;
  }


export interface faqProps {
    question: string;
    answer: string;
    value: string;
  }

export interface faqSectionProps {
    faqList: faqProps[];
    heading: string;
    description: string;
    supportEmailAddress: string;
}

  
  export interface FooterProps {
    label: string;
    href: string;
    type: string;                                                                                       
  }
  
  export interface FooterSectionProps {
    footerList: FooterProps[];
    creator: string;
    creatorLink: string;
    title: string;
    logo: string;
    darkLogo: string;
  }
  
    
  export interface FooterProps {
    label: string;
    href: string;
    type: string;                                                                                       
  }
  
  export interface FooterSectionProps {
    footerList: FooterProps[];
    creator: string;
    creatorLink: string;
    title: string;
    logo: string;
    darkLogo: string;
  }
  

export interface HeroSectionProps  {
    loginFunction?: () => void;
    documentationLink?: string;
    appointmentLink?: string;
    blogLink?: string;
    tagline: string;
    description: string;
  }


export interface NavbarSectionProps {
    donateNowLink?: string;
    githubLink: string;
    githubUsername: string;
    githubRepositoryName: string;
    title: string;
    logo: string;
    darkLogo: string;
  }


  export interface NewsletterSectionProps {
    heading: string;
    description: string;
    supportEmailAddress: string;
}
export interface skillProps {
    title: string;
    type?: string;
}

export interface openSourceDetailsProps {
    link: string;
    npmPackageLink: string;
    stars: string;
    weeklyDownloads: string;
    weeklyClones: string;
}

export interface websiteDetailsProps {
    websiteLink: string;
    websiteViews: string;
    websiteUsers: string;
}

export interface contentDetailsProps {
    blogLink: string;
    videoLink: string;
}

export interface notionDetailsProps {
    templateLink: string;
    views: string;
    downloads: string;
    rating: string;
}

export interface ProjectProps {
    title: string;
    type?: string;
    description?: string;
    techStack?: skillProps[];
    demoImage?: string;
    contribution?: string;
    openSourceDetails?: openSourceDetailsProps;
    websiteDetails?: websiteDetailsProps;
    contentDetails?: contentDetailsProps;
    notionDetails?: notionDetailsProps;
    featured?: boolean;
}                                                                                                                                               

export interface ProjectSectionProps {
    projects: ProjectProps[];
    heading: string;
    description: string;
}

export interface ServiceProps {
    title: string;
    description: string;
  }
    
  export interface ServiceSectionProps {
    services: ServiceProps[];
    heading: string;
    description: string;
  }

  export interface TeamProps {
    imageUrl: string;
    name: string;
    position: string;
    description: string;
    socialNetworks: SociaNetworksProps[];
  }
  
  export interface SociaNetworksProps {
    name: string;
    url: string;
  }

  export interface TeamSectionProps {
    teamList: TeamProps[];
    heading: string;
    description: string;
  }

  export interface TestimonialProps {
    imageUrl: string;
    name: string;
    userName: string;
    comment: string;
    position: string;
  }

export interface TestimonialSectionProps {
    testimonials: TestimonialProps[];
    heading: string;
    description: string;
}