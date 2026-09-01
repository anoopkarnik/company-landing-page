import { TeamProps, SociaNetworksProps } from "@/lib/ts-types/landing";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";
import { Facebook, Github, Globe, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@workspace/ui/components/custom/AnimatedSection";
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

const TeamSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfo.queryOptions());
  const teamSection = data.teamSection;
  const [headingArray, setHeadingArray] = useState<string[]>([])
  useEffect(() => {
    if (teamSection.heading) {
      setHeadingArray(teamSection.heading.split(" "))
    }
  }, [teamSection.heading])
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;
      case "Facebook":
        return <Facebook size="20" />;
      case "Instagram":
        return <Instagram size="20" />;
      case "Twitter":
        return <Twitter size="20" />;
      case "Github":
        return <Github size="20" />;
      case "Youtube":
        return <Youtube size="20" />;
      case "Website":
        return <Globe size="20" />;
    }
  };

  return (
    <section
      id="team"
      className="container py-24 sm:py-32 space-y-8 relative"
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

        <p className="mt-4 mb-10 text-xl text-muted-foreground">
          {teamSection.description}
        </p>
      </AnimatedSection>

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamSection.teamList?.map(
          (team: TeamProps, index: number) => (
            <StaggerItem key={`${team.name}-${index}`}>
              <Card
                className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-primary/10 transition-all duration-300 group"
              >
                <CardHeader className="mt-8 !flex flex-col justify-center items-center pb-2 w-full">
                  <Image
                    src={team.imageUrl}
                    alt={`${team.name} ${team.position}`}
                    width={96}
                    height={96}
                    unoptimized
                    className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover ring-4 ring-transparent group-hover:ring-primary/20 transition-all duration-300"
                  />
                  <CardTitle className="text-center text-lg font-bold ">{team.name}</CardTitle>
                  <CardDescription className="text-primary font-medium text-sm">
                    {team.position}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <p>{team.description}</p>
                </CardContent>

                <CardFooter className="flex items-center justify-center gap-2">
                  {team.socialNetworks?.map((socialNetwork: SociaNetworksProps, idx: number) => (
                    <a
                      key={`${socialNetwork.name}-${idx}`}
                      rel="noreferrer noopener"
                      href={socialNetwork.url}
                      target="_blank"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                    >
                      <span className="sr-only">{socialNetwork.name} icon</span>
                      {socialIcon(socialNetwork.name)}
                    </a>
                  ))}
                </CardFooter>
              </Card>
            </StaggerItem>
          )
        )}
      </StaggerContainer>
      {/* Shadow effect */}
      <div className="shadow left-0"></div>
    </section>
  );
};

export default TeamSection;
