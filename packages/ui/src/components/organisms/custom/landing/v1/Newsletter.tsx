import { useState } from "react";
import { Button } from "../../../../atoms/shadcn/button";
import { Input } from "../../../../atoms/shadcn/input";

export const Newsletter = ({createContactAction,supportEmailAddress}:{createContactAction:any,supportEmailAddress:string}) => {

    const [email, setEmail] = useState<string>("");
  

  return (
    <section id="newsletter">
      <hr className="w-full mx-auto" />

      <div className="container py-24 sm:py-32">
        <h3 className="text-center text-4xl md:text-5xl font-bold">
          Join Our Weekly{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Newsletter
          </span>
        </h3>
        <p className="text-xl text-muted-foreground text-center mt-4 mb-8">
          We send updates on new technologies, tips, and tricks to help you grow your own solopreneur business. We also
            share our journey and the lessons we have learned along the way.
        </p>

        <div
          className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2 "
        >
          <Input
            placeholder={supportEmailAddress}
            aria-label="email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={()=>{createContactAction(email);setEmail('')}}>Subscribe</Button>
      </div>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};