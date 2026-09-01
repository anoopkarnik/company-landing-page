"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Quote,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import type {
  PublicFounderProfile,
  PublicProcessStep,
  PublicTestimonial,
} from "@/lib/ts-types/conversion";
import { AnimatedSection } from "@workspace/ui/components/custom/AnimatedSection";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";

import { SectionHeading } from "./ConversionPrimitives";

const defaultProcess: PublicProcessStep[] = [
  {
    title: "Discover",
    description:
      "Clarify the business problem, current workflow, constraints, and the outcome worth building toward.",
  },
  {
    title: "Define",
    description:
      "Turn discovery into a focused scope, delivery milestones, architecture, and measurable acceptance criteria.",
  },
  {
    title: "Build",
    description:
      "Work in visible increments with regular demos, feedback loops, and production-minded engineering.",
  },
  {
    title: "Launch & hand off",
    description:
      "Deploy, document, transfer knowledge, and agree on the next iteration only when it adds value.",
  },
];

export function ProcessSection({
  steps,
  heading,
  description,
}: {
  steps: PublicProcessStep[];
  heading?: string | null;
  description?: string | null;
}) {
  const visibleSteps = steps.length > 0 ? steps : defaultProcess;

  return (
    <section
      id="process"
      className="scroll-mt-20 border-y bg-muted/25"
      data-track-section="process"
    >
      <div className="container py-20 sm:py-28">
        <AnimatedSection>
          <SectionHeading
            eyebrow="How I work"
            title={heading || "Clear decisions at every stage"}
            description={description || "You always know what is being solved, what is being built, and what happens next."}
          />
        </AnimatedSection>
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {visibleSteps.map((step, index) => (
            <li key={step.id ?? step.title} className="relative">
              <AnimatedSection delay={index * 0.08}>
                <div className="h-full rounded-2xl border bg-background p-6">
                  <span className="grid size-10 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FounderSection({
  founder,
  heading,
}: {
  founder?: PublicFounderProfile | null;
  heading?: string | null;
}) {
  if (!founder?.name && !founder?.shortBio && !founder?.longBio) return null;
  const bio = founder.longBio?.trim() || founder.shortBio?.trim();

  return (
    <section
      id="about"
      className="container scroll-mt-20 py-20 sm:py-28"
      data-track-section="founder"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr]">
        <AnimatedSection direction="right">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/15 to-fuchsia-500/10 blur-2xl" />
            {founder.imageUrl ? (
              <div className="aspect-[4/5] overflow-hidden rounded-3xl border bg-muted shadow-xl">
                {/* CMS media can be hosted on user-managed domains. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={founder.imageUrl}
                  alt={founder.name ? `Portrait of ${founder.name}` : "Founder portrait"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="grid aspect-[4/5] place-items-center rounded-3xl border bg-muted text-6xl font-bold text-muted-foreground">
                {founder.name?.slice(0, 1)}
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection direction="left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {heading || "Founder-led delivery"}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Work directly with {founder.name || "the person building your product"}
          </h2>
          {founder.title ? (
            <p className="mt-3 text-lg font-medium text-foreground">
              {founder.title}
            </p>
          ) : null}
          {bio ? (
            <div className="mt-5 whitespace-pre-line text-base leading-7 text-muted-foreground">
              {bio}
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {founder.education ? (
              <Badge variant="secondary" className="px-3 py-1.5">
                {founder.education}
              </Badge>
            ) : null}
            {founder.location ? (
              <Badge variant="outline" className="px-3 py-1.5">
                {founder.location}
              </Badge>
            ) : null}
          </div>

          {(founder.journey ?? []).length > 0 ? (
            <ol className="mt-8 space-y-5 border-l pl-6">
              {(founder.journey ?? []).map((item) => (
                <li key={`${item.label ?? ""}-${item.title}`} className="relative">
                  <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                  {item.label ? (
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      {item.label}
                    </p>
                  ) : null}
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : null}

          {(founder.socialLinks ?? []).length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {(founder.socialLinks ?? []).map((link) => (
                <Button key={link.url} asChild variant="outline" size="sm">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-track="founder-social-link"
                    data-platform={link.label}
                  >
                    {link.label} <ExternalLink aria-hidden="true" />
                  </a>
                </Button>
              ))}
            </div>
          ) : null}
        </AnimatedSection>
      </div>
    </section>
  );
}

export function VerifiedTestimonialsSection({
  testimonials,
}: {
  testimonials: PublicTestimonial[];
}) {
  const verified = testimonials.filter(
    (testimonial) =>
      testimonial.verified === true && testimonial.consentGranted === true,
  );
  if (verified.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="border-y bg-muted/25"
      data-track-section="verified-testimonials"
    >
      <div className="container py-20 sm:py-28">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Verified client feedback"
            title="What it feels like to work together"
            description="Only testimonials with client consent and a verified source are shown here."
          />
        </AnimatedSection>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {verified.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id ?? testimonial.name} delay={index * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border bg-background p-6 shadow-sm sm:p-7">
                <Quote className="size-8 text-primary/35" aria-hidden="true" />
                <blockquote className="mt-5 flex-1 text-base leading-7 text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t pt-5">
                  <Avatar className="size-10">
                    <AvatarImage src={testimonial.imageUrl ?? undefined} alt="" />
                    <AvatarFallback>{testimonial.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{testimonial.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {testimonial.sourceUrl ? (
                    <a
                      href={testimonial.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-auto rounded-md p-2 text-muted-foreground hover:text-primary"
                      aria-label={`View the source for ${testimonial.name}'s testimonial`}
                      data-track="testimonial-source"
                    >
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

type BlogListItem = {
  id?: string;
  Name: string;
  Type: string;
  slug: string;
  "Created time"?: string;
};

export function InsightsSection() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.blog.getBlogInfo.queryOptions());
  const posts = ((data?.blogs ?? []) as BlogListItem[]).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="container py-20 sm:py-28" data-track-section="insights">
      <AnimatedSection>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Practical insights"
            title="Notes from building products and automations"
            description="Useful explanations for founders and teams making technical decisions."
          />
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/blog" data-track="view-all-insights">
              Browse all articles <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </AnimatedSection>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {posts.map((post, index) => (
          <AnimatedSection key={post.id ?? post.slug} delay={index * 0.08}>
            <article className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <Badge variant="secondary" className="w-fit">
                {post.Type}
              </Badge>
              <h3 className="mt-5 text-lg font-semibold leading-7 group-hover:text-primary">
                {post.Name}
              </h3>
              {post["Created time"] ? (
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                  }).format(new Date(post["Created time"]))}
                </p>
              ) : null}
              <Button asChild variant="ghost" className="mt-auto w-fit px-0 pt-6">
                <Link href={`/blog/${post.slug}`} data-track="insight-card">
                  Read article <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
