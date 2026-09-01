"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote, Plus, Trash2 } from "lucide-react";

import { SectionHeader } from "@/components/admin/SectionHeader";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Field, LoadingEditor, SaveBar, ToggleField } from "./conversion-editor-shared";

export function SocialProofAdmin({ clientLogos: initialLogos, testimonials: initialTestimonials, isLoading, isSaving, onSave }: { clientLogos?: any[]; testimonials?: any[]; isLoading: boolean; isSaving: boolean; onSave: (value: { clientLogos: any[]; testimonials: any[] }) => void }) {
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setClientLogos((initialLogos ?? []).map((item, order) => ({ ...item, websiteUrl: item.websiteUrl ?? "", altText: item.altText ?? "", order })));
    setTestimonials((initialTestimonials ?? []).map((item, order) => ({ ...item, position: item.position ?? "", imageUrl: item.imageUrl ?? "", company: item.company ?? "", companyLogoUrl: item.companyLogoUrl ?? "", sourceUrl: item.sourceUrl ?? "", projectId: item.projectId ?? "", order })));
    setDirty(false);
  }, [initialLogos, initialTestimonials]);

  const updateLogo = (index: number, values: any) => { setClientLogos((items) => items.map((item, i) => i === index ? { ...item, ...values } : item)); setDirty(true); setError(""); };
  const updateTestimonial = (index: number, values: any) => { setTestimonials((items) => items.map((item, i) => i === index ? { ...item, ...values } : item)); setDirty(true); setError(""); };
  const save = () => {
    const logos = clientLogos.map((item, order) => ({ ...item, name: item.name.trim(), logoUrl: item.logoUrl.trim(), websiteUrl: item.websiteUrl.trim(), altText: item.altText.trim(), order }));
    const quotes = testimonials.map((item, order) => ({ ...item, name: item.name.trim(), position: item.position.trim(), comment: item.comment.trim(), imageUrl: item.imageUrl.trim(), company: item.company.trim(), companyLogoUrl: item.companyLogoUrl.trim(), sourceUrl: item.sourceUrl.trim(), projectId: item.projectId.trim(), order }));
    if (logos.some((item) => !item.name || !item.logoUrl)) return setError("Every client logo needs a name and image URL.");
    if (quotes.some((item) => !item.name || !item.comment)) return setError("Every testimonial needs a name and quote.");
    if (logos.some((item) => item.isPublished && !item.consentGranted) || quotes.some((item) => item.isPublished && (!item.isVerified || !item.consentGranted))) return setError("Published social proof must be verified and have recorded consent.");
    onSave({ clientLogos: logos, testimonials: quotes });
  };
  if (isLoading) return <LoadingEditor />;

  return (
    <div className="space-y-10">
      <SectionHeader icon={MessageSquareQuote} title="Verified Social Proof" description="Publish client identities, logos, and quotes only after verification and explicit consent." />
      <section className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Client logos</h3><p className="text-sm text-muted-foreground">Only consented logos are exposed publicly.</p></div><Button variant="outline" size="sm" onClick={() => { setClientLogos((items) => [...items, { name: "", logoUrl: "", websiteUrl: "", altText: "", consentGranted: false, isPublished: false }]); setDirty(true); }}><Plus className="size-4" /> Add logo</Button></div>
        {clientLogos.map((item, index) => <div key={item.id ?? index} className="space-y-4 rounded-2xl border bg-card p-5"><div className="flex justify-end"><Button variant="ghost" size="icon-sm" aria-label="Remove logo" onClick={() => { setClientLogos((items) => items.filter((_, i) => i !== index)); setDirty(true); }}><Trash2 className="size-4" /></Button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Client name"><Input value={item.name} onChange={(e) => updateLogo(index, { name: e.target.value })} /></Field><Field label="Logo URL"><Input value={item.logoUrl} onChange={(e) => updateLogo(index, { logoUrl: e.target.value })} /></Field><Field label="Website URL"><Input value={item.websiteUrl} onChange={(e) => updateLogo(index, { websiteUrl: e.target.value })} /></Field><Field label="Alt text"><Input value={item.altText} onChange={(e) => updateLogo(index, { altText: e.target.value })} /></Field></div><div className="grid gap-3 md:grid-cols-2"><ToggleField label="Consent recorded" description="Permission to display this logo." checked={Boolean(item.consentGranted)} onCheckedChange={(value) => updateLogo(index, { consentGranted: value })} /><ToggleField label="Published" description="Display on the public proof strip." checked={Boolean(item.isPublished)} onCheckedChange={(value) => updateLogo(index, { isPublished: value })} /></div></div>)}
      </section>
      <section className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Testimonials</h3><p className="text-sm text-muted-foreground">Unverified template quotes stay hidden.</p></div><Button variant="outline" size="sm" onClick={() => { setTestimonials((items) => [...items, { name: "", position: "", comment: "", imageUrl: "", company: "", companyLogoUrl: "", sourceUrl: "", projectId: "", isVerified: false, consentGranted: false, isPublished: false }]); setDirty(true); }}><Plus className="size-4" /> Add testimonial</Button></div>
        {testimonials.map((item, index) => <div key={item.id ?? index} className="space-y-4 rounded-2xl border bg-card p-5"><div className="flex justify-end"><Button variant="ghost" size="icon-sm" aria-label="Remove testimonial" onClick={() => { setTestimonials((items) => items.filter((_, i) => i !== index)); setDirty(true); }}><Trash2 className="size-4" /></Button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Name"><Input value={item.name} onChange={(e) => updateTestimonial(index, { name: e.target.value })} /></Field><Field label="Role"><Input value={item.position} onChange={(e) => updateTestimonial(index, { position: e.target.value })} /></Field><Field label="Company"><Input value={item.company} onChange={(e) => updateTestimonial(index, { company: e.target.value })} /></Field><Field label="Person image URL"><Input value={item.imageUrl} onChange={(e) => updateTestimonial(index, { imageUrl: e.target.value })} /></Field><Field label="Company logo URL"><Input value={item.companyLogoUrl} onChange={(e) => updateTestimonial(index, { companyLogoUrl: e.target.value })} /></Field><Field label="Verification source URL"><Input value={item.sourceUrl} onChange={(e) => updateTestimonial(index, { sourceUrl: e.target.value })} /></Field><Field label="Linked project ID"><Input value={item.projectId} onChange={(e) => updateTestimonial(index, { projectId: e.target.value })} /></Field></div><Field label="Quote"><Textarea value={item.comment} onChange={(e) => updateTestimonial(index, { comment: e.target.value })} /></Field><div className="grid gap-3 md:grid-cols-3"><ToggleField label="Verified" description="Identity and quote checked." checked={Boolean(item.isVerified)} onCheckedChange={(value) => updateTestimonial(index, { isVerified: value })} /><ToggleField label="Consent recorded" description="Permission to publish." checked={Boolean(item.consentGranted)} onCheckedChange={(value) => updateTestimonial(index, { consentGranted: value })} /><ToggleField label="Published" description="Display publicly." checked={Boolean(item.isPublished)} onCheckedChange={(value) => updateTestimonial(index, { isPublished: value })} /></div></div>)}
      </section>
      <SaveBar dirty={dirty} saving={isSaving} error={error} label="social proof" onSave={save} />
    </div>
  );
}
