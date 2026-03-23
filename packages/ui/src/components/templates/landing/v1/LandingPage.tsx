"use client"
import { useEffect, useRef, lazy, Suspense } from 'react';
import Hero from '../../../organisms/custom/landing/v1/Hero';
import { LandingPageProps } from '@repo/ts-types/landing-page/landing-page';

// Lazy load below-the-fold sections
const About = lazy(() => import('../../../organisms/custom/landing/v1/About'));
const Features = lazy(() => import('../../../organisms/custom/landing/v1/Features'));
const Services = lazy(() => import('../../../organisms/custom/landing/v1/Services'));
const Projects = lazy(() => import('../../../organisms/custom/landing/v1/Projects'));
const Testimonials = lazy(() => import('../../../organisms/custom/landing/v2/Testimonials'));
const Team = lazy(() => import('../../../organisms/custom/landing/v1/Team'));
const Newsletter = lazy(() => import('../../../organisms/custom/landing/v1/Newsletter'));
const Pricing = lazy(() => import('../../../organisms/custom/landing/v1/Pricing'));
const FAQ = lazy(() => import('../../../organisms/custom/landing/v1/FAQ'));
const Footer = lazy(() => import('../../../organisms/custom/landing/v1/Footer'));
const BackToTopLazy = lazy(() => import('./BackToTop'));

const SectionDivider = () => (
  <div className="w-full flex justify-center py-2">
    <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
  </div>
);

const DotGridBg = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.04) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }}
  />
);

const CursorSpotlight = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${e.clientX}px`;
        spotlightRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div ref={spotlightRef} className="cursor-spotlight hidden lg:block" />;
};

const LandingPage = ({heroSection,aboutSection,serviceSection,featureSection,testimonialSection,
  projectSection,teamSection,faqSection,newsletterSection,pricingSection,footerSection,functionsToUse
 }: LandingPageProps) => {


  return (
    <div className='flex flex-col items-center justify-center overflow-x-hidden'>
      <CursorSpotlight />
      <Hero heroSection={heroSection} />

      <Suspense>
        {aboutSection && <>
          <SectionDivider />
          <div className="w-full bg-muted/30 relative">
            <DotGridBg />
            <About aboutSection={aboutSection} />
          </div>
        </>}

        {featureSection && (featureSection.featureList.length>0 || featureSection.featuresWithDescription.length>0) && <>
          <SectionDivider />
          <div className="w-full relative">
            <Features featureSection={featureSection} />
          </div>
        </>}

        {serviceSection && <>
          <SectionDivider />
          <div className="w-full bg-muted/30 relative">
            <DotGridBg />
            <Services serviceSection={serviceSection} />
          </div>
        </>}

        {projectSection && <>
          <SectionDivider />
          <div className="w-full relative">
            <Projects projectSection={projectSection} />
          </div>
        </>}

        {testimonialSection && <>
          <SectionDivider />
          <div className="w-full bg-muted/30 relative">
            <DotGridBg />
            <Testimonials testimonialSection={testimonialSection}/>
          </div>
        </>}

        {teamSection && teamSection.teamList.length>0 && <>
          <SectionDivider />
          <div className="w-full relative">
            <Team teamSection={teamSection} />
          </div>
        </>}

        {newsletterSection && <>
          <SectionDivider />
          <div className="w-full relative">
            <Newsletter newsletterSection={newsletterSection} createContactAction={functionsToUse?.createContactAction}/>
          </div>
        </>}

        {pricingSection && pricingSection.pricingList.length>0 && <>
          <SectionDivider />
          <div className="w-full bg-muted/30 relative">
            <DotGridBg />
            <Pricing pricingSection={pricingSection}/>
          </div>
        </>}

        {faqSection && faqSection.faqList.length>0 && <>
          <SectionDivider />
          <div className="w-full relative">
            <FAQ FAQSection={faqSection}/>
          </div>
        </>}

        {footerSection && <>
          <div className="w-full relative">
            <Footer footerSection={footerSection}/>
          </div>
        </>}

        <BackToTopLazy />
      </Suspense>
    </div>
  );
};

export default LandingPage
