"use client"
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../molecules/shadcn/sheet";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "../../../../atoms/shadcn/button";
import { MenuIcon } from "lucide-react";
import { ModeToggle } from "../../../../molecules/custom/v1/theme-toggle-dropdown";
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { NavbarSectionProps, RouteProps } from "@repo/ts-types/landing-page/navbar";

const Navbar = ({ navbarSection, showLandingRoutes = true }: {
  navbarSection: NavbarSectionProps, showLandingRoutes?: boolean
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const [starCount, setStarCount] = useState<number>(0);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${navbarSection.githubUsername}/${navbarSection.githubRepositoryName}`);
        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count);
        } else {
          console.error("Failed to fetch star count");
        }
      } catch (error) {
        console.log("Error fetching star count:", error);
      }
    };
    if (navbarSection?.githubLink) {
      fetchStarCount();
    }

  }, [theme, navbarSection]);


  return (
    <header className="sticky border-b border-border/40 top-0 z-40 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 font-geistMono transition-shadow duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <nav className="mx-auto w-full">
        <ul className="h-14 px-4 sm:px-6 w-full flex items-center justify-between">
          <li className="font-bold flex list-none">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 flex items-center gap-2 font-cyberdyne"
            >
              {theme === "dark" ?
                <Image src={navbarSection?.darkLogo} alt={navbarSection?.title} width={40} height={40} /> :
                <Image src={navbarSection?.logo} alt={navbarSection?.title} width={40} height={40} />}
              <div className="hidden lg:flex flex-col items-start text-md leading-none bg-gradient-to-r from-[#03a3d7] to-[#D247BF] bg-clip-text text-transparent ">
                <div>{navbarSection?.title?.split(' ')[0]}</div>
                <div>{navbarSection?.title?.split(' ')[1]}</div>
              </div>
            </a>
          </li>


          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <MenuIcon onClick={() => setIsOpen(true)} className="flex md:hidden h-5 w-5" />
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    {navbarSection?.title}
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {navbarSection?.routeList?.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors duration-200"
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    rel="noreferrer noopener"
                    href={navbarSection?.githubLink}
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary", size: "sm"
                    })}`}
                  >
                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                    {starCount}
                  </a>
                  <a rel="noreferrer noopener" href={navbarSection?.donateNowLink}>
                    <Button size="sm" className="rounded-sm">
                      Donate Now
                    </Button>
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop nav tabs */}
          {showLandingRoutes &&
            <nav className="hidden md:flex gap-1">
              {navbarSection?.routeList?.map((route: RouteProps, i) => (
                <a
                  rel="noreferrer noopener"
                  href={route.href}
                  key={i}
                  className="relative group/navitem px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {route.label}
                  <span className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-gradient-to-r from-[#03a3d7] to-[#D247BF] rounded-full opacity-0 group-hover/navitem:opacity-100 transition-opacity duration-200" />
                </a>
              ))}
            </nav>}
          <div className="hidden md:flex gap-2 items-center">
            <a
              rel="noreferrer noopener"
              href={navbarSection?.githubLink}
              target="_blank"
              className={`border flex items-center rounded-sm ${buttonVariants({ variant: "secondary", size: "sm" })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              {starCount}
            </a>
            <a rel="noreferrer noopener" href={navbarSection?.donateNowLink}>
              <Button size="sm" className="rounded-sm" >
                Donate Now
              </Button>
            </a>

            {/* <ModeToggle /> */}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;