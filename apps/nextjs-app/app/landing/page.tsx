"use client"
import LandingPage from "@repo/ui/templates/landing/v1/LandingPage";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";
import { navbarSection} from "../../lib/constants/landing-page/navbar";
import { testimonialsSection } from "../../lib/constants/landing-page/testimonials";
import { projectsSection } from "../../lib/constants/landing-page/projects";
import { footerSection } from "../../lib/constants/landing-page/footer";
import { teamSection } from "../../lib/constants/landing-page/team";
import { servicesSection } from "../../lib/constants/landing-page/services";
import { aboutSection } from "../../lib/constants/landing-page/about";
import { heroSection } from "../../lib/constants/landing-page/hero";
import { newsletterSection } from "../../lib/constants/landing-page/newsletter";
import { FAQSection } from "../../lib/constants/landing-page/faq";
import { pricingSection } from "../../lib/constants/landing-page/pricing";
import { featureSection } from "../../lib/constants/landing-page/features";

export default function Landing() {

  const {toast} = useToast();

  const createContact = async (email: string): Promise<{ success?: string; error?: string }> => {
      const res = await newsletterSection.createContactAction?.(email); // Use function from newsletterSection
      if (res?.success) {
          toast({ title: "Success", description: res.success, variant: "default" });
          return { success: res.success };
      } else if (res?.error) {
          toast({ title: "Error", description: res.error, variant: "destructive" });
          return { error: res.error };
      }
      return {};
  };

  return (
    <div>
      <LandingPage
        navbarSection={navbarSection}
        heroSection={heroSection}
        aboutSection={aboutSection}
        featureSection={featureSection}
        servicesSection={servicesSection}
        projectsSection={projectsSection}
        testimonialsSection={testimonialsSection}
        teamSection={teamSection}
        FAQSection={FAQSection}
        pricingSection={pricingSection}
        newsletterSection={{ ...newsletterSection, createContactAction: createContact }} 
        footerSection={footerSection}
      />
    </div>
  );
}
