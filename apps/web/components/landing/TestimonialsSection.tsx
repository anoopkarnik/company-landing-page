"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/shadcn/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { AnimatedSection } from "@workspace/ui/components/custom/AnimatedSection";
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

const TestimonialsSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfo.queryOptions());
  const testimonialSection = data.testimonialSection;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const [headingArray, setHeadingArray] = useState<string[]>([])
  useEffect(() => {
    if (testimonialSection.heading) {
      setHeadingArray(testimonialSection.heading.split(" "))
    }
  }, [testimonialSection.heading])

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);
  }, [api, current]);

  return (
    <section
      id="testimonials"
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

        <p className="text-xl text-muted-foreground pt-4 pb-8">
          {testimonialSection.description}
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {testimonialSection.testimonials?.map((testimonial: any) => (
              <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={testimonial.name}>
                <div className="bg-muted rounded-md p-6 min-h-[200px] border-l-2 border-primary/30 hover:border-primary/60 hover:shadow-md transition-all duration-300 relative">
                  {/* Decorative quote mark */}
                  <span className="absolute top-3 right-4 text-4xl text-primary/10 font-serif leading-none select-none">&ldquo;</span>
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col">
                      <h3 className="text-emphasized tracking-tight pr-6">
                        {testimonial.comment}
                      </h3>
                    </div>
                    <p className="flex flex-row gap-2 text-sm items-center mt-4 pt-3 border-t border-border/50">
                      <span className="text-muted-foreground">By</span>{" "}
                      <Avatar className="h-6 w-6 overflow-hidden ring-2 ring-primary/20">
                        <AvatarImage src={testimonial.image} className="h-full w-full object-contain" />
                        <AvatarFallback className="text-xs">{testimonial.userName.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{testimonial.name}</span>
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </AnimatedSection>
    </section>
  );
};

export default TestimonialsSection;
