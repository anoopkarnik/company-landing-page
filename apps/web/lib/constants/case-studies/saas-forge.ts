import { withCaseStudyVisuals } from "../../functions/case-study-visuals";
import type { CaseStudyContent } from "./types";

/** Reviewed against the local saas-forge source on 24 October 2026. */
export const saasForgeCaseStudy = withCaseStudyVisuals({
  title: "SaaS Forge: owning the code, deployment, and upgrade path",
  summary:
    "An open-source SaaS foundation and configurable starter platform spanning web, desktop, and mobile. It combines selectable product modules, provider-specific downloads, guided setup, and upgrades designed to preserve the application a founder builds on top.",
  challenge:
    "Starting a SaaS product repeatedly meant assembling identity, data, billing, administration, email, storage, and deployment before testing the actual idea. Hosted builders could tie code and operating costs to one platform, while payment-provider choices did not always fit an India-based founder. A conventional boilerplate solved the first download but left a harder lifecycle problem: how to keep a heavily customized product current without overwriting the work that made it valuable.",
  solutionMdx: `
<CaseStudyStory visual="saas-product">

### Start with a foundation you can own

SaaS Forge brings identity, data, billing, administration, and other shared concerns into a configurable starting point. The output is source code the developer can inspect and customize.

The starter is separate from the platform that configures, delivers, and upgrades it.

</CaseStudyStory>

<details>
<summary>Why the starter and its delivery platform are separate</summary>

#### Build for the product after the first demo

SaaS Forge began as a reusable foundation for micro-SaaS products whose builders want control over their source code and infrastructure. The goal was not just to make a sign-in page appear quickly. It was to provide a coherent starting point for the work that follows: accepting payments, managing users, publishing content, operating integrations, adding another client, and receiving improvements after customization.

The product therefore has two related responsibilities. **The starter** contains the application foundation a developer takes away. **The SaaS Forge platform** helps that developer choose a configuration, understand it, download it, and later request an upgrade. Keeping those responsibilities distinct prevents the generator's own commercial and project-management machinery from becoming baggage inside every generated app.

The first version established the web experience, identity, persistence, and payments. CMS, administration, scaffold generation, native clients, AI modules, and a Python service expanded the foundation as needs became concrete. The current implementation goes further with selectable operational modules and a lifecycle around saved projects, setup guidance, and versioned upgrades.

</details>

<CaseStudyStory visual="saas-lifecycle" reverse>

### Support the whole product journey

The first download is only the beginning. A founder still needs to configure services, build their product, and absorb improvements later.

Setup guidance explains the selected project. Optional AI help answers questions without taking over the checklist or deploying code.

</CaseStudyStory>

<details>
<summary>The founder journey, guided setup, and secret handling</summary>

#### Follow a founder's journey through the system

1. **Choose what the product needs.** Select modules, target platforms, and supported providers. The configuration determines what belongs in the generated application.
2. **Inspect the intended output.** A file preview is derived from the same variant compiler used for downloads, making it useful evidence of what the selection will contain.
3. **Save and download the project.** The platform tracks the configuration and produces an archive with the selected foundation and setup information.
4. **Configure local services.** A setup walkthrough and environment doctor help the developer connect the required services and understand missing values.
5. **Build the actual product.** The downloaded code becomes the developer's working application, including their own domain models, screens, and business rules.
6. **Evolve the foundation.** Release updates, module changes, and provider changes can produce an upgrade kit that describes the upstream change and gives the developer a basis for merging it into custom code.

This journey made the upgrade path a central product concern. A starter that works only until the first major customization has solved a much smaller problem than the one a founder actually faces.

#### Make setup explain the actual project

A downloaded repository is only useful if its owner can get it running. SaaS Forge includes a project-specific setup walkthrough that reflects selected modules, providers, platforms, and deployment choices. It breaks work into small steps with file locations, expected results, troubleshooting guidance, and documentation links.

The current Launchpad guide is curated rather than waiting for a model to invent a checklist. Opening the guide, navigating it, and downloading its Markdown do not require an AI job. Progress is persistent, and applicable earlier completed work can be retained separately as choices evolve. New steps are not silently marked complete.

Optional AI help can explain or troubleshoot a selected task. It does not edit the checklist, mark progress complete, execute terminal commands, or deploy the application. Keeping assistance separate from the authoritative guide makes the setup path available even when model services are unavailable.

The local environment doctor complements the guide: it checks configuration and services, can help fill missing values, and offers the database preparation steps. A check-only mode provides a noninteractive report for automation. This reduces the gap between a clean archive and a working development environment without pretending that external credentials can be provisioned automatically.

#### Keep secrets out of generated-project state and shared archives

The scaffold service rejects secret environment keys in the public values submitted for generation. A project can retain configuration choices needed to reproduce the selection without turning the SaaS Forge platform into a store of the developer's production credentials.

The shared build cache contains the compiled base variant without buyer-specific environment files, setup output, or project naming. Per-download information is appended separately. The archive walker excludes local environment files and generated directories such as dependency installations and build outputs; environment examples remain available as templates.

The CLI also treats a downloaded project's metadata as untrusted routing information. A repository marker must not be allowed to redirect an API credential to an arbitrary server. These boundaries matter because starter code and project files are frequently copied, shared, and opened by automated tooling.

</details>

<CaseStudyStory visual="saas-modules">

### Choose capabilities, carry less code

The current catalog has **13 selectable modules**. Start with the shared foundation, then choose the billing, team, AI, and operational capabilities the product needs.

Provider choices travel with that selection. Unselected implementations are removed from generated output, rather than simply hidden in the interface.

</CaseStudyStory>

<details>
<summary>The complete module catalog and provider-selection mechanics</summary>

#### Select capabilities without carrying every implementation

The current module registry contains **13 selectable modules**, each marked implemented and enabled for downloads. That is a statement about the local registry and implementation, not a guarantee that every integration is configured in every deployment. AI capabilities continue to be treated as experimental.

| Module | Product capability | Engineering consideration |
| --- | --- | --- |
| Billing and payments | Checkout, credit purchases, transactions, and usage visibility | Connect spending to an auditable usage record. |
| Organizations and teams | Workspaces, invitations, switching, and membership roles | Keep organization context explicit. |
| AI platform | Chat, prompts, speech, and multiple model providers | Separate provider integration from product interaction. |
| AI agents and RAG | Python execution for agents and retrieval workflows | Requires the AI platform and background jobs. |
| API keys | Scoped access for scripts and integrations | Hash stored keys and enforce expiry, revocation, and rate limits. |
| MCP server | Let compatible assistants inspect authorized account data | Requires API keys and tools scoped to selected modules. |
| Background jobs and cron | Asynchronous work, retries, schedules, and failed-job replay | Give slow or failed work an operational lifecycle. |
| Notifications | In-app inbox and email preferences | Deliver the event through channels the user keeps enabled. |
| Audit log | Administrative and workspace change history | Preserve a redacted, append-only trail of meaningful changes. |
| Outgoing webhooks | Customer-managed event delivery | Sign events, retry failures, and protect outbound connections. |
| Feature flags | Targeted availability by role, user, workspace, or percentage | Enforce decisions on the server as well as in the interface. |
| Onboarding | A skippable wizard and module-aware checklist | Base completion on real product data where possible. |
| Product analytics | Typed events with a PostHog adapter | Keep event properties bounded and honor privacy preferences. |

Dependencies are part of the selection model. Choosing agents brings the AI and job capabilities they require; choosing MCP brings API-key support. This avoids handing the user a configuration that looks selectable but lacks its required foundation.

#### How a selected module becomes a real, smaller source tree

Each module has a manifest. Entirely owned files can be removed when the module is unselected. Code shared with other features uses marked regions in the file's own comment syntax, allowing the compiler to remove the relevant block without replacing the whole file. Nested regions handle features that depend on more than one selection.

Structured manifest operations remove JSON keys or apply tightly matched replacements where a marker cannot express the change. Whole-file replacements are reserved for module-owned slots. This keeps a module from maintaining a stale snapshot of a shared router, component, or package definition.

The compiler also checks for identifiers that should not survive an unselected module. That catches leaks which ordinary typechecking can miss, including loose database access. A visually hidden feature is not the same as a removed feature: imports, routes, schema objects, dependencies, and configuration all need to agree.

Module-owned migrations are removed from the generated variant when appropriate, while statements inside mixed migrations are handled through manifest transformations. Repository migrations remain source history. Lockfile importers are pruned to match the selected package manifests so a generated project can use a frozen install.

The result is a compiled application variant, not simply an app with a larger collection of disabled menu items.

#### Treat provider choice as part of portability

The foundation supports provider choices such as Stripe or Dodo for payments, Vercel Blob or Cloudflare R2 for image storage, and constant-backed or PostgreSQL-backed CMS content. The India-based founder context helped make payment flexibility important, while the broader principle is that a core product should not be inseparable from one infrastructure vendor.

Provider choice is reflected in generated code as well as configuration. The selected integration can be kept while unselected implementations are removed. A later provider switch is represented as an upgrade, so portability has a concrete workflow rather than existing only as a claim about modular architecture.

Self-hosting is another part of that control. The repository provides container-based web and database setup, with migrations handled as an explicit rollout step. The private Python service is an additional runtime when the selected AI workflows need it. Actual provider eligibility, service accounts, and hosting operations remain deployment choices for the builder.

#### Provider pruning and dependency consistency

A provider registry describes each toggle, its environment key, its owning module where applicable, and its allowed choices. Provider manifests use the same selective-removal approach as modules. Pruning a payment provider only makes sense when the billing module itself is present.

Provider branches are self-contained so removing one does not leave an orphaned conditional or a missing fallback. Tests specific to a provider can be marked with the same selection boundary. The chosen providers are part of the build identity, preventing an archive compiled for one integration from being reused for another by mistake.

The platform can also retain all providers when explicitly requested. That is a different generated configuration with a different maintenance tradeoff: more flexibility in the downloaded tree, but more code and dependencies to own.

</details>

<CaseStudyStory visual="saas-delivery" reverse>

### Turn a configuration into a working codebase

Root source and starter-specific overrides produce a clean template. A compiler applies the selected modules and providers, then packages the resulting application.

Downloads have recorded states, reusable builds, and a consistent refund path when generation fails.

</CaseStudyStory>

<details>
<summary>Download reliability, build identity, and packaging</summary>

#### Make download failure a recoverable state

Generating an archive is part of a paid workflow, so billing and build behavior have to agree. The platform uses one download service for charging, producing the variant, and recording readiness or failure. A build that the account already owns can be downloaded again without treating it as an unrelated new purchase.

On failure, the workflow is designed to refund the charge once. That matters when a request is retried, the build service fails, or the caller cannot tell whether a previous attempt completed. The useful abstraction is a recorded job with a lifecycle, rather than a charge followed by an untracked zip operation.

#### Build identity, caching, and serverless packaging

The cache key reflects starter content, module selection, providers, platforms, and a builder version. Source and manifest fingerprints prevent a changed starter from accidentally receiving an old compiled archive. Changing compilation or archive behavior requires a builder-version change; tests guard that relationship.

A reusable base archive can be stored in R2 when configured. Project-specific output is added after retrieving the base. This shares expensive compilation across identical selections while keeping personalized download content separate.

The generator reads template and registry files from disk, which creates a serverless deployment concern: each deployed function needs the files it actually uses. Scaffold routes have explicit tracing rules, and expensive scaffold procedures use a dedicated route. This keeps the ordinary application API from inheriting the entire template payload while ensuring the compiler's files are present where required.

The pre-purchase file index is compiled from the same source and selection rules. That reduces the risk of maintaining a marketing preview that drifts from what the user downloads.

</details>

<CaseStudyStory visual="saas-upgrade">

### Upgrade the foundation without erasing the product

Life OS exposed the hard part: a real downstream app has its own schemas, screens, and workflows. Replacing it with a new boilerplate is not an upgrade.

The upgrade kit supplies old and new upstream context. A developer or coding agent reviews that change and merges it into the custom application.

</CaseStudyStory>

<details>
<summary>Three-way upgrades and preserving downstream intent</summary>

#### Solve the upgrade after customization

[Life OS](/case-studies/life-os) made the upgrade problem tangible. Once a downstream product has its own domains, schemas, components, and workflows, copying a fresh boilerplate over it is unacceptable. Plain Git merges help, but large structural changes still require understanding what each side intended.

SaaS Forge generates an upgrade kit containing a machine-readable specification, staged new files, and old upstream versions when available. This gives a coding agent or developer the information needed to compare the old foundation, the new foundation, and the customized application.

The product distinguishes release updates from selection changes. A release update carries upstream changes between versions; an upgrade can also add or remove modules, raise a tier, or switch a provider. The important promise is an explicit, inspectable change set. It is not a promise that every conflict can be merged automatically.

#### Three-way upgrades and preservation of downstream intent

UPGRADE_SPEC.json records the change kind, source and target versions, intervening releases, module changes, new environment keys, and added, modified, or removed files. The .upgrade directory holds the new upstream files. When available, .upgrade-base holds the previous upstream versions for comparison.

For a modified file, the meaningful upstream change is the delta between the old and new upstream versions. That delta is applied to the user's file. If the user never changed it, the new upstream version can be taken directly; if it already matches the target, there is nothing to do. Overlapping edits require preserving the custom product's intent while integrating the upstream improvement.

An added file can still collide with a custom file and therefore needs a merge. A file the user moved or deleted should not be silently recreated. Removing upstream files requires checking custom edits and imports before deleting something the downstream app still depends on.

The finishing work includes dependency installation where necessary, client generation after schema changes, reviewed migration work, new environment values, typechecking, and version markers. The repository includes a Claude Code upgrade command and agent instructions for this workflow. These instructions improve the merge context; they do not eliminate human review or deployment responsibility.

</details>
`.trim(),
  contributionMdx: `
I owned both the application foundation and the lifecycle around it: configuration, generation, setup, operations, and upgrades.

- **Architecture:** keep platform tooling, starter code, and downstream customizations distinct.
- **Delivery:** compile consistent variants and connect downloads with accounting and recovery.
- **Developer experience:** make setup and upgrades inspectable through previews, guides, and explicit change specifications.

<details>
<summary>Full ownership breakdown and downstream validation</summary>

### Ownership across the foundation and its delivery lifecycle

I owned product direction and implementation across the public experience, starter architecture, authentication, persistence, billing, administration, CMS, storage, email, desktop and mobile surfaces, scaffold generation, documentation, and the upgrade workflow.

The less visible work was essential: deciding where root-platform code stops and starter code begins; keeping template source aligned; making optional modules removable without breaking shared files; validating combinations; and ensuring a generated download has a credible setup and maintenance path.

| Area of ownership | Concrete engineering responsibility |
| --- | --- |
| Product structure | Separate the configurable platform, reusable starter, and downstream application. |
| Shared foundation | Integrate identity, typed APIs, database access, common UI, and operational services. |
| Variant generation | Translate module and provider selections into consistent source, schemas, dependencies, and archives. |
| Operational behavior | Connect charges, download jobs, refunds, caching, and saved-project state. |
| Developer experience | Build previews, setup guidance, local checks, CLI workflows, and agent-readable upgrade instructions. |
| Maintenance | Keep root source, template overrides, staged output, and versioned upgrades aligned. |
| Practical validation | Use Life OS as a customized downstream product that exposes conflicts a pristine template cannot. |

### A reusable foundation tested by a demanding consumer

Maintaining both SaaS Forge and Life OS creates a useful feedback loop. A downstream friction point can reveal a missing foundation capability; a shared improvement then has to survive being brought back into a product with real customizations. That is more informative than repeatedly proving that an untouched demo builds.

It also introduces responsibility: not every feature from the platform belongs in the starter, and not every Life OS-specific need should become generic infrastructure. Preserving that distinction is part of the ongoing design work.

</details>
`.trim(),
  architectureMdx: `
<CaseStudyStory visual="saas-architecture">

### Different clients. Shared product contracts.

Next.js web, Electron desktop, and Expo mobile build on shared identity, typed APIs, and product data. Optional jobs and a private Python service support AI workloads.

A separate delivery pipeline turns that foundation into selected downloads and reviewable upgrade kits.

</CaseStudyStory>

<details>
<summary>Source ownership: root, overrides, managed template, and staging</summary>

Shared SaaS behavior is authored in root applications and packages. Intentional starter-only differences live in an override directory. A manifest defines which source and override files belong in the released starter.

Template synchronization copies managed source and reapplies those differences. The drift check verifies both content and ownership: unmanaged files, unregistered overrides, and forbidden generated artifacts should not quietly become part of a release. A clean staging directory is then used for installation, client generation, validation, and builds.

This is a single-source maintenance strategy with explicit exceptions. Hand-editing a generated copy would create another version of the truth, so the staging output is treated as an artifact. Only the documented SaaS boilerplate is treated as the released template; other directories are not automatically marketed as additional shipped products.

</details>

<details>
<summary>Request boundaries, identity, organizations, and feature availability</summary>

A route-policy catalog describes authentication mode, roles, guest behavior, rate limits, body limits, and validation boundaries for pages and APIs. Middleware and route guards consume that policy rather than relying on each endpoint to invent its own protection. Tests check that API routes are represented.

Organization capabilities introduce workspace context and membership roles. API keys provide another access path with scopes, expiry, revocation, and per-key rate limiting. They do not replace user or workspace authorization inside the capability being invoked.

Feature flags are evaluated on the server and hydrated into the UI. Rules can target roles, users, workspaces, or stable percentage cohorts. A hidden control is not sufficient enforcement: procedure and route helpers guard the actual capability. Without the optional module, stable code defaults remain available through a compatible interface.

MCP tools derive the acting user from the authenticated API key rather than accepting an arbitrary user identifier from an assistant. Tool input is validated and scopes are checked. Current tools are read-only; credit-spending or destructive actions require a separate interaction outside model-driven tool execution.

</details>

<details>
<summary>Jobs, notifications, audit history, and outgoing webhooks</summary>

Background jobs use named definitions, input schemas, retry settings, and versioning. With Inngest configured, work is dispatched as events; without a queue, the abstraction can execute inline with its retry behavior. Exhausted failures can be recorded for administrative inspection and replay, and scheduled runs track cron windows.

Notifications define their type, rendering, and default channels in a catalog. Delivery respects user preferences, deduplication prevents repeated events from becoming repeated inbox entries, and email uses the job layer. Presentation components can be reused by the different clients.

Audit events record meaningful configuration or administrative changes. Where application code controls the transaction, the audit entry is written with the change so they commit or roll back together. Metadata is reduced to a schema and redacted for listed or secret-looking fields. Retention is configurable rather than assuming an infinite event history.

Outgoing webhooks use versioned event payloads, HMAC signatures, encrypted stored secrets, delivery records, retries, replay, and automatic pausing after repeated failures. URL checks apply both when endpoints are saved and when connections are made, addressing the risk of an external-looking URL reaching a private destination later.

</details>

<details>
<summary>Credit accounting, usage reconciliation, and privacy-aware analytics</summary>

Metered work records a usage event and updates credit consumption in the same transaction. An idempotency key prevents the same event from charging twice. Existing spending can be represented by an opening-balance event, and reconciliation checks whether recorded events still agree with the aggregate balance.

Threshold notifications are emitted after the transaction commits. That separates the accounting operation from the secondary effect of informing the user. When billing is absent, a compatible stub lets dependent code keep a consistent calling interface.

Product analytics uses a typed event registry with bounded identifiers, counts, and enums rather than names or emails. The adapter can use PostHog when configured, log in development, or do nothing. Consent settings, Do Not Track, and Global Privacy Control are honored. Autocapture and session recording are not part of this implementation, and analytics failures are bounded so they do not become product failures.

</details>

<details>
<summary>Validation across generated combinations</summary>

A configurable starter has a larger verification problem than a single application: removing a feature can expose a missing import, dependency, migration, environment value, or shared component contract.

The repository's scaffold matrix covers each module individually, pairs of modules, and the full selection. A full-subset mode expands coverage further. Checks include compilation, removed-feature leakage, frozen dependency installation, Prisma generation, typechecking, and architecture boundaries.

CI definitions include a pairwise matrix for pull requests and a fuller scheduled sweep. Boot-smoke tooling exercises minimal and complete variants through database migration, seeding, production build, startup, and sign-up. Separate tests cover preview consistency, provider pruning, lockfiles, upgrade output, charging, build cache behavior, and deployment tracing.

These are verification mechanisms present in the repository. This case study does not claim that every combination has passed a fresh run, that current CI is entirely green, or that source-level tests substitute for production monitoring.

</details>
`.trim(),
  outcomeMdx: `
### A starter that remains useful after customization

SaaS Forge connects code ownership with a continuing maintenance path. Life OS provides a demanding downstream application where shared improvements must coexist with real product decisions.

- **Optional means removable.** Imports, schemas, and dependencies must agree with the selection.
- **Generated apps need verification.** A passing root app does not prove every variant can boot.
- **Upgrades need context.** Explicit old and new upstream files make merge decisions better informed.

The foundation is production-oriented; AI modules remain experimental. Module and platform counts describe the implementation, not customer growth or measured time savings.

<details>
<summary>Outcomes, evidence, and the full set of lessons</summary>

### A foundation with a lifecycle beyond its first download

SaaS Forge provides a controlled starting point for web, desktop, and mobile applications, with 13 selectable modules in the current registry and explicit provider choices. The output is source code a developer can inspect, customize, and operate, backed by setup and upgrade workflows designed around that ownership.

Its most important result is the connection between reuse and continued change. Shared improvements can be brought into a customized product such as Life OS without requiring it to restart from a clean template. The upgrade still demands contextual judgment, but the old and new upstream files and the machine-readable specification make that judgment better informed.

### What the project taught me

- **Optionality must reach the source tree.** A toggle is incomplete if hidden features still leave broken imports, unnecessary migrations, or unwanted provider dependencies.
- **A starter is also a maintenance product.** Setup, upgrades, releases, and drift control matter after the initial excitement of a download.
- **Generated output needs its own verification.** A passing root application does not prove that a stripped-down variant can install and boot.
- **Operational failures belong in the design.** A failed archive should have a recorded state and a consistent refund outcome.
- **Agent context improves upgrades.** Old upstream files and an explicit change specification are more useful than asking an assistant to guess which custom code matters.
- **Real downstream products reveal the cost of abstractions.** Life OS makes it harder to hide upgrade friction behind a pristine demo.

### Evidence and remaining work

This case study describes the implementation inspected in the local repository in October 2026. Module counts describe the registry; platform counts describe application surfaces. They are not customer counts, revenue figures, time-saving benchmarks, or an independent production-readiness certification.

The non-AI foundation is production-oriented infrastructure, while AI modules remain experimental. Continued work includes keeping combinations healthy as modules evolve, maintaining clear setup and upgrade guidance, and checking integrations in their actual deployment environments. The complexity of selectable infrastructure is an ongoing maintenance cost, not something the generator removes.

[Explore the source](https://github.com/anoopkarnik/saas-forge), [watch the product demo](https://www.youtube.com/watch?v=0zpQTtcsPtk), or [see the Life OS downstream case study](/case-studies/life-os).

</details>
`.trim(),
  technologies: [
    "Next.js",
    "TypeScript",
    "Better Auth",
    "tRPC",
    "Prisma / PostgreSQL",
    "Turborepo",
    "Electron",
    "Expo",
    "FastAPI",
    "Inngest",
  ],
  metrics: [
    {
      value: "13",
      label: "selectable modules in the October 2026 registry",
      verified: true,
    },
    {
      value: "3",
      label: "application surfaces: web, desktop, mobile",
      verified: true,
    },
  ],
} satisfies CaseStudyContent);
