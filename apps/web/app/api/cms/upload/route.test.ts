import { describe, expect, it } from "vitest";

import { buildR2PublicUrl } from "@/lib/functions/r2-public-url";

describe("buildR2PublicUrl", () => {
  it("returns the browser-readable R2 URL without a duplicate slash", () => {
    expect(
      buildR2PublicUrl(
        "cms-images/portfolio-cover.png",
        "https://public-assets.example.com/",
      ),
    ).toBe("https://public-assets.example.com/cms-images/portfolio-cover.png");
  });

  it("refuses to return the private R2 S3 endpoint as a public URL", () => {
    expect(() => buildR2PublicUrl("cms-images/portfolio-cover.png")).toThrow(
      "NEXT_PUBLIC_R2_PUBLIC_URL",
    );
  });
});
