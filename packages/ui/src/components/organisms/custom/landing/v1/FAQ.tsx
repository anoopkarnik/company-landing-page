import { faqSectionProps } from "@repo/ts-types/landing-page/faq";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../../../../molecules/shadcn/accordion";
import { useEffect, useState } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "../../../../atoms/motion/AnimatedSection";



  const FAQ = ({FAQSection}:{FAQSection:faqSectionProps}) => {

    let href = "https://mail.google.com/mail?view=cm&fs=1&to="+FAQSection.supportEmailAddress+"&su=Support";

    const [headingArray,setHeadingArray] = useState<string[]>([])
    useEffect(()=>{
        if(FAQSection.heading){
            setHeadingArray(FAQSection.heading.split(" "))
        }
    },[FAQSection.heading])

    return (
      <section
        id="faq"
        className="container py-24 sm:py-32"
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
        </AnimatedSection>

        <StaggerContainer className="mt-8">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-3"
          >
            {FAQSection.faqList?.map((faq) => (
              <StaggerItem key={faq.value}>
                <AccordionItem
                  value={faq.value}
                  className="border rounded-lg px-4 data-[state=open]:border-primary/30 data-[state=open]:bg-muted/30 transition-colors duration-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </StaggerItem>
            ))}
          </Accordion>
        </StaggerContainer>

        <AnimatedSection delay={0.3}>
          <h3 className="font-medium mt-6">
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
        </AnimatedSection>
      </section>
    );
  };

  export default FAQ;
