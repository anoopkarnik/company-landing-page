"use client";

import { useEffect, useState } from "react";
import { Boxes, Plus } from "lucide-react";

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
  splitList,
} from "./conversion-editor-shared";

type ServicePackageDraft = {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  descriptionMdx: string;
  idealFor: string;
  deliverables: string[];
  timeline: string;
  priceFrom: string;
  priceCurrency: string;
  technologies: string[];
  faqsJson: string;
  icon: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
};

export function ServicePackagesAdmin({
  initialData,
  isLoading,
  isSaving,
  onSave,
}: {
  initialData?: any[];
  isLoading: boolean;
  isSaving: boolean;
  onSave: (servicePackages: any[]) => void;
}) {
  const [items, setItems] = useState<ServicePackageDraft[]>([]);
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
        shortDescription: item.shortDescription ?? "",
        descriptionMdx: item.descriptionMdx ?? "",
        idealFor: item.idealFor ?? "",
        deliverables: Array.isArray(item.deliverables) ? item.deliverables : [],
        timeline: item.timeline ?? "",
        priceFrom: item.priceFrom?.toString() ?? "",
        priceCurrency: item.priceCurrency ?? "",
        technologies: Array.isArray(item.technologies)
          ? item.technologies
          : [],
        faqsJson: JSON.stringify(item.faqs ?? [], null, 2),
        icon: item.icon ?? "",
        imageUrl: item.imageUrl ?? "",
        ctaLabel: item.ctaLabel ?? "",
        ctaLink: item.ctaLink ?? "",
        isFeatured: Boolean(item.isFeatured),
        isPublished: Boolean(item.isPublished),
        order: item.order ?? index,
      })),
    );
    setDirty(false);
  }, [initialData]);

  const update = (index: number, values: Partial<ServicePackageDraft>) => {
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
        shortDescription: "",
        descriptionMdx: "",
        idealFor: "",
        deliverables: [],
        timeline: "",
        priceFrom: "",
        priceCurrency: "",
        technologies: [],
        faqsJson: "[]",
        icon: "",
        imageUrl: "",
        ctaLabel: "",
        ctaLink: "",
        isFeatured: false,
        isPublished: false,
        order: index,
      },
    ]);
    setExpanded((current) => new Set(current).add(index));
    setDirty(true);
  };

  const save = () => {
    try {
      const normalized = items.map((item, index) => ({
      ...item,
      title: item.title.trim(),
      slug: item.slug.trim(),
      shortDescription: item.shortDescription.trim(),
      descriptionMdx: item.descriptionMdx,
      idealFor: item.idealFor.trim(),
      timeline: item.timeline.trim(),
      priceFrom: item.priceFrom.trim()
        ? Number.parseInt(item.priceFrom, 10)
        : undefined,
      priceCurrency: item.priceCurrency.trim(),
      faqs: (() => {
        const parsed: unknown = JSON.parse(item.faqsJson || "[]");
        if (!Array.isArray(parsed)) throw new Error("FAQs must be a JSON array.");
        return parsed;
      })(),
      icon: item.icon.trim(),
      imageUrl: item.imageUrl.trim(),
      ctaLabel: item.ctaLabel.trim(),
      ctaLink: item.ctaLink.trim(),
      order: index,
      }));
      const invalid = normalized.find((item) => !item.title || !item.slug);
      if (invalid) {
        throw new Error("Every service package needs a title and URL slug.");
      }
      if (
        new Set(normalized.map((item) => item.slug)).size !== normalized.length
      ) {
        throw new Error("Service package URL slugs must be unique.");
      }
      if (
        normalized.some(
          (item) =>
            item.priceFrom !== undefined && !Number.isInteger(item.priceFrom),
        )
      ) {
        throw new Error("Price from must be a valid number.");
      }
      onSave(normalized);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Check the package content and try again.",
      );
    }
  };

  if (isLoading) return <LoadingEditor />;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Boxes}
        title="Service Packages"
        description="Turn your capabilities into clear offers with deliverables, timelines, and qualification cues."
      />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Packages ({items.length})</p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add package
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <RepeaterCard
            key={item.id ?? `service-${index}`}
            title={item.title || "Untitled package"}
            subtitle={item.slug ? `/services/${item.slug}` : "Not yet published"}
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
            <Field label="Short description">
              <Textarea
                value={item.shortDescription}
                onChange={(event) =>
                  update(index, { shortDescription: event.target.value })
                }
              />
            </Field>
            <Field label="Full description (MDX)">
              <Textarea
                className="min-h-52 font-mono text-xs"
                value={item.descriptionMdx}
                onChange={(event) =>
                  update(index, { descriptionMdx: event.target.value })
                }
              />
            </Field>
            <Field label="Ideal for">
              <Input
                placeholder="Founders validating an automation-heavy MVP"
                value={item.idealFor}
                onChange={(event) =>
                  update(index, { idealFor: event.target.value })
                }
              />
            </Field>
            <Field label="Deliverables" hint="Enter one deliverable per line.">
              <Textarea
                value={item.deliverables.join("\n")}
                onChange={(event) =>
                  update(index, { deliverables: splitList(event.target.value) })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Typical timeline">
                <Input
                  placeholder="4–6 weeks"
                  value={item.timeline}
                  onChange={(event) =>
                    update(index, { timeline: event.target.value })
                  }
                />
              </Field>
              <div className="grid grid-cols-[1fr_110px] gap-2">
                <Field label="Price from">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={item.priceFrom}
                    onChange={(event) =>
                      update(index, { priceFrom: event.target.value })
                    }
                  />
                </Field>
                <Field label="Currency">
                  <Input
                    placeholder="USD"
                    value={item.priceCurrency}
                    onChange={(event) =>
                      update(index, { priceCurrency: event.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
            <Field label="Technologies" hint="Comma-separated.">
              <Input
                value={item.technologies.join(", ")}
                onChange={(event) =>
                  update(index, { technologies: splitList(event.target.value) })
                }
              />
            </Field>
            <Field
              label="FAQs (JSON)"
              hint='Array of {"question":"...","answer":"..."}.'
            >
              <Textarea
                className="min-h-40 font-mono text-xs"
                value={item.faqsJson}
                onChange={(event) =>
                  update(index, { faqsJson: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Icon name">
                <Input
                  value={item.icon}
                  onChange={(event) => update(index, { icon: event.target.value })}
                />
              </Field>
              <Field label="Image URL">
                <Input
                  type="url"
                  value={item.imageUrl}
                  onChange={(event) =>
                    update(index, { imageUrl: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA label">
                <Input
                  value={item.ctaLabel}
                  onChange={(event) =>
                    update(index, { ctaLabel: event.target.value })
                  }
                />
              </Field>
              <Field label="CTA URL">
                <Input
                  value={item.ctaLink}
                  onChange={(event) =>
                    update(index, { ctaLink: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <ToggleField
                label="Featured"
                description="Give this package stronger visual priority."
                checked={item.isFeatured}
                onCheckedChange={(isFeatured) => update(index, { isFeatured })}
              />
              <ToggleField
                label="Published"
                description="Show this package to prospective clients."
                checked={item.isPublished}
                onCheckedChange={(isPublished) =>
                  update(index, { isPublished })
                }
              />
            </div>
          </RepeaterCard>
        ))}
      </div>
      <SaveBar
        dirty={dirty}
        saving={isSaving}
        error={error}
        label="packages"
        onSave={save}
      />
    </div>
  );
}
