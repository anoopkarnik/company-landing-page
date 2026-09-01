"use client";

import { useEffect, useState } from "react";
import { SearchCheck } from "lucide-react";

import { SectionHeader } from "@/components/admin/SectionHeader";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import {
  Field,
  LoadingEditor,
  SaveBar,
  parseJsonArray,
} from "./conversion-editor-shared";

type SettingsDraft = {
  heroEyebrow: string;
  targetAudience: string;
  tagline: string;
  valueProposition: string;
  description: string;
  availability: string;
  responseTime: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  trustHeading: string;
  proofHeading: string;
  servicePackagesHeading: string;
  servicePackagesDescription: string;
  caseStudiesHeading: string;
  caseStudiesDescription: string;
  portfolioHeading: string;
  portfolioDescription: string;
  processHeading: string;
  processDescription: string;
  processStepsJson: string;
  founderHeading: string;
  founderName: string;
  founderTitle: string;
  founderShortBio: string;
  founderLongBio: string;
  founderImageUrl: string;
  founderEducation: string;
  founderLocation: string;
  founderTimelineJson: string;
  founderSocialLinksJson: string;
  leadHeading: string;
  leadDescription: string;
  leadSuccessMessage: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  organizationName: string;
  organizationLogoUrl: string;
};

const emptySettings: SettingsDraft = {
  heroEyebrow: "",
  targetAudience: "",
  tagline: "",
  valueProposition: "",
  description: "",
  availability: "",
  responseTime: "",
  primaryCtaLabel: "",
  primaryCtaLink: "",
  secondaryCtaLabel: "",
  secondaryCtaLink: "",
  trustHeading: "",
  proofHeading: "",
  servicePackagesHeading: "",
  servicePackagesDescription: "",
  caseStudiesHeading: "",
  caseStudiesDescription: "",
  portfolioHeading: "",
  portfolioDescription: "",
  processHeading: "",
  processDescription: "",
  processStepsJson: "[]",
  founderHeading: "",
  founderName: "",
  founderTitle: "",
  founderShortBio: "",
  founderLongBio: "",
  founderImageUrl: "",
  founderEducation: "",
  founderLocation: "",
  founderTimelineJson: "[]",
  founderSocialLinksJson: "[]",
  leadHeading: "",
  leadDescription: "",
  leadSuccessMessage: "",
  seoTitle: "",
  seoDescription: "",
  ogImageUrl: "",
  organizationName: "",
  organizationLogoUrl: "",
};

export function ConversionSettingsAdmin({
  initialData,
  isLoading,
  isSaving,
  onSave,
}: {
  initialData?: any;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (settings: any) => void;
}) {
  const [settings, setSettings] = useState<SettingsDraft>(emptySettings);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setSettings({
      ...emptySettings,
      ...Object.fromEntries(
        Object.keys(emptySettings)
          .filter((key) => !key.endsWith("Json"))
          .map((key) => [key, initialData[key] ?? ""]),
      ),
      processStepsJson: JSON.stringify(initialData.processSteps ?? [], null, 2),
      founderTimelineJson: JSON.stringify(initialData.founderTimeline ?? [], null, 2),
      founderSocialLinksJson: JSON.stringify(initialData.founderSocialLinks ?? [], null, 2),
    } as SettingsDraft);
    setDirty(false);
    setError("");
  }, [initialData]);

  const update = (key: keyof SettingsDraft, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setError("");
  };

  const save = () => {
    try {
      const { processStepsJson, founderTimelineJson, founderSocialLinksJson, ...text } = settings;
      onSave({
        ...text,
        processSteps: parseJsonArray(processStepsJson, "Process steps"),
        founderTimeline: parseJsonArray(founderTimelineJson, "Founder timeline"),
        founderSocialLinks: parseJsonArray(founderSocialLinksJson, "Founder social links"),
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Check the JSON fields and try again.");
    }
  };

  if (isLoading) return <LoadingEditor />;

  return (
    <div className="space-y-10">
      <SectionHeader
        icon={SearchCheck}
        title="Positioning, Founder & SEO"
        description="Control the conversion narrative, delivery process, founder credibility, enquiry copy, and search metadata."
      />

      <EditorSection title="Hero positioning" description="Make the audience, outcome, and next action obvious in the first screen.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Eyebrow" field="heroEyebrow" value={settings.heroEyebrow} onChange={update} />
          <TextField label="Target audience" field="targetAudience" value={settings.targetAudience} onChange={update} />
        </div>
        <TextField label="Headline" field="tagline" value={settings.tagline} onChange={update} />
        <AreaField label="Value proposition" field="valueProposition" value={settings.valueProposition} onChange={update} />
        <AreaField label="Supporting description" field="description" value={settings.description} onChange={update} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Availability" field="availability" value={settings.availability} onChange={update} />
          <TextField label="Response time" field="responseTime" value={settings.responseTime} onChange={update} />
          <TextField label="Primary CTA label" field="primaryCtaLabel" value={settings.primaryCtaLabel} onChange={update} />
          <TextField label="Primary CTA URL" field="primaryCtaLink" value={settings.primaryCtaLink} onChange={update} />
          <TextField label="Secondary CTA label" field="secondaryCtaLabel" value={settings.secondaryCtaLabel} onChange={update} />
          <TextField label="Secondary CTA URL" field="secondaryCtaLink" value={settings.secondaryCtaLink} onChange={update} />
        </div>
      </EditorSection>

      <EditorSection title="Section messaging" description="Headings used across proof, offers, case studies, portfolio, and process.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Trust heading" field="trustHeading" value={settings.trustHeading} onChange={update} />
          <TextField label="Proof heading" field="proofHeading" value={settings.proofHeading} onChange={update} />
          <TextField label="Service packages heading" field="servicePackagesHeading" value={settings.servicePackagesHeading} onChange={update} />
          <TextField label="Case studies heading" field="caseStudiesHeading" value={settings.caseStudiesHeading} onChange={update} />
          <TextField label="Portfolio heading" field="portfolioHeading" value={settings.portfolioHeading} onChange={update} />
          <TextField label="Process heading" field="processHeading" value={settings.processHeading} onChange={update} />
        </div>
        <AreaField label="Service packages description" field="servicePackagesDescription" value={settings.servicePackagesDescription} onChange={update} />
        <AreaField label="Case studies description" field="caseStudiesDescription" value={settings.caseStudiesDescription} onChange={update} />
        <AreaField label="Portfolio description" field="portfolioDescription" value={settings.portfolioDescription} onChange={update} />
        <AreaField label="Process description" field="processDescription" value={settings.processDescription} onChange={update} />
        <JsonField label="Process steps (JSON)" hint='Array of {"title":"...","description":"..."}.' field="processStepsJson" value={settings.processStepsJson} onChange={update} />
      </EditorSection>

      <EditorSection title="Founder profile" description="The founder-led story shown to prospective clients.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Section heading" field="founderHeading" value={settings.founderHeading} onChange={update} />
          <TextField label="Name" field="founderName" value={settings.founderName} onChange={update} />
          <TextField label="Title" field="founderTitle" value={settings.founderTitle} onChange={update} />
          <TextField label="Location" field="founderLocation" value={settings.founderLocation} onChange={update} />
          <TextField label="Image URL" field="founderImageUrl" value={settings.founderImageUrl} onChange={update} />
          <TextField label="Education" field="founderEducation" value={settings.founderEducation} onChange={update} />
        </div>
        <AreaField label="Short bio" field="founderShortBio" value={settings.founderShortBio} onChange={update} />
        <AreaField label="Long bio" field="founderLongBio" value={settings.founderLongBio} onChange={update} rows={8} />
        <JsonField label="Timeline (JSON)" hint='Array of {"label":"...","title":"...","description":"..."}.' field="founderTimelineJson" value={settings.founderTimelineJson} onChange={update} />
        <JsonField label="Social links (JSON)" hint='Array of {"label":"LinkedIn","url":"https://..."}.' field="founderSocialLinksJson" value={settings.founderSocialLinksJson} onChange={update} />
      </EditorSection>

      <EditorSection title="Enquiry funnel" description="Set expectations around the qualified project brief.">
        <TextField label="Heading" field="leadHeading" value={settings.leadHeading} onChange={update} />
        <AreaField label="Description" field="leadDescription" value={settings.leadDescription} onChange={update} />
        <AreaField label="Success message" field="leadSuccessMessage" value={settings.leadSuccessMessage} onChange={update} />
      </EditorSection>

      <EditorSection title="Search & organization" description="Default metadata and structured-data identity.">
        <TextField label="SEO title" field="seoTitle" value={settings.seoTitle} onChange={update} />
        <AreaField label="SEO description" field="seoDescription" value={settings.seoDescription} onChange={update} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Social image URL" field="ogImageUrl" value={settings.ogImageUrl} onChange={update} />
          <TextField label="Organization name" field="organizationName" value={settings.organizationName} onChange={update} />
          <TextField label="Organization logo URL" field="organizationLogoUrl" value={settings.organizationLogoUrl} onChange={update} />
        </div>
      </EditorSection>

      <SaveBar dirty={dirty} saving={isSaving} error={error} label="settings" onSave={save} />
    </div>
  );
}

function EditorSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function TextField({ label, field, value, onChange }: { label: string; field: keyof SettingsDraft; value: string; onChange: (field: keyof SettingsDraft, value: string) => void }) {
  return <Field label={label}><Input value={value} onChange={(event) => onChange(field, event.target.value)} /></Field>;
}

function AreaField({ label, field, value, onChange, rows = 4 }: { label: string; field: keyof SettingsDraft; value: string; rows?: number; onChange: (field: keyof SettingsDraft, value: string) => void }) {
  return <Field label={label}><Textarea rows={rows} value={value} onChange={(event) => onChange(field, event.target.value)} /></Field>;
}

function JsonField({ label, hint, field, value, onChange }: { label: string; hint: string; field: keyof SettingsDraft; value: string; onChange: (field: keyof SettingsDraft, value: string) => void }) {
  return <Field label={label} hint={hint}><Textarea className="min-h-44 font-mono text-xs" value={value} onChange={(event) => onChange(field, event.target.value)} /></Field>;
}
