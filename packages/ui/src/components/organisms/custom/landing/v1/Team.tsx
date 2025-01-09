import { buttonVariants } from "../../../../atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../molecules/shadcn/card";
import { Facebook, Github, Globe, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { TeamProps, SociaNetworkslProps } from "@repo/ts-types/landing-page/v1";


export const Team = ({teamList}:{teamList:TeamProps[]}) => {
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
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Our Dedicated{" "}
        </span>
        Crew
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        Some of the best people in the industry are working with us, as we are the only ones in the industry of spontaneous product development.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
        {teamList.map(
          ({ imageUrl, name, position, description,socialNetworks }: TeamProps) => (
            <Card
              key={name}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <img
                  src={imageUrl}
                  alt={`${name} ${position}`}
                  className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{name}</CardTitle>
                <CardDescription className="text-primary">
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p>{description}</p>
              </CardContent>

              <CardFooter className="flex flex-wrap items-center justify-center mx-4">
                {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                  <div key={name}>
                    <a
                      rel="noreferrer noopener"
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{name} icon</span>
                      {socialIcon(name)}
                    </a>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};