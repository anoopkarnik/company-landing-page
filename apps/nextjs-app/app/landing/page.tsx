"use client"
import LandingPage from "@repo/ui/templates/landing/v1/LandingPage";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import { navbarSection} from "../../lib/constants/landing-page/navbar";
import { testimonialSection } from "../../lib/constants/landing-page/testimonials";
import { projectSection } from "../../lib/constants/landing-page/projects";
import { footerSection } from "../../lib/constants/landing-page/footer";
import { teamSection } from "../../lib/constants/landing-page/team";
import { serviceSection } from "../../lib/constants/landing-page/services";
import { aboutSection } from "../../lib/constants/landing-page/about";
import { heroSection } from "../../lib/constants/landing-page/hero";
import { newsletterSection } from "../../lib/constants/landing-page/newsletter";
import { faqSection } from "../../lib/constants/landing-page/faq";
import { pricingSection } from "../../lib/constants/landing-page/pricing";
import { featureSection } from "../../lib/constants/landing-page/features";
import { createContactAction } from "../_actions/email";
import { useEffect, useState } from "react";
import { getCompanyDetails } from "../_actions/strapi";
import { Switch } from "@repo/ui/molecules/shadcn/switch";

export default function Landing() {

  const {toast} = useToast();
  const [navbarSectionState, setNavbarSectionState] = useState(navbarSection)
  const [heroSectionState, setHeroSectionState] = useState(heroSection)
  const [aboutSectionState, setAboutSectionState] = useState(aboutSection)
  const [featureSectionState, setFeatureSectionState] = useState(featureSection)
  const [serviceSectionState, setServiceSectionState] = useState(serviceSection)
  const [projectSectionState, setProjectSectionState] = useState(projectSection)
  const [testimonialSectionState, setTestimonialSectionState] = useState(testimonialSection)
  const [teamSectionState, setTeamSectionState] = useState(teamSection)
  const [faqSectionState, setFaqSectionState] = useState(faqSection)
  const [pricingSectionState, setPricingSectionState] = useState(pricingSection)
  const [newsletterSectionState, setNewsletterSectionState] = useState(newsletterSection)
  const [footerSectionState, setFooterSectionState] = useState(footerSection)
  const [constantsType, setConstantsType] = useState(process.env.NEXT_PUBLIC_BASE_DATA_SOURCE || 'file')

  const createContact = async (email: string): Promise<{ success?: string; error?: string }> => {
      const res = await createContactAction(email); // Use function from newsletterSection
      if (res?.success) {
          toast({ title: "Success", description: res.success, variant: "default" });
          return { success: res.success };
      } else if (res?.error) {
          toast({ title: "Error", description: res.error, variant: "destructive" });
          return { error: res.error };
      }
      return {};
  };

  const functionsToUse = {
      createContactAction : createContact
  }

  useEffect(() => {
    if (constantsType === 'cms') {
      updateDataFromStrapiCms()
    }
  }, [constantsType])

  const updateDataFromStrapiCms = async () => {
    const companyDetails = await getCompanyDetails()
    setNavbarSectionState(companyDetails.navbarSection)
    setHeroSectionState(companyDetails.heroSection)
    setAboutSectionState(companyDetails.aboutSection)
    setFeatureSectionState(companyDetails.featureSection)
    setServiceSectionState(companyDetails.serviceSection)
    setProjectSectionState(companyDetails.projectSection)
    setTestimonialSectionState(companyDetails.testimonialSection)
    setTeamSectionState(companyDetails.teamSection)
    setFaqSectionState(companyDetails.faqSection)
    setPricingSectionState(companyDetails.pricingSection)
    setNewsletterSectionState(companyDetails.newsletterSection)
    setFooterSectionState(companyDetails.footerSection)
  }

  const updateDataFromFiles = async () => {
    setNavbarSectionState(navbarSection)
    setHeroSectionState(heroSection)
    setAboutSectionState(aboutSection)
    setFeatureSectionState(featureSection)
    setServiceSectionState(serviceSection)
    setProjectSectionState(projectSection)
    setTestimonialSectionState(testimonialSection)
    setTeamSectionState(teamSection)
    setFaqSectionState(faqSection)
    setPricingSectionState(pricingSection)
    setNewsletterSectionState(newsletterSection)
    setFooterSectionState(footerSection)
  }

  const handleConstantsType = async () => {
      if (constantsType === 'file') {
          await updateDataFromStrapiCms()
          setConstantsType('cms')
      }
      else {
          await updateDataFromFiles()
          setConstantsType('file')
      }
  }


  return (
    <div className="relative">
      <LandingPage
        navbarSection={navbarSectionState}
        heroSection={heroSectionState}
        aboutSection={aboutSectionState}
        featureSection={featureSectionState}
        serviceSection={serviceSectionState}
        projectSection={projectSectionState}
        testimonialSection={testimonialSectionState}
        teamSection={teamSectionState}
        faqSection={faqSectionState}
        pricingSection={pricingSectionState}
        newsletterSection={newsletterSectionState} 
        footerSection={footerSectionState}
        functionsToUse={functionsToUse}
      />
       <div className='fixed bottom-0 left-0 flex items-center justify-center gap-2 p-4'>
          <Switch onClick={handleConstantsType}/>
          <p className='text-xs font-light text-gray-500 ml-2'>{constantsType}</p>
        </div> 
    </div>
  );
}
