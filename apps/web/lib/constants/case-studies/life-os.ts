import { withCaseStudyVisuals } from "../../functions/case-study-visuals";
import type { CaseStudyContent } from "./types";

/** Reviewed against the local life-forge source on 24 October 2026. */
export const lifeOsCaseStudy = withCaseStudyVisuals({
  title: "Life OS: designing a personal system that rewards resilience",
  summary:
    "A self-hosted personal operating system that connects daily commitments, learning, attention, finances, relationships, and creative work. Built from real routines, it explores how software can make progress visible and returning after a setback easier.",
  challenge:
    "The work of managing life was becoming a second job. Plans lived in Notion, knowledge in YouTube and saved links, automation in n8n, tasks in other tools, and entertainment history in TV Time. None shared a useful picture of progress. Early gamified versions added another problem: penalties for missed habits made a difficult week feel like permanent failure. The challenge was to consolidate those workflows while designing a motivation system that could support discipline, honest reflection, and recovery.",
  solutionMdx: `
<CaseStudyStory visual="life-product">

### A working system, built from real routines

Life OS brings planning, knowledge, career work, and personal records into one workspace. It grew from Notion systems already in use, with shared infrastructure supplied by SaaS Forge.

The goal is practical: know what matters today, act on it, and keep a useful record of what happened.

</CaseStudyStory>

<details>
<summary>The origin story and product boundaries</summary>

#### A product grown from routines already in use

Life OS is the public case-study name for the Life Forge project. It began with personal Notion systems for productivity, finance, and relationships, then grew as recurring needs exposed the limits of disconnected tools. The starting question was practical: what information is needed to decide what to do today, and where should the result go when that work is done?

A task manager can record completion, but it rarely connects that action to a long-term direction. A bookmark manager can save a video, but saving is different from understanding it. A screen-time report can show yesterday's distraction without helping shape tomorrow's choices. Life OS brings these workflows into one account and data model so the connections can become part of the product.

The scope is intentionally personal and experimental. This is an actively used environment for discovering useful workflows, with a broad web application and companion surfaces for work that belongs on the device. It is also a demanding downstream application of [SaaS Forge](/case-studies/saas-forge): shared authentication, persistence, payments, and application infrastructure have to coexist with substantial custom domain logic.

</details>

<CaseStudyStory visual="life-progress" reverse>

### Progress should leave a way back

Early versions made a bad week feel like permanent failure. The revised direction makes effort and recovery visible, alongside goals and results.

- **Choose** a useful commitment.
- **Record** the effort, not just the outcome.
- **Reflect and return** after a setback.

</CaseStudyStory>

<details>
<summary>Motivation design, experience points, and schedule history</summary>

#### Design for returning, not an unbroken streak

The first motivation model put too much weight on results and negative experience points. A run of missed habits could make the accumulated deficit feel impossible to reverse. That undermined the reason to use the product: helping someone act again after losing momentum.

The revised direction emphasizes showing up, effort, and the possibility of recovery. Long-term **Paths** represent areas such as mind, body, and work. **Goals** describe intended outcomes, **Missions** give them actionable structure, and **Status Metrics** track selected observations. Experience points and levels provide feedback; they are not presented as a scientific measurement of someone's ability, wellbeing, or worth.

The product still contains rewards, punishments, and missed-action calculations. The lesson was not that every consequence must disappear. It was that a useful system must distinguish a missed action from a reason to abandon the whole plan, and make the next worthwhile action clear.

#### How effort, schedule history, and progress are modeled

Completion experience uses duration, difficulty, discomfort, and the impact assigned to a path. The current helper calculates rounded experience from **((difficulty × 2) + discomfort) × impact × time factor**. Time factors are bounded buckets: 0.5 for up to two minutes, 1 for up to ten, 1.5 for up to thirty, and 2 beyond that. A longer logged session therefore does not increase this factor without limit.

Actions can distribute experience across primary, secondary, and tertiary paths. This lets one activity contribute to more than one direction without creating duplicate tasks. The formulas live outside the UI, alongside tests, so a dashboard and an activity view can use the same computation.

The missed-schedule helper gives the first miss no experience deduction; successive misses use an increasing fraction of the completion value. This is an implementation choice under continued iteration, not evidence that the motivational model has been clinically validated.

A separate commitment ledger records effective schedule versions and activity outcomes. Recurrence is evaluated against the version that applied at the time. Historical estimates are explicitly represented, and an archived commitment can remain in the record. That matters because editing today's routine should not silently rewrite what was expected last month.

Progress views distinguish what has been earned, what should have been earned by this point, and what remains achievable. Those are different questions: a disappointing start does not necessarily make a useful end to the week impossible.

</details>

<CaseStudyStory visual="life-overview">

### Connected data, distinct places to work

One account does not mean one giant task list. Learning, money, relationships, attention, and creative work each keep the structure they need.

Career has a focused home, while AI assistance appears inside the workflow it supports. The diagram groups the broader domain catalog into six readable areas.

</CaseStudyStory>

<details>
<summary>Explore the complete domain inventory</summary>

#### One system, distinct places for different kinds of work

Consolidation does not mean forcing every record into a generic task table. The current domain structure separates the information people need to act on, while preserving shared identity and reusable product infrastructure.

| Area | What it brings together | Why it belongs in the system |
| --- | --- | --- |
| Game and productivity | Paths, goals, missions, status metrics, recurring schedules, tasks, containers, and activity logs | Connect everyday action to longer-term intent. |
| Second Brain | Books, videos, podcasts, songs, links, channels, capture, and archives | Give useful material a place to be revisited and used. |
| Skill Tree | Visual learning canvases, checklists, practice, tests, and code learning | Move from collecting information to demonstrating understanding. |
| Digital Control | Site and app usage, categories, daily limits, schedules, and session breaks | Make attention visible and support deliberate boundaries. |
| Career | Applications, saved material, resume documents, and AI-assisted tailoring | Keep an opportunity and its supporting evidence together. |
| Indie Hacker | Projects, ideas, features, tasks, sprints, bugs, clients, and collaborators | Connect product planning to the work needed to ship. |
| Finance | Assets, budgets, funds, income, and transactions | Keep planning and recorded financial activity in one workspace. |
| Health and emotional life | Exercise and food records, nutrition goals, journals, mood entries, and self-awareness exercises | Support personal observation without turning the app into a medical authority. |
| Social | Contacts, interests, and interaction history | Make relationship context easier to recall. |
| Content Creation | YouTube planning and drafts, LinkedIn posts, reusable templates, and other publishing records | Keep preparation, publication, and follow-up connected. |
| Entertainment and inventory | Media and episode history, lists, owned items, restocking, and wish lists | Preserve useful personal history beyond work tasks. |
| AI | Chat, speech, prompts, and provider configuration | Supply shared assistance to workflows that have a clear purpose. |

Career now has its own workspace rather than living entirely inside Indie Hacker. Agent actions are also placed inside the domain they serve: the YouTube assistant belongs with videos, and resume tailoring belongs with career work. These boundaries make the breadth easier to understand than a separate catch-all agents screen.

</details>

<CaseStudyStory visual="life-learning" reverse>

### Turn saved information into understanding

A saved video can become a summary, a practice task, and a written assessment. Code learning applies the same idea to repository-specific lessons.

**Capture, practice, and assessment are separate stages.** The system keeps source evidence and previous attempts so progress has context.

</CaseStudyStory>

<details>
<summary>Learning workflows, source evidence, and assessment integrity</summary>

#### From a saved video to something learned

A representative learning journey starts with a video in the Second Brain. The YouTube assistant can bring transcript-derived summaries, key points, and action items back into the knowledge collection. Skill Tree then adds a different layer: a learning canvas, tasks, and written assessments that ask the user to retrieve and explain what they learned.

This is a deliberate distinction between **capture**, **practice**, and **assessment**. A large library is useful only if material can be found again; a completed checklist is useful only if it corresponds to meaningful work. The product gives those stages their own records rather than treating a saved URL as completed learning.

Code learning extends the same idea to software repositories. A coding assistant prepares a learning tree tied to a specific repository revision, and Life OS stores the selected material, assessments, and progress. The four tracks are Foundation, Contribute, Concepts, and Interviews. Prepared levels can be studied immediately; later levels remain visibly in need of preparation.

#### Code learning: source evidence, assessment integrity, and repository updates

The current code-learning flow is skill-driven. Codex or Claude Code inspects a repository locally, pins a commit, and uploads selected excerpts and learning material through a scoped API. The application does not need to download every file or continually regenerate a repository-wide curriculum in the background.

Uploads validate prerequisites, track coverage, learning objectives, rubric criteria, excerpt references, and assessment-template keys. Prepared levels carry bounded source evidence linked to the pinned commit. Missing source ranges can be followed back to the repository instead of duplicating the whole codebase inside the learning database.

Accepted upload items are immutable and resumable. Finalization checks the base revision and publishes in a transaction; repeated finalization is idempotent. Incomplete material remains unpublished. These details protect against a partially uploaded curriculum appearing complete to the learner.

Assessments use written questions with an overall threshold and separate checks for essential objectives. Reference answers and rubrics stay hidden until grading, and tutoring receives lesson context without hidden assessment answers. Starting an assessment reuses an uploaded template and can resume an unfinished attempt; model calls are reserved for grading, help, practice, and related assistance.

Stable level keys and source fingerprints preserve prepared material and progress where the source remains applicable. Changed completed levels can stay passed while being marked for review. Removed topics and previous attempts remain in history. Later changed outlines are presented as drafts, so an update does not silently replace the learner's structure.

</details>

<CaseStudyStory visual="life-attention">

### Use attention data to set better boundaries

Browser, desktop, and Android collectors bring site and app usage into a shared view. Limits, schedules, and session breaks help the user act on that information.

An earned-snooze experiment connects attention with learning: a written test can earn a short break from a scheduled block.

</CaseStudyStory>

<details>
<summary>Attention tracking, earned snoozes, and device limitations</summary>

#### Turn attention data into decisions

Digital Control connects the browser extension, desktop collector, and Android app to a shared attention dashboard. Site usage and native application usage remain distinguishable. Categories, limits, schedules, and session breaks turn the record into something actionable: the user can decide which patterns deserve a boundary and when that boundary should apply.

A particularly revealing experiment is **earned schedule snoozing**. A user requests 10, 20, 30, or 50 minutes and answers a written test generated from indexed Second Brain video material. Each mark earned grants one minute; half a mark grants thirty seconds. The snooze starts after grading, and zero marks grants no time. Drafts can be resumed, and completed tests remain in learning history.

The design connects three previously separate activities: managing distraction, revisiting saved knowledge, and practicing recall. It remains an experiment in product behavior, not a claim that gamification always improves attention or learning.

#### Attention tracking: idle time, retries, device differences, and offline rules

The browser and desktop collectors share tracking primitives in a dedicated package. Time is counted only when the relevant session, focus, and activity conditions hold. Elapsed intervals are capped after interruptions, so waking a suspended machine does not turn an unobserved gap into hours of activity.

Intervals are split at hour boundaries using shared time-zone helpers. Cumulative rounding preserves whole seconds across a boundary rather than losing a fraction in every slice. Native application names are normalized so platform-specific spellings do not unnecessarily fragment one application's history.

The Android collector rebuilds usage buckets from foreground-app events and uploads absolute bucket values. Phone and tablet sources have separate identities. It checks the server's supported sources before uploading, so an older server cannot silently merge an unfamiliar source into the wrong category. Multiple devices of the same form factor still share a source; this is not a per-device identity system.

Android background uploads are subject to the operating system's scheduling and power rules. Foreground sync and a manual action complement background work. Desktop collection on Linux requires a supported windowing environment; the current implementation reports tracking as unavailable under Wayland rather than fabricating activity. Android requires Usage Access. iOS app-usage collection is not implemented in this project.

Blocking policies carry absolute snooze deadlines to the enforcing clients. Expiry is checked locally, allowing a cached rule to resume after the deadline even without a new network response. A snoozed app rule does not cancel a separate category rule that still applies. Session breaks are evaluated per device, which is a different scope from a shared daily usage view.

</details>

### Carry the work through to a usable result

Career tools connect an opportunity to an editable resume and its PDF. Content tools connect a draft to publishing attempts and follow-up. Personal media history stays useful even when an external tool disappears.

<details>
<summary>Career, content creation, and preserving personal history</summary>

#### Make career work editable all the way to the final document

Career work combines an application record, the candidate's own experience, tailored content, and a document that can actually be sent. The resume assistant parses the opportunity, relates it to profile information, and helps compose and critique a tailored version. The human remains responsible for the final claims and presentation.

The difficult interaction was not simply generating text. An editable resume and its PDF must agree about page fit, line wrapping, and what content will appear in the export. That makes layout part of the product workflow. A technically valid response from a model is only a draft until it can be reviewed, edited, and rendered into a useful document.

Separating Career from Indie Hacker also clarified two different kinds of work: managing an opportunity and building a product. Projects, sprints, client records, and bugs remain in the product-building domain, while applications and resume material have a more focused home.

#### Create content without losing the operational work around it

The content workspace covers more than an AI writing box. YouTube drafts, reusable pipeline tasks, stage tracking, and channel or video snapshots give creative work a repeatable structure. LinkedIn work includes authentication, post records, publishing attempts, and follow-up metrics.

External publishing introduces uncertainty: a request can be delayed, credentials can stop working, and retries can overlap. The application records attempts and uses scheduled jobs for due posts. This makes publication a workflow with state and recovery rather than assuming that a button click always equals a successful external post.

Entertainment imports surfaced a related lesson: personal history has value even when it is not part of a productivity score. Preserving watched media and episode history before an external tool becomes inaccessible is a data-continuity problem, not just a convenience feature.

</details>
`.trim(),
  contributionMdx: `
I owned the product from the first personal workflows through domain modeling, interface design, full-stack implementation, and companion clients.

- **Product:** revise incentives and simplify how people enter a broad system.
- **Engineering:** connect reliable data, access control, device collectors, and AI jobs.
- **Maintenance:** preserve history and bring foundation improvements into a customized application.

<details>
<summary>Full ownership breakdown and difficult design decisions</summary>

### Ownership from product discovery to operations

I conceived and built Life OS end-to-end, using my own routines as the first source of requirements. That included translating existing Notion systems into relational domain models, designing the game and progress language, implementing the web experience, and extending selected workflows to desktop, mobile, and browser contexts.

| Responsibility | Work involved |
| --- | --- |
| Product direction | Decide which recurring problems deserve a first-class workflow; revise incentives when they discourage returning. |
| Domain and data design | Model paths, schedules, knowledge, finance, relationships, career, publishing, and attention with explicit ownership and history. |
| Interface design | Make dense information navigable through domain pages, focused views, learning canvases, editors, and progress summaries. |
| Full-stack engineering | Connect typed APIs, persistence, access policy, shared components, integrations, and background work. |
| AI integration | Put assistance inside useful workflows, manage prompt/provider boundaries, and preserve durable job state. |
| Cross-platform work | Package companion applications and implement collectors where browser-only software cannot observe the required context. |
| Migration and maintenance | Preserve existing personal records and absorb improvements from the shared SaaS Forge foundation. |

### The decisions that required the most judgment

The hardest work sat at boundaries: between motivation and punishment, between a flexible editor and a fixed PDF page, between a website and operating-system permissions, and between an AI result and a reliable application action. Each required more than adding a screen.

I also had to decide when to simplify. The current Python agent service executes direct functions while the web application owns queueing and job state. Code-learning preparation moved into a coding-assistant workflow with explicit uploads. Career gained its own domain. These changes reflect a willingness to revise the architecture as real use reveals a clearer division of responsibility.

</details>
`.trim(),
  architectureMdx: `
<CaseStudyStory visual="life-architecture">

### Shared records. Specialized execution.

The web application owns identity, access, and product APIs. PostgreSQL stores the records. Durable Inngest jobs call a private Python service when an agent is needed.

**Queueing belongs to the web layer; agent execution belongs to FastAPI.** That separation lets the interface recover work after interruptions.

</CaseStudyStory>

<details>
<summary>Domain boundaries and the relational model</summary>

Domain organization is mirrored across routes, components, tRPC routers, and Prisma schema files. A finance feature can be followed from its page to its API and persistence model without searching an undifferentiated application folder. Shared calculations, validation, and types live outside page components.

Relationships are explicit: paths can relate to goals and missions; projects connect to features, tasks, sprints, clients, and people; media has episodes and list membership; learning material has source references, revisions, assessments, and progress. This structure is more work than storing arbitrary dashboard JSON, but it makes ownership, filtering, history, and cross-domain use clearer.

The foundation supplies reusable identity and application concerns. Life-specific entities remain downstream product code. That boundary matters during upgrades: a better authentication or infrastructure module should not require the custom learning or productivity model to be recreated.

</details>

<details>
<summary>Durable AI jobs and recovery when the job server is unavailable</summary>

Starting mutations perform inexpensive authorization and precondition checks, persist an AiJob row, and return a job identifier. Persisting before event dispatch prevents a temporary queue outage from erasing the user's request.

When dispatch fails or times out, the row remains queued. Status polling can retry dispatch with throttling, and a scheduled sweep revisits queued work. Accepted events that never begin are also recoverable within bounded retry rules. The UI can say that it is waiting for the job server instead of showing an indefinite, unexplained spinner.

An executing function claims the row with its run identifier, making duplicate deliveries no-ops. Work is separated into job steps, and its result is saved for the client to retrieve. The client resumes unfinished work after reload and settles its success or failure callback once.

All web-to-Python calls use the signed backend client. The private service maps a registered agent identifier to a direct Python function. It no longer needs a separate persisted job system, streaming lifecycle, or worker process of its own. Caller errors and retryable service failures are distinguished so retrying does not become a substitute for correcting invalid input.

</details>

<details>
<summary>Authorization beyond hiding sidebar links</summary>

Invitations and users can carry allowed-subtab selections. New restricted invitations begin without selected subtabs; administrators retain full access, and legacy unrestricted access is represented explicitly. A shared subtab catalog connects navigation to route and procedure policy.

Server-side checks read current role and permissions rather than trusting a stale session snapshot. Direct URLs, typed procedures, REST routes, and relevant digital-time API-key access enforce the current policy. Hiding a navigation item improves the interface but is not the security boundary.

Guest mutations are read-only, banned access is rejected, and an authorization lookup failure does not grant access. Open clients periodically refresh navigation permissions, while server checks apply on subsequent requests. This is useful in a broad personal platform because sharing a selected workflow should not imply access to every domain.

</details>

<details>
<summary>Verification targets and the limits of a cross-platform test suite</summary>

The repository contains targeted tests for scheduler formulas, commitment grading, authorization, resume layout helpers, attention buckets, session limits, snooze grading, code-learning uploads, and job behavior. These are meaningful boundaries because small mistakes can alter progress, expose a hidden workflow, duplicate activity, or award time twice.

Automated tests complement device checks. Android usage access and background scheduling, native desktop window detection, real OAuth flows, and external publishing still need environment-specific verification. Source code and test coverage demonstrate the intended implementation; they do not establish that every integration is currently deployed, configured, or passing in production.

</details>
`.trim(),
  outcomeMdx: `
### Useful connections, tested through personal use

Saved knowledge can become an assessment. An assessment can earn a schedule snooze. An activity can contribute to a longer-term path. Those connections are the strongest result of bringing the workflows together.

- **Make returning easy.** A progress model should support recovery.
- **Make failures understandable.** Queued jobs and unavailable trackers need honest states.
- **Make starting smaller.** Newcomers should get value from one routine before configuring a whole life system.

Life OS remains an experimental personal platform. The next direction is simpler starting paths and focused products around its strongest workflows.

<details>
<summary>Outcomes, limitations, and the full set of lessons</summary>

### A connected working environment and a source of product lessons

Life OS consolidates workflows that previously needed several tools and repeated context entry. Its strongest result is the ability to explore connections inside one working system: saved knowledge can become an assessment, an assessment can earn a schedule snooze, an activity can contribute to a path, and an application can reuse structured career evidence.

The platform is used as a personal product, with several workflows used daily and others revisited less frequently. That is evidence of usefulness to its builder, not a measured retention rate or a claim of broad market fit. There is no independently measured productivity uplift, time-saving percentage, or learning-outcome study attached to this case study.

### What the work taught me

- **Consolidation needs structure.** One database reduces fragmentation only if the user can still understand where each kind of work belongs.
- **A progress model changes behavior.** The emotional cost of returning after a setback matters as much as the precision of a score.
- **Reliability is part of the interface.** A recoverable queued job, an honest unavailable tracker, and a clear upload state are product features.
- **Device context is a design constraint.** A browser, a desktop process, and Android offer different capabilities and cannot be treated as interchangeable shells.
- **AI benefits from a narrow responsibility.** Preparing a draft, grading an answer, or summarizing a video is easier to inspect than asking an agent to own the whole workflow.
- **History deserves protection.** Changes to schedules, source code, or external tools should not casually erase the record of earlier work.

### The next product challenge is reducing the starting burden

Breadth is both the platform's strength and its main constraint. An interface shaped by years of personal habits can be intuitive to its builder and overwhelming to a newcomer. A first-time user should not need to configure every life domain before getting value from one routine.

The product direction is to introduce simpler starting paths, reveal complexity gradually, and explore focused standalone products around the strongest workflows. Those are directions for further work, not completed commercial launches. The current project remains an experimental personal platform and a practical test of how a reusable SaaS foundation behaves under extensive customization.

[Explore the Life Forge source](https://github.com/anoopkarnik/life-forge) or [read how SaaS Forge supports the foundation](/case-studies/saas-forge).

</details>
`.trim(),
  technologies: [
    "Next.js",
    "TypeScript",
    "Better Auth",
    "tRPC",
    "Prisma / PostgreSQL",
    "FastAPI",
    "Inngest",
    "Electron",
    "Expo",
    "WXT",
  ],
  metrics: [
    {
      value: "4",
      label:
        "code-learning tracks: Foundation, Contribute, Concepts, Interviews",
      verified: true,
    },
    {
      value: "3",
      label: "attention collection contexts: browser, desktop, Android",
      verified: true,
    },
  ],
} satisfies CaseStudyContent);
