export interface FooterListProps {
    [key: string]: FooterProps[];
  }
  
  export interface FooterProps {
    label: string;
    href: string;
  }
  
  export interface FooterSectionProps {
    footerList: FooterListProps;
    creator: string;
    creatorLink: string;
    title: string;
    logo: string;
    darkLogo: string;
  }
  