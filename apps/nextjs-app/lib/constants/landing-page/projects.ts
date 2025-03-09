import { ProjectProps, ProjectSectionProps } from "@repo/ts-types/landing-page/projects";



export const projects:ProjectProps[] = [
  {
      title: 'Turborepo SaaS Boilerplate Code',
      type: 'Full Stack',
      description: 'The best boilerplate code for creating a SaaS monorepo codebase.',
      techStack: [],
      demoImage:'/projects/turborepo-saas-boilerplate-code.png',
      contribution: `Made the entire codebase from scratch, 
      including the UI/UX, frontend, backend, testing and CI/CD pipelines.`,
      openSourceDetails: {
          link: 'https://github.com/anoopkarnik/turborepo-saas-boilerplate-code',
          npmPackageLink: "https://www.npmjs.com/package/turborepo-saas-boilerplate-code",
          stars: '7',
          weeklyDownloads: '3',
          weeklyClones: '13',
      },
      websiteDetails: {
          websiteLink: 'https://boilerplate.bayesian-labs.com',
          websiteViews: '213',
          websiteUsers: '133',
      },
      contentDetails: {
          blogLink: '',
          videoLink: '',
      },
      featured: true
  },
  {
      title: 'Company Landing Page',
      type: 'Full Stack',
      description: 'The best boilerplate code for a SaaS company landing page.',
      techStack: [],
      demoImage:'/projects/company-landing-page.png',
      contribution: `Made the codebase from scratch`,
      openSourceDetails: {
          link: 'https://github.com/anoopkarnik/company-landing-page',
          npmPackageLink: "https://www.npmjs.com/package/company-landing-page",
          stars: '1',
          weeklyDownloads: '165',
          weeklyClones: '69',
      },
      websiteDetails: {
          websiteLink: 'https://bayesian-labs.com',
          websiteViews: '15',
          websiteUsers: '8',
      },
      contentDetails: {
          blogLink: '',
          videoLink: '',
      },
      featured: true
  },
  {
      title: 'Portfolio Boilerplate',
      type: 'Full Stack',
      description: 'The best portfolio boilerplate code for a developer.',
      techStack: [],
      demoImage:'/projects/portfolio-boilerplate.gif',
      contribution: `Made the codebase from scratch`,
      openSourceDetails: {
          link: 'https://github.com/anoopkarnik/portfoilio-boilerplate',
          npmPackageLink: "https://www.npmjs.com/package/portfolio-boilerplate",
          stars: '1',
          weeklyDownloads: '165',
          weeklyClones: '69',
      },
      websiteDetails: {
          websiteLink: 'https://anoopkarnik.net',
          websiteViews: '15',
          websiteUsers: '8',
      },
      contentDetails: {
          blogLink: '',
          videoLink: '',
      },
      featured: true
  },
  {
      title: 'Personal Finance System',
      type: 'Notion Template',
      description: `This dashboard is used to put your monthly budgets, yearly budgets, assets
       and liabilities, financial transactions, FIRE and funds with a sample list of all 
       budgets a person above 25 faces. You get to know based on your expenses, income, 
       inflation, death age, current age, lifestyle adjustment, increment, etc your time to 
       bankruptcy or FIRE, and all other things like that`,
      techStack: [],
      demoImage:'/projects/personal-finance-system.webp',
      contribution: `Made the template from scratch`,
      notionDetails: {
          templateLink: 'https://www.notion.so/templates/personal-finance-system',
          views: '6',
          downloads: '4',
          rating: '5',
      },
      contentDetails: {
          blogLink: '',
          videoLink: 'https://youtu.be/jOASverE_FI',
      },
      featured: true
  },
  {
      title: 'Solopreneur Projects Dashboard',
      type: 'Notion Template',
      description: `This dashboard is perfect for planning production level projects
       which a very small team or solopreneur builds, it includes databases for projects,
        sprints, bugs, features, team, etc. The buttons only work for paid notion subscribers
         but the template functions perfectly without those too. Feel free to leave reviews 
         and any additions you think would work well for you. I will reply back once a week
          to all those queries to inform if it is possible in notion or not and if it is add 
          the feature.`,
      techStack: [],
      demoImage:'/projects/solopreneur-projects-dashboard.webp',
      contribution: `Made the template from scratch`,
      notionDetails: {
          templateLink: 'https://www.notion.so/templates/solopreneur-projects-dashboard',
          views: '84',
          downloads: '24',
          rating: '5',
      },
      contentDetails: {
          blogLink: '',
          videoLink: 'https://youtu.be/_t6RJ9Trw6A',
      },
      featured: true
  },
  {
      title: 'Social & Relationship System',
      type: 'Notion Template',
      description: `This is a template to maintain all my relationships - friends, family,
       acquantances and professional. If you want to have any kind of permanent relationship 
       in your life, you need to maintain contact based on long term emotions irrespective of
        what your short term emotions say. It also categorises your social needs based on 
        Dunbar's Number Framework and Maslow's Hierarchy of Needs which determine a person's 
        social fulfillment in life.`,
      techStack: [],
      demoImage:'/projects/social-relationship-system.jpeg',
      contribution: `Made the template from scratch`,
      notionDetails: {
          templateLink: 'https://www.notion.so/templates/social-relationship-system',
          views: '22',
          downloads: '10',
          rating: '-',
      },
      contentDetails: {
          blogLink: '',
          videoLink: 'https://youtu.be/NeISUZa87EE',
      },
      featured: true
  },

]
export const projectSection: ProjectSectionProps = {
    heading: "Many Great Products",
    description: `These are some of the products that we have build. 
    We are always looking to improve and add more products`,
    projects
}