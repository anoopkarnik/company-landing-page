import { FooterComponentProps, FooterProps } from "@repo/ts-types/landing-page/v1";
import { useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const Footer = ({footerList,creator,creatorLink,title,logo,darkLogo}:FooterComponentProps) => {
    const {theme} = useTheme();

    useEffect(()=>{
  
    },[theme,footerList])

    
  return (
    <div id="footer" className="w-full container  ">
        <hr className="w-full mx-auto" />
        <div className="flex container py-10 ">
            <section className="hidden lg:flex w-1/2 ">
                <a
                rel="noreferrer noopener"
                href="/"
                className="flex ml-2 font-bold text-xl items-center gap-2"
                >
                    {theme === "dark" ?
                    <Image src={darkLogo} alt={title} width={30} height={30} /> : 
                    <Image src={logo} alt={title} width={30} height={30} />}
                    {title}
               </a>
            </section>
            <section className="w-full flex flex-wrap items-start justify-between gap-4 mx-2">
                {footerList && Object.keys(footerList).map((footer:string)=>(
                    <div key={footer} className="flex flex-col gap-2">
                        <h3 className="font-bold text-lg">{footer}</h3>
                        {footerList[footer]?.map((item:FooterProps)=>(
                            <div key={item.label}>
                                <a
                                    rel="noreferrer noopener"
                                    href={item.href}
                                    className="opacity-60 hover:opacity-100"
                                >
                                {item.label}
                                </a>

                            </div>
                        ))}
                    </div>
                ))}
            </section>
        </div>


        <section className="container pb-14 text-center">
            <h3>
            &copy; 2024 Made by {" "}
            <a
                rel="noreferrer noopener"
                target="_blank"
                href={creatorLink}
                className="text-primary transition-all border-primary hover:border-b-2"
            >
                {creator}
            </a>
            </h3>
        </section>
    </div>
  );
};

export default Footer;