"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Sparkles,
} from "lucide-react";

import type {
  PublicCaseStudy,
  PublicHero,
  PublicServicePackage,
} from "@/lib/ts-types/conversion";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import { trackConversionEvent } from "@/lib/analytics/conversion-events";

function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href);
}

export function ConversionHero({
  hero,
  fallbackHeadline,
  fallbackDescription,
  services,
  featuredStudy,
}: {
  hero?: PublicHero | null;
  fallbackHeadline?: string;
  fallbackDescription?: string;
  services: PublicServicePackage[];
  featuredStudy?: PublicCaseStudy;
}) {
  const headline = hero?.headline?.trim() || fallbackHeadline?.trim();
  const description =
    hero?.subheadline?.trim() || fallbackDescription?.trim();
  const primaryHref = hero?.primaryCtaHref?.trim() || "#start-project";
  const secondaryHref =
    hero?.secondaryCtaHref?.trim() ||
    (featuredStudy ? "#case-studies" : "#selected-work");

  return (
    <section
      className="relative isolate w-full overflow-hidden border-b"
      data-track-section="hero"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_15%,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_88%_35%,rgba(210,71,191,0.13),transparent_28%)]" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)/0.45) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--border)/0.45) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom,black,transparent 86%)",
        }}
      />

      <div className="container grid min-h-[720px] items-center gap-14 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
        <div className="max-w-4xl">
          {hero?.eyebrow ? (
            <Badge
              variant="outline"
              className="mb-6 gap-2 rounded-full bg-background/70 px-3.5 py-1.5 backdrop-blur"
            >
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              {hero.eyebrow}
            </Badge>
          ) : null}

          {headline ? (
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              {headline}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              {description}
            </p>
          ) : null}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-12 px-6">
              <a
                href={primaryHref}
                target={isExternal(primaryHref) ? "_blank" : undefined}
                rel={isExternal(primaryHref) ? "noreferrer noopener" : undefined}
                data-track="hero-primary-cta"
                onClick={() =>
                  trackConversionEvent("cta_clicked", {
                    location: "hero",
                    destination: primaryHref,
                    variant: "primary",
                  })
                }
              >
                {hero?.primaryCtaLabel?.trim() || "Start a project"}
                {isExternal(primaryHref) ? (
                  <ArrowUpRight aria-hidden="true" />
                ) : (
                  <ArrowRight
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                )}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <a
                href={secondaryHref}
                target={isExternal(secondaryHref) ? "_blank" : undefined}
                rel={
                  isExternal(secondaryHref) ? "noreferrer noopener" : undefined
                }
                data-track="hero-secondary-cta"
                onClick={() =>
                  trackConversionEvent("cta_clicked", {
                    location: "hero",
                    destination: secondaryHref,
                    variant: "secondary",
                  })
                }
              >
                {hero?.secondaryCtaLabel?.trim() || "See client work"}
              </a>
            </Button>
          </div>

          {hero?.availability || hero?.responseTime ? (
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {hero.availability ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]"
                    aria-hidden="true"
                  />
                  {hero.availability}
                </span>
              ) : null}
              {hero.responseTime ? (
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="size-4" aria-hidden="true" />
                  {hero.responseTime}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-fuchsia-500/15 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-background/80 shadow-2xl backdrop-blur-xl">
            {featuredStudy?.coverImageUrl ? (
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                {/* CMS media can be hosted on user-managed domains. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredStudy.coverImageUrl}
                  alt={`${featuredStudy.title} project preview`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-fuchsia-500/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_42%)]" />
                <div className="relative grid size-28 place-items-center rounded-3xl border bg-background/80 shadow-xl">
                  <Sparkles className="size-10 text-primary" aria-hidden="true" />
                </div>
              </div>
            )}
            <div className="p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {featuredStudy ? "Featured outcome" : "Built around the outcome"}
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {featuredStudy?.title ||
                  services[0]?.title ||
                  "A focused path from brief to launch"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {featuredStudy?.summary ||
                  services[0]?.description ||
                  "Clear scope, visible progress, production-ready delivery, and a handoff your team can maintain."}
              </p>
              {featuredStudy ? (
                <Button asChild variant="link" className="mt-4 h-auto px-0">
                  <Link
                    href={`/case-studies/${featuredStudy.slug}`}
                    data-track="hero-featured-case-study"
                    onClick={() =>
                      trackConversionEvent("case_study_opened", {
                        slug: featuredStudy.slug,
                        location: "hero",
                      })
                    }
                  >
                    Explore the case study <ArrowUpRight aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <ul className="mt-5 grid gap-3 text-sm">
                  {["A useful first release", "Transparent delivery", "Clean handoff"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
