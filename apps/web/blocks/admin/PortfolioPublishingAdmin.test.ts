import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import * as portfolioAdmin from "./PortfolioPublishingAdmin";

type MediaFieldsProps = {
  clientLogoUrl: string;
  imageUrl: string;
  onChange: (values: { clientLogoUrl?: string; imageUrl?: string }) => void;
};

const PortfolioMediaFields = (
  portfolioAdmin as typeof portfolioAdmin & {
    PortfolioMediaFields?: ComponentType<MediaFieldsProps>;
  }
).PortfolioMediaFields;

describe("PortfolioMediaFields", () => {
  it("renders an image upload action beside both portfolio image URLs", () => {
    expect(PortfolioMediaFields).toBeTypeOf("function");
    if (!PortfolioMediaFields) return;

    const markup = renderToStaticMarkup(
      createElement(PortfolioMediaFields, {
        clientLogoUrl: "https://cdn.example.com/client-logo.png",
        imageUrl: "https://cdn.example.com/project-cover.png",
        onChange: () => undefined,
      }),
    );

    expect(markup.match(/title="Upload image"/g)).toHaveLength(2);
    expect(markup.match(/aria-label="Upload image"/g)).toHaveLength(2);
    expect(markup).toContain("https://cdn.example.com/client-logo.png");
    expect(markup).toContain("https://cdn.example.com/project-cover.png");
  });
});
