import { publishedCaseStudyAssets } from "./case-study-assets";

export type CaseStudyVisualSpec = {
  src: string;
  title: string;
  alt: string;
  caption: string;
  kind: "diagram" | "screenshot";
};

const diagram = (
  id: string,
  title: string,
  alt: string,
  caption: string,
): CaseStudyVisualSpec => ({
  src: `/case-studies/diagrams/${id}.svg`,
  title,
  alt,
  caption,
  kind: "diagram",
});

const visuals: Record<string, CaseStudyVisualSpec> = {
  "life-product": {
    src: "/case-studies/life-os/dashboard.png",
    kind: "screenshot",
    title: "The working product",
    alt: "Life OS dashboard showing a weekly plan alongside productivity, product-building, and skill-tree task summaries.",
    caption:
      "Earlier product view: weekly planning brings several kinds of work into one workspace. Some navigation has since evolved.",
  },
  "life-overview": diagram(
    "life-overview",
    "One workspace, different parts of life",
    "Six groups of workflows share one Life OS account: do, learn, focus, build, care, and manage.",
    "A simplified map of the product. Each area keeps its own useful structure.",
  ),
  "life-progress": diagram(
    "life-progress",
    "Make returning part of the loop",
    "Choose a commitment, show up, reflect, then adjust and return to the next action.",
    "The design goal is a useful next action, even after a difficult week.",
  ),
  "life-learning": diagram(
    "life-learning",
    "From saved to understood",
    "Capture material, understand its ideas, practice, assess, and revisit gaps.",
    "Saving a link begins the learning journey; it does not complete it.",
  ),
  "life-attention": diagram(
    "life-attention",
    "See attention across devices",
    "Browser, desktop, and Android collectors feed an attention dashboard; the user sets limits, schedules, and breaks.",
    "Usage stays distinguishable by source while the user manages boundaries together.",
  ),
  "life-architecture": diagram(
    "life-architecture",
    "Where the work happens",
    "Clients call the web application, which uses PostgreSQL for records and results and durable Inngest jobs to invoke private FastAPI agents.",
    "The web layer owns access and job state. The private Python service executes agents.",
  ),
  "saas-product": {
    src: "/case-studies/saas-forge/setup.png",
    kind: "screenshot",
    title: "The starter configuration experience",
    alt: "SaaS Forge setup interface with a guided sequence, configuration choices, and a project summary.",
    caption:
      "Earlier product view: a guided setup with a visible configuration summary. Presets and module choices have since evolved.",
  },
  "saas-lifecycle": diagram(
    "saas-lifecycle",
    "Beyond the first download",
    "Select modules, set up services, customize the product, and review upgrades as the foundation evolves.",
    "A starter has to remain useful after it becomes someone's custom product.",
  ),
  "saas-modules": diagram(
    "saas-modules",
    "Compose a smaller starting point",
    "A shared identity, API, and data foundation combines with selected billing, team, AI, and operational capabilities.",
    "Capability groups summarize the 13-module catalog; each download follows its actual selection.",
  ),
  "saas-delivery": diagram(
    "saas-delivery",
    "From choices to application code",
    "Root source and starter overrides produce a clean template; the compiler applies selected modules and providers to create an application.",
    "The download is a compiled source variant, with unselected implementations removed.",
  ),
  "saas-upgrade": diagram(
    "saas-upgrade",
    "Keep the product you built",
    "Compare old and new upstream versions, review their changes, merge into custom code, and validate the upgraded app.",
    "Upgrade kits provide the change context. Overlapping custom edits still need judgment.",
  ),
  "saas-architecture": diagram(
    "saas-architecture",
    "One foundation across clients",
    "Web, desktop, and mobile use shared authentication and typed APIs with PostgreSQL data and optional queued Python AI work.",
    "Client experiences differ while identity, product data, and contracts stay shared.",
  ),
};

export const caseStudyVisuals = Object.fromEntries(
  Object.entries(visuals).map(([id, visual]) => [
    id,
    {
      ...visual,
      localSrc: visual.src,
      src: publishedCaseStudyAssets[id] ?? visual.src,
    },
  ]),
);
