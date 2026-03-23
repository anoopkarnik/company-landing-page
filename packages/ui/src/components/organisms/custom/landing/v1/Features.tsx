import { FeatureSectionProps } from "@repo/ts-types/landing-page/features";
import { Badge } from "../../../../atoms/shadcn/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../molecules/shadcn/card";
import { useEffect, useState } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../../../../atoms/motion/AnimatedSection";

const Features = ({featureSection}:{featureSection:FeatureSectionProps}) => {
  const [headingArray,setHeadingArray] = useState<string[]>([])
  useEffect(()=>{
      if(featureSection.heading){
          setHeadingArray(featureSection.heading.split(" "))
      }
  },[featureSection.heading])
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
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
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="flex flex-wrap md:justify-center gap-4">
          {featureSection.featureList?.map((feature: any) => (
            <div key={feature.title}>
              <Badge
                variant="secondary"
                className="text-sm"
              >
                {feature.title}
              </Badge>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureSection.featuresWithDescription?.map((feature, index) => (
          <StaggerItem key={feature.title}>
            <Card className={`h-full hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 group ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors duration-200">{feature.title}</CardTitle>
              </CardHeader>

              <CardContent>{feature.description}</CardContent>

              <CardFooter>
                <img
                  src={feature.href}
                  alt="About feature"
                  className="w-[200px] lg:w-[300px] mx-auto"
                />
              </CardFooter>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default Features;
