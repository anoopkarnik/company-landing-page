/**
 * Curated workflow diagrams for case study cover images.
 *
 * Each spec is a hand-tightened reading of that case study's own
 * `architectureMdx` numbered steps — same pipeline, phrased short enough to
 * stay legible when the cover renders at card size. Case studies absent from
 * this map fall back to stages derived automatically from their architecture
 * steps (see `deriveStagesFromSteps`), so a new case study still gets a cover.
 *
 * Keep a spec to at most `MAX_STAGES` nodes, and keep `label` to a single
 * short word where possible — it is the largest text in the node.
 */
import type { DiagramStage } from "@/lib/functions/case-study-diagram";

/**
 * Curated diagrams for portfolio projects that have no linked case study to
 * borrow an architecture from. Projects with a linked case study reuse that
 * case study's pipeline instead, so the two stay in step.
 */
export const PROJECT_DIAGRAMS: Record<string, DiagramStage[]> = {
  // Derived from the project description: a GitHub repository becomes a
  // levelled, quizzed learning path with progress tracking.
  "git-grasp": [
    { label: "Connect", tech: "GitHub", caption: "Any public repository" },
    { label: "Analyze", tech: "AI", caption: "Structure and key concepts" },
    { label: "Syllabus", tech: "Levels", caption: "Personalized path" },
    { label: "Quiz", tech: "Checks", caption: "Grasp measured per level" },
    { label: "Track", tech: "Progress", caption: "Faster team ramp-up" },
  ],
};

export const CASE_STUDY_DIAGRAMS: Record<string, DiagramStage[]> = {
  "financial-document-ocr-pipeline": [
    { label: "Upload", tech: "Next.js", caption: "Screenshot + context" },
    { label: "Route", tech: "n8n", caption: "Webhook by table type" },
    { label: "Extract", tech: "PaddleOCR", caption: "Table-aware OCR" },
    { label: "Normalize", tech: "LLM parser", caption: "Fixed row schema" },
    { label: "Append", tech: "Google Sheets", caption: "Reviewable rows" },
  ],

  "automated-ga4-search-reporting": [
    { label: "Schedule", tech: "n8n", caption: "Dates + report config" },
    { label: "Collect", tech: "GA4 · Search Console", caption: "Dimensions + metrics" },
    { label: "Chart", tech: "QuickChart", caption: "Deterministic visuals" },
    { label: "Draft", tech: "Constrained AI", caption: "Evidence-linked notes" },
    { label: "Assemble", tech: "Google Docs", caption: "Templated, reviewed" },
  ],

  "voice-driven-restaurant-ordering": [
    { label: "Speak", tech: "Vapi", caption: "Transcribed intent" },
    { label: "Route", tech: "n8n", caption: "Intent to tool flow" },
    { label: "Ground", tech: "Menu sheet", caption: "Canonical items + prices" },
    { label: "Confirm", tech: "Agent", caption: "One detail at a time" },
    { label: "Write", tech: "Orders sheet", caption: "Only after confirm" },
  ],
};
