import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import * as caseStudiesAdmin from "./CaseStudiesAdmin";

type MediaFieldsProps = {
  clientLogoUrl: string;
  coverImageUrl: string;
  onChange: (values: {
    clientLogoUrl?: string;
    coverImageUrl?: string;
  }) => void;
};

const CaseStudyMediaFields = (
  caseStudiesAdmin as typeof caseStudiesAdmin & {
    CaseStudyMediaFields?: ComponentType<MediaFieldsProps>;
  }
).CaseStudyMediaFields;

describe("CaseStudyMediaFields", () => {
  it("renders an image upload action beside the client logo and cover URLs", () => {
    expect(CaseStudyMediaFields).toBeTypeOf("function");
    if (!CaseStudyMediaFields) return;

    const markup = renderToStaticMarkup(
      createElement(CaseStudyMediaFields, {
        clientLogoUrl: "https://cdn.example.com/client-logo.png",
        coverImageUrl: "https://cdn.example.com/case-study-cover.png",
        onChange: () => undefined,
      }),
    );

    expect(markup.match(/aria-label="Upload image"/g)).toHaveLength(2);
    expect(markup).toContain("https://cdn.example.com/client-logo.png");
    expect(markup).toContain("https://cdn.example.com/case-study-cover.png");
  });
});
