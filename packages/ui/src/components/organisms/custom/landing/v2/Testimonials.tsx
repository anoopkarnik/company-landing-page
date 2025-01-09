"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../../../../molecules/shadcn/carousel";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../atoms/shadcn/avatar";
import { TestimonialProps } from "@repo/ts-types/landing-page/v1";

const Testimonials = ({testimonials}: {testimonials: TestimonialProps[]}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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
    <div className="w-full  py-24 sm:py-32 space-y-8">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
        <div>
            <h2 className="text-3xl md:text-4xl font-bold">
                Discover Why
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                {" "}
                People Love{" "}
                </span>
                This Micro SaaS Boilerplate Code
            </h2>
            <p className="text-xl text-muted-foreground pt-4 pb-8">
                Tweets from our happy users who have used our product and loved it.
            </p>
        </div>

          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
                {testimonials.map((testimonial: TestimonialProps) => (
                    <CarouselItem className="lg:basis-1/4" key={testimonial.name}>
                    <div className="bg-muted rounded-md p-6 min-h-[200px] ">
                        <div className="flex flex-col justify-between ">
                            <div className="flex flex-col">
                                <h3 className="text-exmphasis tracking-tight">
                                {testimonial.comment}
                                </h3>
                            </div>
                            <p className="flex flex-row gap-2 text-sm items-center">
                                <span className="text-muted-foreground">By</span>{" "}
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={testimonial.image} />
                                        <AvatarFallback>{testimonial.userName}</AvatarFallback>
                                    </Avatar>
                                <span>{testimonial.name}</span>
                            </p>
                        </div>
                    </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;