import { caseStudyVisuals } from "../constants/case-study-visuals";
import type { CaseStudyContent } from "../constants/case-studies/types";

function attribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
}

function figure(id: string) {
  const visual = caseStudyVisuals[id];
  if (!visual) throw new Error(`Unknown case-study visual: ${id}`);
  return `<figure className="case-study-figure" data-case-visual="${id}">
<div className="case-study-visual-title">${visual.title}</div>
<a className="case-study-image-link" href="${attribute(visual.src)}" target="_blank" rel="noreferrer noopener" aria-label="${attribute(`View ${visual.title.toLowerCase()} at full size (opens in a new tab)`)}">
<img src="${attribute(visual.src)}" alt="${attribute(visual.alt)}" loading="lazy" />
<span className="case-study-enlarge">View full size ↗</span>
</a>
<figcaption>${visual.caption}</figcaption>
</figure>`;
}

/** Expand editorial shortcuts into portable HTML supported by every MDX reader. */
export function renderCaseStudyVisuals(source: string) {
  return source
    .replace(
      /<CaseStudyStory visual="([^"]+)"( reverse)?>([\s\S]*?)<\/CaseStudyStory>/g,
      (_, id: string, reverse: string | undefined, body: string) =>
        `<div className="case-study-story${reverse ? " case-study-story-reverse" : ""}">\n<div className="case-study-copy">\n${body}\n</div>\n${figure(id)}\n</div>`,
    )
    .replace(/<CaseStudyVisual id="([^"]+)"\s*\/>/g, (_, id: string) =>
      figure(id),
    );
}

export function withCaseStudyVisuals<T extends CaseStudyContent>(
  content: T,
): T {
  return {
    ...content,
    solutionMdx: renderCaseStudyVisuals(content.solutionMdx),
    contributionMdx: renderCaseStudyVisuals(content.contributionMdx),
    architectureMdx: renderCaseStudyVisuals(content.architectureMdx),
    outcomeMdx: renderCaseStudyVisuals(content.outcomeMdx),
  };
}
