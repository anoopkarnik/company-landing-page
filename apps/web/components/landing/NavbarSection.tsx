"use client"
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/shadcn/sheet";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@workspace/ui/components/shadcn/button";
import { MenuIcon } from "lucide-react";
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from './ModeToggle'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

const NavbarSection = ({ showLandingRoutes = true }: { showLandingRoutes?: boolean } = {}) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfoFromNotion.queryOptions());
  const navbarSection = data.navbarSection;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [starCount, setStarCount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <Link
              rel="noreferrer noopener"
              href="/"
              className="ml-2 flex items-center gap-2 font-cyberdyne"
            >
              <Image
                src={mounted && theme === "dark" ? navbarSection?.darkLogo : navbarSection?.logo}
                alt={navbarSection?.title}
                width={40}
                height={40}
                unoptimized
              />
              <div className="hidden lg:flex flex-col items-start text-md leading-none bg-gradient-to-r from-[#03a3d7] to-[#D247BF] bg-clip-text text-transparent ">
                <div>{navbarSection?.title?.split(' ')[0]}</div>
                <div>{navbarSection?.title?.split(' ')[1]}</div>
              </div>
            </Link>
          </li>


          <span className="flex md:hidden">

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
                  <a
                    rel="noreferrer noopener"
                    key={"About"}
                    href={"#about"}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors duration-200"
                  >
                    About
                  </a>
                  <a
                    rel="noreferrer noopener"
                    key={"Services"}
                    href={"#services"}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors duration-200"
                  >
                    Services
                  </a>
                  <a
                    rel="noreferrer noopener"
                    key={"Products"}
                    href={"#products"}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors duration-200"
                  >
                    Products
                  </a>
                  <a
                    rel="noreferrer noopener"
                    key={"Testimonials"}
                    href={"#testimonials"}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-4 rounded-md hover:bg-accent transition-colors duration-200"
                  >
                    Testimonials
                  </a>

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
              <a
                rel="noreferrer noopener"
                href={"#about"}
                key={"About"}
                className="relative group/navitem px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                About
                <span className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-gradient-to-r from-[#03a3d7] to-[#D247BF] rounded-full opacity-0 group-hover/navitem:opacity-100 transition-opacity duration-200" />
              </a>
              <a
                rel="noreferrer noopener"
                href={"#services"}
                key={"Services"}
                className="relative group/navitem px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Services
                <span className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-gradient-to-r from-[#03a3d7] to-[#D247BF] rounded-full opacity-0 group-hover/navitem:opacity-100 transition-opacity duration-200" />
              </a>

              <a
                rel="noreferrer noopener"
                href={"#products"}
                key={"Products"}
                className="relative group/navitem px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Products
                <span className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-gradient-to-r from-[#03a3d7] to-[#D247BF] rounded-full opacity-0 group-hover/navitem:opacity-100 transition-opacity duration-200" />
              </a>
              <a
                rel="noreferrer noopener"
                href={"#testimonials"}
                key={"Testimonials"}
                className="relative group/navitem px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Testimonials
                <span className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-gradient-to-r from-[#03a3d7] to-[#D247BF] rounded-full opacity-0 group-hover/navitem:opacity-100 transition-opacity duration-200" />
              </a>


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

            <ModeToggle />
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default NavbarSection;