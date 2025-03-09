"use client"
import LandingPage from "@repo/ui/templates/landing/v1/LandingPage";
import LoadingPage from "@repo/ui/templates/landing/v1/LoadingPage";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import { createContactAction } from "../_actions/email";

import { useGlobalData } from "../../context/DataContext";

export default function Landing() {

  const {toast} = useToast();
  const data = useGlobalData();
  

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

  if (data.isLoading) {
    return (
      <LoadingPage />
    );
  }


  return (
    <div className="relative">
      <LandingPage
        navbarSection={data.navbarSectionState}
        heroSection={data.heroSectionState}
        aboutSection={data.aboutSectionState}
        featureSection={data.featureSectionState}
        serviceSection={data.serviceSectionState}
        projectSection={data.projectSectionState}
        testimonialSection={data.testimonialSectionState}
        teamSection={data.teamSectionState}
        faqSection={data.faqSectionState}
        pricingSection={data.pricingSectionState}
        newsletterSection={data.newsletterSectionState} 
        footerSection={data.footerSectionState}
        functionsToUse={functionsToUse}
      />
      
    </div>
  );
}
