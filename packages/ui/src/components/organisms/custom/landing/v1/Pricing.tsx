import { PricingProps } from "@repo/ts-types/landing-page/v1";
import PricingItem from "../../../../molecules/custom/v1/PricingItem";


const Pricing = ({pricingList,supportEmailAddress}: {pricingList: PricingProps[],supportEmailAddress:string}) => {
  let href = "https://mail.google.com/mail?view=cm&fs=1&to="+supportEmailAddress+"&su=Support";
  return (
    <section
      id="pricing"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Get
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Premium{" "}
        </span>
        Access
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        It's all available for free. You can contact us for any customized solution based on this boilerplate code, you want to implement.
        You can also show your support by giving us a star on Github or donating to our project.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <PricingItem key={pricing.title} pricing={pricing} />
        ))}
      </div>
    </section>
  );
};

export default Pricing;