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
        <div className="w-full flex flex-wrap items-start justify-around gap-4 my-10 ">
            <section className="hidden lg:flex w-1/2 font-cyberdyne">
                <a
                    rel="noreferrer noopener"
                    href="/"
                    className="ml-2 flex items-center gap-2"
                >
                    {theme === "dark" ?
                    <Image src={darkLogo} alt={title} width={40} height={40} /> : 
                    <Image src={logo} alt={title} width={40} height={40} />}
                    <div className="hidden lg:flex flex-col items-start text-md leading-none bg-gradient-to-r from-[#03a3d7] to-[#D247BF] bg-clip-text text-transparent ">
                        <div>{title.split(' ')[0]}</div>
                        <div>{title.split(' ')[1]}</div>
                    </div>
                </a>
            </section>
            {footerList && Object.keys(footerList).map((footer:string)=>(
                <div key={footer} className="flex flex-col gap-2">
                    <h3 className="text-paragraph">{footer}</h3>
                    {footerList[footer]?.map((item:FooterProps)=>(
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