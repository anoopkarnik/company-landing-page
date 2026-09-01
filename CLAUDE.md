# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Turborepo + pnpm monorepo that ships a configurable company/SaaS landing page. The product is also distributed as an npm CLI (`npx company-landing-page@latest`, see [scripts/cli.js](scripts/cli.js)) that scaffolds the project for end users. The single app is `apps/web` (Next.js 15 App Router, React 19); everything reusable lives in `packages/*` under the `@workspace/*` namespace.

> The README still describes a Strapi CMS and a `strapi-cms` app. **That is stale.** The CMS is now **Notion** (`NEXT_PUBLIC_CMS="notion"`) and there is no Strapi app. Trust the code over the README.

## Commands

Run from the repo root unless noted. Turbo fans tasks out across the workspace.

```sh
pnpm dev            # turbo dev — runs `next dev --turbopack` for apps/web on :3000
pnpm build          # turbo build
pnpm lint           # turbo lint
pnpm format         # prettier --write across ts/tsx/md
```

Scope a task to one workspace with `--filter`:

```sh
pnpm --filter web dev
pnpm --filter web typecheck          # tsc --noEmit (NOT part of `turbo lint`)
pnpm --filter web lint:fix
pnpm --filter @workspace/cms test    # vitest run
```

Tests use **Vitest** and live next to source as `*.test.ts` (mostly in `packages/cms`). The web app and several packages pass `--passWithNoTests`.

```sh
pnpm --filter @workspace/cms test                     # whole package
pnpm --filter @workspace/cms exec vitest run src/notion/page/updatePage.test.ts   # single file
pnpm --filter @workspace/cms exec vitest -t "name of test"                        # single test by name
```

### CMS snapshot sync (important)

```sh
pnpm --filter web sync:cms-constants
```

This pulls live landing-page data from Notion and writes `apps/web/lib/constants/landing-page/generated.ts` — the **build-time fallback** used when Notion is unreachable at runtime. It is generated; never hand-edit it. Rerun after Notion content changes that should be baked into the deploy. The sync script ([apps/web/scripts/sync-cms-constants.ts](apps/web/scripts/sync-cms-constants.ts)) strips Notion's expiring signed S3 file URLs and substitutes local `/public` fallbacks.

## Architecture

### Data flow: Notion → cache → tRPC → RSC → client

The landing page has no database of its own. Content is authored in Notion and flows through three cache layers (see [apps/web/lib/functions/cms-cache.ts](apps/web/lib/functions/cms-cache.ts)):

1. **Upstash Redis** (`server/redis.ts`) — first read, ~50 min TTL. Optional; absent in local dev.
2. **Next.js `unstable_cache`** — tagged (`LANDING_PAGE_CACHE_TAG`, etc.) for `revalidateTag` invalidation.
3. **Generated snapshot** — `lib/constants/landing-page/generated.ts`, returned if Notion fetch throws.

TTL is deliberately under 60 min because **Notion file URLs are signed and expire after 3600s** — cache them too long and images 404.

The fetch + cache results are exposed through **tRPC** ([apps/web/trpc](apps/web/trpc)). Routers: `landing`, `support`, `documentation`, `blog` (`trpc/routers/_app.ts`). Server Components prefetch via `getQueryClient()` + `ensureQueryData` and dehydrate into a `HydrationBoundary`; client components read the same query through `useTRPC()` + TanStack Query. Landing/admin pages are `export const dynamic = "force-dynamic"`.

### The `@workspace/cms` Notion abstraction

`packages/cms/src/notion/` wraps the `@notionhq/client` SDK with a uniform shape:

- `database/`, `page/`, `block/` — CRUD operations (`queryDatabase`, `createPage`, `updatePage`, `trashPage`, ...).
- `utils/modifyProperty` / `unmodifyProperty` — translate between Notion's verbose property JSON and flat app objects. `modifyResult` flattens a Notion row to `{ ...props, id }`.
- Functions take a typed `{ name, type, value }[]` property array (types like `title`, `text`, `url`, `file_url`, `number`, `select`, `relation`). The admin write path in `landingProcedures.ts` builds these arrays.

All Notion calls log through `@workspace/observability/winston-logger`.

### Admin CMS editor

[apps/web/app/admin/page.tsx](apps/web/app/admin/page.tsx) is a client-side editor with tabbed sections (`blocks/admin/*TabContent.tsx`) that writes back to Notion via the `landing.updateLandingInfo` mutation. That mutation's `syncArray` helper does a full diff-sync per child database (services, products, testimonials, team, footer): trash rows removed from input, update rows with ids, create rows without — then `invalidateLandingPageCache()`.

**Auth caveat:** admin access is a client-side localStorage password gate (`DEFAULT_PASSWORD = "password"`), not real auth. `better-auth` and `prisma` are in `apps/web/package.json` but not yet wired in (no `schema.prisma` exists). Treat admin as unprotected.

### Packages

- `@workspace/ui` — shared component library. ShadCN (`new-york` style) lives in `src/components/shadcn`; also `aceternity`, `custom`, `mdx`, `notion`, `misc` component groups, plus providers, hooks, typography, and `styles/globals.css` (the Tailwind entry). New ShadCN components install here, not in the app (see `apps/web/components.json` aliases → `@workspace/ui/*`).
- `@workspace/cms` — Notion CMS layer (above).
- `@workspace/email` — React Email templates rendered/sent via Resend.
- `@workspace/observability` — Winston logger (+ Logtail/Loki transports).
- `@workspace/analytics` — Vercel Analytics / GA wrappers.
- `@workspace/eslint-config`, `@workspace/typescript-config` — shared config; consumed via `extends`.

### Routing (apps/web/app)

- `(landing)/` route group — public site: `/` (landing), `/blog`, `/doc`, `/legal/*`.
- `admin/` — CMS editor.
- `api/` — `trpc/[trpc]` handler, `cms/upload` (image upload), `healthcheck`.

`blocks/` holds page-level composed sections (`landing/`, `admin/`, `support/`); `components/landing/` holds smaller landing-specific components. Reusable primitives belong in `@workspace/ui`.

### Image uploads

[apps/web/app/api/cms/upload/route.ts](apps/web/app/api/cms/upload/route.ts) switches on `NEXT_PUBLIC_IMAGE_STORAGE`: `cloudflare_r2` (S3 client against R2) or `vercel_blob`. Images: 10MB max, `image/*` only.

## Conventions & gotchas

- **TypeScript is intentionally loose in the web app:** `strictNullChecks: false` (web `tsconfig.json`) and `@typescript-eslint/no-explicit-any` is **off**. The `any`-heavy Notion code is deliberate, not an oversight.
- `apps/web` is ESM (`"type": "module"`); the Notion/observability packages are CommonJS.
- Path aliases: `@/*` → `apps/web/*`; cross-package imports use `@workspace/<pkg>/<path>` (note `cms`/`ui` export raw `.ts`/`.tsx`, no build step).
- `transpilePackages` and `optimizePackageImports` are configured in `next.config.js`; `images.remotePatterns` must include any new external image host (R2 public URL, Notion S3, etc.).
- All site identity is env-driven: `NEXT_PUBLIC_SAAS_NAME` keys the Notion landing-page row lookup and the Redis cache namespace. See `apps/web/.env.example` for the full variable set (CMS database IDs, Notion token, Resend, R2/Upstash, GA).
- Generated file — do not edit by hand: `apps/web/lib/constants/landing-page/generated.ts`.
