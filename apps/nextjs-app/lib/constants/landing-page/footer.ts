import { FooterListProps, FooterSectionProps } from "@repo/ts-types/landing-page/footer";
import { creator, creatorLink, title, logo, darkLogo } from "../appDetails";

export const footerList: FooterListProps = {
    "Follow Us": [
        {
            label: "Twitter",
            href: "https://x.com/anooplegend1992"
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/anoopkarnik/"
        },
        {
            label: "Github",
            href: "https://github.com/anoopkarnik"
        },
        {
            label: "Youtube",
            href: "https://youtube.com/@bayesianlabs"
        },
        {
            label: "Discord",
            href: "https://discord.gg/ephjwba9"
        }
    ],
    "Legal": [
        {
            label: "Cancellation/Refund Policies",
            href: "/landing/cancellation-refund-policies"
        },
        {
            label: "Terms & Conditions",
            href: "/landing/terms-of-service"
        },
        {
            label: "Privacy Policy",
            href: "/landing/privacy-policy"
        },
        {
          label: "Contact Us",
          href: "/landing/contact-us"
        }
    ],
  }

export const footerSection: FooterSectionProps = {
    footerList,
    creator,
    creatorLink,
    title,
    logo,
    darkLogo
}