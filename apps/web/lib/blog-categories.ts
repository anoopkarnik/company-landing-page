export const BLOG_CATEGORIES = [
  {
    slug: "ai-automation",
    label: "AI Automation",
    description:
      "Practical guidance for reliable AI agents, n8n workflows, human review, and automation delivery.",
  },
  {
    slug: "mvp-saas",
    label: "MVP & SaaS",
    description:
      "Decision guides for founders planning, building, owning, and launching production-ready software.",
  },
  {
    slug: "data-ai",
    label: "Data & AI",
    description:
      "Architecture and implementation notes for OCR, healthcare data, analytics, and AI-assisted systems.",
  },
  {
    slug: "product-engineering",
    label: "Product Engineering",
    description:
      "Engineering lessons from multi-platform products, maintainable templates, and experimental product systems.",
  },
  {
    slug: "devops",
    label: "DevOps",
    description:
      "Deployment, packaging, hosting, and operations guides for modern web and desktop applications.",
  },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

const legacyCategoryAliases: Record<string, string> = {
  devops: "DevOps",
};

export function normalizeBlogCategory(value: string) {
  const trimmed = value.trim();
  return legacyCategoryAliases[trimmed.toLowerCase()] ?? trimmed;
}

export function blogCategorySlug(value: string) {
  const normalized = normalizeBlogCategory(value);
  const known = BLOG_CATEGORIES.find(
    (category) => category.label.toLowerCase() === normalized.toLowerCase(),
  );
  if (known) return known.slug;
  return normalized
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getBlogCategoryBySlug(slug: string) {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

export function sortBlogCategories(categories: string[]) {
  const editorialOrder = new Map<string, number>(
    BLOG_CATEGORIES.map((category, index) => [category.label, index]),
  );

  return [...new Set(categories.map(normalizeBlogCategory))].sort((a, b) => {
    const aOrder = editorialOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = editorialOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder || a.localeCompare(b);
  });
}
