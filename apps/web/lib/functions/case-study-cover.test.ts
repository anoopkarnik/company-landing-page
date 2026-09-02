import { describe, expect, it } from "vitest";

import {
  buildCoverCardData,
  buildCoverObjectKey,
  needsCoverImage,
  normalizeTechnologies,
} from "./case-study-cover";

describe("needsCoverImage", () => {
  it("selects case studies with no cover image at all", () => {
    expect(needsCoverImage({ coverImageUrl: null })).toBe(true);
    expect(needsCoverImage({ coverImageUrl: undefined })).toBe(true);
    expect(needsCoverImage({})).toBe(true);
  });

  it("treats blank and whitespace-only URLs as missing", () => {
    expect(needsCoverImage({ coverImageUrl: "" })).toBe(true);
    expect(needsCoverImage({ coverImageUrl: "   " })).toBe(true);
    expect(needsCoverImage({ coverImageUrl: "\n\t" })).toBe(true);
  });

  it("skips case studies that already have a cover", () => {
    expect(
      needsCoverImage({
        coverImageUrl: "https://pub-abc.r2.dev/cms-images/lifeos.png",
      }),
    ).toBe(false);
  });
});

describe("normalizeTechnologies", () => {
  it("passes through a Prisma Json array of strings", () => {
    expect(normalizeTechnologies(["Next.js", "n8n", "AWS Textract"])).toEqual([
      "Next.js",
      "n8n",
      "AWS Textract",
    ]);
  });

  it("parses a stringified JSON array", () => {
    expect(normalizeTechnologies('["Vapi", "n8n"]')).toEqual(["Vapi", "n8n"]);
  });

  it("drops blank entries and trims surrounding whitespace", () => {
    expect(normalizeTechnologies(["  GA4  ", "", "   ", "QuickChart"])).toEqual(
      ["GA4", "QuickChart"],
    );
  });

  it("drops entries that are not strings", () => {
    expect(normalizeTechnologies(["GA4", 42, null, { name: "n8n" }])).toEqual([
      "GA4",
    ]);
  });

  it("removes case-insensitive duplicates, keeping the first spelling", () => {
    expect(normalizeTechnologies(["n8n", "N8N", "AI", "ai"])).toEqual([
      "n8n",
      "AI",
    ]);
  });

  it("caps the chip count so the card never overflows", () => {
    expect(
      normalizeTechnologies(
        ["Next.js", "n8n", "AWS Textract", "PaddleOCR", "OCR"],
        4,
      ),
    ).toEqual(["Next.js", "n8n", "AWS Textract", "PaddleOCR"]);
  });

  it("returns an empty list for unusable input", () => {
    expect(normalizeTechnologies(null)).toEqual([]);
    expect(normalizeTechnologies(undefined)).toEqual([]);
    expect(normalizeTechnologies("not json")).toEqual([]);
    expect(normalizeTechnologies('{"a":1}')).toEqual([]);
    expect(normalizeTechnologies(7)).toEqual([]);
  });
});

describe("buildCoverCardData", () => {
  const caseStudy = {
    slug: "financial-document-ocr-pipeline",
    title: "Financial document OCR: from terminal screenshots to Google Sheets",
    industry: "Financial operations automation",
    clientName: "Automation client",
    technologies: ["Next.js", "n8n", "AWS Textract", "PaddleOCR", "OCR"],
  };

  it("derives the card content from the case study row", () => {
    expect(buildCoverCardData(caseStudy, { wordmark: "Bayesian Labs" })).toEqual(
      {
        slug: "financial-document-ocr-pipeline",
        eyebrow: "FINANCIAL OPERATIONS AUTOMATION",
        title:
          "Financial document OCR: from terminal screenshots to Google Sheets",
        technologies: ["Next.js", "n8n", "AWS Textract", "PaddleOCR"],
        wordmark: "Bayesian Labs",
      },
    );
  });

  it("falls back to the client name when there is no industry", () => {
    expect(
      buildCoverCardData({ ...caseStudy, industry: null }).eyebrow,
    ).toBe("AUTOMATION CLIENT");
  });

  it("falls back to a generic eyebrow when neither is present", () => {
    expect(
      buildCoverCardData({
        ...caseStudy,
        industry: "  ",
        clientName: null,
      }).eyebrow,
    ).toBe("CASE STUDY");
  });

  it("trims the title", () => {
    expect(
      buildCoverCardData({ ...caseStudy, title: "  Voice ordering  " }).title,
    ).toBe("Voice ordering");
  });

  it("requires a title to render a meaningful card", () => {
    expect(() => buildCoverCardData({ ...caseStudy, title: "   " })).toThrow(
      /title/i,
    );
  });
});

describe("buildCoverObjectKey", () => {
  it("namespaces generated covers under a dedicated prefix", () => {
    expect(buildCoverObjectKey("automated-ga4-search-reporting")).toBe(
      "cms-images/case-studies/automated-ga4-search-reporting.png",
    );
  });

  it("is stable so re-running the backfill targets the same object", () => {
    expect(buildCoverObjectKey("life-os")).toBe(
      buildCoverObjectKey("life-os"),
    );
  });

  it("normalizes slug casing and separators", () => {
    expect(buildCoverObjectKey("Life_OS Pilot")).toBe(
      "cms-images/case-studies/life-os-pilot.png",
    );
  });

  it("refuses slugs that would escape the prefix", () => {
    expect(buildCoverObjectKey("../../etc/passwd")).toBe(
      "cms-images/case-studies/etc-passwd.png",
    );
  });

  it("puts a content fingerprint in the key so a regenerated cover gets a fresh URL", () => {
    expect(buildCoverObjectKey("life-os", "a1b2c3d4")).toBe(
      "cms-images/case-studies/life-os-a1b2c3d4.png",
    );
  });

  it("keeps the same URL when the rendered output is unchanged", () => {
    expect(buildCoverObjectKey("life-os", "a1b2c3d4")).toBe(
      buildCoverObjectKey("life-os", "a1b2c3d4"),
    );
  });

  it("sanitizes and bounds the fingerprint", () => {
    expect(buildCoverObjectKey("life-os", "../A1B2!!")).toBe(
      "cms-images/case-studies/life-os-a1b2.png",
    );
    expect(buildCoverObjectKey("life-os", "")).toBe(
      "cms-images/case-studies/life-os.png",
    );
  });

  it("throws when the slug has nothing usable left", () => {
    expect(() => buildCoverObjectKey("///")).toThrow(/slug/i);
    expect(() => buildCoverObjectKey("")).toThrow(/slug/i);
  });
});

describe("buildCoverObjectKey prefixes", () => {
  it("namespaces portfolio images away from case study covers", () => {
    expect(
      buildCoverObjectKey("git-grasp", "abc123", "cms-images/portfolio"),
    ).toBe("cms-images/portfolio/git-grasp-abc123.png");
  });

  it("still defaults to the case studies prefix", () => {
    expect(buildCoverObjectKey("git-grasp", "abc123")).toBe(
      "cms-images/case-studies/git-grasp-abc123.png",
    );
  });
});
