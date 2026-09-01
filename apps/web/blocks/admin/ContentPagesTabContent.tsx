"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Checkbox } from "@workspace/ui/components/shadcn/checkbox";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";

interface EditableContentPage {
  id?: string;
  sourceId?: string;
  name: string;
  slug: string;
  type: string;
  order: number;
  mdx: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageCaption: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string;
  author: string;
  includeInSitemap: boolean;
  relatedServiceSlugs: string[];
  relatedCaseStudySlugs: string[];
  sourceCreatedAt?: string;
  sourceUpdatedAt?: string;
}

interface Props {
  title: string;
  description: string;
  itemLabel: string;
  icon: LucideIcon;
  initialData: any[] | undefined;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (items: any[]) => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ContentPagesTabContent({
  title,
  description,
  itemLabel,
  icon,
  initialData,
  isLoading,
  isSaving,
  onSave,
}: Props) {
  const [items, setItems] = useState<EditableContentPage[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setItems(
      initialData.map((item, index) => ({
        id: item.id,
        sourceId: item.sourceId ?? undefined,
        name: item.name ?? "",
        slug: item.slug ?? "",
        type: item.type ?? "General",
        order: item.order ?? index,
        mdx: item.mdx ?? "",
        excerpt: item.excerpt ?? "",
        coverImage: item.coverImage ?? "",
        coverImageAlt: item.coverImageAlt ?? "",
        coverImageCaption: item.coverImageCaption ?? "",
        seoTitle: item.seoTitle ?? "",
        seoDescription: item.seoDescription ?? "",
        canonicalUrl: item.canonicalUrl ?? "",
        ogImageUrl: item.ogImageUrl ?? "",
        tags: Array.isArray(item.tags) ? item.tags : [],
        status: item.status === "published" ? "published" : "draft",
        publishedAt: item.publishedAt
          ? new Date(item.publishedAt).toISOString()
          : undefined,
        author: item.author ?? "",
        includeInSitemap: item.includeInSitemap !== false,
        relatedServiceSlugs: Array.isArray(item.relatedServiceSlugs)
          ? item.relatedServiceSlugs
          : [],
        relatedCaseStudySlugs: Array.isArray(item.relatedCaseStudySlugs)
          ? item.relatedCaseStudySlugs
          : [],
        sourceCreatedAt: item.sourceCreatedAt
          ? new Date(item.sourceCreatedAt).toISOString()
          : undefined,
        sourceUpdatedAt: item.sourceUpdatedAt
          ? new Date(item.sourceUpdatedAt).toISOString()
          : undefined,
      })),
    );
    setIsDirty(false);
    setError("");
  }, [initialData]);

  const updateItem = (index: number, update: Partial<EditableContentPage>) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...update } : item,
      ),
    );
    setIsDirty(true);
    setError("");
  };

  const addItem = () => {
    const index = items.length;
    setItems((current) => [
      ...current,
      {
        name: "",
        slug: "",
        type: "General",
        order: index,
        mdx: "",
        excerpt: "",
        coverImage: "",
        coverImageAlt: "",
        coverImageCaption: "",
        seoTitle: "",
        seoDescription: "",
        canonicalUrl: "",
        ogImageUrl: "",
        tags: [],
        status: "draft",
        author: "",
        includeInSitemap: true,
        relatedServiceSlugs: [],
        relatedCaseStudySlugs: [],
      },
    ]);
    setExpanded((current) => new Set(current).add(index));
    setIsDirty(true);
  };

  const removeItem = (index: number) => {
    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    setIsDirty(true);
  };

  const handleSave = () => {
    try {
      const slugs = new Set<string>();
      const parsedItems = items.map((item, index) => {
        const name = item.name.trim();
        const slug = item.slug.trim();
        const type = item.type.trim();
        if (!name || !slug || !type) {
          throw new Error(
            `${itemLabel} #${index + 1} needs a title, slug, and category.`,
          );
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          throw new Error(`${itemLabel} #${index + 1} has an invalid slug.`);
        }
        if (slugs.has(slug)) {
          throw new Error(`The slug "${slug}" is used more than once.`);
        }
        slugs.add(slug);

        return {
          id: item.id,
          sourceId: item.sourceId,
          name,
          slug,
          type,
          order: index,
          mdx: item.mdx,
          excerpt: item.excerpt.trim(),
          coverImage: item.coverImage.trim(),
          coverImageAlt: item.coverImageAlt.trim(),
          coverImageCaption: item.coverImageCaption.trim(),
          seoTitle: item.seoTitle.trim(),
          seoDescription: item.seoDescription.trim(),
          canonicalUrl: item.canonicalUrl.trim(),
          ogImageUrl: item.ogImageUrl.trim(),
          tags: item.tags,
          status: item.status,
          publishedAt:
            item.status === "published"
              ? item.publishedAt || new Date().toISOString()
              : undefined,
          author: item.author.trim(),
          includeInSitemap: item.includeInSitemap,
          relatedServiceSlugs: item.relatedServiceSlugs,
          relatedCaseStudySlugs: item.relatedCaseStudySlugs,
          sourceCreatedAt: item.sourceCreatedAt,
          sourceUpdatedAt: item.sourceUpdatedAt,
        };
      });

      onSave(parsedItems);
      setError("");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Invalid MDX content.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={icon} title={title} description={description} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {itemLabel}s ({items.length})
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add {itemLabel}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const isExpanded = expanded.has(index);
          return (
            <div
              key={item.id ?? `new-${index}`}
              className="rounded-lg border bg-muted/30"
            >
              <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={() =>
                  setExpanded((current) => {
                    const next = new Set(current);
                    if (next.has(index)) next.delete(index);
                    else next.add(index);
                    return next;
                  })
                }
              >
                <div>
                  <p className="font-medium">
                    {item.name || `Untitled ${itemLabel}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{itemLabel.toLowerCase() === "blog post" ? "blog" : "doc"}/
                    {item.slug || "new-page"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeItem(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-4 border-t p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Title
                      </label>
                      <Input
                        value={item.name}
                        onChange={(event) => {
                          const previousAutoSlug = slugify(item.name);
                          const name = event.target.value;
                          updateItem(index, {
                            name,
                            ...(!item.slug || item.slug === previousAutoSlug
                              ? { slug: slugify(name) }
                              : {}),
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Category
                      </label>
                      <Input
                        value={item.type}
                        onChange={(event) =>
                          updateItem(index, { type: event.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      URL slug
                    </label>
                    <Input
                      value={item.slug}
                      onChange={(event) =>
                        updateItem(index, { slug: slugify(event.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Excerpt
                    </label>
                    <Textarea
                      className="min-h-20"
                      placeholder="A concise summary for cards and search results"
                      value={item.excerpt}
                      onChange={(event) =>
                        updateItem(index, { excerpt: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-4 rounded-lg border bg-background p-4">
                    <p className="text-sm font-semibold">Cover image</p>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Image URL or upload
                      </label>
                      <ImageUploadField
                        value={item.coverImage}
                        onChange={(coverImage) =>
                          updateItem(index, { coverImage })
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Alternative text
                        </label>
                        <Input
                          maxLength={500}
                          placeholder="Describe the image for readers who cannot see it"
                          value={item.coverImageAlt}
                          onChange={(event) =>
                            updateItem(index, {
                              coverImageAlt: event.target.value,
                            })
                          }
                        />
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                          {item.coverImageAlt.length}/500
                        </p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Author
                        </label>
                        <Input
                          value={item.author}
                          onChange={(event) =>
                            updateItem(index, { author: event.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Caption
                      </label>
                      <Textarea
                        className="min-h-20"
                        maxLength={1000}
                        placeholder="Optional context displayed with the cover image"
                        value={item.coverImageCaption}
                        onChange={(event) =>
                          updateItem(index, {
                            coverImageCaption: event.target.value,
                          })
                        }
                      />
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        {item.coverImageCaption.length}/1000
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Tags
                      </label>
                      <Input
                        placeholder="automation, n8n, ai"
                        value={item.tags.join(", ")}
                        onChange={(event) =>
                          updateItem(index, {
                            tags: event.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Publication status
                      </label>
                      <select
                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        value={item.status}
                        onChange={(event) =>
                          updateItem(index, {
                            status: event.target.value as "draft" | "published",
                          })
                        }
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  {item.status === "published" && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Published at
                      </label>
                      <Input
                        type="datetime-local"
                        value={
                          item.publishedAt ? item.publishedAt.slice(0, 16) : ""
                        }
                        onChange={(event) =>
                          updateItem(index, {
                            publishedAt: event.target.value
                              ? new Date(event.target.value).toISOString()
                              : undefined,
                          })
                        }
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Content (MDX)
                    </label>
                    <Textarea
                      className="min-h-80 font-mono text-xs"
                      value={item.mdx}
                      onChange={(event) =>
                        updateItem(index, { mdx: event.target.value })
                      }
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Write Markdown or MDX, including headings, lists, links,
                      images, code fences, and JSX components.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-3 text-sm font-semibold">
                      Search and sharing
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          SEO title
                        </label>
                        <Input
                          maxLength={70}
                          placeholder={item.name || "Search result title"}
                          value={item.seoTitle}
                          onChange={(event) =>
                            updateItem(index, { seoTitle: event.target.value })
                          }
                        />
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                          {item.seoTitle.length}/70
                        </p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          SEO description
                        </label>
                        <Textarea
                          className="min-h-20"
                          maxLength={170}
                          value={item.seoDescription}
                          onChange={(event) =>
                            updateItem(index, {
                              seoDescription: event.target.value,
                            })
                          }
                        />
                        <p className="mt-1 text-right text-xs text-muted-foreground">
                          {item.seoDescription.length}/170
                        </p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Canonical URL
                        </label>
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={item.canonicalUrl}
                          onChange={(event) =>
                            updateItem(index, {
                              canonicalUrl: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Social sharing image
                        </label>
                        <ImageUploadField
                          value={item.ogImageUrl}
                          onChange={(ogImageUrl) =>
                            updateItem(index, { ogImageUrl })
                          }
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Leave empty to use the cover image for Open Graph and
                          social previews.
                        </p>
                      </div>
                      <label className="flex items-start gap-3 rounded-lg border p-3">
                        <Checkbox
                          checked={item.includeInSitemap}
                          onCheckedChange={(checked) =>
                            updateItem(index, {
                              includeInSitemap: checked === true,
                            })
                          }
                        />
                        <span>
                          <span className="block text-sm font-medium">
                            Include in sitemap
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            Published pages remain accessible when this is off,
                            but are omitted from the generated XML sitemap.
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="mb-3 text-sm font-semibold">
                      Related conversion content
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Service slugs
                        </label>
                        <Input
                          placeholder="ai-automation, data-ai-integration"
                          value={item.relatedServiceSlugs.join(", ")}
                          onChange={(event) =>
                            updateItem(index, {
                              relatedServiceSlugs: event.target.value
                                .split(",")
                                .map((slug) => slug.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Comma-separated slugs used by the article CTA.
                        </p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">
                          Case-study slugs
                        </label>
                        <Input
                          placeholder="saas-forge, financial-document-ocr-pipeline"
                          value={item.relatedCaseStudySlugs.join(", ")}
                          onChange={(event) =>
                            updateItem(index, {
                              relatedCaseStudySlugs: event.target.value
                                .split(",")
                                .map((slug) => slug.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Comma-separated slugs linked after the article.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {isDirty ? "You have unsaved changes." : "All changes are saved."}
        </p>
        <Button
          type="button"
          size="sm"
          disabled={isSaving || !isDirty}
          onClick={handleSave}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save {itemLabel}s
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
