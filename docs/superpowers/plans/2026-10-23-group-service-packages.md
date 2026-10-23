# Group service packages implementation plan

**Goal:** Replace twelve standalone service cards with four headings, each containing Basic, Medium, and Advanced packages, and persist the classification in the CMS and PostgreSQL.

**Architecture:** Keep the existing package records and add editable `category` and `level` fields. Group the public section and CMS editor by category; expand individual public packages for their existing details. Use an additive migration to backfill the twelve existing slugs while preserving authored content and pricing.

**Tech stack:** Existing Next.js, React, tRPC, Zod, Prisma, PostgreSQL, and Tailwind.

**Design:** Keep the site's existing background/card/primary/muted palette and typography. Use a left-aligned two-column grid of four category panels (one column on mobile), with three compact disclosure rows per panel. The level is the subheading, followed by the existing package title and starting price. Details contain the current description, deliverables, timeline, and enquiry CTA.

- [x] Verify grouping behavior with interleaved featured packages, out-of-order levels, custom headings, and legacy services.
- [x] Add classification to Prisma, migration/backfill, public DTO, API validation and save path, and existing seed/sync scripts.
- [x] Replace the public package grid with grouped disclosures; group the CMS editor and expose heading/level controls.
- [x] Apply the additive migration to the configured database and verify all twelve packages retain their authored data.
- [x] Run web tests, typecheck, build, and desktop/mobile browser checks, including enquiry selection and CMS persistence.

**Review focus:** No packages lost through grouping; Basic/Medium/Advanced order independent of featured status; blank legacy categories still render; database backfill does not alter copy/prices/publication; CMS saves retain heading and level.

**Verification:** 66 web tests pass, TypeScript check passes, production build passes, and Prisma schema validates with all migrations applied. Database snapshot comparison confirms no original package fields changed (apart from timestamps during the CMS save check). Desktop and 390px mobile checks confirm all four headings, twelve ordered levels, working disclosures, no horizontal overflow, and correct enquiry selection. CMS save returned HTTP 200 and classification survived reload. Independent code review found no actionable defects.
