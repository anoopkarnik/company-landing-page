---
sidebar_position: 1
---

# Overview

MicroSaaS products are one of the most exciting ways to create impactful software with minimal resources. They allow solopreneurs and small teams to quickly launch, validate, and iterate on ideas. To help developers hit the ground running, I built a boilerplate for MicroSaaS products using a **TurboRepo monorepo setup** and am excited to share it with the open-source community.

In this overview, I'll walk you through the architecture, design decisions, and why I chose each part of the stack.

---

## Why a MicroSaaS Boilerplate?

Building a MicroSaaS product often involves:

1. Repetitive setups for backend, frontend, and infrastructure.
2. Struggling with the decision of monorepo vs polyrepo.
3. Ensuring scalability without overengineering.

This boilerplate solves these problems by providing a pre-configured, modular, and extensible foundation. Here's what you get out of the box:

- A **monorepo** setup using TurboRepo for code-sharing and efficient builds.
- **TypeScript** for type safety across the stack.
- A **Next.js** frontend for fast and modern web development.
- **Docusaurus** for customizable documentation sites.
- **NextAuth** for email, GitHub, LinkedIn, and Gmail authentication with email verification.
- **Prisma** for database management and ORM.
- **Resend** for email handling.
- **Vercel Blob Storage** for managing profile pictures.
- **ShadCN UI components** in atomic design with easily customizable themes.
- **Zod** for schema validation.
- **Docker** for containerized deployments.
- **Coolify** for deploying production workloads on AWS EC2.
- **Notion** for interacting with Notion 
- **OpenAI** for interacting with OpenAI
- **Cashfree** for payment gateway
- **Recoil** for Context Library
- A clear **folder structure** to keep everything organized.

---

## Monorepo with TurboRepo

### Why TurboRepo?

TurboRepo is a powerful build system for monorepos that simplifies dependency management and speeds up builds. In a MicroSaaS setup, where you might have shared components or utilities between your frontend and backend, a monorepo makes life easier.

**Key Benefits:**
- Shared code between packages.
- Efficient caching for faster builds.
- Simplified dependency management.

### Folder Structure

Here’s how the boilerplate is organized:

```
/turborepo-saas-boilerplate-code
├── apps
│   ├── nextjs-app  # Next.js app
│   ├── docs  # Docusaurus app for documentation
├── packages
│   ├── ui  # Shared UI components and styles (ShadCN based)
│   |   ├── components (Shadcn  and Custom Components in atoms, molecules, organisms and templates)
│   |   ├── styles (Shadcn and Custom Colour themes and css styles to use)
│   ├── next-auth # Auth v5 Authentication library
│   ├── prisma-db # Prisma ORM Client library
│   ├── resend-email # Email Templates and Resend Client library
│   ├── storage # Vercel Blob Clientlibrary
│   ├── ts-types # typescript interfaces and types library
│   ├── typescript-config # Typescript configs library
│   ├── eslint-config # Eslint configs library
│   ├── zod-validation # Zod Validation Client library
│   ├── server-utils # Server Functions which are run in UI components
│   ├── notion # Notion Client to interact with your notion database
│   ├── openai # OpenAI Client to interact with openai
│   ├── recoil # Recoil Context API 
├── docker  # Docker configuration with example env files
├── scripts # Bash Scripts to run to get started
├── docker-compose.yaml # Docker Configuration to start the app
└── turbo.json  # TurboRepo config
```

---

## Frontend with Next.js

### Why Next.js?

Next.js offers the perfect blend of server-side rendering (SSR) and static site generation (SSG), making it ideal for modern MicroSaaS products. Features like API routes and image optimization come in handy for building performant apps.

### Key Decisions

- **Customizable landing page:** The boilerplate includes a pre-built landing page that can be easily tailored to your needs.
- **File-based routing:** Keeps the code organized and easy to scale.
- **TypeScript:** Ensures type safety and reduces bugs.
- **ShadCN UI Components:** Pre-configured with themes and atomic design principles.
- **TailwindCSS:** For rapidly building beautiful and responsive UIs.

---

## Documentation with Docusaurus

### Why Docusaurus?

Docusaurus provides a simple and powerful way to create documentation for your product. It integrates seamlessly with the monorepo, allowing you to maintain docs alongside your codebase.

### Key Features

- Pre-configured themes for consistency.
- Markdown support for quick content creation.
- Versioning for managing updates to your documentation.

---

## Backend with Node.js and Prisma

### Why Prisma?

Prisma simplifies database interactions with a declarative schema and powerful type safety. It works seamlessly with relational databases like PostgreSQL and MySQL, making it an excellent choice for SaaS apps.

### Key Decisions

- **REST API vs GraphQL:** The boilerplate uses REST for simplicity but can be extended to GraphQL if needed.
- **Authentication:** NextAuth provides a robust and customizable authentication system.
- **Database migrations:** Prisma CLI ensures migrations are easy to manage and deploy.

---

## Authentication with NextAuth

### Why NextAuth?

NextAuth provides a flexible and secure authentication system out of the box. This boilerplate supports:

- **Email authentication** with verification links.
- Social logins via **GitHub**, **LinkedIn**, and **Gmail**.
- **JWT-based session management** for scalability.

---

## DevOps: Docker, Vercel, and Coolify

### Why Docker?

Docker ensures consistency across development, testing, and production environments. The boilerplate includes:

- A `Dockerfile` for both the frontend and backend.
- A `docker-compose.yml` for local development.

### CI/CD with GitHub Actions and Vercel

In the development environment, the boilerplate integrates with Vercel for seamless deployments. Automated workflows include:

- Linting and testing.
- Building and deploying Docker containers.
- Running database migrations.

### Production with Coolify on AWS EC2

For production, the boilerplate leverages Coolify, an open-source platform for self-hosted deployments. Key benefits include:

- Simplified setup for deploying Docker containers.
- Integration with AWS EC2 for scalable infrastructure.
- Enhanced control over production workloads.

---

## Design Principles

When creating this boilerplate, I followed these guiding principles:

1. **Simplicity:** Avoid overengineering. The goal is to ship MVPs quickly.
2. **Scalability:** While simple, the stack can scale as your app grows.
3. **Extensibility:** Easily add new features, packages, or technologies.
4. **Developer Experience:** Focus on tools that make development enjoyable and productive.

---

## Conclusion

This boilerplate is the result of many iterations and lessons learned while building MicroSaaS products. I hope it saves you time and effort so you can focus on what truly matters—your product and your users.

Feel free to fork, star, and contribute to the repository. Let’s build amazing MicroSaaS products together!

[Check out the repo here](https://github.com/anoopkarnik/turborepo-saas-boilerplate-code)

---

### Share Your Feedback

Have ideas to improve the boilerplate or want to share your experience using it? Open an [issue on GitHub !](https://github.com/anoopkarnik/turborepo-saas-boilerplate-code/issues)


## Contacting Support

If you encounter any issues or have questions not covered in this documentation, our dedicated support team is here to assist you. Contact us at *support@bsamaritan.com*.