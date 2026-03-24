import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/shadcn/card";
import { ServiceProps } from "@/lib/ts-types/landing";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@workspace/ui/components/custom/AnimatedSection";
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

const ServicesSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfoFromNotion.queryOptions());
  const serviceSection = data.serviceSection;
  const [headingArray, setHeadingArray] = useState<string[]>([])
  useEffect(() => {
    if (serviceSection.heading) {
      setHeadingArray(serviceSection.heading.split(" "))
    }
  }, [serviceSection.heading])
  return (
    <section id="services" className="container py-24 sm:py-32 relative">
      <AnimatedSection>
        <h2 className="text-3xl md:text-4xl font-bold text-left leading-tight font-cyberdyne">
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {headingArray.slice(0, Math.ceil(headingArray.length / 2)).join(" ")}
          </span>{" "}
          <span>
            {headingArray.slice(Math.ceil(headingArray.length / 2)).join(" ")}
          </span>
        </h2>

        <p className="text-muted-foreground text-xl mt-4 mb-8">
          {serviceSection.description}
        </p>
      </AnimatedSection>

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {serviceSection.services?.map((service: ServiceProps, index: number) => (
          <StaggerItem key={`${service.title}-${index}`}>
            <Card className="h-full hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 dark:hover:shadow-primary/5 transition-all duration-300 group py-4">
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-md leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default ServicesSection;
