import { Statistics } from "./Statistics";
import { useEffect, useState } from "react";
import { AnimatedSection, StaggerContainer } from "@workspace/ui/components/custom/AnimatedSection";
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Sparkles } from "lucide-react";

const AboutSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfo.queryOptions());
  const aboutSection = data.aboutSection;
  const [headingArray, setHeadingArray] = useState<string[]>([])

  useEffect(() => {
    if (aboutSection.heading) {
      setHeadingArray(aboutSection.heading.split(" "))
    }
  }, [aboutSection.heading])

  return (
    <section
      id="about"
      className="container py-24 sm:py-32 relative"
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#61DAFB]/8 to-[#D247BF]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Section badge */}
      <AnimatedSection>
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Who We Are
          </span>
        </div>
      </AnimatedSection>

      {/* Heading */}
      <AnimatedSection delay={0.1}>
        <h2 className="text-3xl md:text-5xl font-bold leading-tight font-cyberdyne text-center max-w-3xl mx-auto">
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {headingArray.slice(0, Math.ceil(headingArray.length / 2)).join(" ")}
          </span>{" "}
          <span>
            {headingArray.slice(Math.ceil(headingArray.length / 2)).join(" ")}
          </span>
        </h2>
      </AnimatedSection>

      {/* Description card with accent border */}
      <AnimatedSection delay={0.2}>
        <div className="relative max-w-3xl mx-auto mt-10">
          <div className="relative bg-muted/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-10">
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent rounded-full" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed pl-6">
              {aboutSection.companyDetails}
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Statistics */}
      <StaggerContainer className="mt-16" delay={0.3}>
        <Statistics
          users={aboutSection.users}
          subscribers={aboutSection.subscribers}
          products={aboutSection.products}
          downloads={aboutSection.downloads}
        />
      </StaggerContainer>
    </section>
  );
};

export default AboutSection;
