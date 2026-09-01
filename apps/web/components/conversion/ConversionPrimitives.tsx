"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import type { PublicCaseStudy } from "@/lib/ts-types/conversion";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";
import { trackConversionEvent } from "@/lib/analytics/conversion-events";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function CaseStudyCard({
  study,
  priority = false,
}: {
  study: PublicCaseStudy;
  priority?: boolean;
}) {
  const verifiedMetrics = (study.metrics ?? []).filter(
    (metric) => metric.verified === true,
  );

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
      data-track="case-study-card"
      data-case-study-slug={study.slug}
    >
      {study.coverImageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {/* CMS media can be hosted on user-managed domains. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={study.coverImageUrl}
            alt={`${study.title} case study`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading={priority ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {study.clientName ? (
            <Badge variant="secondary">{study.clientName}</Badge>
          ) : null}
          {study.timeline ? (
            <span className="text-xs text-muted-foreground">
              {study.timeline}
            </span>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary">
          {study.title}
        </h3>
        {study.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {study.summary}
          </p>
        ) : null}
        {verifiedMetrics.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 border-y py-4">
            {verifiedMetrics.slice(0, 2).map((metric) => (
              <div key={`${metric.value}-${metric.label}`}>
                <p className="font-semibold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        ) : null}
        {(study.technologies ?? []).length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {(study.technologies ?? []).slice(0, 5).map((technology) => (
              <li
                key={technology}
                className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground"
              >
                {technology}
              </li>
            ))}
          </ul>
        ) : null}
        <Button asChild variant="ghost" className="mt-auto w-fit px-0 pt-6">
          <Link
            href={`/case-studies/${study.slug}`}
            aria-label={`Read the ${study.title} case study`}
            onClick={() =>
              trackConversionEvent("case_study_opened", {
                slug: study.slug,
                location: "case_study_card",
              })
            }
          >
            Read case study <ArrowUpRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function DeliverableList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
