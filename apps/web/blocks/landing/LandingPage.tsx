"use client"
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

const FooterSection = dynamic(() => import('@/components/landing/FooterSection'))
const TestimonialSection = dynamic(() => import('@/components/landing/TestimonialsSection'))
const NewsletterSection = dynamic(() => import('@/components/landing/NewsletterSection'))
const TeamSection = dynamic(() => import('@/components/landing/TeamSection'))
const ProjectsSection = dynamic(() => import('@/components/landing/ProjectsSection'))
const ServicesSection = dynamic(() => import('@/components/landing/ServicesSection'))
const AboutSection = dynamic(() => import('@/components/landing/AboutSection'))
import HeroSection from '@/components/landing/HeroSection'
import { Spotlight } from '@workspace/ui/components/aceternity/spotlight-new'
import React from 'react'
import NavbarSection from '@/components/landing/NavbarSection'

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

const LandingPage = () => {
  return (
    <div className='flex flex-col items-center justify-center relative overflow-x-hidden'>
      <Spotlight />
      <CursorSpotlight />
      <NavbarSection />
      <HeroSection />

      <SectionDivider />
      <div className="w-full bg-muted/30 relative overflow-hidden">
        <DotGridBg />
        <AboutSection />
        <div className="shadow-left" />
      </div>

      <SectionDivider />
      <div className="w-full relative overflow-hidden">
        <ServicesSection />
        <div className="shadow-right" />
      </div>

      <SectionDivider />
      <div className="w-full bg-muted/30 relative overflow-hidden">
        <DotGridBg />
        <ProjectsSection />
        <div className="shadow-left" />
      </div>

      <SectionDivider />
      <div className="w-full relative overflow-hidden">
        <TeamSection />
        <div className="shadow-right" />
      </div>

      <SectionDivider />
      <div className="w-full bg-muted/30 relative overflow-hidden">
        <DotGridBg />
        <TestimonialSection />
        <div className="shadow-left" />
      </div>

      <SectionDivider />
      <div className="w-full relative overflow-hidden">
        <NewsletterSection />
        <div className="shadow-right" />
      </div>

      <div className="w-full relative">
        <FooterSection />
      </div>
    </div>
  )
}

export default LandingPage
