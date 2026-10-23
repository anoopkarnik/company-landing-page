"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Globe,
  Braces,
  CheckCircle2,
  ChevronDown,
  Database,
} from "lucide-react";

import type {
  PublicClientLogo,
  PublicProofMetric,
  PublicServicePackage,
} from "@/lib/ts-types/conversion";
import { AnimatedSection } from "@workspace/ui/components/custom/AnimatedSection";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";

import { DeliverableList, SectionHeading } from "./ConversionPrimitives";
import { trackConversionEvent } from "@/lib/analytics/conversion-events";
import {
  groupServicePackages,
  SERVICE_LEVEL_LABELS,
} from "@/lib/service-packages";

export function ProofSection({
  logos,
  metrics,
  trustHeading,
  proofHeading,
}: {
  logos: PublicClientLogo[];
  metrics: PublicProofMetric[];
  trustHeading?: string | null;
  proofHeading?: string | null;
}) {
  const approvedLogos = logos.filter((logo) => logo.approved === true);
  const verifiedMetrics = metrics.filter((metric) => metric.verified === true);

  if (approvedLogos.length === 0 && verifiedMetrics.length === 0) return null;

  return (
    <section
      className="w-full border-b bg-muted/20"
      aria-labelledby="proof-heading"
      data-track-section="proof"
    >
      <div className="container py-10 sm:py-14">
        <h2 id="proof-heading" className="sr-only">
          {proofHeading || "Verified client proof"}
        </h2>
        {approvedLogos.length > 0 ? (
          <div>
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {trustHeading || "Trusted for client and product work"}
            </p>
            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
              {approvedLogos.map((logo) => (
                <li key={logo.id ?? logo.name}>
                  {logo.websiteUrl ? (
                    <a
                      href={logo.websiteUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group block"
                      aria-label={`Visit ${logo.name}`}
                      data-track="client-logo"
                    >
                      <ClientLogo logo={logo} />
                    </a>
                  ) : (
                    <ClientLogo logo={logo} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {verifiedMetrics.length > 0 ? (
          <dl
            className={`grid gap-px overflow-hidden rounded-2xl border bg-border ${
              approvedLogos.length > 0 ? "mt-10" : ""
            } sm:grid-cols-2 lg:grid-cols-4`}
          >
            {verifiedMetrics.slice(0, 4).map((metric) => (
              <div
                key={metric.id ?? `${metric.value}-${metric.label}`}
                className="bg-background px-6 py-7 text-center sm:text-left"
              >
                <dt className="text-sm leading-5 text-muted-foreground">
                  {metric.label}
                </dt>
                <dd className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </dd>
                {metric.context ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {metric.context}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}

function ClientLogo({ logo }: { logo: PublicClientLogo }) {
  return logo.logoUrl ? (
    // CMS media can be hosted on user-managed domains.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.logoUrl}
      alt={logo.name}
      className="h-9 max-w-36 object-contain grayscale opacity-65 transition group-hover:grayscale-0 group-hover:opacity-100 dark:brightness-0 dark:invert"
      loading="lazy"
    />
  ) : (
    <span className="text-base font-semibold text-muted-foreground transition group-hover:text-foreground">
      {logo.name}
    </span>
  );
}

const serviceIcons = [Bot, Database, Braces, Globe];

export function ServicePackagesSection({
  services,
  heading,
  description,
}: {
  services: PublicServicePackage[];
  heading?: string;
  description?: string;
}) {
  if (services.length === 0) return null;

  return (
    <section
      id="services"
      className="container scroll-mt-20 py-20 sm:py-28"
      data-track-section="service-packages"
    >
      <AnimatedSection>
        <SectionHeading
          eyebrow="Ways to work together"
          title={
            heading || "Choose a focused engagement, not an open-ended build"
          }
          description={description}
        />
      </AnimatedSection>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
        {groupServicePackages(services).map((group, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];
          return (
            <article
              key={group.category}
              className="overflow-hidden rounded-2xl border bg-card"
            >
              <header className="flex items-center gap-3 border-b px-5 py-5 sm:px-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight">
                  {group.category}
                </h3>
              </header>
              <div className="divide-y">
                {group.packages.map((service) => {
                  const serviceHref =
                    !service.ctaHref || service.ctaHref === "#start-project"
                      ? `/?service=${encodeURIComponent(service.slug || service.title)}#start-project`
                      : service.ctaHref;
                  return (
                    <details
                      key={service.id ?? service.slug ?? service.title}
                      className="group/package"
                      data-track="service-package"
                      data-service-slug={service.slug ?? undefined}
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:px-6 [&::-webkit-details-marker]:hidden">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-semibold text-primary">
                              {service.level
                                ? SERVICE_LEVEL_LABELS[service.level]
                                : "Package details"}
                            </h4>
                            {service.featured ? (
                              <Badge variant="secondary">Popular</Badge>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-medium">
                            {service.title}
                          </p>
                          {service.priceFrom ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Approx {service.priceFrom}
                            </p>
                          ) : null}
                        </div>
                        <ChevronDown
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-open/package:rotate-180 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="px-5 pb-5 sm:px-6">
                        <p className="text-sm leading-6 text-muted-foreground">
                          {service.description}
                        </p>
                        {service.idealFor ? (
                          <p className="mt-4 text-sm leading-6 text-muted-foreground">
                            <strong className="font-medium text-foreground">
                              Best for:{" "}
                            </strong>
                            {service.idealFor}
                          </p>
                        ) : null}
                        {(service.deliverables ?? []).length > 0 ? (
                          <div className="mt-5">
                            <p className="mb-3 text-sm font-medium">
                              Typical deliverables
                            </p>
                            <DeliverableList
                              items={service.deliverables ?? []}
                            />
                          </div>
                        ) : null}
                        {service.timeline ? (
                          <p className="mt-5 text-sm text-muted-foreground">
                            Timeline:{" "}
                            <strong className="font-medium text-foreground">
                              {service.timeline}
                            </strong>
                          </p>
                        ) : null}
                        <Button
                          asChild
                          variant="outline"
                          className="mt-5 w-full"
                        >
                          <Link
                            href={serviceHref}
                            data-track="service-cta"
                            data-service={service.slug ?? service.title}
                            onClick={() =>
                              trackConversionEvent("cta_clicked", {
                                location: "service_package",
                                service: service.slug || service.title,
                              })
                            }
                          >
                            {service.ctaLabel || "Discuss this project"}
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>
                    </details>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-7 flex items-start gap-2 text-sm text-muted-foreground">
        <CheckCircle2
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        Scope, timing, and investment are confirmed after a short discovery
        call.
      </p>
    </section>
  );
}
