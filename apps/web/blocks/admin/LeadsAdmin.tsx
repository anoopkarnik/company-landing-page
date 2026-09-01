"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, Mail, Search } from "lucide-react";

import { SectionHeader } from "@/components/admin/SectionHeader";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { Badge } from "@workspace/ui/components/shadcn/badge";
import { LoadingEditor } from "./conversion-editor-shared";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST", "SPAM"] as const;
const priorities = ["LOW", "NORMAL", "HIGH"] as const;

export function LeadsAdmin({ initialData, isLoading, isSaving, onUpdate }: { initialData?: any[]; isLoading: boolean; isSaving: boolean; onUpdate: (lead: any) => void }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => setLeads(initialData ?? []), [initialData]);

  const visible = useMemo(() => leads.filter((lead) => {
    if (statusFilter !== "ALL" && lead.status !== statusFilter) return false;
    const needle = search.trim().toLowerCase();
    return !needle || [lead.name, lead.email, lead.company, lead.service, lead.problem].filter(Boolean).join(" ").toLowerCase().includes(needle);
  }), [leads, search, statusFilter]);

  const update = (id: string, values: Record<string, string>) => setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, ...values } : lead));

  if (isLoading) return <LoadingEditor />;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Inbox} title="Project Leads" description="Review qualified briefs, preserve acquisition context, and move opportunities through a simple pipeline." />
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search name, company, service, or problem" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="ALL">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
      </div>
      <p className="text-sm text-muted-foreground">Showing {visible.length} of {leads.length} enquiries</p>
      <div className="space-y-4">
        {visible.map((lead) => (
          <article key={lead.id} className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-semibold">{lead.name}</h3><Badge variant={lead.status === "NEW" ? "default" : "secondary"}>{lead.status}</Badge>{lead.priority === "HIGH" ? <Badge variant="destructive">High priority</Badge> : null}</div>
                <p className="mt-1 text-sm text-muted-foreground">{[lead.company, lead.service].filter(Boolean).join(" · ")}</p>
                <a className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline" href={`mailto:${lead.email}`}><Mail className="size-4" />{lead.email}</a>
              </div>
              <time className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.createdAt))}</time>
            </div>
            <div className="mt-5 rounded-xl bg-muted/40 p-4"><p className="whitespace-pre-wrap text-sm leading-6">{lead.problem}</p>{lead.currentSystems ? <p className="mt-3 text-xs text-muted-foreground"><strong>Current systems:</strong> {lead.currentSystems}</p> : null}</div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-xs text-muted-foreground">Budget</dt><dd>{lead.budget || "Not provided"}</dd></div><div><dt className="text-xs text-muted-foreground">Timeline</dt><dd>{lead.timeline || "Not provided"}</dd></div><div><dt className="text-xs text-muted-foreground">Source</dt><dd>{lead.utmSource || lead.sourcePath || "Direct"}</dd></div></dl>
            <div className="mt-5 grid gap-4 md:grid-cols-[170px_150px_1fr_auto] md:items-end">
              <label className="grid gap-1.5 text-sm"><span className="font-medium">Status</span><select className="h-9 rounded-md border bg-background px-3" value={lead.status} onChange={(event) => update(lead.id, { status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm"><span className="font-medium">Priority</span><select className="h-9 rounded-md border bg-background px-3" value={lead.priority} onChange={(event) => update(lead.id, { priority: event.target.value })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm"><span className="font-medium">Private notes</span><Textarea rows={2} value={lead.notes ?? ""} onChange={(event) => update(lead.id, { notes: event.target.value })} /></label>
              <Button disabled={isSaving} onClick={() => onUpdate({ id: lead.id, status: lead.status, priority: lead.priority, notes: lead.notes ?? "" })}>{isSaving ? "Saving…" : "Save"}</Button>
            </div>
          </article>
        ))}
        {!visible.length ? <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No enquiries match this view.</div> : null}
      </div>
    </div>
  );
}
