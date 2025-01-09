import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../../../../molecules/shadcn/accordion";
  import { FAQProps } from "@repo/ts-types/landing-page/v1";


  
  const FAQ = ({FAQList,supportEmailAddress}: {FAQList: FAQProps[],supportEmailAddress:string}) => {

    let href = "https://mail.google.com/mail?view=cm&fs=1&to="+supportEmailAddress+"&su=Support";

    return (
      <section
        id="faq"
        className="container py-24 sm:py-32"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Questions
          </span>
        </h2>
  
        <Accordion
          type="single"
          collapsible
          className="w-full AccordionRoot"
        >
          {FAQList.map(({ question, answer, value }: FAQProps) => (
            <AccordionItem
              key={value}
              value={value}
            >
              <AccordionTrigger className="text-left">
                {question}
              </AccordionTrigger>
  
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
  
        <h3 className="font-medium mt-4">
          Still have questions?{" "}
          <a
            rel="noreferrer noopener"
            href={href}
            target="_blank"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Contact us
          </a>
        </h3>
      </section>
    );
  };

  export default FAQ;