import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { PublicServicePackage } from "@/lib/ts-types/conversion";
import {
  ServiceCategoryPicker,
  ServicePackagePicker,
} from "./ProjectServicePicker";

const services: PublicServicePackage[] = [
  {
    slug: "platform",
    category: "Automation",
    level: "advanced",
    title: "Connected Automation Platform",
    description: "Coordinate multiple workflows.",
    priceFrom: "$2,500",
  },
  {
    slug: "website",
    category: "Web Presence",
    level: "basic",
    title: "Landing Page",
    description: "Launch your first website.",
  },
  {
    slug: "workflow",
    category: "Automation",
    level: "basic",
    title: "Workflow Automation",
    description: "Connect your everyday tools.",
    priceFrom: "$500",
    timeline: "1–3 weeks",
  },
  {
    slug: "extraction",
    category: "Automation",
    level: "medium",
    title: "AI Document Processing",
    description: "Turn documents into usable data.",
  },
];

describe("service choices in the project enquiry", () => {
  it("starts with categories and explanatory copy instead of listing every package", () => {
    const markup = renderToStaticMarkup(
      createElement(ServiceCategoryPicker, {
        services,
        selected: "Automation",
        onSelect: () => undefined,
      }),
    );
    expect(markup.match(/type="radio"/g)).toHaveLength(3);
    expect(markup).toContain("Automation");
    expect(markup).toContain("Web Presence");
    expect(markup).toContain("Something else");
    expect(markup).toContain("Automate repetitive tasks");
    expect(markup).not.toContain("Connected Automation Platform");
    expect(markup).not.toContain("AI Document Processing");
    expect(markup).toContain("aria-describedby=");
  });

  it("only offers the chosen category's packages in level order, with descriptions and approximate prices", () => {
    const markup = renderToStaticMarkup(
      createElement(ServicePackagePicker, {
        services,
        category: "Automation",
        selected: "workflow",
        onSelect: () => undefined,
      }),
    );
    expect(markup.match(/type="radio"/g)).toHaveLength(4);
    expect(markup).not.toContain("Landing Page");
    expect(markup.indexOf("Workflow Automation")).toBeLessThan(
      markup.indexOf("AI Document Processing"),
    );
    expect(markup.indexOf("AI Document Processing")).toBeLessThan(
      markup.indexOf("Connected Automation Platform"),
    );
    expect(markup).toContain("Connect your everyday tools.");
    expect(markup).toContain("Turn documents into usable data.");
    expect(markup).toContain("Approx $500");
    expect(markup).toContain("1–3 weeks");
    expect(markup).toContain("Help me choose");
    expect(markup).toMatch(
      /<input(?=[^>]*value="workflow")(?=[^>]*checked="")[^>]*>/,
    );
  });

  it("keeps custom and unclassified CMS services selectable", () => {
    const custom: PublicServicePackage[] = [
      {
        title: "Technical consulting",
        description: "Review your technical options.",
      },
    ];
    const markup = renderToStaticMarkup(
      createElement(ServicePackagePicker, {
        services: custom,
        category: "Other services",
        selected: "",
        onSelect: () => undefined,
      }),
    );
    expect(markup).toContain("Technical consulting");
    expect(markup).toContain("Review your technical options.");
    expect(markup).not.toContain("undefined");
  });

  it("uses CMS descriptions for custom headings that match object property names", () => {
    const markup = renderToStaticMarkup(
      createElement(ServiceCategoryPicker, {
        services: [
          {
            category: "__proto__",
            title: "Custom service",
            description: "Discuss your specialist project.",
          },
        ],
        selected: "",
        onSelect: () => undefined,
      }),
    );
    expect(markup).toContain("Discuss your specialist project.");
  });
});
