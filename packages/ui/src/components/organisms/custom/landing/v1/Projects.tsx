"use client"
import { ProjectSectionProps } from "@repo/ts-types/landing-page/projects";
import { useEffect, useState } from "react";
import ProjectCard from "../../../../molecules/custom/v1/ProjectCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../../../../atoms/motion/AnimatedSection";


const Projects = ({projectSection}:{projectSection:ProjectSectionProps}) => {
  const [headingArray,setHeadingArray] = useState<string[]>([])
  useEffect(()=>{
      if(projectSection.heading){
          setHeadingArray(projectSection.heading.split(" "))
      }
  },[projectSection.heading])

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

      <StaggerContainer className="flex flex-wrap gap-4 justify-left">
        {projectSection.projects?.map((project) => (
          <StaggerItem key={project.title}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>

    </section>
  );
};

export default Projects;
