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


const Projects = ({projectsSection}:{projectsSection:ProjectSectionProps}) => {
  const router = useRouter();
  const {theme} = useTheme();
  const [headingArray,setHeadingArray] = useState<string[]>([])
  useEffect(()=>{
      if(projectsSection.heading){
          setHeadingArray(projectsSection.heading.split(" "))
      }
  },[projectsSection.heading])

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
        {projectsSection.description}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {projectsSection.projects?.map((project) => (
          <Card key={project.title} className="flex flex-col relative  ">
            <CardHeader>
              <CardTitle className="text-center text-subtitle">{project.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-4 flex-1">
              <Image
                  src={project.image || ""}
                  alt="About feature"
                  layout="cover"
                  width={400}
                  height={400}
                />
                <div className="text-center">{project.description}</div>
            </CardContent>

            <CardFooter className="absolute left-0 top-[-20px] flex gap-2">
              {project.github && <Image
                src={theme === "dark" ? "/connections/github-dark.png" : "/connections/github.png"}
                alt="GitHub Icon"
                className="cursor-pointer hover:opacity-70 "
                width={40}
                height={40}
                onClick={() => router.push(project.github || "")}
              />}
              {project.demo && <Image
                src={"/globe.svg"}
                alt="GitHub Icon"
                className="cursor-pointer hover:opacity-70 bg-primary-500"
                width={30}
                height={30}
                onClick={() => router.push(project.demo || "")}
              />}
              {project.notion && <Image
                src={"/connections/notion.png"}
                alt="GitHub Icon"
                className="cursor-pointer hover:opacity-70 bg-primary-500"
                width={30}
                height={30}
                onClick={() => router.push(project.notion || "")}
              />}
            </CardFooter>
          </Card>
        ))}
      </div>
                  {/* Shadow effect */}
                  <div className="shadow left-0"></div>
    </section>
  );
};

export default Projects;