import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ServicePackagesSection } from "./CredibilitySections";

describe("ServicePackagesSection", () => {
  it("groups interleaved packages under headings and orders levels without losing package details or enquiry links", () => {
    const markup = renderToStaticMarkup(
      createElement(ServicePackagesSection, {
        services: [
          {
            slug: "platform",
            title: "Automation Platform",
            description: "Coordinate workflows",
            category: "Automation",
            level: "advanced",
            featured: true,
          },
          {
            slug: "website",
            title: "Landing Page",
            description: "Your first site",
            category: "Web Presence",
            level: "basic",
          },
          {
            slug: "workflow",
            title: "Workflow",
            description: "Connect your tools",
            category: "Automation",
            level: "basic",
            priceFrom: "$500",
            deliverables: ["Workflow handover"],
          },
          {
            slug: "extraction",
            title: "AI Extraction",
            description: "Read documents",
            category: "Automation",
            level: "medium",
          },
        ],
      }),
    );

    expect(markup.match(/<h3\b/g)).toHaveLength(2);
    expect(markup.match(/<details\b/g)).toHaveLength(4);
    expect(markup).toContain("Automation");
    expect(markup).toContain("Web Presence");
    expect(markup.indexOf("Workflow</")).toBeLessThan(
      markup.indexOf("AI Extraction</"),
    );
    expect(markup.indexOf("AI Extraction</")).toBeLessThan(
      markup.indexOf("Automation Platform</"),
    );
    expect(markup).toContain("Basic level");
    expect(markup).toContain("Medium level");
    expect(markup).toContain("Advanced level");
    expect(markup).toContain("Workflow handover");
    expect(markup).toContain("$500");
    expect(markup).toContain("/?service=workflow#start-project");
  });

  it("keeps legacy packages with no classification visible", () => {
    const markup = renderToStaticMarkup(
      createElement(ServicePackagesSection, {
        services: [
          { title: "Custom consulting", description: "Discuss your project" },
        ],
      }),
    );
    expect(markup).toContain("Custom consulting");
    expect(markup).toContain("Discuss your project");
    expect(markup.match(/<h3\b/g)).toHaveLength(1);
  });
});
