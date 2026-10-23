/** Editorial fields shared by the portfolio seed and the targeted CMS refresh. */
export type CaseStudyContent = {
  title: string;
  summary: string;
  challenge: string;
  solutionMdx: string;
  contributionMdx: string;
  architectureMdx: string;
  outcomeMdx: string;
  technologies: string[];
  metrics: Array<{ value: string; label: string; verified: boolean }>;
};
