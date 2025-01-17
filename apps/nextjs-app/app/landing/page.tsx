"use client"
import LandingPage from "@repo/ui/templates/landing/v1/LandingPage";
import { routeList,testimonials, footerList, teamList, projects, services} from "../../lib/constants/landing-page";
import { appointmentLink, companyDetails, creator, creatorLink, darkLogo, description, donateNowLink, downloads,
   githubLink, githubRepositoryName, githubUsername, logo, products, subscribers, supportEmailAddress, tagline,
    title, users } from "../../lib/constants/appDetails";
import { createContactAction } from "../_actions/email";
import { useToast } from "../../../../packages/ui/src/hooks/use-toast";

export default function Landing() {

  const {toast} = useToast();
  const createContact = async (email: string) => {
    const res = await createContactAction(email);
    if (res.success){
      toast({title: "Success", description: res?.success, variant: 'default'})
    }
    else if (res.error){
        toast({title: "Error", description: res?.error, variant: 'destructive'})
    }
  }

  return (
    <div>
      <LandingPage
        donateNowLink={donateNowLink}
        routeList={routeList} 
        githubLink={githubLink}
        githubUsername={githubUsername}
        githubRepositoryName={githubRepositoryName}
        appointmentLink={appointmentLink}
        title={title}
        logo={logo}
        darkLogo={darkLogo}
        tagline={tagline}
        description={description}
        testimonials={testimonials}
        projectsList={projects}
        footerList={footerList}
        creator={creator}
        creatorLink={creatorLink}
        teamList={teamList}
        supportEmailAddress={supportEmailAddress}
        companyDetails={companyDetails}
        users={users}
        subscribers={subscribers}
        products={products}
        downloads={downloads}
        services={services}
        createContactAction={createContact}
      />
    </div>
  );
}
