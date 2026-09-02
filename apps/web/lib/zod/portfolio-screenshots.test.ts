import { describe, expect, it } from "vitest";

import * as cmsSchemas from "./cms";

type PortfolioScreenshotSchema = {
  parse: (value: unknown) => unknown;
  safeParse: (value: unknown) => { success: boolean };
};

const portfolioScreenshotsSchema = (
  cmsSchemas as typeof cmsSchemas & {
    portfolioScreenshotsSchema?: PortfolioScreenshotSchema;
  }
).portfolioScreenshotsSchema;

describe("portfolioScreenshotsSchema", () => {
  it("normalizes legacy screenshot URL strings into media records", () => {
    expect(
      portfolioScreenshotsSchema?.parse([
        "https://cdn.example.com/portfolio/screen-one.png",
      ]),
    ).toEqual([
      { url: "https://cdn.example.com/portfolio/screen-one.png" },
    ]);
  });

  it("preserves canonical screenshot records", () => {
    const screenshot = {
      url: "https://cdn.example.com/portfolio/screen-two.png",
      alt: "Dashboard overview",
      caption: "The final dashboard",
    };

    expect(portfolioScreenshotsSchema?.parse([screenshot])).toEqual([
      screenshot,
    ]);
  });

  it("rejects legacy strings that are not valid public URLs", () => {
    expect(portfolioScreenshotsSchema?.safeParse(["not-a-url"]).success).toBe(
      false,
    );
  });
});
