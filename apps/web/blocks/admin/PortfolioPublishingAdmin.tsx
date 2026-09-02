"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderKanban, Plus, Search } from "lucide-react";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
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

type PortfolioDraft = {
  id?: string;
  sourceId?: string;
  title: string;
  slug: string;
  description: string;
  publicDescription: string;
  type: string;
  category: string;
  clientName: string;
  clientLogoUrl: string;
  technologies: string[];
  imageUrl: string;
  screenshotsJson: string;
  approvedMetricsJson: string;
  contribution: string;
  githubLink: string;
  websiteLink: string;
  demoVideoUrl: string;
  confidentiality: "PUBLIC" | "ANONYMIZED" | "PRIVATE";
  isClientWork: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  syncedAt?: string;
  order: number;
};

export function PortfolioMediaFields({
  clientLogoUrl,
  imageUrl,
  onChange,
}: {
  clientLogoUrl: string;
  imageUrl: string;
  onChange: (values: {
    clientLogoUrl?: string;
    imageUrl?: string;
  }) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Client logo URL">
        <ImageUploadField
          value={clientLogoUrl}
          onChange={(nextClientLogoUrl) =>
            onChange({ clientLogoUrl: nextClientLogoUrl })
          }
        />
      </Field>
      <Field label="Screenshot / cover URL">
        <ImageUploadField
          value={imageUrl}
          onChange={(nextImageUrl) => onChange({ imageUrl: nextImageUrl })}
        />
      </Field>
    </div>
  );
}

export function PortfolioPublishingAdmin({
  initialData,
  isLoading,
  isSaving,
  onSave,
}: {
  initialData?: any[];
  isLoading: boolean;
  isSaving: boolean;
  onSave: (portfolioProjects: any[]) => void;
}) {
  const [items, setItems] = useState<PortfolioDraft[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    if (!initialData) return;
    setItems(
      initialData.map((item, index) => ({
        id: item.id,
        sourceId: item.sourceId ?? item.lifeForgeId ?? undefined,
        title: item.title ?? "",
        slug: item.slug ?? "",
        description: item.description ?? "",
        publicDescription: item.publicDescription ?? "",
        type: item.type ?? "",
        category: item.category ?? "",
        clientName: item.clientName ?? "",
        clientLogoUrl: item.clientLogoUrl ?? "",
        technologies: Array.isArray(item.technologies)
          ? item.technologies
          : [],
        imageUrl: item.imageUrl ?? item.screenshotUrl ?? "",
        screenshotsJson: JSON.stringify(item.screenshots ?? [], null, 2),
        approvedMetricsJson: JSON.stringify(
          item.approvedMetrics ?? [],
          null,
          2,
        ),
        contribution: item.contribution ?? "",
        githubLink: item.githubLink ?? "",
        websiteLink: item.websiteLink ?? "",
        demoVideoUrl: item.demoVideoUrl ?? "",
        confidentiality:
          item.confidentiality === "ANONYMIZED" ||
          item.confidentiality === "PRIVATE"
            ? item.confidentiality
            : "PUBLIC",
        isClientWork: Boolean(item.isClientWork),
        isFeatured: Boolean(item.isFeatured),
        isPublished: Boolean(item.isPublished),
        syncedAt: item.syncedAt
          ? new Date(item.syncedAt).toISOString()
          : undefined,
        order: item.order ?? index,
      })),
    );
    setDirty(false);
    setError("");
  }, [initialData]);

  const visibleItems = useMemo(
    () =>
      items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => {
          if (filter === "published" && !item.isPublished) return false;
          if (filter === "draft" && item.isPublished) return false;
          const needle = search.trim().toLowerCase();
          return (
            !needle ||
            item.title.toLowerCase().includes(needle) ||
            item.category.toLowerCase().includes(needle) ||
            item.technologies.some((technology) =>
              technology.toLowerCase().includes(needle),
            )
          );
        }),
    [filter, items, search],
  );

  const update = (index: number, values: Partial<PortfolioDraft>) => {
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
        description: "",
        publicDescription: "",
        type: "",
        category: "",
        clientName: "",
        clientLogoUrl: "",
        technologies: [],
        imageUrl: "",
        screenshotsJson: "[]",
        approvedMetricsJson: "[]",
        contribution: "",
        githubLink: "",
        websiteLink: "",
        demoVideoUrl: "",
        confidentiality: "PRIVATE",
        isClientWork: false,
        isFeatured: false,
        isPublished: false,
        order: index,
      },
    ]);
    setExpanded((current) => new Set(current).add(index));
    setDirty(true);
    setFilter("all");
    setSearch("");
  };

  const save = () => {
    try {
      const portfolioProjects = items.map((item, index) => ({
        ...item,
        title: item.title.trim(),
        slug: item.slug.trim() || undefined,
        description: item.description.trim(),
        publicDescription: item.publicDescription.trim(),
        type: item.type.trim(),
        category: item.category.trim(),
        clientName: item.clientName.trim(),
        clientLogoUrl: item.clientLogoUrl.trim(),
        imageUrl: item.imageUrl.trim(),
        screenshots: parseJsonArray(item.screenshotsJson, "Screenshots"),
        approvedMetrics: parseJsonArray(
          item.approvedMetricsJson,
          "Approved metrics",
        ),
        contribution: item.contribution.trim(),
        githubLink: item.githubLink.trim(),
        websiteLink: item.websiteLink.trim(),
        demoVideoUrl: item.demoVideoUrl.trim(),
        order: index,
      }));
      if (portfolioProjects.some((item) => !item.title || !item.description)) {
        throw new Error("Every portfolio project needs a title and description.");
      }
      if (
        portfolioProjects.some(
          (item) => item.isPublished && item.confidentiality === "PRIVATE",
        )
      ) {
        throw new Error("Private projects cannot be published.");
      }
      const slugs = portfolioProjects
        .map((item) => item.slug)
        .filter((slug): slug is string => Boolean(slug));
      if (new Set(slugs).size !== slugs.length) {
        throw new Error("Portfolio project slugs must be unique.");
      }
      onSave(portfolioProjects);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Check the portfolio content and try again.",
      );
    }
  };

  if (isLoading) return <LoadingEditor />;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={FolderKanban}
        title="Portfolio Publishing"
        description="Review imported LifeForge projects and explicitly choose what is safe to show clients."
      />
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search projects, categories, or technologies"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as "all" | "published" | "draft")
          }
        >
          <option value="all">All projects</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add project
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {visibleItems.length} of {items.length} projects
      </p>
      <div className="space-y-4">
        {visibleItems.map(({ item, index }) => (
          <RepeaterCard
            key={item.id ?? `portfolio-${index}`}
            title={item.title || "Untitled project"}
            subtitle={`${item.category || "Uncategorized"} · ${item.isPublished ? "Published" : "Draft"}`}
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
            {item.sourceId && (
              <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                LifeForge source: {item.sourceId}
              </p>
            )}
            <TitleSlugFields
              title={item.title}
              slug={item.slug}
              onChange={(values) => update(index, values)}
            />
            <Field label="Source description">
              <Textarea
                value={item.description}
                onChange={(event) =>
                  update(index, { description: event.target.value })
                }
              />
            </Field>
            <Field label="Approved public description">
              <Textarea
                value={item.publicDescription}
                onChange={(event) =>
                  update(index, { publicDescription: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Project type">
                <Input
                  value={item.type}
                  onChange={(event) =>
                    update(index, { type: event.target.value })
                  }
                />
              </Field>
              <Field label="Portfolio category">
                <select
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={item.category}
                  onChange={(event) =>
                    update(index, { category: event.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  <option value="Client Work">Client Work</option>
                  <option value="Products">Products</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Experiments">Experiments</option>
                </select>
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
              <Field label="Client name">
                <Input
                  value={item.clientName}
                  onChange={(event) =>
                    update(index, { clientName: event.target.value })
                  }
                />
              </Field>
            </div>
            <PortfolioMediaFields
              clientLogoUrl={item.clientLogoUrl}
              imageUrl={item.imageUrl}
              onChange={(values) => update(index, values)}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="GitHub URL">
                <Input
                  type="url"
                  value={item.githubLink}
                  onChange={(event) =>
                    update(index, { githubLink: event.target.value })
                  }
                />
              </Field>
              <Field label="Website URL">
                <Input
                  type="url"
                  value={item.websiteLink}
                  onChange={(event) =>
                    update(index, { websiteLink: event.target.value })
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
            </div>
            <Field label="Your contribution">
              <Textarea
                value={item.contribution}
                onChange={(event) =>
                  update(index, { contribution: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="Screenshots (JSON)"
                hint='Array of {"url":"...","alt":"...","caption":"..."}.'
              >
                <Textarea
                  className="min-h-40 font-mono text-xs"
                  value={item.screenshotsJson}
                  onChange={(event) =>
                    update(index, { screenshotsJson: event.target.value })
                  }
                />
              </Field>
              <Field
                label="Approved metrics (JSON)"
                hint='Array of {"value":"...","label":"...","context":"..."}.'
              >
                <Textarea
                  className="min-h-40 font-mono text-xs"
                  value={item.approvedMetricsJson}
                  onChange={(event) =>
                    update(index, { approvedMetricsJson: event.target.value })
                  }
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
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
              <ToggleField
                label="Client work"
                checked={item.isClientWork}
                onCheckedChange={(isClientWork) =>
                  update(index, { isClientWork })
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
          </RepeaterCard>
        ))}
      </div>
      <SaveBar
        dirty={dirty}
        saving={isSaving}
        error={error}
        label="portfolio"
        onSave={save}
      />
    </div>
  );
}
