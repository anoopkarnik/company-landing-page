# Flagship case-study source notes

Reviewed on 24 October 2026 against the user-provided local checkouts under
`/home/anoop/Downloads/TechnicalWork/MyProjects/full-stack-2026v2/`.
Only the company landing page and its two CMS case-study records were edited.

The existing case studies provide the first-person origin stories, ownership,
personal usage, historical migration challenges, and future product direction.
The local source provides implementation detail. Code presence does not establish
production deployment, measured business results, or a successful current CI run.

## SaaS Forge

Paths below are relative to `saas-forge/`.

| Coverage | Evidence |
| --- | --- |
| Starter versus platform, template ownership, native clients, setup | `README.md`, `AGENTS.md`, `template-sync.manifest.json` |
| Thirteen implemented/downloadable modules and dependencies | `scaffold-modules/registry.json` |
| Payment, storage, and CMS provider choices | `scaffold-providers/registry.json` |
| Source pruning, migration handling, lockfile handling | `apps/web/lib/scaffold-modules.ts`, module manifests, scaffold tests |
| Secret rejection, download charging, refunds | `apps/web/lib/scaffold/service.ts`, `secret-keys.ts`, download tests |
| Archive separation, fingerprints, builder version | `apps/web/lib/scaffold/build-cache.ts` |
| Setup walkthrough and optional assistance | `README.md` Launchpad section, `apps/web/lib/scaffold/launchpad/` |
| CLI project selection and credential boundary | `packages/create-saas-forge/src/commands.mjs` |
| Upgrade specification and three-way merge behavior | `.claude/commands/upgrade-boilerplate.md` |
| Jobs, notifications, audits, flags, analytics, MCP, route policy | `AGENTS.md` subsystem contracts and referenced implementation paths |
| Validation strategy | `AGENTS.md` scaffold matrix guidance, `apps/web/lib/scaffold/__tests__/` |

The old case study said organizations, API keys, and notifications were incomplete.
The current registry marks them implemented and download-enabled. Historical tag
and commit counts were replaced by current, directly inspectable project facts.

## Life OS / Life Forge

Paths below are relative to `life-forge/`.

| Coverage | Evidence |
| --- | --- |
| Product origin, broad domains, surfaces | Existing case study, `README.md`, `AGENTS.md`, domain route directories |
| Domain entities and relationships | `packages/database/prisma/*.prisma` |
| Effort calculations and first-miss behavior | `apps/web/lib/formulas/schedulerFormulas.ts`, `actionFormulas.ts` |
| Effective schedule history | `apps/web/lib/formulas/productivity/commitmentGrades.ts`, related types/tests |
| Four code-learning tracks and upload lifecycle | `docs/features/code-repository-learning.md` |
| Attention counting and hour boundaries | `packages/digital-time/src/tracker.ts` and related tests |
| Desktop collection and capability limits | `apps/desktop/src/main/digitalTime/README.md` |
| Android source identities and offline policy | `apps/mobile/lib/appUsage/README.md` |
| Earned snooze behavior | `README.md`, `apps/web/server/digital-control/snoozeTests.ts` and tests |
| Current AI boundary and recovery | `AGENTS.md` AI/backend and Background Jobs sections, `apps/web/lib/backend/client.ts`, backend agent registry |
| Subtab access | `AGENTS.md` access-control sections, `packages/auth/src/subtab-access.ts` |
| Career separation and publishing jobs | `AGENTS.md`, career routers, resume layout helpers |

The current architecture uses web-owned Inngest jobs and a private synchronous
Python execution service. The earlier LangGraph-centric description did not
capture that division. The README also contains older domain/agent descriptions;
the current domain conventions and feature-specific documentation take precedence.

## Presentation and publishing

Copy is in `apps/web/lib/constants/case-studies/`. Native details/summary elements
keep technical material collapsed, with CSS scoped to the MDX renderer. The page
has section navigation and a constrained reading width. No new dependencies or
schema changes are needed.

`refresh-flagship-case-studies.ts` validates all eight MDX fields before updating,
backs up the existing rows locally, guards against concurrent edits, and changes
only editorial fields. The full portfolio sync imports the same content modules.

Verification: all MDX fields compiled; web TypeScript check passed; 53 existing
MDX/case-study tests passed. Both local pages returned HTTP 200. Desktop and
390px mobile browser checks verified closed defaults, Enter/Space operation,
valid section anchors, no page overflow with an open disclosure, and no browser
page errors. Screenshots were inspected and the explicit-MDX styling issue was
corrected before the final browser pass.

## Visual reading pass

The main narratives now use six alternating text-and-visual sections per study:
five purpose-built SVG diagrams and one authentic earlier product screenshot.
The screenshots were already published in the portfolio and retain captions
explaining that some navigation and setup choices have since evolved.

Diagram topics:
- Life OS: domain overview, recovery loop, learning journey, attention sources,
  and web-owned jobs/private Python architecture.
- SaaS Forge: product lifecycle, selected capability groups, delivery pipeline,
  context-aware upgrades, and shared contracts across clients.

The diagrams are explanatory illustrations, not product screenshots or measured
performance charts. All are authored as SVG with accessible title/description
metadata, checked for out-of-frame labels, and rebuilt from the checked-in Python
script. Public screenshots are copied without editing. Source assets are retained
under `apps/web/public/case-studies/` and published with content-addressed R2 URLs.

The editorial helper converts visual-story shortcuts to ordinary HTML before
CMS storage. This keeps existing MDX readers compatible. Figures have descriptive
alt text, captions, and keyboard-accessible full-size links. CSS places images
beside copy on desktop and stacks them below the explanation on smaller screens.
The longer earlier narrative and technical inventories remain in closed details.

Verification after this pass: TypeScript and 56 relevant tests passed, including
rendering every visual article with an uncustomized MDX reader. Both pages returned
HTTP 200, all twelve inline images loaded, six side-by-side sections were verified
on each desktop page, and layouts stacked without page overflow at 768, 390, and
320 pixels. Keyboard accordion and full-size-link interactions passed. Both light
and dark screenshots were inspected. With details closed, the entire articles
(including headings and metadata) contained approximately 933 and 880 visible
words respectively, rather than presenting the complete technical copy at once.
