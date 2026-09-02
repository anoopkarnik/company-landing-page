/**
 * Renders a case study or portfolio cover as a workflow diagram.
 *
 * Both backfill scripts share this so the two cards stay one visual system,
 * but they lay the pipeline out differently:
 *
 *   caseStudy — 1200x630 (the card's aspect-[16/9] and the OG standard), a
 *     horizontal pipeline under a small title.
 *   portfolio — 1200x750 (the project card's aspect-[16/10]), a vertical
 *     pipeline and no title. A taller frame suits stacked rows, and the
 *     project card already prints the title directly beneath the image.
 *
 * `next/og` (Satori + resvg, bundled with Next) does the rasterizing, which is
 * why the layout sticks to flexbox and inline SVG — Satori implements a
 * deliberately small CSS subset with no block layout, and never clips
 * overflowing text.
 */
import { createElement } from "react";

import {
  clampText,
  type CoverDiagram,
  type DiagramStage,
} from "../../lib/functions/case-study-diagram";

/** shadcn violet/zinc dark tokens, converted from oklch to hex for Satori. */
export const COLORS = {
  background: "#09090B",
  surface: "#18181B",
  border: "#27272A",
  foreground: "#FAFAFA",
  muted: "#A1A1AA",
  chipText: "#D4D4D8",
  primary: "#8B5CF6",
  primarySoft: "#A78BFA",
};

export type CoverVariant = "caseStudy" | "portfolio";

type VariantSpec = {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  layout: "horizontal" | "vertical";
  showTitle: boolean;
  /** Upper bound; a horizontal row shrinks this to fit the longest label. */
  labelSize: number;
  techSize: number;
  captionSize: number;
  nodePaddingX: number;
  nodePaddingY: number;
};

export const VARIANTS: Record<CoverVariant, VariantSpec> = {
  caseStudy: {
    width: 1200,
    height: 630,
    paddingX: 64,
    paddingY: 56,
    layout: "horizontal",
    showTitle: true,
    labelSize: 32,
    techSize: 18,
    captionSize: 17,
    nodePaddingX: 20,
    nodePaddingY: 26,
  },
  portfolio: {
    width: 1200,
    height: 750,
    paddingX: 64,
    paddingY: 64,
    layout: "vertical",
    showTitle: false,
    labelSize: 36,
    techSize: 22,
    captionSize: 20,
    nodePaddingX: 30,
    nodePaddingY: 20,
  },
};

const TITLE_MAX_CHARS = 76;
const LABEL_MAX_CHARS = 24;

const ARROW_WIDTH = 30;
const NODE_GAP = 6;
const MIN_LABEL_SIZE = 20;
/** Rough advance width per character, as a fraction of font size, for Noto Sans. */
const CHAR_WIDTH_RATIO = 0.56;

/** Usable text width inside one node of a horizontal row. */
function nodeInnerWidth(spec: VariantSpec, nodeCount: number): number {
  const row = spec.width - spec.paddingX * 2;
  const connectors = (nodeCount - 1) * ARROW_WIDTH + (nodeCount * 2 - 2) * NODE_GAP;
  return (row - connectors) / nodeCount - spec.nodePaddingX * 2;
}

/**
 * Labels are single words like "Normalize", which Satori cannot wrap — an
 * oversized one silently overflows its node. Shrink the whole row to the
 * largest size that fits the longest label, so every node stays typographically
 * consistent.
 */
export function labelFontSize(
  labels: string[],
  spec: VariantSpec,
  nodeCount: number,
): number {
  if (spec.layout === "vertical") return spec.labelSize;

  const longest = labels.reduce((max, label) => Math.max(max, label.length), 0);
  if (!longest) return spec.labelSize;

  const fits = Math.floor(
    nodeInnerWidth(spec, nodeCount) / (CHAR_WIDTH_RATIO * longest),
  );
  return Math.max(MIN_LABEL_SIZE, Math.min(spec.labelSize, fits));
}

function stepIndex(index: number, size = 17, marginBottom = 12) {
  return createElement(
    "div",
    {
      style: {
        display: "flex",
        color: COLORS.primarySoft,
        fontSize: size,
        letterSpacing: 2,
        marginBottom,
      },
    },
    String(index + 1).padStart(2, "0"),
  );
}

/** A violet connector with an arrowhead, drawn as real SVG rather than borders. */
function arrowRight() {
  return createElement(
    "svg",
    {
      width: ARROW_WIDTH,
      height: 20,
      viewBox: "0 0 30 20",
      xmlns: "http://www.w3.org/2000/svg",
      style: { flexShrink: 0, alignSelf: "center" },
    },
    createElement("line", {
      x1: 0,
      y1: 10,
      x2: 17,
      y2: 10,
      stroke: COLORS.primary,
      strokeWidth: 3,
    }),
    createElement("polygon", { points: "17,3 30,10 17,17", fill: COLORS.primary }),
  );
}

/** The vertical equivalent, sitting in the gutter under the step number. */
function arrowDown() {
  return createElement(
    "svg",
    {
      width: 20,
      height: 24,
      viewBox: "0 0 20 24",
      xmlns: "http://www.w3.org/2000/svg",
      style: { flexShrink: 0, marginLeft: 44 },
    },
    createElement("line", {
      x1: 10,
      y1: 0,
      x2: 10,
      y2: 15,
      stroke: COLORS.primary,
      strokeWidth: 3,
    }),
    createElement("polygon", { points: "3,14 17,14 10,24", fill: COLORS.primary }),
  );
}

function nodeShell(spec: VariantSpec, children: any[], extraStyle: any = {}) {
  return createElement(
    "div",
    {
      style: {
        display: "flex",
        padding: `${spec.nodePaddingY}px ${spec.nodePaddingX}px`,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.surface,
        ...extraStyle,
      },
    },
    ...children,
  );
}

/** One node of the horizontal pipeline: a column of index, label, tech, caption. */
function horizontalNode(
  stage: DiagramStage,
  index: number,
  spec: VariantSpec,
  labelSize: number,
) {
  const children = [
    stepIndex(index),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          color: COLORS.foreground,
          fontSize: labelSize,
          lineHeight: 1.1,
        },
      },
      clampText(stage.label, LABEL_MAX_CHARS),
    ),
  ];

  if (stage.tech) {
    children.push(
      createElement(
        "div",
        {
          style: {
            display: "flex",
            marginTop: 10,
            color: COLORS.chipText,
            fontSize: spec.techSize,
            lineHeight: 1.25,
          },
        },
        stage.tech,
      ),
    );
  }

  if (stage.caption) {
    children.push(
      createElement(
        "div",
        {
          style: {
            display: "flex",
            marginTop: 16,
            color: COLORS.muted,
            fontSize: spec.captionSize,
            lineHeight: 1.35,
          },
        },
        clampText(stage.caption, 42),
      ),
    );
  }

  return nodeShell(spec, children, {
    flexDirection: "column",
    flexGrow: 1,
    flexBasis: 0,
  });
}

/**
 * One row of the vertical pipeline. Reading left to right: step number, the
 * stage name, the component that runs it, then what it produces — so the
 * columns line up down the card.
 */
function verticalRow(stage: DiagramStage, index: number, spec: VariantSpec) {
  const children = [
    createElement(
      "div",
      {
        style: {
          display: "flex",
          width: 42,
          flexShrink: 0,
          color: COLORS.primarySoft,
          fontSize: 20,
          letterSpacing: 2,
        },
      },
      String(index + 1).padStart(2, "0"),
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          width: 290,
          flexShrink: 0,
          color: COLORS.foreground,
          fontSize: spec.labelSize,
          lineHeight: 1.1,
        },
      },
      clampText(stage.label, LABEL_MAX_CHARS),
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          width: 250,
          flexShrink: 0,
          color: COLORS.chipText,
          fontSize: spec.techSize,
          lineHeight: 1.25,
        },
      },
      stage.tech ?? "",
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          flexGrow: 1,
          color: COLORS.muted,
          fontSize: spec.captionSize,
          lineHeight: 1.3,
        },
      },
      clampText(stage.caption ?? "", 44),
    ),
  ];

  return nodeShell(spec, children, { alignItems: "center", gap: 18 });
}

export function renderDiagramCard(diagram: CoverDiagram, variant: CoverVariant) {
  const spec = VARIANTS[variant];
  const labels = diagram.stages.map((stage) =>
    clampText(stage.label, LABEL_MAX_CHARS),
  );
  const resolvedLabelSize = labelFontSize(labels, spec, diagram.stages.length);

  const pipeline: any[] = [];
  diagram.stages.forEach((stage, index) => {
    if (index > 0) pipeline.push(spec.layout === "vertical" ? arrowDown() : arrowRight());
    pipeline.push(
      spec.layout === "vertical"
        ? verticalRow(stage, index, spec)
        : horizontalNode(stage, index, spec, resolvedLabelSize),
    );
  });

  const sections: any[] = [
    // Header: eyebrow on the left, wordmark on the right.
    createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      },
      createElement(
        "div",
        {
          style: {
            display: "flex",
            color: COLORS.primarySoft,
            fontSize: 21,
            letterSpacing: 3,
          },
        },
        diagram.eyebrow,
      ),
      createElement(
        "div",
        { style: { display: "flex", alignItems: "center" } },
        createElement("div", {
          style: {
            display: "flex",
            width: 11,
            height: 11,
            marginRight: 11,
            borderRadius: 999,
            backgroundColor: COLORS.primary,
          },
        }),
        createElement(
          "div",
          { style: { display: "flex", color: COLORS.muted, fontSize: 21 } },
          diagram.wordmark,
        ),
      ),
    ),
  ];

  if (spec.showTitle) {
    sections.push(
      createElement(
        "div",
        {
          style: {
            display: "flex",
            marginTop: 20,
            maxWidth: 1000,
            color: COLORS.foreground,
            fontSize: 34,
            lineHeight: 1.2,
            letterSpacing: -0.5,
          },
        },
        clampText(diagram.title, TITLE_MAX_CHARS),
      ),
    );
  }

  // The pipeline. Horizontal: centre the row, stretch nodes to the tallest.
  // Vertical: distribute the rows down the remaining height.
  sections.push(
    spec.layout === "vertical"
      ? createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "space-between",
              marginTop: 26,
            },
          },
          ...pipeline,
        )
      : createElement(
          "div",
          {
            style: {
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              marginTop: 28,
            },
          },
          createElement(
            "div",
            {
              style: {
                display: "flex",
                width: "100%",
                alignItems: "stretch",
                gap: NODE_GAP,
              },
            },
            ...pipeline,
          ),
        ),
  );

  return createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: `${spec.paddingY}px ${spec.paddingX}px`,
        backgroundColor: COLORS.background,
        backgroundImage:
          "radial-gradient(1100px 620px at 88% -12%, rgba(139, 92, 246, 0.30), rgba(9, 9, 11, 0) 62%)",
        fontFamily: "sans-serif",
      },
    },
    ...sections,
  );
}

export async function renderCoverPng(
  diagram: CoverDiagram,
  variant: CoverVariant,
): Promise<Buffer> {
  const { ImageResponse } = await import("next/og.js");
  const spec = VARIANTS[variant];
  const response = new ImageResponse(renderDiagramCard(diagram, variant) as any, {
    width: spec.width,
    height: spec.height,
  });
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Downscale a rendered cover to the width it actually occupies in the site's
 * card grid, so a dry run shows whether the diagram survives at card size.
 */
export async function renderCardSizePreview(
  png: Buffer,
  variant: CoverVariant,
): Promise<Buffer> {
  const { ImageResponse } = await import("next/og.js");
  const spec = VARIANTS[variant];
  const width = 400;
  const height = Math.round((spec.height / spec.width) * width);
  const preview = createElement("img", {
    src: `data:image/png;base64,${png.toString("base64")}`,
    width,
    height,
  });
  const response = new ImageResponse(preview as any, { width, height });
  return Buffer.from(await response.arrayBuffer());
}
