"use client"
import Navbar from '../../../organisms/custom/landing/v1/Navbar';
import Hero from '../../../organisms/custom/landing/v1/Hero';
import Features from '../../../organisms/custom/landing/v1/Features';
import Testimonials from '../../../organisms/custom/landing/v2/Testimonials';
import Pricing from '../../../organisms/custom/landing/v1/Pricing';
import FAQ from '../../../organisms/custom/landing/v1/FAQ';
import Footer from '../../../organisms/custom/landing/v1/Footer';
import { LandingPageProps} from '@repo/ts-types/landing-page/v1';
import { Team } from '../../../organisms/custom/landing/v1/Team';

const LandingPage = ({routeList,githubLink,githubUsername,githubRepositoryName,loginFunction,documentationLink,title,logo,
  darkLogo,tagline,description,featuresWithDescription,featureList,testimonials,pricingList,
  FAQList, footerList, creator, creatorLink, teamList, supportEmailAddress, donateNowLink}: LandingPageProps) => {
    

  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar routeList={routeList} githubLink={githubLink} githubUsername={githubUsername} 
      githubRepositoryName={githubRepositoryName} title={title} logo={logo} darkLogo={darkLogo} donateNowLink={donateNowLink} />
      <Hero loginFunction={loginFunction} documentationLink={documentationLink}
      tagline={tagline} description={description} testimonials={testimonials}
       pricingList={pricingList} teamList={teamList}
       featuresWithDescription={featuresWithDescription} />
      <Features featureList={featureList} featuresWithDescription={featuresWithDescription} />
      <Testimonials testimonials={testimonials} />
      <Team teamList={teamList} />
      <Pricing pricingList={pricingList} supportEmailAddress={supportEmailAddress}/>
      <FAQ FAQList={FAQList} supportEmailAddress={supportEmailAddress}/>
      <Footer footerList={footerList} creator={creator} creatorLink={creatorLink} title={title} logo={logo}
       darkLogo={darkLogo} />


    </div>
  );
};

export default LandingPage