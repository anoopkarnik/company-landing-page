import { describe, expect, it } from "vitest";

import {
  buildCoverDiagram,
  clampText,
  deriveStagesFromSteps,
  parseArchitectureSteps,
  selectEvenly,
  tidyLabel,
} from "./case-study-diagram";

const OCR_ARCHITECTURE = `1. A user selects the financial table type and uploads a screenshot in the Next.js interface.
2. The UI sends the image and layout-specific context to an n8n webhook.
3. n8n posts the image to the internal PaddleOCR FastAPI service.`;

const VOICE_ARCHITECTURE = `1. **Caller and Vapi:** speech is transcribed and the current intent is captured.
2. **n8n webhook:** session context and structured intent are routed to the correct tool flow.`;

describe("parseArchitectureSteps", () => {
  it("parses a numbered architecture list into ordered steps", () => {
    expect(parseArchitectureSteps(OCR_ARCHITECTURE)).toEqual([
      {
        label: null,
        detail:
          "A user selects the financial table type and uploads a screenshot in the Next.js interface.",
      },
      {
        label: null,
        detail:
          "The UI sends the image and layout-specific context to an n8n webhook.",
      },
      {
        label: null,
        detail: "n8n posts the image to the internal PaddleOCR FastAPI service.",
      },
    ]);
  });

  it("lifts a bold lead-in out as the step label and drops its colon", () => {
    expect(parseArchitectureSteps(VOICE_ARCHITECTURE)).toEqual([
      {
        label: "Caller and Vapi",
        detail: "speech is transcribed and the current intent is captured.",
      },
      {
        label: "n8n webhook",
        detail:
          "session context and structured intent are routed to the correct tool flow.",
      },
    ]);
  });

  it("ignores blank lines, prose paragraphs, and markdown headings", () => {
    expect(
      parseArchitectureSteps(
        "## How it runs\n\nSome intro prose.\n\n1. First thing happens.\n\n2. Second thing happens.\n",
      ),
    ).toEqual([
      { label: null, detail: "First thing happens." },
      { label: null, detail: "Second thing happens." },
    ]);
  });

  it("strips residual emphasis markers from the detail", () => {
    expect(
      parseArchitectureSteps("1. The *active* n8n workflow **appends** rows."),
    ).toEqual([{ label: null, detail: "The active n8n workflow appends rows." }]);
  });

  it("returns nothing for missing or unusable input", () => {
    expect(parseArchitectureSteps(null)).toEqual([]);
    expect(parseArchitectureSteps("")).toEqual([]);
    expect(parseArchitectureSteps("Just a paragraph with no steps.")).toEqual([]);
  });
});

describe("clampText", () => {
  it("leaves short text untouched", () => {
    expect(clampText("Table-aware OCR", 40)).toBe("Table-aware OCR");
  });

  it("collapses internal whitespace", () => {
    expect(clampText("  fixed   row\nschema ", 40)).toBe("fixed row schema");
  });

  it("truncates on a word boundary and adds an ellipsis", () => {
    expect(clampText("session context and structured intent are routed", 24)).toBe(
      "session context and…",
    );
  });

  it("does not leave dangling punctuation before the ellipsis", () => {
    expect(clampText("speech is transcribed, and intent is captured", 26)).toBe(
      "speech is transcribed…",
    );
  });
});

describe("selectEvenly", () => {
  it("returns every item when it already fits", () => {
    expect(selectEvenly([1, 2, 3], 5)).toEqual([1, 2, 3]);
    expect(selectEvenly([1, 2, 3, 4, 5], 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps the first and last step so the arc stays intact", () => {
    const sampled = selectEvenly([1, 2, 3, 4, 5, 6, 7], 5);
    expect(sampled[0]).toBe(1);
    expect(sampled.at(-1)).toBe(7);
    expect(sampled).toHaveLength(5);
  });

  it("samples the middle without repeating a step", () => {
    expect(selectEvenly([1, 2, 3, 4, 5, 6, 7], 5)).toEqual([1, 3, 4, 6, 7]);
    expect(selectEvenly([1, 2, 3, 4, 5, 6], 5)).toEqual([1, 2, 4, 5, 6]);
  });

  it("handles degenerate limits", () => {
    expect(selectEvenly([1, 2, 3], 1)).toEqual([1]);
    expect(selectEvenly([], 5)).toEqual([]);
  });
});

describe("deriveStagesFromSteps", () => {
  const technologies = ["Next.js", "n8n", "PaddleOCR"];

  it("uses a bold lead-in as the stage label when the author wrote one", () => {
    const stages = deriveStagesFromSteps(
      parseArchitectureSteps(VOICE_ARCHITECTURE),
      ["Vapi", "n8n"],
    );
    expect(stages[0].label).toBe("Caller and Vapi");
  });

  it("falls back to the technology the step names", () => {
    const stages = deriveStagesFromSteps(
      parseArchitectureSteps(OCR_ARCHITECTURE),
      technologies,
    );
    expect(stages.map((stage) => stage.label)).toEqual([
      "Next.js",
      "n8n",
      "PaddleOCR",
    ]);
  });

  it("captions each stage with a clamped version of the step text", () => {
    const stages = deriveStagesFromSteps(
      parseArchitectureSteps(OCR_ARCHITECTURE),
      technologies,
    );
    expect(stages[2].caption).toMatch(/^n8n posts the image/);
    expect(stages[2].caption!.length).toBeLessThanOrEqual(48);
  });

  it("numbers a stage that names no known technology", () => {
    const stages = deriveStagesFromSteps(
      parseArchitectureSteps("1. Everything is reviewed by a person."),
      technologies,
    );
    expect(stages[0].label).toBe("Step 1");
  });

  it("compresses long pipelines down to the stage limit", () => {
    const seven = Array.from(
      { length: 7 },
      (_, index) => `${index + 1}. Step number ${index + 1} runs on n8n.`,
    ).join("\n");
    expect(deriveStagesFromSteps(parseArchitectureSteps(seven), ["n8n"])).toHaveLength(
      5,
    );
  });
});

describe("buildCoverDiagram", () => {
  const caseStudy = {
    slug: "financial-document-ocr-pipeline",
    title: "Financial document OCR: from terminal screenshots to Google Sheets",
    industry: "Financial operations automation",
    clientName: "Automation client",
    technologies: ["Next.js", "n8n", "PaddleOCR"],
    architectureMdx: OCR_ARCHITECTURE,
  };

  const curated = [
    { label: "Upload", tech: "Next.js", caption: "Screenshot and layout context" },
    { label: "Extract", tech: "PaddleOCR", caption: "Table-aware OCR" },
    { label: "Append", tech: "Google Sheets", caption: "Reviewable rows" },
  ];

  it("prefers a curated spec over the derived pipeline", () => {
    const diagram = buildCoverDiagram(caseStudy, {
      curatedStages: curated,
      wordmark: "Bayesian Labs",
    });
    expect(diagram.stages).toEqual(curated);
    expect(diagram.source).toBe("curated");
  });

  it("derives stages from architectureMdx when no spec exists", () => {
    const diagram = buildCoverDiagram(caseStudy, { wordmark: "Bayesian Labs" });
    expect(diagram.source).toBe("derived");
    expect(diagram.stages.map((stage) => stage.label)).toEqual([
      "Next.js",
      "n8n",
      "PaddleOCR",
    ]);
  });

  it("carries the eyebrow, clamped title, and wordmark for the card chrome", () => {
    const diagram = buildCoverDiagram(caseStudy, { wordmark: "Bayesian Labs" });
    expect(diagram.eyebrow).toBe("FINANCIAL OPERATIONS AUTOMATION");
    expect(diagram.title).toBe(
      "Financial document OCR: from terminal screenshots to Google Sheets",
    );
    expect(diagram.wordmark).toBe("Bayesian Labs");
  });

  it("refuses to render a diagram with nothing to draw", () => {
    expect(() =>
      buildCoverDiagram({ ...caseStudy, architectureMdx: "" }, {}),
    ).toThrow(/no architecture steps/i);
  });
});

describe("tidyLabel", () => {
  it("keeps a label that is already short", () => {
    expect(tidyLabel("Caller and Vapi")).toBe("Caller and Vapi");
    expect(tidyLabel("Upload")).toBe("Upload");
  });

  it("drops the qualifier an author appended after a dash", () => {
    expect(tidyLabel("Provider connectors — outside my scope")).toBe(
      "Provider connectors",
    );
  });

  it("drops a trailing clause after a comma or colon", () => {
    expect(tidyLabel("Result contract, in three parts")).toBe("Result contract");
  });

  it("clamps a label with no qualifier to break out of", () => {
    expect(tidyLabel("An extremely long stage name that will never fit")).toBe(
      "An extremely long…",
    );
  });
});
