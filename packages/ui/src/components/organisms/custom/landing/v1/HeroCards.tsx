import { Avatar, AvatarFallback, AvatarImage } from "../../../../atoms/shadcn/avatar";
import { Badge } from "../../../../atoms/shadcn/badge";
import { Button, buttonVariants } from "../../../../atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../../molecules/shadcn/card";
import { Check} from "lucide-react";
import { LightbulbIcon } from "lucide-react";
import { HeroCardsProps } from "@repo/ts-types/landing-page/v1";

const HeroCards = ({testimonials,pricingList,teamList,featuresWithDescription}:HeroCardsProps) => {
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

      {/* Pricing */}

      <Card className="absolute top-[180px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricingList[0]?.title}
                  <Badge
                    variant="secondary"
                    className="text-sm text-primary"
                  >
                    Most popular
                  </Badge>
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">{pricingList[0]?.price}</span>
                <span className="text-muted-foreground"> {pricingList[0]?.priceType}</span>
              </div>

              <CardDescription>{pricingList[0]?.description}</CardDescription>
            </CardHeader>

        <CardContent>
          <Button className="w-full">{pricingList[0]?.buttonText}</Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {pricingList[0]?.benefitList.filter((_, index) => index >= 0 && index <= 2).map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Feature*/}
      <Card className="absolute w-[350px] -right-[10px] top-[250px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightbulbIcon />
          </div>
          <div>
            <CardTitle>{featuresWithDescription[1]?.title}</CardTitle>
            <CardDescription className="text-md mt-2 ">
              {featuresWithDescription[1]?.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default HeroCards;