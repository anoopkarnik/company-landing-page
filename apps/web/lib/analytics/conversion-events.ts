"use client";

import { track } from "@vercel/analytics";

type ConversionEvent =
  | "cta_clicked"
  | "case_study_opened"
  | "portfolio_filtered"
  | "lead_form_started"
  | "lead_form_step_completed"
  | "lead_submitted";

export function trackConversionEvent(
  event: ConversionEvent,
  properties: Record<string, string | number | boolean | null | undefined> = {},
) {
  track(event, properties);
}
