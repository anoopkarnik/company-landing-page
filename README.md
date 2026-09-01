# Company Landing Page

A configurable company landing page built with Next.js, React, tRPC, Prisma, PostgreSQL, Tailwind CSS, and Turborepo.

Landing-page, blog, and documentation content is stored in PostgreSQL and can be edited from `/admin`. Blog and documentation bodies are authored as MDX. Notion is only needed when importing an existing CMS.

## Local setup

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Copy `apps/web/.env.example` to `apps/web/.env` and set at least:

   ```dotenv
   DATABASE_URL="postgresql://postgres:password@localhost:5432/company_landing_page"
   NEXT_PUBLIC_SAAS_NAME="Your Company"
   NEXT_PUBLIC_URL="http://localhost:3000"
   ADMIN_PASSWORD="choose-a-strong-password"
   ADMIN_SESSION_SECRET="generate-a-long-random-secret"
   ```

3. Generate Prisma Client and apply the PostgreSQL migration:

   ```sh
   pnpm db:generate
   pnpm db:migrate:deploy
   ```

4. Start the app:

   ```sh
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS. On a new database, the first CMS read seeds PostgreSQL from the checked-in landing-page snapshot. Admin access uses a signed, HttpOnly session backed by `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`; there is no browser-stored fallback password.

## Database commands

```sh
pnpm db:generate        # regenerate Prisma Client
pnpm db:migrate         # create/apply migrations during development
pnpm db:migrate:deploy  # apply checked-in migrations in deployment
pnpm db:import-cms      # import landing, blog, and documentation content from Notion
pnpm db:sync-lifeforge  # sync the curated public LifeForge portfolio projection
pnpm db:studio          # open Prisma Studio
```

`db:sync-lifeforge` requires `LIFEFORGE_DATABASE_URL`. It copies only the
allowlisted public/anonymized portfolio fields into this app's database and
rejects signed or private Notion media URLs. The public API additionally
filters unpublished projects, private case studies, unverified metrics, and
testimonials or logos without consent.

The `/admin` sidebar includes dedicated workspaces for service packages, case
studies, portfolio publishing, proof metrics, social proof, project leads,
founder/SEO content, Blogs, and Documentation. Blog, Documentation, service,
and case-study long-form content is authored as MDX.

The MDX editor supports standard Markdown plus JSX components. A styled callout is available as `<Callout type="info">...</Callout>`; supported types are `info`, `success`, `warning`, and `danger`.

## Quality checks

```sh
pnpm --filter web typecheck
pnpm --filter @workspace/cms test
pnpm build
```

## License

MIT. See [LICENSE](LICENSE).
