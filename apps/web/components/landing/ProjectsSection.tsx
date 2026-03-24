"use client"
import { ProjectProps } from "@/lib/ts-types/landing";
import { useEffect, useState } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@workspace/ui/components/custom/AnimatedSection";
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import ProjectCard from "./ProjectCard";

const ProjectsSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfoFromNotion.queryOptions());
  const projectSection = data.projectSection;
  const [headingArray, setHeadingArray] = useState<string[]>([])
  useEffect(() => {
    if (projectSection.heading) {
      setHeadingArray(projectSection.heading.split(" "))
    }
  }, [projectSection.heading])

  return (
    <section
      id="products"
      className="container py-24 sm:py-32 relative"
    >
      <AnimatedSection>
        <h2 className="text-3xl md:text-4xl font-bold text-left leading-tight font-cyberdyne">
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {headingArray.slice(0, Math.ceil(headingArray.length / 2)).join(" ")}
          </span>{" "}
          <span>
            {headingArray.slice(Math.ceil(headingArray.length / 2)).join(" ")}
          </span>
        </h2>
        <p className="text-xl text-muted-foreground pt-4 pb-8 mb-10">
          {projectSection.description}
        </p>
      </AnimatedSection>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectSection.projects?.map((project: ProjectProps, index: number) => (
          <StaggerItem key={`${project.title}-${index}`}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>

    </section>
  );
};

export default ProjectsSection;
