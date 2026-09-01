import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { AnimatedSection } from "@workspace/ui/components/custom/AnimatedSection";
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

const NewsletterSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfo.queryOptions());
  const newsletterSection = data.newsletterSection;

  const [email, setEmail] = useState<string>("");
  const [headingArray, setHeadingArray] = useState<string[]>([])
  useEffect(() => {
    if (newsletterSection.heading) {
      setHeadingArray(newsletterSection.heading.split(" "))
    }
  }, [newsletterSection.heading])


  return (
    <section id="newsletter" className="relative">
      <div className="container py-24 sm:py-32">
        <AnimatedSection>
          <div className="relative rounded-2xl border border-primary/10 bg-gradient-to-br from-muted/50 via-background to-muted/30 p-8 md:p-12 overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-[#61DAFB]/10 to-[#D247BF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-[#D247BF]/10 to-[#61DAFB]/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight font-cyberdyne relative z-10">
              <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                {headingArray.slice(0, Math.ceil(headingArray.length / 2)).join(" ")}
              </span>{" "}
              <span>
                {headingArray.slice(Math.ceil(headingArray.length / 2)).join(" ")}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground text-center mt-4 mb-8 relative z-10">
              {newsletterSection.description}
            </p>

            <div
              className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2 relative z-10"
            >
              <Input
                placeholder={newsletterSection.supportEmailAddress}
                aria-label="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="text-white border-0 hover:opacity-90 hover:shadow-lg hover:shadow-[#03a3d7]/25 transition-all duration-300"
                onClick={() => {
                  // if (createContactAction) {
                  //   createContactAction(email);
                  //   setEmail('');
                  // }
                }}
              >Subscribe</Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default NewsletterSection;
