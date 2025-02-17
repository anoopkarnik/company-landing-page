import Image from "next/image";
import { Statistics } from "./Statistics";
import { AboutSectionProps } from "@repo/ts-types/landing-page/about";
import { useEffect, useState } from "react";


const About = ({aboutSection}:{aboutSection:AboutSectionProps}) => {
  const [headingArray,setHeadingArray] = useState<string[]>([])
  useEffect(()=>{
      if(aboutSection.heading){
          setHeadingArray(aboutSection.heading.split(" "))
      }
  },[aboutSection.heading])

  return (
    <section
      id="about"
      className="container py-24 sm:py-32 relative"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <Image
            src="/pilot.png"
            alt=""
            width={300}
            height={300}
          />
          <div className="flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-left leading-tight">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  {headingArray.slice(0, Math.ceil(headingArray.length / 2)).join(" ")}
                </span>{" "}
                <span>
                  {headingArray.slice(Math.ceil(headingArray.length / 2)).join(" ")}
                </span>
              </h2>

              <p className="text-xl text-muted-foreground mt-4">
                {aboutSection.companyDetails}
              </p>
            </div>

            <Statistics users={aboutSection.users} subscribers={aboutSection.subscribers} 
            products={aboutSection.products} downloads={aboutSection.downloads} />
          </div>
        </div>
      </div>
            {/* Shadow effect */}
            <div className="shadow left-0"></div>
    </section>
  );
};

export default About;