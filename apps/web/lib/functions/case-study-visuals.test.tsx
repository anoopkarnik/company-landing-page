import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MDXRemote } from "next-mdx-remote";
import { describe, expect, it } from "vitest";
import { lifeOsCaseStudy } from "../constants/case-studies/life-os";
import { saasForgeCaseStudy } from "../constants/case-studies/saas-forge";
import { renderCaseStudyVisuals } from "./case-study-visuals";
import { serializeMdx } from "./serialize-mdx";

describe("portable visual case studies", () => {
  it.each([
    ["Life OS", lifeOsCaseStudy],
    ["SaaS Forge", saasForgeCaseStudy],
  ] as const)(
    "renders %s visuals and detail without custom MDX components",
    async (_, study) => {
      const fields = [
        study.solutionMdx,
        study.contributionMdx,
        study.architectureMdx,
        study.outcomeMdx,
      ];
      const html = (
        await Promise.all(
          fields.map(async (field) => {
            const source = await serializeMdx(field);
            // Existing CMS/public readers need only the standard HTML element set.
            return renderToStaticMarkup(createElement(MDXRemote, source));
          }),
        )
      ).join("");
      expect(html.match(/data-case-visual=/g)).toHaveLength(6);
      expect(
        html.match(/class="case-study-story(?: case-study-story-reverse)?"/g),
      ).toHaveLength(6);
      expect(html).not.toMatch(/<details[^>]*\bopen[=>\s]/);
      expect(html).not.toContain("CaseStudyStory");
      expect(html).toContain("opens in a new tab");
      expect(html).not.toContain('alt=""');
    },
  );

  it("rejects an unknown visual before an article can be published", () => {
    expect(() =>
      renderCaseStudyVisuals('<CaseStudyVisual id="missing" />'),
    ).toThrow("Unknown case-study visual");
  });
});
