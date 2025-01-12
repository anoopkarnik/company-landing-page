import { ServiceProps } from "@repo/ts-types/landing-page/v1";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../../molecules/shadcn/card";




export const Services = ({services}:{services:ServiceProps[]}) => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            These are some of the services that I offer to my clients. I am always looking to improve and add more services
          </p>

          <div className="flex flex-col gap-8">
            {services.map((service) => (
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
    </section>
  );
};