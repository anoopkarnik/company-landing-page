# Web app

The Next.js application for the company landing page. Run it from the repository root with `pnpm dev` after configuring `apps/web/.env` and applying the Prisma migrations described in the root README.

The public site includes productized services, approved case studies, a curated
portfolio, verified proof, founder positioning, a persisted project-enquiry
funnel, MDX Blog/Documentation, structured data, and a dynamic sitemap. The
PostgreSQL CMS lives at `/admin` and requires server-side `ADMIN_PASSWORD` and
`ADMIN_SESSION_SECRET` values.
