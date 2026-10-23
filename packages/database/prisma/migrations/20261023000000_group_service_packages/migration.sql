BEGIN;

ALTER TABLE "company_landing_cms"."service_package"
  ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Other services',
  ADD COLUMN "level" TEXT NOT NULL DEFAULT 'basic';

ALTER TABLE "company_landing_cms"."service_package"
  ADD CONSTRAINT "service_package_level_check"
  CHECK ("level" IN ('basic', 'medium', 'advanced'));

UPDATE "company_landing_cms"."service_package" AS package
SET "category" = classification.category, "level" = classification.level
FROM (VALUES
  ('ai-automation', 'Automation', 'basic'),
  ('automation-ai-extraction', 'Automation', 'medium'),
  ('automation-platform', 'Automation', 'advanced'),
  ('data-ai-integration', 'Data & AI', 'basic'),
  ('validated-data-pipeline', 'Data & AI', 'medium'),
  ('data-platform-ai', 'Data & AI', 'advanced'),
  ('mvp-development', 'Product Development', 'basic'),
  ('production-mvp', 'Product Development', 'medium'),
  ('scaling-mvp', 'Product Development', 'advanced'),
  ('landing-page-starter', 'Web Presence', 'basic'),
  ('landing-page-cms', 'Web Presence', 'medium'),
  ('marketing-site-cms', 'Web Presence', 'advanced')
) AS classification(slug, category, level)
WHERE package.slug = classification.slug;

COMMIT;
