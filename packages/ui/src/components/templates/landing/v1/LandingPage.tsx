"use client"
import Navbar from '../../../organisms/custom/landing/v1/Navbar';
import Hero from '../../../organisms/custom/landing/v1/Hero';
import Testimonials from '../../../organisms/custom/landing/v2/Testimonials';
import Footer from '../../../organisms/custom/landing/v1/Footer';
import Team  from '../../../organisms/custom/landing/v1/Team';
import Projects from '../../../organisms/custom/landing/v1/Projects';
import Services from '../../../organisms/custom/landing/v1/Services';
import Newsletter from '../../../organisms/custom/landing/v1/Newsletter';
import About from '../../../organisms/custom/landing/v1/About';
import { LandingPageProps } from '@repo/ts-types/landing-page/landing-page';
import FAQ from '../../../organisms/custom/landing/v1/FAQ';
import Pricing from '../../../organisms/custom/landing/v1/Pricing';
import Features from '../../../organisms/custom/landing/v1/Features';

const LandingPage = ({navbarSection,heroSection,aboutSection,serviceSection,featureSection,testimonialSection,
  projectSection,teamSection,faqSection,newsletterSection,pricingSection,footerSection,functionsToUse
 }: LandingPageProps) => {
    

  return (
    <div className='flex flex-col items-center justify-center'>
      <Navbar navbarSection={navbarSection} />
      <Hero heroSection={heroSection} services={serviceSection?.services} testimonials={testimonialSection?.testimonials} 
      teamList={teamSection?.teamList} projects={projectSection?.projects}/>
      {aboutSection && <About aboutSection={aboutSection} />}
      {featureSection  && (featureSection.featureList.length>0 || featureSection.featuresWithDescription.length>0) && 
       <Features featureSection={featureSection} />}
      {serviceSection && <Services serviceSection={serviceSection} />}
      {projectSection && <Projects projectSection={projectSection} />}
      {testimonialSection && <Testimonials testimonialSection={testimonialSection}/>}
      {teamSection && teamSection.teamList.length>0 &&<Team teamSection={teamSection} />}
      {newsletterSection && <Newsletter newsletterSection={newsletterSection} createContactAction={functionsToUse?.createContactAction}/>}
      {pricingSection && pricingSection.pricingList.length>0 && <Pricing pricingSection={pricingSection}/>}

      {faqSection && faqSection.faqList.length>0 && <FAQ FAQSection={faqSection}/>} 
      {footerSection &&  <Footer footerSection={footerSection}/>}
    </div>
  );
};

export default LandingPage