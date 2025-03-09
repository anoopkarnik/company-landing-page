"use client";

import { useEffect, useState } from "react";
import { navbarSection } from "../lib/constants/landing-page/navbar";
import { testimonialSection } from "../lib/constants/landing-page/testimonials";
import { projectSection } from "../lib/constants/landing-page/projects";
import { footerSection } from "../lib/constants/landing-page/footer";
import { teamSection } from "../lib/constants/landing-page/team";
import { serviceSection } from "../lib/constants/landing-page/services";
import { aboutSection } from "../lib/constants/landing-page/about";
import { heroSection } from "../lib/constants/landing-page/hero";
import { newsletterSection } from "../lib/constants/landing-page/newsletter";
import { faqSection } from "../lib/constants/landing-page/faq";
import { pricingSection } from "../lib/constants/landing-page/pricing";
import { featureSection } from "../lib/constants/landing-page/features";
import { getCompanyDetails, getLegalDetails } from "../app/_actions/strapi";
import { termsOfService } from "../lib/constants/legal/termsOfService";
import { privacyPolicy } from "../lib/constants/legal/privacyPolicy";
import { cancellationRefundPolicies } from "../lib/constants/legal/cancellationRefundPolicies";
import { contactUs } from "../lib/constants/legal/contactUs";

export const useData = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [navbarSectionState, setNavbarSectionState] = useState(navbarSection);
  const [heroSectionState, setHeroSectionState] = useState(heroSection);
  const [aboutSectionState, setAboutSectionState] = useState(aboutSection);
  const [featureSectionState, setFeatureSectionState] = useState(featureSection);
  const [serviceSectionState, setServiceSectionState] = useState(serviceSection);
  const [projectSectionState, setProjectSectionState] = useState(projectSection);
  const [testimonialSectionState, setTestimonialSectionState] = useState(testimonialSection);
  const [teamSectionState, setTeamSectionState] = useState(teamSection);
  const [faqSectionState, setFaqSectionState] = useState(faqSection);
  const [pricingSectionState, setPricingSectionState] = useState(pricingSection);
  const [newsletterSectionState, setNewsletterSectionState] = useState(newsletterSection);
  const [footerSectionState, setFooterSectionState] = useState(footerSection);

  const [termsOfServiceState, setTermsOfServiceState] = useState(termsOfService);
  const [privacyPolicyState, setPrivacyPolicyState] = useState(privacyPolicy);
  const [cancellationRefundPoliciesState, setCancellationRefundPoliciesState] = useState(cancellationRefundPolicies);
  const [contactUsState, setContactUsState] = useState(contactUs);

  const [constantsType, setConstantsType] = useState<string>(process.env.NEXT_PUBLIC_BASE_DATA_SOURCE || "file");

  useEffect(() => {
    if (constantsType === "cms") {
      updateDataFromStrapiCms();
    } else {
      setIsLoading(false); // ✅ Mark as loaded for file-based data
    }
  }, []);

  const updateDataFromStrapiCms = async () => {
    setIsLoading(true);
    try {
      const companyDetails = await getCompanyDetails();
      setNavbarSectionState(companyDetails.navbarSection);
      setHeroSectionState(companyDetails.heroSection);
      setAboutSectionState(companyDetails.aboutSection);
      setFeatureSectionState(companyDetails.featureSection);
      setServiceSectionState(companyDetails.serviceSection);
      setProjectSectionState(companyDetails.projectSection);
      setTestimonialSectionState(companyDetails.testimonialSection);
      setTeamSectionState(companyDetails.teamSection);
      setFaqSectionState(companyDetails.faqSection);
      setPricingSectionState(companyDetails.pricingSection);
      setNewsletterSectionState(companyDetails.newsletterSection);
      setFooterSectionState(companyDetails.footerSection);

      const legalDetails = await getLegalDetails();
      setPrivacyPolicyState(legalDetails.privacyPolicy);
      setTermsOfServiceState(legalDetails.termsOfService);
      setCancellationRefundPoliciesState(legalDetails.cancellationRefundPolicies);
      setContactUsState(legalDetails.contactUs);
    } catch (error) {
      console.error("Error fetching CMS data:", error);
    } finally {
      setIsLoading(false); // ✅ Ensure loading state is turned off
    }

  };

  const updateDataFromFiles = () => {
    setNavbarSectionState(navbarSection);
    setHeroSectionState(heroSection);
    setAboutSectionState(aboutSection);
    setFeatureSectionState(featureSection);
    setServiceSectionState(serviceSection);
    setProjectSectionState(projectSection);
    setTestimonialSectionState(testimonialSection);
    setTeamSectionState(teamSection);
    setFaqSectionState(faqSection);
    setPricingSectionState(pricingSection);
    setNewsletterSectionState(newsletterSection);
    setFooterSectionState(footerSection);
    setPrivacyPolicyState(privacyPolicy);
    setTermsOfServiceState(termsOfService);
    setCancellationRefundPoliciesState(cancellationRefundPolicies);
    setContactUsState(contactUs);
  };

  const handleConstantsType = async () => {
    if (constantsType === "file") {
      await updateDataFromStrapiCms();
      setConstantsType("cms");
    } else {
      updateDataFromFiles();
      setConstantsType("file");
    }
  };

  return {
    isLoading,
    navbarSectionState,
    heroSectionState,
    aboutSectionState,
    featureSectionState,
    serviceSectionState,
    projectSectionState,
    testimonialSectionState,
    teamSectionState,
    faqSectionState,
    pricingSectionState,
    newsletterSectionState,
    footerSectionState,
    termsOfServiceState,
    privacyPolicyState,
    cancellationRefundPoliciesState,
    contactUsState,
    constantsType,
    handleConstantsType,
  };
};
