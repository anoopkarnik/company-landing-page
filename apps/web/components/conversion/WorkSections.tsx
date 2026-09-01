"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  PlayCircle,
  SearchX,
  Sparkles,
} from "lucide-react";

import type {
  PublicCaseStudy,
  PublicPortfolioProject,
} from "@/lib/ts-types/conversion";
import { AnimatedSection } from "@workspace/ui/components/custom/AnimatedSection";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import { cn } from "@workspace/ui/lib/utils";

import { CaseStudyCard, SectionHeading } from "./ConversionPrimitives";
import { trackConversionEvent } from "@/lib/analytics/conversion-events";

const flagshipCaseStudySlugs = ["life-os", "saas-forge"] as const;
const flagshipCaseStudySlugSet = new Set<string>(flagshipCaseStudySlugs);

export function FlagshipProductsSection({
  caseStudies,
}: {
  caseStudies: PublicCaseStudy[];
}) {
  const flagships = flagshipCaseStudySlugs
    .map((slug) =>
      caseStudies.find(
        (study) => study.slug === slug && study.published !== false,
      ),
    )
    .filter((study): study is PublicCaseStudy => Boolean(study));

  if (flagships.length === 0) return null;

  return (
    <section
      id="flagship-products"
      className="relative isolate overflow-hidden border-y bg-gradient-to-b from-primary/[0.07] via-background to-background"
      data-track-section="flagship-products"
    >
      <div
        className="pointer-events-none absolute -left-32 top-0 -z-10 size-96 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 size-96 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container py-20 sm:py-28">
        <AnimatedSection>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Flagship products"
              title="Products shaped by real use, not just a polished launch"
              description="Life OS and SaaS Forge are the clearest expression of how I work: own the architecture, learn from daily use, and turn hard-won engineering lessons into reusable systems."
            />
            <p className="max-w-sm text-sm leading-6 text-muted-foreground lg:text-right">
              Go inside the product decisions, technical trade-offs, and
              iterations behind each build.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {flagships.map((study, index) => (
            <AnimatedSection key={study.id ?? study.slug} delay={index * 0.1}>
              <FlagshipProductCard study={study} index={index} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlagshipProductCard({
  study,
  index,
}: {
  study: PublicCaseStudy;
  index: number;
}) {
  const verifiedMetrics = (study.metrics ?? [])
    .filter((metric) => metric.verified === true)
    .slice(0, 2);
  const demoUrl = study.demoVideoUrl || study.videoUrl;
  const isLifeOs = study.slug === "life-os";

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-xl transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-2xl"
      data-track="flagship-product"
      data-case-study-slug={study.slug}
    >
      {study.coverImageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b bg-muted">
          {/* CMS media can be hosted on user-managed domains. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={study.coverImageUrl}
            alt={`${study.title} product preview`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-5 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            Flagship product · 0{index + 1}
          </span>
        </div>
      ) : (
        <div
          className={cn(
            "relative flex min-h-56 items-end overflow-hidden border-b p-6 sm:p-8",
            isLifeOs
              ? "bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-background"
              : "bg-gradient-to-br from-violet-500/20 via-blue-500/10 to-background",
          )}
          aria-hidden="true"
        >
          <div className="absolute -right-10 -top-16 size-52 rounded-full border border-foreground/10" />
          <div className="absolute -right-2 -top-8 size-32 rounded-full border border-foreground/10" />
          <div className="absolute right-8 top-8 grid size-12 place-items-center rounded-2xl border bg-background/65 shadow-lg backdrop-blur">
            <Sparkles className="size-5 text-primary" />
          </div>
          <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
            Flagship product · 0{index + 1}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {study.clientName ? (
            <Badge variant="secondary">{study.clientName}</Badge>
          ) : (
            <Badge variant="secondary">Independent product</Badge>
          )}
          {study.timeline ? (
            <span className="text-xs text-muted-foreground">
              {study.timeline}
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          {study.title}
        </h3>
        {study.summary ? (
          <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">
            {study.summary}
          </p>
        ) : null}

        {verifiedMetrics.length > 0 ? (
          <dl
            className="mt-7 grid grid-cols-2 gap-3"
            aria-label={`${study.title} verified results`}
          >
            {verifiedMetrics.map((metric) => (
              <div
                key={`${metric.value}-${metric.label}`}
                className="flex flex-col rounded-2xl border bg-muted/35 p-4"
              >
                <dt className="order-2 mt-1 text-xs leading-5 text-muted-foreground">
                  {metric.label}
                </dt>
                <dd className="order-1 text-xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {(study.technologies ?? []).length > 0 ? (
          <ul
            className="mt-7 flex flex-wrap gap-2"
            aria-label={`${study.title} technologies`}
          >
            {(study.technologies ?? []).slice(0, 6).map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {technology}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <Button asChild size="lg" className="group/link">
            <Link
              href={`/case-studies/${study.slug}`}
              aria-label={`Read the ${study.title} case study`}
              data-track="flagship-case-study-link"
              onClick={() =>
                trackConversionEvent("case_study_opened", {
                  slug: study.slug,
                  location: "flagship_products",
                })
              }
            >
              Read case study
              <ArrowRight
                className="transition-transform group-hover/link:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Button>
          {study.projectUrl ? (
            <Button asChild size="lg" variant="outline">
              <a
                href={study.projectUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Open ${study.title} in a new tab`}
                data-track="flagship-project-link"
                onClick={() =>
                  trackConversionEvent("cta_clicked", {
                    location: "flagship_products",
                    destination: study.projectUrl,
                    product: study.slug,
                  })
                }
              >
                View product <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          ) : null}
          {demoUrl ? (
            <Button asChild size="lg" variant="ghost">
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Watch the ${study.title} demo in a new tab`}
                data-track="flagship-demo-link"
                onClick={() =>
                  trackConversionEvent("cta_clicked", {
                    location: "flagship_products",
                    destination: demoUrl,
                    product: study.slug,
                  })
                }
              >
                <PlayCircle aria-hidden="true" /> Watch demo
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function FeaturedCaseStudiesSection({
  caseStudies,
  heading,
  description,
}: {
  caseStudies: PublicCaseStudy[];
  heading?: string | null;
  description?: string | null;
}) {
  const published = caseStudies
    .filter(
      (study) =>
        study.published !== false && !flagshipCaseStudySlugSet.has(study.slug),
    )
    .slice(0, 3);
  if (published.length === 0) return null;

  return (
    <section
      id="case-studies"
      className="scroll-mt-20 border-y bg-muted/25"
      data-track-section="featured-case-studies"
    >
      <div className="container py-20 sm:py-28">
        <AnimatedSection>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Selected case studies"
              title={
                heading ||
                "The thinking, build, and outcome—not just the screenshot"
              }
              description={
                description ||
                "See how real constraints were translated into maintainable systems and useful products. Client identities and metrics appear only when approved for publication."
              }
            />
            <Button asChild variant="outline" className="w-fit shrink-0">
              <Link href="/case-studies" data-track="view-all-case-studies">
                View all case studies <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {published.map((study, index) => (
            <AnimatedSection key={study.id ?? study.slug} delay={index * 0.08}>
              <CaseStudyCard study={study} priority={index === 0} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

const categoryFilters = [
  "All",
  "Client Work",
  "Products",
  "Open Source",
  "Experiments",
] as const;
const disciplineFilters = [
  { label: "All skills", value: "All" },
  { label: "AI", value: "AI" },
  { label: "n8n", value: "n8n" },
  { label: "Full Stack", value: "Full Stack" },
  { label: "Data", value: "Data" },
] as const;

function includesDiscipline(project: PublicPortfolioProject, filter: string) {
  if (filter === "All") return true;
  const searchable = [
    ...(project.disciplines ?? []),
    ...(project.technologies ?? []),
  ]
    .join(" ")
    .toLowerCase();
  const terms: Record<string, string[]> = {
    AI: ["ai", "llm", "machine learning", "openai", "ocr"],
    n8n: ["n8n", "automation", "workflow"],
    "Full Stack": ["full stack", "full-stack", "next.js", "react", "web app"],
    Data: ["data", "postgres", "analytics", "etl", "database"],
  };
  return (terms[filter] ?? [filter.toLowerCase()]).some((term) =>
    searchable.includes(term),
  );
}

export function PortfolioExplorer({
  projects,
  heading,
  description,
}: {
  projects: PublicPortfolioProject[];
  heading?: string | null;
  description?: string | null;
}) {
  const published = useMemo(
    () => projects.filter((project) => project.published !== false),
    [projects],
  );
  const [category, setCategory] =
    useState<(typeof categoryFilters)[number]>("All");
  const [discipline, setDiscipline] = useState("All");

  const filtered = useMemo(
    () =>
      published.filter(
        (project) =>
          (category === "All" || project.category === category) &&
          includesDiscipline(project, discipline),
      ),
    [published, category, discipline],
  );

  if (published.length === 0) return null;

  return (
    <section
      id="selected-work"
      className="container scroll-mt-20 py-20 sm:py-28"
      data-track-section="portfolio"
    >
      <AnimatedSection>
        <SectionHeading
          eyebrow="Selected work"
          title={
            heading || "A curated portfolio for the problem you need solved"
          }
          description={
            description ||
            "Filter by the kind of work and technical discipline most relevant to your project."
          }
        />
      </AnimatedSection>

      <div className="mt-10 space-y-4" aria-label="Portfolio filters">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Work type"
        >
          {categoryFilters.map((filter) => (
            <Button
              key={filter}
              type="button"
              variant={category === filter ? "default" : "outline"}
              size="sm"
              className="shrink-0 rounded-full"
              aria-pressed={category === filter}
              onClick={() => {
                setCategory(filter);
                trackConversionEvent("portfolio_filtered", {
                  filter_type: "category",
                  value: filter,
                });
              }}
              data-track="portfolio-category-filter"
              data-filter={filter}
            >
              {filter}
            </Button>
          ))}
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Discipline"
        >
          {disciplineFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm transition",
                discipline === filter.value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-pressed={discipline === filter.value}
              onClick={() => {
                setDiscipline(filter.value);
                trackConversionEvent("portfolio_filtered", {
                  filter_type: "discipline",
                  value: filter.value,
                });
              }}
              data-track="portfolio-discipline-filter"
              data-filter={filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {published.length} projects
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <PortfolioCard
              key={project.id ?? project.slug ?? project.title}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed p-10 text-center">
          <SearchX
            className="mx-auto size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="mt-3 font-semibold">No work matches both filters</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different category or discipline.
          </p>
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setCategory("All");
              setDiscipline("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </section>
  );
}

function PortfolioCard({ project }: { project: PublicPortfolioProject }) {
  const caseStudyHref = project.caseStudySlug
    ? `/case-studies/${project.caseStudySlug}`
    : null;
  const primaryHref =
    caseStudyHref || project.websiteUrl || project.repositoryUrl;

  return (
    <article
      className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      data-track="portfolio-project"
      data-project-slug={project.slug ?? undefined}
    >
      {project.imageUrl ? (
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {/* CMS media can be hosted on user-managed domains. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          {project.category ? (
            <Badge variant="secondary">{project.category}</Badge>
          ) : (
            <span />
          )}
          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label={`View ${project.title} source code`}
              data-track="portfolio-repository-link"
            >
              <Github className="size-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
        <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
          {project.title}
        </h3>
        {project.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
        ) : null}
        {(project.technologies ?? []).length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
            {(project.technologies ?? []).slice(0, 4).map((technology) => (
              <li key={technology} className="text-xs text-muted-foreground">
                {technology}
              </li>
            ))}
          </ul>
        ) : null}
        {primaryHref ? (
          <Button asChild variant="ghost" className="mt-4 h-auto px-0">
            {primaryHref.startsWith("/") ? (
              <Link href={primaryHref}>
                {caseStudyHref ? "Read case study" : "View project"}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ) : (
              <a href={primaryHref} target="_blank" rel="noreferrer noopener">
                View project <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
