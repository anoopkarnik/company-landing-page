import Image from "next/image";
import { Statistics } from "./Statistics";
import { AboutProps } from "@repo/ts-types/landing-page/v1";


export const About = ({companyDetails, users, subscribers, downloads, products}:AboutProps) => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <Image
            src="/pilot.png"
            alt=""
            width={300}
            height={300}
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Company
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                {companyDetails}
              </p>
            </div>

            <Statistics users={users} subscribers={subscribers} products={products} downloads={downloads} />
          </div>
        </div>
      </div>
    </section>
  );
};