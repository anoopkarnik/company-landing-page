export const SERVICE_CATEGORIES = [
  "Automation",
  "Data & AI",
  "Product Development",
  "Web Presence",
] as const;

export const SERVICE_LEVELS = ["basic", "medium", "advanced"] as const;
export type ServiceLevel = (typeof SERVICE_LEVELS)[number];

export const SERVICE_LEVEL_LABELS: Record<ServiceLevel, string> = {
  basic: "Basic level",
  medium: "Medium level",
  advanced: "Advanced level",
};

export const SERVICE_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Automation:
    "Automate repetitive tasks and connect the tools your team uses every day.",
  "Data & AI":
    "Connect your data, improve its quality, and add useful AI features to your systems.",
  "Product Development":
    "Launch a new product or improve an existing one with the foundations it needs to grow.",
  "Web Presence":
    "Create a landing page or marketing website, with options for a CMS, blog, and case studies.",
};

export function groupServicePackages<
  T extends { category?: string | null; level?: string | null },
>(services: T[]) {
  const groups = new Map<string, T[]>();
  for (const service of services) {
    const category = service.category?.trim() || "Other services";
    const items = groups.get(category) ?? [];
    items.push(service);
    groups.set(category, items);
  }
  const levelOrder = (level?: string | null) => {
    const index = SERVICE_LEVELS.indexOf(level as ServiceLevel);
    return index < 0 ? SERVICE_LEVELS.length : index;
  };
  return Array.from(groups, ([category, packages]) => ({
    category,
    packages: packages.sort(
      (a, b) => levelOrder(a.level) - levelOrder(b.level),
    ),
  }));
}
