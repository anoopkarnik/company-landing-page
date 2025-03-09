import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../../molecules/shadcn/card";
import { ServiceSectionProps } from "@repo/ts-types/landing-page/services";

const Services = ({serviceSection}:{serviceSection:ServiceSectionProps}) => {
  const [headingArray,setHeadingArray] = useState<string[]>([])
  useEffect(()=>{
      if(serviceSection.heading){
          setHeadingArray(serviceSection.heading.split(" "))
      }
  },[serviceSection.heading])
  return (
    <section id="services" className="container py-24 sm:py-32 relative">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
        <h2 className="text-3xl md:text-4xl font-bold text-left leading-tight">
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {headingArray.slice(0, Math.ceil(headingArray.length / 2)).join(" ")}
          </span>{" "}
          <span>
            {headingArray.slice(Math.ceil(headingArray.length / 2)).join(" ")}
          </span>
        </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            {serviceSection.description}
          </p>

          <div className="flex flex-col gap-8">
            {serviceSection.services?.map((service) => (
              <Card key={service.title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                 
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {service.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

      </div>
      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};

export default Services;