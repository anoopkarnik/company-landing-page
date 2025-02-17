import { useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { FooterSectionProps } from "@repo/ts-types/landing-page/footer";

const Footer = ({footerSection}:{footerSection:FooterSectionProps}) => {
    const {theme} = useTheme();

    useEffect(()=>{
  
    },[theme,footerSection.footerList])

    
  return (
    <div id="footer" className="w-full container  ">
        <hr className="w-full mx-auto" />
        <div className="w-full flex flex-wrap items-start justify-around gap-4 my-10 ">
            <section className="hidden lg:flex w-1/2 font-cyberdyne">
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
            {footerSection.footerList && Object.keys(footerSection.footerList)?.map((footer:string)=>(
                <div key={footer} className="flex flex-col gap-2">
                    <h3 className="text-paragraph">{footer}</h3>
                    {footerSection.footerList[footer]?.map((item)=>(
                        <div key={item.label}>
                            <a
                                rel="noreferrer noopener"
                                href={item.href}
                                className="opacity-60 hover:opacity-100 text-description"
                            >
                            {item.label}
                            </a>

                        </div>
                    ))}
                </div>
            ))}
        </div>


        <section className="container pb-14 text-center text-paragraph">
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