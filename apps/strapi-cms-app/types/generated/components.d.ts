import type { Schema, Struct } from '@strapi/strapi';

export interface AboutSectionPropsAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_about_section_props_about_sections';
  info: {
    displayName: 'aboutSection';
  };
  attributes: {
    companyDetails: Schema.Attribute.Text;
    downloads: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    products: Schema.Attribute.String;
    subscribers: Schema.Attribute.String;
    users: Schema.Attribute.String;
  };
}

export interface BenefitListPropsBenefitList extends Struct.ComponentSchema {
  collectionName: 'components_benefit_list_props_benefit_lists';
  info: {
    displayName: 'benefitList';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface CancellationRefundPoliciesPropsCancellationRefundPolicies
  extends Struct.ComponentSchema {
  collectionName: 'components_cancellation_refund_policies_props_cancellation_refund_policies';
  info: {
    displayName: 'cancellationRefundPolicies';
  };
  attributes: {
    companyLegalName: Schema.Attribute.String;
    lastUpdated: Schema.Attribute.String;
    siteName: Schema.Attribute.String;
    supportEmailAddress: Schema.Attribute.String;
    websiteUrl: Schema.Attribute.String;
  };
}

export interface ContactUsPropsContactUs extends Struct.ComponentSchema {
  collectionName: 'components_contact_us_props_contactuses';
  info: {
    displayName: 'contactUs';
  };
  attributes: {
    address: Schema.Attribute.Text;
    companyLegalName: Schema.Attribute.String;
    contactNumber: Schema.Attribute.String;
    lastUpdated: Schema.Attribute.String;
    supportEmailAddress: Schema.Attribute.String;
  };
}

export interface ContentDetailsPropsContentDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_content_details_props_content_details';
  info: {
    displayName: 'contentDetails';
  };
  attributes: {
    blogLink: Schema.Attribute.String;
    videoLink: Schema.Attribute.String;
  };
}

export interface FaqListPropsFaqList extends Struct.ComponentSchema {
  collectionName: 'components_faq_list_props_faq_lists';
  info: {
    displayName: 'faqList';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.Text;
    value: Schema.Attribute.String;
  };
}

export interface FaqSectionPropsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_faq_section_props_faq_sections';
  info: {
    displayName: 'faqSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    faqList: Schema.Attribute.Component<'faq-list-props.faq-list', true>;
    heading: Schema.Attribute.String;
    supportEmailAddress: Schema.Attribute.String;
  };
}

export interface FeatureListPropsFeatureListProps
  extends Struct.ComponentSchema {
  collectionName: 'components_feature_list_props_feature_list_props';
  info: {
    displayName: 'featureListProps';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface FeatureSectionPropsFeatureSection
  extends Struct.ComponentSchema {
  collectionName: 'components_feature_section_props_feature_sections';
  info: {
    displayName: 'featureSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    featureList: Schema.Attribute.Component<
      'feature-list-props.feature-list-props',
      true
    >;
    featuresWithDescription: Schema.Attribute.Component<
      'feature-with-description-props.feature-with-description',
      true
    >;
    heading: Schema.Attribute.String;
  };
}

export interface FeatureWithDescriptionPropsFeatureWithDescription
  extends Struct.ComponentSchema {
  collectionName: 'components_feature_with_description_props_feature_with_descriptions';
  info: {
    displayName: 'featureWithDescription';
  };
  attributes: {
    description: Schema.Attribute.Text;
    href: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface FooterListPropsFooterList extends Struct.ComponentSchema {
  collectionName: 'components_footer_list_props_footer_lists';
  info: {
    displayName: 'footerList';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    type: Schema.Attribute.String;
  };
}

export interface FooterSectionPropsFooterSection
  extends Struct.ComponentSchema {
  collectionName: 'components_footer_section_props_footer_sections';
  info: {
    displayName: 'footerSection';
  };
  attributes: {
    creator: Schema.Attribute.String;
    creatorLink: Schema.Attribute.String;
    darkLogo: Schema.Attribute.String;
    darkLogoMedia: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    footerList: Schema.Attribute.Component<
      'footer-list-props.footer-list',
      true
    >;
    logo: Schema.Attribute.String;
    logoMedia: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface HeroSectionPropsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_hero_section_props_hero_sections';
  info: {
    description: '';
    displayName: 'heroSection';
  };
  attributes: {
    appointmentLink: Schema.Attribute.String;
    blogLink: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    documentationLink: Schema.Attribute.String;
    tagline: Schema.Attribute.Text;
  };
}

export interface NavbarSectionPropsNavbarSection
  extends Struct.ComponentSchema {
  collectionName: 'components_navbar_section_props_navbar_sections';
  info: {
    description: '';
    displayName: 'navbarSection';
  };
  attributes: {
    darkLogo: Schema.Attribute.String;
    darkLogoMedia: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    donateNowLink: Schema.Attribute.String;
    githubLink: Schema.Attribute.String;
    githubRepositoryName: Schema.Attribute.String;
    githubUsername: Schema.Attribute.String;
    logo: Schema.Attribute.String;
    logoMedia: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    routeList: Schema.Attribute.Component<'route-props.route', true>;
    title: Schema.Attribute.String;
  };
}

export interface NewsletterSectionPropsNewsletterSection
  extends Struct.ComponentSchema {
  collectionName: 'components_newsletter_section_props_newsletter_sections';
  info: {
    displayName: 'newsletterSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    supportEmailAddress: Schema.Attribute.String;
  };
}

export interface NotionDetailsPropsNotionDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_notion_details_props_notion_details';
  info: {
    displayName: 'notionDetails';
  };
  attributes: {
    downloads: Schema.Attribute.String;
    rating: Schema.Attribute.String;
    templateLink: Schema.Attribute.String;
    views: Schema.Attribute.String;
  };
}

export interface OpenSourceDetailsPropsOpenSourceDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_open_source_details_props_open_source_details';
  info: {
    displayName: 'openSourceDetails';
  };
  attributes: {
    link: Schema.Attribute.String;
    npmPackageLink: Schema.Attribute.String;
    stars: Schema.Attribute.String;
    weeklyClones: Schema.Attribute.String;
    weeklyDownloads: Schema.Attribute.String;
  };
}

export interface PricingListPropsPricingListProps
  extends Struct.ComponentSchema {
  collectionName: 'components_pricing_list_props_pricing_list_props';
  info: {
    displayName: 'pricingListProps';
  };
  attributes: {
    benefitList: Schema.Attribute.Component<
      'benefit-list-props.benefit-list',
      true
    >;
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    href: Schema.Attribute.String;
    popular: Schema.Attribute.Boolean;
    price: Schema.Attribute.String;
    priceType: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface PricingSectionPropsPricingSection
  extends Struct.ComponentSchema {
  collectionName: 'components_pricing_section_props_pricing_sections';
  info: {
    displayName: 'pricingSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    pricingList: Schema.Attribute.Component<
      'pricing-list-props.pricing-list-props',
      true
    >;
    supportEmailAddress: Schema.Attribute.String;
  };
}

export interface PrivacyPolicyPropsPrivacyPolicy
  extends Struct.ComponentSchema {
  collectionName: 'components_privacy_policy_props_privacy_policies';
  info: {
    displayName: 'privacyPolicy';
  };
  attributes: {
    companyLegalName: Schema.Attribute.String;
    country: Schema.Attribute.String;
    lastUpdated: Schema.Attribute.String;
    siteName: Schema.Attribute.String;
    supportEmailAddress: Schema.Attribute.String;
    websiteUrl: Schema.Attribute.String;
  };
}

export interface ProjectPropsProject extends Struct.ComponentSchema {
  collectionName: 'components_project_props_projects';
  info: {
    description: '';
    displayName: 'project';
  };
  attributes: {
    contentDetails: Schema.Attribute.Component<
      'content-details-props.content-details',
      false
    >;
    contribution: Schema.Attribute.Text;
    demoImage: Schema.Attribute.String;
    demoImageMedia: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    description: Schema.Attribute.Text;
    featured: Schema.Attribute.Boolean;
    notionDetails: Schema.Attribute.Component<
      'notion-details-props.notion-details',
      false
    >;
    openSourceDetails: Schema.Attribute.Component<
      'open-source-details-props.open-source-details',
      false
    >;
    techStack: Schema.Attribute.Component<'tech-stack-props.tech-stack', true>;
    title: Schema.Attribute.String;
    type: Schema.Attribute.String;
    websiteDetails: Schema.Attribute.Component<
      'website-details-props.website-details',
      false
    >;
  };
}

export interface ProjectSectionPropsProjectSection
  extends Struct.ComponentSchema {
  collectionName: 'components_project_section_props_project_sections';
  info: {
    displayName: 'projectSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    projects: Schema.Attribute.Component<'project-props.project', true>;
  };
}

export interface RoutePropsRoute extends Struct.ComponentSchema {
  collectionName: 'components_route_props_routes';
  info: {
    displayName: 'route';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface ServicePropsService extends Struct.ComponentSchema {
  collectionName: 'components_service_props_services';
  info: {
    displayName: 'service';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface ServiceSectionPropsServiceSection
  extends Struct.ComponentSchema {
  collectionName: 'components_service_section_props_service_sections';
  info: {
    displayName: 'serviceSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    services: Schema.Attribute.Component<'service-props.service', true>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'quote';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    displayName: 'Rich text';
    icon: 'book';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    shareImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    displayName: 'Slider';
  };
  attributes: {
    files: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface SocialNetworkPropsSocialNetwork
  extends Struct.ComponentSchema {
  collectionName: 'components_social_network_props_social_networks';
  info: {
    displayName: 'socialNetwork';
  };
  attributes: {
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface TeamListPropsTeamList extends Struct.ComponentSchema {
  collectionName: 'components_team_list_props_team_lists';
  info: {
    displayName: 'teamList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    imageUrl: Schema.Attribute.String;
    imageUrlMedia: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    name: Schema.Attribute.String;
    position: Schema.Attribute.String;
    socialNetwork: Schema.Attribute.Component<
      'social-network-props.social-network',
      true
    >;
  };
}

export interface TeamSectionPropsTeamSection extends Struct.ComponentSchema {
  collectionName: 'components_team_section_props_team_sections';
  info: {
    displayName: 'teamSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    teamList: Schema.Attribute.Component<'team-list-props.team-list', true>;
  };
}

export interface TechStackPropsTechStack extends Struct.ComponentSchema {
  collectionName: 'components_tech_stack_props_tech_stacks';
  info: {
    displayName: 'techStack';
  };
  attributes: {
    title: Schema.Attribute.String;
    type: Schema.Attribute.String;
  };
}

export interface TermsOfServicePropsTermsOfService
  extends Struct.ComponentSchema {
  collectionName: 'components_terms_of_service_props_terms_of_services';
  info: {
    displayName: 'termsOfService';
  };
  attributes: {
    address: Schema.Attribute.Text;
    companyLegalName: Schema.Attribute.String;
    country: Schema.Attribute.String;
    lastUpdated: Schema.Attribute.String;
    siteName: Schema.Attribute.String;
    supportEmailAddress: Schema.Attribute.String;
    version: Schema.Attribute.String;
    websiteUrl: Schema.Attribute.String;
  };
}

export interface TestimonialPropsTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_testimonial_props_testimonials';
  info: {
    displayName: 'testimonial';
  };
  attributes: {
    comment: Schema.Attribute.Text;
    image: Schema.Attribute.String;
    imageMedia: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    name: Schema.Attribute.String;
    userName: Schema.Attribute.String;
  };
}

export interface TestimonialSectionPropsTestimonialSection
  extends Struct.ComponentSchema {
  collectionName: 'components_testimonial_section_props_testimonial_sections';
  info: {
    displayName: 'testimonialSection';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    testimonials: Schema.Attribute.Component<
      'testimonial-props.testimonial',
      true
    >;
  };
}

export interface WebsiteDetailsPropsWebsiteDetails
  extends Struct.ComponentSchema {
  collectionName: 'components_website_details_props_website_details';
  info: {
    displayName: 'websiteDetails';
  };
  attributes: {
    websiteDetails: Schema.Attribute.String;
    websiteUsers: Schema.Attribute.String;
    websiteViews: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-section-props.about-section': AboutSectionPropsAboutSection;
      'benefit-list-props.benefit-list': BenefitListPropsBenefitList;
      'cancellation-refund-policies-props.cancellation-refund-policies': CancellationRefundPoliciesPropsCancellationRefundPolicies;
      'contact-us-props.contact-us': ContactUsPropsContactUs;
      'content-details-props.content-details': ContentDetailsPropsContentDetails;
      'faq-list-props.faq-list': FaqListPropsFaqList;
      'faq-section-props.faq-section': FaqSectionPropsFaqSection;
      'feature-list-props.feature-list-props': FeatureListPropsFeatureListProps;
      'feature-section-props.feature-section': FeatureSectionPropsFeatureSection;
      'feature-with-description-props.feature-with-description': FeatureWithDescriptionPropsFeatureWithDescription;
      'footer-list-props.footer-list': FooterListPropsFooterList;
      'footer-section-props.footer-section': FooterSectionPropsFooterSection;
      'hero-section-props.hero-section': HeroSectionPropsHeroSection;
      'navbar-section-props.navbar-section': NavbarSectionPropsNavbarSection;
      'newsletter-section-props.newsletter-section': NewsletterSectionPropsNewsletterSection;
      'notion-details-props.notion-details': NotionDetailsPropsNotionDetails;
      'open-source-details-props.open-source-details': OpenSourceDetailsPropsOpenSourceDetails;
      'pricing-list-props.pricing-list-props': PricingListPropsPricingListProps;
      'pricing-section-props.pricing-section': PricingSectionPropsPricingSection;
      'privacy-policy-props.privacy-policy': PrivacyPolicyPropsPrivacyPolicy;
      'project-props.project': ProjectPropsProject;
      'project-section-props.project-section': ProjectSectionPropsProjectSection;
      'route-props.route': RoutePropsRoute;
      'service-props.service': ServicePropsService;
      'service-section-props.service-section': ServiceSectionPropsServiceSection;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'social-network-props.social-network': SocialNetworkPropsSocialNetwork;
      'team-list-props.team-list': TeamListPropsTeamList;
      'team-section-props.team-section': TeamSectionPropsTeamSection;
      'tech-stack-props.tech-stack': TechStackPropsTechStack;
      'terms-of-service-props.terms-of-service': TermsOfServicePropsTermsOfService;
      'testimonial-props.testimonial': TestimonialPropsTestimonial;
      'testimonial-section-props.testimonial-section': TestimonialSectionPropsTestimonialSection;
      'website-details-props.website-details': WebsiteDetailsPropsWebsiteDetails;
    }
  }
}
