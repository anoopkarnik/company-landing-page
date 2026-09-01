import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";

import { Button } from "@workspace/ui/components/shadcn/button";

function label(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function RelatedContentLinks({
  serviceSlugs,
  caseStudySlugs,
}: {
  serviceSlugs: string[];
  caseStudySlugs: string[];
}) {
  if (!serviceSlugs.length && !caseStudySlugs.length) return null;
  return (
    <aside className="mt-14 rounded-2xl border bg-muted/30 p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <BriefcaseBusiness className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Put this into practice</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Explore related delivery examples or start a focused conversation about
        the same kind of problem.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {caseStudySlugs.map((slug) => (
          <Button key={slug} asChild variant="outline">
            <Link href={`/case-studies/${slug}`}>
              {label(slug)} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        ))}
        {serviceSlugs.map((slug) => (
          <Button key={slug} asChild>
            <Link href={`/?service=${encodeURIComponent(slug)}#start-project`}>
              Discuss {label(slug)} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  );
}
