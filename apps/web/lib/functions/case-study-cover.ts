/**
 * Derivation helpers for generated case study cover images.
 *
 * Case studies authored in the admin CMS often ship without a cover image.
 * These helpers turn a case study row into the content of a branded cover card
 * and into the R2 object key that card is stored under. Everything here is
 * pure so the backfill script's decisions stay testable without Postgres, R2,
 * or a rasterizer.
 */

/** The subset of a case study row the cover generator reads. */
export type CaseStudyCoverSource = {
  slug?: string | null;
  title?: string | null;
  industry?: string | null;
  clientName?: string | null;
  /** Prisma `Json` column — an array in practice, but not guaranteed. */
  technologies?: unknown;
  coverImageUrl?: string | null;
};

/** Flat, render-ready content for one cover card. */
export type CoverCardData = {
  slug: string;
  eyebrow: string;
  title: string;
  technologies: string[];
  wordmark: string;
};

/** Chips past this count overflow the card's bottom row. */
const DEFAULT_TECHNOLOGY_LIMIT = 4;

const COVER_KEY_PREFIX = "cms-images/case-studies";
export const PORTFOLIO_KEY_PREFIX = "cms-images/portfolio";

const DEFAULT_EYEBROW = "CASE STUDY";

function trimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * True when a case study has no usable cover image. Blank and whitespace-only
 * columns count as missing — the CMS writes `""` where the admin form cleared
 * a field, and Prisma writes `null` where it was never set.
 */
export function needsCoverImage(caseStudy: CaseStudyCoverSource): boolean {
  return trimmed(caseStudy?.coverImageUrl).length === 0;
}

/**
 * Coerce the `technologies` Json column into display chips. Accepts a real
 * array, a stringified array, or anything at all — unusable input yields no
 * chips rather than throwing, so one malformed row cannot fail a whole run.
 */
export function normalizeTechnologies(
  value: unknown,
  limit: number = DEFAULT_TECHNOLOGY_LIMIT,
): string[] {
  let candidates = value;

  if (typeof candidates === "string") {
    try {
      candidates = JSON.parse(candidates);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(candidates)) return [];

  const seen = new Set<string>();
  const chips: string[] = [];

  for (const entry of candidates) {
    const label = trimmed(entry);
    if (!label) continue;

    const fingerprint = label.toLowerCase();
    if (seen.has(fingerprint)) continue;

    seen.add(fingerprint);
    chips.push(label);

    if (chips.length >= limit) break;
  }

  return chips;
}

/**
 * Build the card content for one case study. The eyebrow prefers the industry
 * (the most specific label the CMS holds), falls back to the client name, and
 * finally to a generic label so the card never renders a bare gap.
 */
export function buildCoverCardData(
  caseStudy: CaseStudyCoverSource,
  options: { wordmark?: string; technologyLimit?: number } = {},
): CoverCardData {
  const title = trimmed(caseStudy?.title);
  if (!title) {
    throw new Error(
      `Case study "${trimmed(caseStudy?.slug) || "(unknown)"}" has no title to render on a cover`,
    );
  }

  const eyebrowSource =
    trimmed(caseStudy?.industry) || trimmed(caseStudy?.clientName);

  return {
    slug: trimmed(caseStudy?.slug),
    eyebrow: (eyebrowSource || DEFAULT_EYEBROW).toUpperCase(),
    title,
    technologies: normalizeTechnologies(
      caseStudy?.technologies,
      options.technologyLimit ?? DEFAULT_TECHNOLOGY_LIMIT,
    ),
    wordmark: options.wordmark ?? "",
  };
}

/**
 * The R2 object key a case study's generated cover lives at.
 *
 * Covers are served with a one-year immutable cache header, so a regenerated
 * image must not reuse its predecessor's URL — Cloudflare would keep serving
 * the stale copy. Passing the rendered file's `fingerprint` puts a content
 * hash in the key: identical output keeps the same URL (so re-runs stay
 * idempotent), while changed output gets a fresh one that no cache has seen.
 *
 * The slug is reduced to `[a-z0-9-]`, which also neutralizes any path
 * separators or traversal segments before they reach the bucket.
 */
export function buildCoverObjectKey(
  slug: string,
  fingerprint?: string,
  prefix: string = COVER_KEY_PREFIX,
): string {
  const safeSlug = trimmed(slug)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!safeSlug) {
    throw new Error(`Cannot build a cover object key from slug "${slug}"`);
  }

  const safeFingerprint = String(fingerprint ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);

  return safeFingerprint
    ? `${prefix}/${safeSlug}-${safeFingerprint}.png`
    : `${prefix}/${safeSlug}.png`;
}
