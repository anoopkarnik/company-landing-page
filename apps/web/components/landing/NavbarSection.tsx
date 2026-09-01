"use client";

import { useEffect, useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ArrowRight, MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/shadcn/sheet";

import { ModeToggle } from "./ModeToggle";

const routes = [
  { label: "Services", href: "#services" },
  { label: "Case studies", href: "#case-studies" },
  { label: "Selected work", href: "#selected-work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

const NavbarSection = ({
  showLandingRoutes = true,
}: {
  showLandingRoutes?: boolean;
} = {}) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.landing.getLandingInfo.queryOptions());
  const navbar = data.navbarSection;
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const githubLink = navbar?.githubLink?.trim();
  const donateNowLink = /^https?:\/\//.test(
    navbar?.donateNowLink?.trim() || "",
  )
    ? navbar.donateNowLink.trim()
    : null;

  useEffect(() => setMounted(true), []);

  const resolveHref = (href: string) =>
    showLandingRoutes ? href : `/${href}`;
  const logo =
    mounted && resolvedTheme === "dark" ? navbar?.darkLogo : navbar?.logo;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/82 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/72">
      <nav className="container flex h-16 items-center justify-between gap-4" aria-label="Primary navigation">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" data-track="navbar-logo">
          {logo ? (
            <Image
              src={logo}
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain"
              unoptimized
              priority
            />
          ) : (
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
              {navbar?.title?.slice(0, 1) || "B"}
            </span>
          )}
          <span className="truncate font-cyberdyne text-sm font-semibold sm:text-base">
            {navbar?.title}
          </span>
        </Link>

        {showLandingRoutes ? (
          <div className="hidden items-center gap-0.5 lg:flex">
            {routes.map((route) => (
              <a
                key={route.href}
                href={resolveHref(route.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                data-track="navbar-link"
                data-destination={route.href.slice(1)}
              >
                {route.label}
              </a>
            ))}
          </div>
        ) : (
          <div className="hidden items-center gap-1 lg:flex">
            <Link href="/case-studies" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              Case studies
            </Link>
            <Link href="/blog" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              Insights
            </Link>
            <Link href="/doc" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              Documentation
            </Link>
          </div>
        )}

        <div className="hidden items-center gap-1.5 md:flex">
          <ModeToggle />
          {githubLink ? (
            <Button asChild size="icon-sm" variant="ghost">
              <a href={githubLink} target="_blank" rel="noreferrer noopener" aria-label="View GitHub" data-track="navbar-github">
                <GitHubLogoIcon />
              </a>
            </Button>
          ) : null}
          {donateNowLink ? (
            <Button asChild size="sm" variant="ghost">
              <a
                href={donateNowLink}
                target="_blank"
                rel="noreferrer noopener"
              >
                Donate
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" className="group">
            <a href={resolveHref("#start-project")} data-track="navbar-project-cta">
              Start a project
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <MenuIcon className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <SheetHeader className="border-b px-5 py-5 text-left">
                <SheetTitle>{navbar?.title}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col p-5">
                <nav className="flex flex-col" aria-label="Mobile navigation">
                  {routes.map((route) => (
                    <a
                      key={route.href}
                      href={resolveHref(route.href)}
                      onClick={() => setIsOpen(false)}
                      className="border-b py-4 text-base font-medium text-foreground"
                      data-track="mobile-navbar-link"
                    >
                      {route.label}
                    </a>
                  ))}
                  <Link href="/blog" onClick={() => setIsOpen(false)} className="border-b py-4 text-base font-medium text-foreground">
                    Insights
                  </Link>
                  <Link href="/doc" onClick={() => setIsOpen(false)} className="border-b py-4 text-base font-medium text-foreground">
                    Documentation
                  </Link>
                </nav>
                <Button asChild size="lg" className="mt-7">
                  <a href={resolveHref("#start-project")} onClick={() => setIsOpen(false)} data-track="mobile-navbar-project-cta">
                    Start a project <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                {githubLink ? (
                  <Button asChild variant="outline" className="mt-3">
                    <a href={githubLink} target="_blank" rel="noreferrer noopener">
                      <GitHubLogoIcon /> View GitHub
                    </a>
                  </Button>
                ) : null}
                {donateNowLink ? (
                  <Button asChild variant="outline" className="mt-3">
                    <a
                      href={donateNowLink}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Donate
                    </a>
                  </Button>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default NavbarSection;
