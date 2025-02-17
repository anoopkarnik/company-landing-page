import { ProjectProps, ProjectSectionProps } from "@repo/ts-types/landing-page/projects";

export const projects: ProjectProps[] = [
    {
      "title": "Turborepo SaaS Boilerplate Code",
      "description": "The best boilerplate code for creating a micro SaaS monorepo codebase.",
      "demo": "https://boilerplate.bayesian-labs.com",
      "github": "https://github.com/anoopkarnik/turborepo-saas-boilerplate-code",
      "image": "/projects/turborepo-saas-boilerplate-code.png"
  
    },
    {
      "title": "Company Landing Page Boilerplate Code",
      "description": "The best boilerplate code for creating a company landing page.",
      "demo": "https://bayesian-labs.com",
      "github": "https://github.com/anoopkarnik/company-landing-page",
      "image": "/projects/company-landing-page.png"
    },
    {
      "title": "Personal Finance System Template",
      "description": "This dashboard is used to put your monthly budgets, yearly budgets, assets and liabilities, financial transactions, FIRE and funds with a sample list of all budgets a person above 25 faces.",
      "notion": "https://www.notion.so/marketplace/templates/personal-finance-system",
      "image": "/projects/personal-finance-system.webp"
    },
    {
      "title": "Social & Relationship System Template",
      "description": "This is a template to maintain all my relationships - friends, family, acquantances and professional.",
      "notion": "https://www.notion.so/marketplace/templates/social-relationship-system",
      "image": "/projects/social-relationship-system.jpeg"
    },
    {
      "title": "Solopreneur Project Management System Template",
      "description": "This dashboard is perfect for planning production level projects which a very small team or solopreneur builds, it includes databases for projects, sprints, bugs, features, team, etc.",
      "notion": "https://www.notion.so/marketplace/templates/solopreneur-projects-dashboard",
      "image": "/projects/solopreneur-projects-dashboard.webp"
    }
  ]

export const projectsSection: ProjectSectionProps = {
    heading: "Many Great Products",
    description: `These are some of the products that we have build. 
    We are always looking to improve and add more products`,
    projects
}