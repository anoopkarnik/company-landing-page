import type { Metadata } from "next";

import FooterSection from "@/components/landing/FooterSection";
import NavbarSection from "@/components/landing/NavbarSection";
import { CaseStudyCard } from "@/components/conversion/ConversionPrimitives";
import { getPublicCaseStudies } from "@/trpc/routers/conversionProcedures";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Detailed AI automation, full-stack product, and data engineering case studies covering the problem, implementation, and approved outcomes.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Client and Product Case Studies",
    description:
      "See how business problems were translated into reliable automations, products, and data systems.",
    url: "/case-studies",
  },
};

export default async function CaseStudiesPage() {
  const studies = await getPublicCaseStudies();

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarSection showLandingRoutes={false} />
      <main className="flex-1">
        <header className="border-b bg-muted/25">
          <div className="container py-20 sm:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Case studies
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              Real constraints, implementation decisions, and outcomes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A closer look at selected client and product work. Identities and
              measurements are published only when they are approved; other
              engagements remain safely anonymized.
            </p>
          </div>
        </header>
        <section className="container py-16 sm:py-24">
          {studies.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {studies.map((study, index) => (
                <CaseStudyCard
                  key={study.id}
                  study={study}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed p-12 text-center">
              <h2 className="text-xl font-semibold">Case studies are being prepared</h2>
              <p className="mt-2 text-muted-foreground">
                Published, approved work will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
