import { NavbarSectionProps, RouteProps } from "@repo/ts-types/landing-page/navbar";
import { githubLink, githubUsername, githubRepositoryName, title, logo, darkLogo, donateNowLink } from "../appDetails";

export const routeList: RouteProps[] = [

    {
        href: "#about",
        label: "About",
    },
    {
      href: "#services",
      label: "Services",
    },
    {
      href: "#products",
      label: "Products",
    },
    {
      href: "#team",
      label: "Team",
    }
]

export const navbarSection:NavbarSectionProps = {
    routeList,
    githubLink,
    githubUsername,
    githubRepositoryName,
    title,
    logo,
    darkLogo,
    donateNowLink
}