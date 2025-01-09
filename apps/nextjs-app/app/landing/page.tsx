"use client"
import LandingPage from "@repo/ui/templates/landing/v1/LandingPage";
import { routeList,featuresWithDescription,featureList, testimonials, 
  pricingList, FAQList, footerList, teamList} from "../../lib/constants/landing-page";
import { useRouter } from "next/navigation";
import { creator, creatorLink, darkLogo, description, donateNowLink, githubLink, githubRepositoryName, githubUsername, loginPath, logo, supportEmailAddress, tagline, title } from "../../lib/constants/appDetails";

export default function Landing() {
  const documentationLink = process.env.NEXT_PUBLIC_DOCUMENTATION_URL as string;
  const router = useRouter()

  
  const  loginFunction = () => {
      router.push(loginPath)
  }

  return (
    <div>
      <LandingPage
        donateNowLink={donateNowLink}
        routeList={routeList} 
        githubLink={githubLink}
        githubUsername={githubUsername}
        githubRepositoryName={githubRepositoryName}
        documentationLink={documentationLink}
        title={title}
        logo={logo}
        darkLogo={darkLogo}
        loginFunction={loginFunction}
        tagline={tagline}
        description={description}
        featuresWithDescription={featuresWithDescription}
        featureList={featureList}
        testimonials={testimonials}
        pricingList={pricingList}
        FAQList={FAQList}
        footerList={footerList}
        creator={creator}
        creatorLink={creatorLink}
        teamList={teamList}
        supportEmailAddress={supportEmailAddress}
      />
    </div>
  );
}
