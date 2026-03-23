import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { FooterSectionProps } from "@repo/ts-types/landing-page/footer";
import { AnimatedSection } from "../../../../atoms/motion/AnimatedSection";

const Footer = ({footerSection}:{footerSection:FooterSectionProps}) => {
    const [footerTypes, setFooterTypes] = useState<any>([]);
    const {theme} = useTheme();

    useEffect(()=>{
        const types = footerSection.footerList?.map(footer=>footer.type);
        setFooterTypes(new Set(types));
    },[theme,footerSection.footerList])


  return (
    <div id="footer" className="w-full container">
        {/* Gradient top border */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#61DAFB]/40 to-transparent mb-1" />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D247BF]/30 to-transparent" />

        <AnimatedSection>
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-10">
              <section className="hidden lg:flex col-span-1 font-cyberdyne">
                  <a
                      rel="noreferrer noopener"
                      href="/"
                      className="ml-2 flex items-center gap-2"
                  >
                      {theme === "dark" ?
                      <Image src={footerSection.darkLogo} alt={footerSection.title} width={40} height={40} /> :
                      <Image src={footerSection.logo} alt={footerSection.title} width={40} height={40} />}
                      <div className="hidden lg:flex flex-col items-start text-md leading-none bg-gradient-to-r from-[#03a3d7] to-[#D247BF] bg-clip-text text-transparent ">
                          <div>{footerSection.title?.split(' ')[0]}</div>
                          <div>{footerSection.title?.split(' ')[1]}</div>
                      </div>
                  </a>
              </section>
              {[...footerTypes]?.map((type:string)=>(
                  <div key={type} className="flex flex-col gap-2">
                      <h3 className="text-paragraph font-semibold text-foreground">{type}</h3>
                      {footerSection.footerList?.filter(footer => footer.type===type)?.map((item)=>(
                          <div key={item.label}>
                              <a
                                  rel="noreferrer noopener"
                                  href={item.href}
                                  className="text-muted-foreground hover:text-primary text-description transition-colors duration-200"
                              >
                              {item.label}
                              </a>
                          </div>
                      ))}
                  </div>
              ))}
          </div>
        </AnimatedSection>


        <section className="pb-14 text-center text-paragraph">
            <h3>
            &copy; 2024 Made by {" "}
            <a
                rel="noreferrer noopener"
                target="_blank"
                href={footerSection.creatorLink}
                className="text-primary transition-all border-primary hover:border-b-2"
            >
                {footerSection.creator}
            </a>
            </h3>
        </section>
    </div>
  );
};

export default Footer;
