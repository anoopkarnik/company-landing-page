import { BenefitProps, PricingProps } from "@repo/ts-types/landing-page/pricing";
import { Badge } from "../../../atoms/shadcn/badge";
import { Button } from "../../../atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../molecules/shadcn/card";
import { Check } from "lucide-react";
enum PopularPlanType {
    NO = 0,
    YES = 1,
  }


const PricingItem = ({pricing}:{pricing:PricingProps}) => {
    const isExternal = pricing.buttonText.includes("https");

  return (
    <div className={`relative group ${pricing.popular === PopularPlanType.YES ? 'p-[2px] rounded-xl bg-gradient-to-r from-[#61DAFB] via-[#D247BF] to-[#03a3d7]' : ''}`}>
      <Card
          key={pricing.title}
          className={`h-full hover:-translate-y-1 transition-all duration-300 ${
              pricing.popular === PopularPlanType.YES
              ? "shadow-xl shadow-primary/10 dark:shadow-primary/20 rounded-[10px]"
              : "hover:shadow-lg dark:hover:shadow-primary/5"
          }`}
          >
              <CardHeader>
                <CardTitle className="flex item-center justify-between">
                  {pricing.title}
                  {pricing.popular === PopularPlanType.YES ? (
                    <Badge
                      variant="secondary"
                      className="text-sm text-primary"
                    >
                      Most popular
                    </Badge>
                  ) : null}
                </CardTitle>
                <div>
                  <span className="text-3xl font-bold">{pricing.price}</span>
                  <span className="text-muted-foreground"> {pricing.priceType}</span>
                </div>

                <CardDescription>{pricing.description}</CardDescription>
              </CardHeader>

              <CardContent>
                  <a href={pricing.href || "#"} target="_blank" rel="noreferrer noopener" aria-label="External link">
                    <Button className={`w-full ${pricing.popular === PopularPlanType.YES ? 'bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-white border-0 hover:opacity-90 hover:shadow-lg hover:shadow-[#03a3d7]/25 transition-all duration-300' : ''}`}>
                      {pricing.buttonText}
                    </Button>
                  </a>
              </CardContent>

              <hr className="w-4/5 m-auto mb-4" />

              <CardFooter className="flex">
                <div className="space-y-4">
                  {pricing.benefitList?.map((benefit: BenefitProps) => (
                    <span
                      key={benefit.title}
                      className="flex"
                    >
                      <Check className="text-green-500" />{" "}
                      <h3 className="ml-2">{benefit.title}</h3>
                    </span>
                  ))}
                </div>
              </CardFooter>
          </Card>
    </div>
  )
}

export default PricingItem
