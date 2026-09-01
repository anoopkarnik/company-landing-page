"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Boxes,
  Braces,
  CheckCircle2,
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

const serviceIcons = [Bot, Braces, Database, Boxes];

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
          title={heading || "Choose a focused engagement, not an open-ended build"}
          description={description}
        />
      </AnimatedSection>
      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];
          const serviceHref =
            !service.ctaHref || service.ctaHref === "#start-project"
              ? `/?service=${encodeURIComponent(service.slug || service.title)}#start-project`
              : service.ctaHref;
          return (
            <AnimatedSection key={service.id ?? service.title} delay={index * 0.08}>
              <article
                className={`relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${
                  service.featured ? "border-primary/50 ring-1 ring-primary/20" : ""
                }`}
                data-track="service-package"
                data-service-slug={service.slug ?? undefined}
              >
                {service.featured ? (
                  <Badge className="absolute right-5 top-5">Popular</Badge>
                ) : null}
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>
                {service.idealFor ? (
                  <div className="mt-5 rounded-xl bg-muted/55 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Best for
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {service.idealFor}
                    </p>
                  </div>
                ) : null}
                {(service.deliverables ?? []).length > 0 ? (
                  <div className="mt-6">
                    <p className="mb-3 text-sm font-medium">Typical deliverables</p>
                    <DeliverableList items={service.deliverables ?? []} />
                  </div>
                ) : null}
                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm">
                  {service.timeline ? (
                    <span>
                      <span className="text-muted-foreground">Timeline</span>
                      <br />
                      <strong>{service.timeline}</strong>
                    </span>
                  ) : null}
                  {service.priceFrom ? (
                    <span>
                      <span className="text-muted-foreground">Investment</span>
                      <br />
                      <strong>{service.priceFrom}</strong>
                    </span>
                  ) : null}
                </div>
                <Button asChild variant="outline" className="mt-6 w-full group">
                  <Link
                    href={
                      serviceHref
                    }
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
                    <ArrowRight
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </article>
            </AnimatedSection>
          );
        })}
      </div>
      <p className="mt-7 flex items-start gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        Scope, timing, and investment are confirmed after a short discovery call.
      </p>
    </section>
  );
}
