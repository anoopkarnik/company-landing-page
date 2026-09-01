"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

import type {
  LeadInput,
  PublicServicePackage,
} from "@/lib/ts-types/conversion";
import { useTRPC } from "@/trpc/client";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Checkbox } from "@workspace/ui/components/shadcn/checkbox";
import { Input } from "@workspace/ui/components/shadcn/input";
import { Label } from "@workspace/ui/components/shadcn/label";
import { Progress } from "@workspace/ui/components/shadcn/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";
import { Textarea } from "@workspace/ui/components/shadcn/textarea";
import { cn } from "@workspace/ui/lib/utils";

import { SectionHeading } from "./ConversionPrimitives";
import { trackConversionEvent } from "@/lib/analytics/conversion-events";

const budgetOptions = [
  "Not sure yet",
  "Under $2,500",
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000+",
];
const timelineOptions = [
  "Exploring options",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Flexible",
];

const initialLead: LeadInput = {
  name: "",
  email: "",
  company: "",
  service: "",
  problem: "",
  currentSystems: "",
  budget: "",
  timeline: "",
  contactConsent: false,
};

export function ProjectEnquiryForm({
  services,
  appointmentLink,
  heading,
  description,
  successMessage,
}: {
  services: PublicServicePackage[];
  appointmentLink?: string | null;
  heading?: string | null;
  description?: string | null;
  successMessage?: string | null;
}) {
  const trpc = useTRPC();
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState(initialLead);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const createLead = useMutation(
    trpc.conversion.createLead.mutationOptions({
      onSuccess: () => {
        setSubmitted(true);
        setError("");
        trackConversionEvent("lead_submitted", {
          service: lead.service,
          budget: lead.budget || null,
          timeline: lead.timeline || null,
        });
      },
      onError: (mutationError) => {
        setError(
          mutationError.message ||
            "Your brief could not be sent. Please try again in a moment.",
        );
      },
    }),
  );

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("service");
    if (!selected) return;
    const match = services.find(
      (service) => service.slug === selected || service.title === selected,
    );
    if (match) {
      setLead((current) => ({ ...current, service: match.title }));
    }
  }, [services]);

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  const update = <Key extends keyof LeadInput>(key: Key, value: LeadInput[Key]) => {
    setLead((current) => ({ ...current, [key]: value }));
    setError("");
  };

  function nextStep() {
    if (step === 0 && !lead.service.trim()) {
      setError("Choose the kind of help you need.");
      return;
    }
    if (step === 1 && lead.problem.trim().length < 20) {
      setError("Tell me a little more about the problem (at least 20 characters).");
      return;
    }
    setError("");
    if (step === 0) {
      trackConversionEvent("lead_form_started", { service: lead.service });
    }
    trackConversionEvent("lead_form_step_completed", {
      step: step + 1,
      service: lead.service,
    });
    setStep((current) => Math.min(current + 1, 2));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lead.name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(lead.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!lead.contactConsent) {
      setError("Confirm that I may contact you about this project.");
      return;
    }
    if (website) {
      setSubmitted(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    createLead.mutate({
      name: lead.name.trim(),
      email: lead.email.trim(),
      company: lead.company?.trim() || undefined,
      service: lead.service,
      problem: lead.problem.trim(),
      currentSystems: lead.currentSystems?.trim() || undefined,
      budget: lead.budget || undefined,
      timeline: lead.timeline || undefined,
      contactConsent: true,
      sourcePath: window.location.pathname,
      referrer: document.referrer || undefined,
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      utmContent: params.get("utm_content") || undefined,
      utmTerm: params.get("utm_term") || undefined,
    });
  }

  const cleanAppointmentLink = appointmentLink?.trim();

  return (
    <section
      id="start-project"
      className="relative scroll-mt-20 overflow-hidden border-t bg-muted/25"
      data-track-section="project-enquiry"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,hsl(var(--primary)/0.12),transparent_35%)]" />
      <div className="container relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="Start a project"
            title={heading || "Tell me what needs to change"}
            description={description || "A short brief is enough. I’ll review the problem, constraints, and fit before suggesting a next step."}
          />
          <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
            {[
              "No polished specification required",
              "Your brief stays private",
              "A clear response, even when the fit is not right",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border bg-background p-5 shadow-xl sm:p-8">
          {submitted ? (
            <div className="flex min-h-[440px] flex-col items-center justify-center text-center" aria-live="polite">
              <span className="grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Your brief is in</h2>
              <p className="mt-3 max-w-md leading-7 text-muted-foreground">
                {successMessage || `Thanks, ${lead.name || "there"}. I’ll review the context and reply to ${lead.email || "your email"} with a useful next step.`}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {cleanAppointmentLink ? (
                  <Button asChild>
                    <a
                      href={cleanAppointmentLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-track="post-lead-appointment"
                    >
                      <CalendarCheck2 aria-hidden="true" /> Book a call
                    </a>
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link href="/case-studies">Explore case studies</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate data-track="lead-form">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Step {step + 1} of 3</p>
                  <p className="text-xs text-muted-foreground">
                    {step === 0
                      ? "What do you need?"
                      : step === 1
                        ? "What should change?"
                        : "Where should I reply?"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">About 2 minutes</span>
              </div>
              <Progress value={progress} className="mt-4" aria-label={`${Math.round(progress)}% complete`} />

              <div className="mt-8 min-h-[330px]">
                {step === 0 ? (
                  <fieldset>
                    <legend className="text-lg font-semibold">What kind of help are you looking for?</legend>
                    <p className="mt-1 text-sm text-muted-foreground">Choose the closest option. We can refine it later.</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {[...services.map((service) => service.title), "Something else"].map((option) => (
                        <label
                          key={option}
                          className={cn(
                            "cursor-pointer rounded-xl border p-4 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5",
                            lead.service === option && "border-primary bg-primary/5 ring-1 ring-primary/30",
                          )}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={option}
                            checked={lead.service === option}
                            onChange={() => update("service", option)}
                            className="sr-only"
                          />
                          <span className="flex items-center justify-between gap-3">
                            {option}
                            <span className={cn("size-3 rounded-full border", lead.service === option && "border-primary bg-primary ring-2 ring-primary/20")} />
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                {step === 1 ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="lead-problem">What problem or opportunity should this project address?</Label>
                      <Textarea
                        id="lead-problem"
                        value={lead.problem}
                        onChange={(event) => update("problem", event.target.value)}
                        placeholder="For example: Our team spends two days each month combining reports by hand..."
                        rows={5}
                        required
                      />
                      <p className="text-right text-xs text-muted-foreground">{lead.problem.length} characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-systems">Current tools or systems (optional)</Label>
                      <Input
                        id="lead-systems"
                        value={lead.currentSystems}
                        onChange={(event) => update("currentSystems", event.target.value)}
                        placeholder="e.g. Google Sheets, HubSpot, an existing Next.js app"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="lead-budget">Budget range (optional)</Label>
                        <Select
                          value={lead.budget}
                          onValueChange={(value) => update("budget", value)}
                        >
                          <SelectTrigger id="lead-budget" className="w-full">
                            <SelectValue placeholder="Select a range" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lead-timeline">Desired timing (optional)</Label>
                        <Select
                          value={lead.timeline}
                          onValueChange={(value) => update("timeline", value)}
                        >
                          <SelectTrigger id="lead-timeline" className="w-full">
                            <SelectValue placeholder="Select timing" />
                          </SelectTrigger>
                          <SelectContent>
                            {timelineOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="lead-name">Your name</Label>
                        <Input id="lead-name" autoComplete="name" value={lead.name} onChange={(event) => update("name", event.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lead-company">Company (optional)</Label>
                        <Input id="lead-company" autoComplete="organization" value={lead.company} onChange={(event) => update("company", event.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-email">Work email</Label>
                      <Input id="lead-email" type="email" autoComplete="email" value={lead.email} onChange={(event) => update("email", event.target.value)} required />
                    </div>
                    <div className="sr-only" aria-hidden="true">
                      <Label htmlFor="lead-website">Website</Label>
                      <Input id="lead-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/30 p-4 text-sm leading-6">
                      <Checkbox checked={lead.contactConsent} onCheckedChange={(checked) => update("contactConsent", checked === true)} className="mt-1" />
                      <span>
                        You may contact me about this project. I understand my details will be handled according to the{" "}
                        <Link href="/legal/privacy-policy" className="font-medium text-primary underline-offset-4 hover:underline">privacy policy</Link>.
                      </span>
                    </label>
                    <div className="rounded-xl bg-muted/50 p-4 text-sm">
                      <p className="font-medium">Brief summary</p>
                      <dl className="mt-2 grid gap-2 text-muted-foreground sm:grid-cols-2">
                        <div><dt className="text-xs">Service</dt><dd className="text-foreground">{lead.service}</dd></div>
                        {lead.timeline ? <div><dt className="text-xs">Timing</dt><dd className="text-foreground">{lead.timeline}</dd></div> : null}
                      </dl>
                    </div>
                  </div>
                ) : null}
              </div>

              <p className="min-h-6 text-sm text-destructive" role="alert" aria-live="polite">{error}</p>
              <div className="mt-3 flex items-center justify-between gap-3 border-t pt-5">
                <Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0 || createLead.isPending}>
                  <ArrowLeft aria-hidden="true" /> Back
                </Button>
                {step < 2 ? (
                  <Button type="button" onClick={nextStep} data-track="lead-form-next">
                    Continue <ArrowRight aria-hidden="true" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={createLead.isPending} data-track="lead-form-submit">
                    {createLead.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                    {createLead.isPending ? "Sending…" : "Send project brief"}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
