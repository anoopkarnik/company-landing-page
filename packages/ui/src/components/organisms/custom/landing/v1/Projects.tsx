"use client"
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../molecules/shadcn/card";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../../../providers/theme-provider";
import { ProjectSectionProps } from "@repo/ts-types/landing-page/projects";
import { useEffect, useState } from "react";
import { useDeviceType } from "../../../../../hooks/use-device";
import ProjectCard from "../../../../molecules/custom/v1/ProjectCard";


const Projects = ({projectSection}:{projectSection:ProjectSectionProps}) => {
  const router = useRouter();
  const {theme} = useTheme();
  const [headingArray,setHeadingArray] = useState<string[]>([])
  useEffect(()=>{
      if(projectSection.heading){
          setHeadingArray(projectSection.heading.split(" "))
      }
  },[projectSection.heading])

  const device = useDeviceType()

  return (
    <section
      id="products"
      className="container py-24 sm:py-32 relative"
    >
    <h2 className="text-3xl md:text-4xl font-bold text-left leading-tight">
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

      <div className="flex flex-wrap gap-4 justify-left">
        {projectSection.projects?.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

    </section>
  );
};

export default Projects;