/**
 * Turns a case study's `architectureMdx` into the stages of a workflow
 * diagram.
 *
 * Every case study documents its architecture as a numbered list, which is
 * already a pipeline in prose form. These helpers reduce that list to the
 * handful of large stages a cover image can show legibly at card size, so the
 * cover explains *how the system works* rather than restating the title and
 * tech badges that the card markup already renders beside it.
 */
import { buildCoverCardData, type CaseStudyCoverSource } from "./case-study-cover";

/** One node in the rendered pipeline. */
export type DiagramStage = {
  label: string;
  tech?: string;
  caption?: string;
};

/** A single numbered step lifted out of `architectureMdx`. */
export type ArchitectureStep = {
  /** The bold lead-in the author wrote, when there is one. */
  label: string | null;
  detail: string;
};

export type CoverDiagram = {
  slug: string;
  eyebrow: string;
  title: string;
  wordmark: string;
  stages: DiagramStage[];
  /** Which path produced the stages — useful in the backfill script's log. */
  source: "curated" | "derived";
};

/** More nodes than this stop being readable in a 400px-wide card. */
export const MAX_STAGES = 5;

const CAPTION_LENGTH = 36;

/** A node label is the largest text in the card; past this it stops fitting. */
const LABEL_MAX_CHARS = 22;

/**
 * Authors write architecture lead-ins as sentences ("Provider connectors —
 * outside my scope"), but a diagram node needs a name. Keep the head of the
 * phrase, drop the qualifier after a dash or comma, then clamp.
 */
const LABEL_QUALIFIER = /\s+[—–-]\s+|[:,;]\s+/;

export function tidyLabel(label: string): string {
  const [head] = String(label ?? "").trim().split(LABEL_QUALIFIER);
  return clampText(head ?? "", LABEL_MAX_CHARS);
}

const NUMBERED_STEP = /^\s*\d+[.)]\s+(.*)$/;
const BOLD_LEAD_IN = /^\*\*(.+?):?\*\*:?\s*(.*)$/;

function stripEmphasis(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/(?<!\w)\*(.*?)\*(?!\w)/g, "$1");
}

/**
 * Pull the numbered steps out of an architecture write-up, ignoring headings
 * and surrounding prose. A `**Bold lead-in:**` becomes the step's label.
 */
export function parseArchitectureSteps(
  architectureMdx: string | null | undefined,
): ArchitectureStep[] {
  if (typeof architectureMdx !== "string") return [];

  const steps: ArchitectureStep[] = [];

  for (const line of architectureMdx.split(/\r?\n/)) {
    const numbered = line.match(NUMBERED_STEP);
    if (!numbered) continue;

    const body = numbered[1].trim();
    const leadIn = body.match(BOLD_LEAD_IN);

    steps.push(
      leadIn
        ? { label: stripEmphasis(leadIn[1]).trim(), detail: stripEmphasis(leadIn[2]).trim() }
        : { label: null, detail: stripEmphasis(body).trim() },
    );
  }

  return steps;
}

/**
 * Shorten text to fit a caption slot, breaking on a word boundary and leaving
 * no dangling punctuation in front of the ellipsis.
 */
export function clampText(text: string, maxLength: number): string {
  const normalized = String(text ?? "").trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;

  const cut = normalized.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;

  return `${base.replace(/[\s,.;:—–-]+$/, "")}…`;
}

/**
 * Sample at most `max` items while always keeping the first and last, so a
 * compressed pipeline still starts where the real one starts and ends where it
 * ends.
 */
export function selectEvenly<T>(items: T[], max: number): T[] {
  if (max <= 0 || items.length === 0) return [];
  if (items.length <= max) return [...items];
  if (max === 1) return [items[0]];

  const stride = (items.length - 1) / (max - 1);
  const picked: T[] = [items[0]];

  for (let position = 1; position < max - 1; position += 1) {
    picked.push(items[Math.round(position * stride)]);
  }

  picked.push(items[items.length - 1]);
  return picked;
}

/**
 * Find the technology a step is about. When a step names several — "n8n posts
 * the image to the internal PaddleOCR service" names two — prefer one no
 * earlier stage has claimed, so consecutive nodes describe distinct components
 * instead of repeating the orchestrator that appears in every sentence.
 */
function findTechnology(
  text: string,
  technologies: string[],
  alreadyUsed?: Set<string>,
): string | undefined {
  const haystack = text.toLowerCase();
  const matches = technologies.filter(
    (technology) => technology && haystack.includes(technology.toLowerCase()),
  );

  return (
    matches.find((technology) => !alreadyUsed?.has(technology.toLowerCase())) ??
    matches[0]
  );
}

/**
 * Build diagram nodes from parsed steps. The label prefers the author's bold
 * lead-in, then the technology the step names, and only then a bare step
 * number — a deliberate quality ladder rather than guessing a noun phrase out
 * of the prose.
 */
export function deriveStagesFromSteps(
  steps: ArchitectureStep[],
  technologies: string[] = [],
  maxStages: number = MAX_STAGES,
): DiagramStage[] {
  const claimedTechnologies = new Set<string>();

  return selectEvenly(
    steps.map((step, index) => {
      const technology = findTechnology(
        step.detail,
        technologies,
        claimedTechnologies,
      );
      if (technology) claimedTechnologies.add(technology.toLowerCase());
      const label = tidyLabel(step.label ?? technology ?? `Step ${index + 1}`);

      return {
        label,
        tech: technology && technology !== label ? technology : undefined,
        caption: clampText(step.detail, CAPTION_LENGTH),
      };
    }),
    maxStages,
  );
}

/**
 * Assemble everything the cover renderer needs. A curated stage spec always
 * wins; otherwise the stages are derived from the case study's own
 * architecture steps so newly added case studies still get a diagram.
 */
export function buildCoverDiagram(
  caseStudy: CaseStudyCoverSource & { architectureMdx?: string | null },
  options: {
    curatedStages?: DiagramStage[];
    wordmark?: string;
    maxStages?: number;
  } = {},
): CoverDiagram {
  const card = buildCoverCardData(caseStudy, { wordmark: options.wordmark });

  const curated = options.curatedStages?.filter((stage) => stage?.label);
  const stages = curated?.length
    ? curated
        .slice(0, options.maxStages ?? MAX_STAGES)
        .map((stage) => ({ ...stage, label: tidyLabel(stage.label) }))
    : deriveStagesFromSteps(
        parseArchitectureSteps(caseStudy.architectureMdx),
        card.technologies,
        options.maxStages ?? MAX_STAGES,
      );

  if (!stages.length) {
    throw new Error(
      `Case study "${card.slug}" has no architecture steps and no curated diagram to draw`,
    );
  }

  return {
    slug: card.slug,
    eyebrow: card.eyebrow,
    title: card.title,
    wordmark: card.wordmark,
    stages,
    source: curated?.length ? "curated" : "derived",
  };
}
