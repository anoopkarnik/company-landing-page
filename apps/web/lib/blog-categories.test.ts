import { describe, expect, it } from "vitest";

import {
  blogCategorySlug,
  getBlogCategoryBySlug,
  normalizeBlogCategory,
  sortBlogCategories,
} from "./blog-categories";

describe("blog categories", () => {
  it("uses stable readable archive slugs", () => {
    expect(blogCategorySlug("AI Automation")).toBe("ai-automation");
    expect(blogCategorySlug("MVP & SaaS")).toBe("mvp-saas");
    expect(blogCategorySlug("Data & AI")).toBe("data-ai");
  });

  it("normalizes the legacy Devops value", () => {
    expect(normalizeBlogCategory("Devops")).toBe("DevOps");
    expect(normalizeBlogCategory("  Product Engineering ")).toBe(
      "Product Engineering",
    );
  });

  it("resolves known archive slugs and rejects unknown ones", () => {
    expect(getBlogCategoryBySlug("mvp-saas")?.label).toBe("MVP & SaaS");
    expect(getBlogCategoryBySlug("unknown")).toBeUndefined();
  });

  it("sorts known categories in editorial order before unknown values", () => {
    expect(
      sortBlogCategories(["DevOps", "Something Else", "AI Automation"]),
    ).toEqual(["AI Automation", "DevOps", "Something Else"]);
  });
});
