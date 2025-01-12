import { Avatar, AvatarFallback, AvatarImage } from "../../../../atoms/shadcn/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../../molecules/shadcn/card";
import { LightbulbIcon } from "lucide-react";
import { HeroCardsProps } from "@repo/ts-types/landing-page/v1";

const HeroCards = ({testimonials,teamList,services,projects}:HeroCardsProps) => {
  return (
    <div className="hidden xl:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src={testimonials?.[0]?.image}
            />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">{testimonials?.[0]?.name}</CardTitle>
            <CardDescription>{testimonials?.[0]?.userName}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>{testimonials?.[0]?.comment}</CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src={teamList?.[0]?.imageUrl}
            alt="user avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">{teamList?.[0]?.name}</CardTitle>
          <CardDescription className="font-normal text-primary">
            {teamList?.[0]?.position}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center pb-2">
          <p>
            {teamList?.[0]?.description}
          </p>
        </CardContent>
      </Card>

      {/* Services */}

      {services && <Card className="absolute top-[180px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {services[0]?.title}
              </CardTitle>

              <CardDescription>{services[0]?.description}</CardDescription>
            </CardHeader>
      </Card>}

      {/* Projects*/}
      {projects && <Card className="absolute w-[350px] -right-[10px] top-[250px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightbulbIcon />
          </div>
          <div>
            <CardTitle>{projects[0]?.title}</CardTitle>
            <CardDescription className="text-md mt-2 ">
              {projects[0]?.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>}
    </div>
  );
};

export default HeroCards;