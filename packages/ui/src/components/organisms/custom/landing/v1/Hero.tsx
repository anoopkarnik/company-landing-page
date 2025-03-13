import { ExternalLink, BookIcon } from "lucide-react";
import { Button, buttonVariants } from "../../../../atoms/shadcn/button";
import HeroCards  from "./HeroCards";
import { useEffect, useState } from "react";
import { HeroSectionProps } from "@repo/ts-types/landing-page/hero";
import { ServiceProps } from "@repo/ts-types/landing-page/services";
import { TestimonialProps } from "@repo/ts-types/landing-page/testimonials";
import { ProjectProps } from "@repo/ts-types/landing-page/projects";
import { TeamProps } from "@repo/ts-types/landing-page/team";
import { useRouter } from "next/navigation";


const Hero = ({heroSection,services,testimonials,projects,teamList}:{
  heroSection:HeroSectionProps ,services:ServiceProps[] | undefined,testimonials:TestimonialProps[] | undefined,
  projects:ProjectProps[] | undefined, teamList:TeamProps[]  | undefined}) => {
    const [taglineArray,setTaglineArray] = useState<string[]>([])
    const router = useRouter()
    useEffect(()=>{
        if(heroSection.tagline){
            setTaglineArray(heroSection.tagline.split(" "))
        }
    },[heroSection.tagline])
  return (
    <section className="container grid xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
      <main className="text-5xl md:text-6xl text-left leading-tight">
        <h1 className="inline-block">
          <span className="bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
            {taglineArray.slice(0, Math.ceil(taglineArray.length / 3)).join(" ")}
          </span>{" "}
          <span>
            {taglineArray
              .slice(Math.ceil(taglineArray.length / 3), Math.ceil((2 * taglineArray.length) / 3))
              .join(" ")}
          </span>{" "}
          <span className="bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
            {taglineArray.slice(Math.ceil((2 * taglineArray.length) / 3)).join(" ")}
          </span>
        </h1>
      </main>


        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          {heroSection.description}
        </p>

        <div className="flex items-center space-y-4 md:space-y-0 md:space-x-4">
        {heroSection.documentationLink && <div>
            <Button
            className="flex items-center gap-2"
              variant="outline"
              onClick={() => heroSection.documentationLink && router.push(heroSection.documentationLink)}
            ><BookIcon size={20} /> Documentation
            </Button>
            </div>}
            { heroSection.blogLink &&           
            <Button
             className="flex items-center gap-2"
              variant="outline"
              onClick={() => heroSection.blogLink && router.push(heroSection.blogLink)}
            > <BookIcon size={20} />
            Read the Blogs
            </Button>}
            
          {heroSection.appointmentLink && <a
            rel="noreferrer noopener"
            href={heroSection.appointmentLink}
            target="_blank"
            className={`w-full md:w-1/3 text-lg flex items-center gap-1 ${buttonVariants({
              variant: "default",
            })}`}
          >
            <div>Book an Appointment</div>
            <ExternalLink size={16}/>
          </a>}

        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards testimonials={testimonials} teamList={teamList} 
        services={services} projects={projects}/>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};

export default Hero;