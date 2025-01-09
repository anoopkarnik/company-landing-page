import { BookOpenIcon } from "lucide-react";
import { Button } from "../../../../atoms/shadcn/button";
import { buttonVariants } from "../../../../atoms/shadcn/button";
import HeroCards  from "./HeroCards";
import { useEffect, useState } from "react";
import { HeroProps } from "@repo/ts-types/landing-page/v1";

const Hero = ({loginFunction,documentationLink,tagline,description,testimonials,
    pricingList,teamList,featuresWithDescription}: HeroProps) => {
    const [taglineArray,setTaglineArray] = useState<string[]>([])
    useEffect(()=>{
        if(tagline){
            setTaglineArray(tagline.split(" "))
        }
    },[tagline])
  return (
    <section className="container grid xl:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              {taglineArray[0]}
            </span>{" "}
            {taglineArray.slice(1,2)}{" "}
            {taglineArray.slice(2,3)}
          </h1>{" "}
          {taglineArray[3]}{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              {taglineArray[4]}
            </span>{" "}
            {taglineArray.slice(5,)}
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          {description}
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
            
          <Button onClick={loginFunction} className="w-full md:w-1/3">Get Started</Button>

          <a
            rel="noreferrer noopener"
            href={documentationLink}
            target="_blank"
            className={`w-full md:w-1/3 text-lg ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Documentation
            <BookOpenIcon className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards testimonials={testimonials} pricingList={pricingList}
         teamList={teamList} featuresWithDescription={featuresWithDescription}/>
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};

export default Hero;