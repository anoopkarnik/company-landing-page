import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import FooterSection from "@/components/landing/FooterSection";
import NavbarSection from "@/components/landing/NavbarSection";
import { MdxContent } from "@/components/mdx/MdxContent";
import { serializeMdx } from "@/lib/functions/serialize-mdx";
import { getPublicCaseStudyBySlug } from "@/trpc/routers/conversionProcedures";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { Button } from "@workspace/ui/components/shadcn/button";

interface Props {
  params: Promise<{ slug: string }>;
}

const getStudy = cache((slug: string) => getPublicCaseStudyBySlug(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getStudy(slug);
  if (!study) {
    return {
      title: "Case study not found",
      robots: { index: false, follow: false },
    };
  }
  const title = study.seoTitle || study.title;
  const description = study.seoDescription || study.summary || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/case-studies/${study.slug}`,
      modifiedTime: study.updatedAt,
      images: study.coverImageUrl ? [{ url: study.coverImageUrl }] : undefined,
    },
    twitter: {
      card: study.coverImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: study.coverImageUrl ? [study.coverImageUrl] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getStudy(slug);
  if (!study) notFound();
  const verifiedMetrics = study.metrics.filter((metric) => metric.verified);

  const [solution, contribution, outcome, architecture] = await Promise.all([
    serializeMdx(study.solutionMdx || ""),
    serializeMdx(study.contributionMdx || ""),
    serializeMdx(study.outcomeMdx || ""),
    serializeMdx(study.architectureMdx || ""),
  ]);
  const baseUrl = (
    process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    image: study.coverImageUrl || undefined,
    dateModified: study.updatedAt,
    author: { "@type": "Person", name: "Anoop Karnik Dasika" },
    publisher: { "@type": "Organization", name: "Bayesian Labs" },
    about: study.technologies,
    mainEntityOfPage: `${baseUrl}/case-studies/${study.slug}`,
  }).replace(/</g, "\\u003c");

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <NavbarSection showLandingRoutes={false} />
      <main className="flex-1">
        <article>
          <header className="border-b bg-muted/20">
            <div className="container py-14 sm:py-20">
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" aria-hidden="true" /> All case
                studies
              </Link>
              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {study.clientName ? (
                      <Badge variant="secondary">{study.clientName}</Badge>
                    ) : null}
                    {study.industry ? (
                      <Badge variant="outline">{study.industry}</Badge>
                    ) : null}
                    {study.timeline ? (
                      <Badge variant="outline">{study.timeline}</Badge>
                    ) : null}
                  </div>
                  <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                    {study.title}
                  </h1>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                    {study.summary}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {study.projectUrl ? (
                      <Button asChild>
                        <a
                          href={study.projectUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          View project <ArrowUpRight aria-hidden="true" />
                        </a>
                      </Button>
                    ) : null}
                    {study.demoVideoUrl ? (
                      <Button asChild variant="outline">
                        <a
                          href={study.demoVideoUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <PlayCircle aria-hidden="true" /> Watch demo
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
                {study.coverImageUrl ? (
                  <div className="overflow-hidden rounded-3xl border bg-muted shadow-2xl">
                    {/* CMS media can be hosted on user-managed domains. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.coverImageUrl}
                      alt={`${study.title} preview`}
                      className="aspect-[16/10] h-full w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="container grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-24">
            <div className="space-y-14">
              {study.challenge ? (
                <CaseSection
                  eyebrow="The problem"
                  title="What needed to change"
                >
                  <p className="text-lg leading-8 text-muted-foreground">
                    {study.challenge}
                  </p>
                </CaseSection>
              ) : null}
              {solution.compiledSource ? (
                <CaseSection
                  eyebrow="The build"
                  title="Solution and implementation"
                >
                  <MdxArticle source={solution} />
                </CaseSection>
              ) : null}
              {contribution.compiledSource ? (
                <CaseSection eyebrow="Contribution" title="What I owned">
                  <MdxArticle source={contribution} />
                </CaseSection>
              ) : null}
              {architecture.compiledSource ? (
                <CaseSection
                  eyebrow="Architecture"
                  title="How the system fits together"
                >
                  <MdxArticle source={architecture} />
                </CaseSection>
              ) : null}
              {outcome.compiledSource ? (
                <CaseSection eyebrow="Outcome" title="What the work changed">
                  <MdxArticle source={outcome} />
                </CaseSection>
              ) : null}
              {study.gallery.length ? (
                <CaseSection
                  eyebrow="Visual evidence"
                  title="Product and workflow views"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    {study.gallery.map((media, index) => (
                      <figure
                        key={`${media.url}-${index}`}
                        className="overflow-hidden rounded-2xl border bg-card"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={media.url}
                          alt={media.alt || `${study.title} view ${index + 1}`}
                          className="aspect-[16/10] w-full object-cover"
                          loading="lazy"
                        />
                        {media.caption ? (
                          <figcaption className="p-3 text-sm text-muted-foreground">
                            {media.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                </CaseSection>
              ) : null}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {verifiedMetrics.length ? (
                <div className="rounded-2xl border bg-card p-5">
                  <h2 className="font-semibold">Approved results</h2>
                  <dl className="mt-4 space-y-5">
                    {verifiedMetrics.map((metric) => (
                      <div key={`${metric.value}-${metric.label}`}>
                        <dd className="text-2xl font-bold text-primary">
                          {metric.value}
                        </dd>
                        <dt className="mt-1 text-sm text-muted-foreground">
                          {metric.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              {study.technologies.length ? (
                <div className="rounded-2xl border bg-card p-5">
                  <h2 className="font-semibold">Technology</h2>
                  <ul className="mt-4 space-y-2">
                    {study.technologies.map((technology) => (
                      <li
                        key={technology}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />{" "}
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
                <h2 className="font-semibold">Have a related problem?</h2>
                <p className="mt-2 text-sm opacity-85">
                  Share the current workflow and desired outcome. A short brief
                  is enough.
                </p>
                <Button asChild variant="secondary" className="mt-5 w-full">
                  <Link href="/#start-project">Start a project</Link>
                </Button>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <FooterSection />
    </div>
  );
}

function CaseSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function MdxArticle({
  source,
}: {
  source: Awaited<ReturnType<typeof serializeMdx>>;
}) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-a:text-primary prose-img:rounded-2xl">
      <MdxContent
        source={source as Parameters<typeof MdxContent>[0]["source"]}
      />
    </div>
  );
}
