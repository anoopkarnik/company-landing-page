"use client";

import { useEffect, useState } from "react";
import { BarChart3, Plus } from "lucide-react";

import { SectionHeader } from "@/components/admin/SectionHeader";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import {
  Field,
  LoadingEditor,
  RepeaterCard,
  SaveBar,
  ToggleField,
} from "./conversion-editor-shared";

type Verification = "UNVERIFIED" | "VERIFIED";

type ProofMetricDraft = {
  id?: string;
  value: string;
  label: string;
  context: string;
  tooltip: string;
  source: string;
  sourceProjectId: string;
  verificationStatus: Verification;
  isPublished: boolean;
  order: number;
};

export function ProofMetricsAdmin({
  initialData,
  isLoading,
  isSaving,
  onSave,
}: {
  initialData?: any[];
  isLoading: boolean;
  isSaving: boolean;
  onSave: (proofMetrics: any[]) => void;
}) {
  const [items, setItems] = useState<ProofMetricDraft[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setItems(
      initialData.map((item, index) => ({
        id: item.id,
        value: item.value ?? "",
        label: item.label ?? "",
        context: item.context ?? "",
        tooltip: item.tooltip ?? "",
        source: item.source ?? item.sourceProject ?? "",
        sourceProjectId: item.sourceProjectId ?? "",
        verificationStatus:
          item.verificationStatus === "VERIFIED" || item.verified
            ? "VERIFIED"
            : "UNVERIFIED",
        isPublished: Boolean(item.isPublished),
        order: item.order ?? index,
      })),
    );
    setDirty(false);
    setError("");
  }, [initialData]);

  const update = (index: number, values: Partial<ProofMetricDraft>) => {
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
        value: "",
        label: "",
        context: "",
        tooltip: "",
        source: "",
        sourceProjectId: "",
        verificationStatus: "UNVERIFIED",
        isPublished: false,
        order: index,
      },
    ]);
    setExpanded((current) => new Set(current).add(index));
    setDirty(true);
  };

  const save = () => {
    const proofMetrics = items.map((item, index) => ({
      ...item,
      value: item.value.trim(),
      label: item.label.trim(),
      context: item.context.trim(),
      tooltip: item.tooltip.trim(),
      source: item.source.trim(),
      sourceProjectId: item.sourceProjectId.trim(),
      order: index,
    }));
    if (proofMetrics.some((item) => !item.value || !item.label)) {
      setError("Every proof metric needs a value and label.");
      return;
    }
    onSave(proofMetrics);
  };

  if (isLoading) return <LoadingEditor />;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BarChart3}
        title="Proof Metrics"
        description="Manage measurable results. Keep unverified claims unpublished until their source is documented."
      />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Metrics ({items.length})</p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add metric
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <RepeaterCard
            key={item.id ?? `metric-${index}`}
            title={item.value || "New metric"}
            subtitle={item.label || "No description"}
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
            <div className="grid gap-4 md:grid-cols-[180px_1fr]">
              <Field label="Value">
                <Input
                  placeholder="A substantiated result"
                  value={item.value}
                  onChange={(event) =>
                    update(index, { value: event.target.value })
                  }
                />
              </Field>
              <Field label="Label">
                <Input
                  placeholder="What this result measures"
                  value={item.label}
                  onChange={(event) =>
                    update(index, { label: event.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Context">
              <Textarea
                placeholder="Explain the scope and conditions behind the number."
                value={item.context}
                onChange={(event) =>
                  update(index, { context: event.target.value })
                }
              />
            </Field>
            <Field label="Tooltip">
              <Input
                placeholder="Short clarification displayed with the metric"
                value={item.tooltip}
                onChange={(event) =>
                  update(index, { tooltip: event.target.value })
                }
              />
            </Field>
            <Field
              label="Evidence / source"
              hint="Internal project reference or public source URL. This is retained for review even when not displayed."
            >
              <Input
                value={item.source}
                onChange={(event) =>
                  update(index, { source: event.target.value })
                }
              />
            </Field>
            <Field label="Source portfolio project ID">
              <Input
                value={item.sourceProjectId}
                onChange={(event) =>
                  update(index, { sourceProjectId: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Verification">
                <select
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                  value={item.verificationStatus}
                  onChange={(event) =>
                    update(index, {
                      verificationStatus: event.target.value as Verification,
                    })
                  }
                >
                  <option value="UNVERIFIED">Unverified</option>
                  <option value="VERIFIED">Verified</option>
                </select>
              </Field>
              <ToggleField
                label="Published"
                description="Show this metric on the public landing page."
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
        label="metrics"
        onSave={save}
      />
    </div>
  );
}
