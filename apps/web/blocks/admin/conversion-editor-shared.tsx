"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Loader2, Save, Trash2 } from "lucide-react";

import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Switch } from "@workspace/ui/components/shadcn/switch";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function splitList(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatDateTimeInput(value?: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

export function parseJsonArray(value: string, label: string) {
  if (!value.trim()) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error(`${label} must be a JSON array.`);
  return parsed;
}

export function LoadingEditor() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ToggleField({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border bg-background p-3">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && (
          <span className="block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

export function RepeaterCard({
  title,
  subtitle,
  expanded,
  onToggle,
  onRemove,
  children,
}: {
  title: string;
  subtitle?: string;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-muted/30">
      <div
        className="flex cursor-pointer items-center justify-between gap-4 p-4"
        onClick={onToggle}
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive"
            aria-label={`Remove ${title}`}
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>
      {expanded && <div className="space-y-4 border-t p-4">{children}</div>}
    </div>
  );
}

export function SaveBar({
  dirty,
  saving,
  error,
  label,
  onSave,
}: {
  dirty: boolean;
  saving: boolean;
  error?: string;
  label: string;
  onSave: () => void;
}) {
  return (
    <div className="space-y-2 pt-2">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {dirty ? "You have unsaved changes." : "All changes are saved."}
        </p>
        <Button type="button" size="sm" disabled={!dirty || saving} onClick={onSave}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saving ? "Saving..." : `Save ${label}`}
        </Button>
      </div>
    </div>
  );
}

export function TitleSlugFields({
  title,
  slug,
  onChange,
}: {
  title: string;
  slug: string;
  onChange: (values: { title?: string; slug?: string }) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Title">
        <Input
          value={title}
          onChange={(event) => {
            const nextTitle = event.target.value;
            onChange({
              title: nextTitle,
              ...(!slug || slug === slugify(title)
                ? { slug: slugify(nextTitle) }
                : {}),
            });
          }}
        />
      </Field>
      <Field label="URL slug">
        <Input
          value={slug}
          onChange={(event) => onChange({ slug: slugify(event.target.value) })}
        />
      </Field>
    </div>
  );
}
