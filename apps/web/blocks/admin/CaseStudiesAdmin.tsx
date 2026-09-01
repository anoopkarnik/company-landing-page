"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Plus } from "lucide-react";

import { SectionHeader } from "@/components/admin/SectionHeader";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import {
  Field,
  LoadingEditor,
  RepeaterCard,
  SaveBar,
  TitleSlugFields,
  ToggleField,
  parseJsonArray,
  splitList,
} from "./conversion-editor-shared";

type CaseStudyDraft = {
  id?: string;
  title: string;
  slug: string;
  clientName: string;
  clientLogoUrl: string;
  industry: string;
  summary: string;
  challenge: string;
  solutionMdx: string;
  outcomeMdx: string;
  architectureMdx: string;
  contributionMdx: string;
  serviceSlugs: string[];
  technologies: string[];
  timeline: string;
  coverImageUrl: string;
  demoVideoUrl: string;
  projectUrl: string;
  metricsJson: string;
  galleryJson: string;
  testimonialQuote: string;
  clientConsentGranted: boolean;
  confidentiality: "PUBLIC" | "ANONYMIZED" | "PRIVATE";
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
  projectId: string;
  order: number;
};

const EMPTY_JSON_ARRAY = "[]";

export function CaseStudiesAdmin({
  initialData,
  isLoading,
  isSaving,
  onSave,
}: {
  initialData?: any[];
  isLoading: boolean;
  isSaving: boolean;
  onSave: (caseStudies: any[]) => void;
}) {
  const [items, setItems] = useState<CaseStudyDraft[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setItems(
      initialData.map((item, index) => ({
        id: item.id,
        title: item.title ?? "",
        slug: item.slug ?? "",
        clientName: item.clientName ?? "",
        clientLogoUrl: item.clientLogoUrl ?? "",
        industry: item.industry ?? "",
        summary: item.summary ?? "",
        challenge: item.challenge ?? "",
        solutionMdx: item.solutionMdx ?? item.solution ?? "",
        outcomeMdx: item.outcomeMdx ?? "",
        architectureMdx: item.architectureMdx ?? "",
        contributionMdx: item.contributionMdx ?? "",
        serviceSlugs: Array.isArray(item.serviceSlugs)
          ? item.serviceSlugs
          : [],
        technologies: Array.isArray(item.technologies)
          ? item.technologies
          : [],
        timeline: item.timeline ?? "",
        coverImageUrl: item.coverImageUrl ?? "",
        demoVideoUrl: item.demoVideoUrl ?? "",
        projectUrl: item.projectUrl ?? "",
        metricsJson: JSON.stringify(item.metrics ?? [], null, 2),
        galleryJson: JSON.stringify(item.gallery ?? [], null, 2),
        testimonialQuote: item.testimonialQuote ?? "",
        isFeatured: Boolean(item.isFeatured),
        isPublished: Boolean(item.isPublished),
        clientConsentGranted: Boolean(item.clientConsentGranted),
        confidentiality:
          item.confidentiality === "ANONYMIZED" ||
          item.confidentiality === "PRIVATE"
            ? item.confidentiality
            : "PUBLIC",
        seoTitle: item.seoTitle ?? "",
        seoDescription: item.seoDescription ?? "",
        projectId: item.projectId ?? "",
        order: item.order ?? index,
      })),
    );
    setDirty(false);
    setError("");
  }, [initialData]);

  const update = (index: number, values: Partial<CaseStudyDraft>) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...values } : item,
      ),
    );
    setDirty(true);
    setError("");
  };

  const add = () => {
    const index = items.length;
    setItems((current) => [
      ...current,
      {
        title: "",
        slug: "",
        clientName: "",
        clientLogoUrl: "",
        industry: "",
        summary: "",
        challenge: "",
        solutionMdx: "",
        outcomeMdx: "",
        architectureMdx: "",
        contributionMdx: "",
        serviceSlugs: [],
        technologies: [],
        timeline: "",
        coverImageUrl: "",
        demoVideoUrl: "",
        projectUrl: "",
        metricsJson: EMPTY_JSON_ARRAY,
        galleryJson: EMPTY_JSON_ARRAY,
        testimonialQuote: "",
        isFeatured: false,
        isPublished: false,
        clientConsentGranted: false,
        confidentiality: "PRIVATE",
        seoTitle: "",
        seoDescription: "",
        projectId: "",
        order: index,
      },
    ]);
    setExpanded((current) => new Set(current).add(index));
    setDirty(true);
  };

  const save = () => {
    try {
      const normalized = items.map((item, index) => {
        if (!item.title.trim() || !item.slug.trim()) {
          throw new Error(`Case study #${index + 1} needs a title and slug.`);
        }
        if (item.isPublished && item.confidentiality === "PRIVATE") {
          throw new Error(
            `“${item.title}” cannot be published while confidentiality is private.`,
          );
        }
        if (
          item.isPublished &&
          item.confidentiality === "PUBLIC" &&
          !item.clientConsentGranted
        ) {
          throw new Error(
            `Record client consent before publishing identifying details for “${item.title}”.`,
          );
        }
        return {
          id: item.id,
          title: item.title.trim(),
          slug: item.slug.trim(),
          clientName: item.clientName.trim(),
          clientLogoUrl: item.clientLogoUrl.trim(),
          industry: item.industry.trim(),
          summary: item.summary.trim(),
          challenge: item.challenge.trim(),
          solutionMdx: item.solutionMdx,
          outcomeMdx: item.outcomeMdx,
          architectureMdx: item.architectureMdx,
          contributionMdx: item.contributionMdx,
          serviceSlugs: item.serviceSlugs,
          technologies: item.technologies,
          timeline: item.timeline.trim(),
          coverImageUrl: item.coverImageUrl.trim(),
          demoVideoUrl: item.demoVideoUrl.trim(),
          projectUrl: item.projectUrl.trim(),
          metrics: parseJsonArray(item.metricsJson, "Metrics"),
          gallery: parseJsonArray(item.galleryJson, "Gallery"),
          testimonialQuote: item.testimonialQuote.trim(),
          isFeatured: item.isFeatured,
          isPublished: item.isPublished,
          clientConsentGranted: item.clientConsentGranted,
          confidentiality: item.confidentiality,
          seoTitle: item.seoTitle.trim(),
          seoDescription: item.seoDescription.trim(),
          projectId: item.projectId.trim(),
          order: index,
        };
      });
      if (new Set(normalized.map((item) => item.slug)).size !== normalized.length) {
        throw new Error("Case study URL slugs must be unique.");
      }
      onSave(normalized);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Check the JSON fields and try again.",
      );
    }
  };

  if (isLoading) return <LoadingEditor />;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BriefcaseBusiness}
        title="Case Studies"
        description="Publish credible Problem → Solution → Outcome stories with explicit client consent."
      />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Case studies ({items.length})</p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add case study
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <RepeaterCard
            key={item.id ?? `case-study-${index}`}
            title={item.title || "Untitled case study"}
            subtitle={`${item.clientName || "No client name"} · ${item.isPublished ? "Published" : "Draft"}`}
            expanded={expanded.has(index)}
            onToggle={() =>
              setExpanded((current) => {
                const next = new Set(current);
                next.has(index) ? next.delete(index) : next.add(index);
                return next;
              })
            }
            onRemove={() => {
              setItems((current) => current.filter((_, i) => i !== index));
              setDirty(true);
            }}
          >
            <TitleSlugFields
              title={item.title}
              slug={item.slug}
              onChange={(values) => update(index, values)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Client name">
                <Input
                  value={item.clientName}
                  onChange={(event) =>
                    update(index, { clientName: event.target.value })
                  }
                />
              </Field>
              <Field label="Client logo URL">
                <Input
                  type="url"
                  value={item.clientLogoUrl}
                  onChange={(event) =>
                    update(index, { clientLogoUrl: event.target.value })
                  }
                />
              </Field>
              <Field label="Industry">
                <Input
                  value={item.industry}
                  onChange={(event) =>
                    update(index, { industry: event.target.value })
                  }
                />
              </Field>
              <Field label="Linked portfolio project ID">
                <Input
                  value={item.projectId}
                  onChange={(event) =>
                    update(index, { projectId: event.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Summary">
              <Textarea
                value={item.summary}
                onChange={(event) =>
                  update(index, { summary: event.target.value })
                }
              />
            </Field>
            <Field label="Problem / challenge">
              <Textarea
                className="min-h-28"
                value={item.challenge}
                onChange={(event) =>
                  update(index, { challenge: event.target.value })
                }
              />
            </Field>
            <Field
              label="Solution and story (MDX)"
              hint="Use Markdown headings, lists, code fences, links, images, or approved MDX components."
            >
              <Textarea
                className="min-h-80 font-mono text-xs"
                value={item.solutionMdx}
                onChange={(event) =>
                  update(index, { solutionMdx: event.target.value })
                }
              />
            </Field>
            <Field label="Your contribution (MDX)">
              <Textarea
                className="min-h-36 font-mono text-xs"
                value={item.contributionMdx}
                onChange={(event) =>
                  update(index, { contributionMdx: event.target.value })
                }
              />
            </Field>
            <Field label="Outcome (MDX)">
              <Textarea
                className="min-h-44 font-mono text-xs"
                value={item.outcomeMdx}
                onChange={(event) =>
                  update(index, { outcomeMdx: event.target.value })
                }
              />
            </Field>
            <Field label="Architecture (MDX)">
              <Textarea
                className="min-h-36 font-mono text-xs"
                value={item.architectureMdx}
                onChange={(event) =>
                  update(index, { architectureMdx: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Related service slugs" hint="Comma-separated.">
                <Input
                  value={item.serviceSlugs.join(", ")}
                  onChange={(event) =>
                    update(index, {
                      serviceSlugs: splitList(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Technologies" hint="Comma-separated.">
                <Input
                  value={item.technologies.join(", ")}
                  onChange={(event) =>
                    update(index, {
                      technologies: splitList(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Timeline">
                <Input
                  value={item.timeline}
                  onChange={(event) =>
                    update(index, { timeline: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Cover image URL">
                <Input
                  type="url"
                  value={item.coverImageUrl}
                  onChange={(event) =>
                    update(index, { coverImageUrl: event.target.value })
                  }
                />
              </Field>
              <Field label="Demo video URL">
                <Input
                  type="url"
                  value={item.demoVideoUrl}
                  onChange={(event) =>
                    update(index, { demoVideoUrl: event.target.value })
                  }
                />
              </Field>
              <Field label="Project URL">
                <Input
                  type="url"
                  value={item.projectUrl}
                  onChange={(event) =>
                    update(index, { projectUrl: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="Metrics (JSON)"
                hint='Array of objects, for example [{"value":"...","label":"..."}].'
              >
                <Textarea
                  className="min-h-48 font-mono text-xs"
                  value={item.metricsJson}
                  onChange={(event) =>
                    update(index, { metricsJson: event.target.value })
                  }
                />
              </Field>
              <Field
                label="Gallery (JSON)"
                hint='Array of {"url":"...","alt":"...","caption":"..."}.'
              >
                <Textarea
                  className="min-h-48 font-mono text-xs"
                  value={item.galleryJson}
                  onChange={(event) =>
                    update(index, { galleryJson: event.target.value })
                  }
                />
              </Field>
            </div>
            <Field
              label="Approved testimonial quote"
              hint="Keep this empty unless the testimonial is approved for public use."
            >
              <Textarea
                className="min-h-24"
                value={item.testimonialQuote}
                onChange={(event) =>
                  update(index, { testimonialQuote: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="SEO title">
                <Input
                  maxLength={70}
                  value={item.seoTitle}
                  onChange={(event) =>
                    update(index, { seoTitle: event.target.value })
                  }
                />
              </Field>
              <Field label="SEO description">
                <Textarea
                  maxLength={170}
                  value={item.seoDescription}
                  onChange={(event) =>
                    update(index, { seoDescription: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Confidentiality">
                <select
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={item.confidentiality}
                  onChange={(event) =>
                    update(index, {
                      confidentiality: event.target.value as
                        | "PUBLIC"
                        | "ANONYMIZED"
                        | "PRIVATE",
                    })
                  }
                >
                  <option value="PRIVATE">Private</option>
                  <option value="ANONYMIZED">Anonymized</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                <ToggleField
                  label="Consent"
                  checked={item.clientConsentGranted}
                  onCheckedChange={(clientConsentGranted) =>
                    update(index, { clientConsentGranted })
                  }
                />
                <ToggleField
                  label="Featured"
                  checked={item.isFeatured}
                  onCheckedChange={(isFeatured) =>
                    update(index, { isFeatured })
                  }
                />
                <ToggleField
                  label="Published"
                  checked={item.isPublished}
                  onCheckedChange={(isPublished) =>
                    update(index, { isPublished })
                  }
                />
              </div>
            </div>
          </RepeaterCard>
        ))}
      </div>
      <SaveBar
        dirty={dirty}
        saving={isSaving}
        error={error}
        label="case studies"
        onSave={save}
      />
    </div>
  );
}
