ALTER TABLE "company_landing_cms"."landing_page"
  ADD COLUMN "hero_eyebrow" TEXT,
  ADD COLUMN "target_audience" TEXT,
  ADD COLUMN "value_proposition" TEXT,
  ADD COLUMN "availability" TEXT,
  ADD COLUMN "response_time" TEXT,
  ADD COLUMN "primary_cta_label" TEXT,
  ADD COLUMN "primary_cta_link" TEXT,
  ADD COLUMN "secondary_cta_label" TEXT,
  ADD COLUMN "secondary_cta_link" TEXT,
  ADD COLUMN "trust_heading" TEXT,
  ADD COLUMN "proof_heading" TEXT,
  ADD COLUMN "service_packages_heading" TEXT,
  ADD COLUMN "service_packages_description" TEXT,
  ADD COLUMN "case_studies_heading" TEXT,
  ADD COLUMN "case_studies_description" TEXT,
  ADD COLUMN "portfolio_heading" TEXT,
  ADD COLUMN "portfolio_description" TEXT,
  ADD COLUMN "process_heading" TEXT,
  ADD COLUMN "process_description" TEXT,
  ADD COLUMN "process_steps" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "founder_heading" TEXT,
  ADD COLUMN "founder_name" TEXT,
  ADD COLUMN "founder_title" TEXT,
  ADD COLUMN "founder_short_bio" TEXT,
  ADD COLUMN "founder_long_bio" TEXT,
  ADD COLUMN "founder_image_url" TEXT,
  ADD COLUMN "founder_education" TEXT,
  ADD COLUMN "founder_location" TEXT,
  ADD COLUMN "founder_timeline" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "founder_social_links" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "lead_heading" TEXT,
  ADD COLUMN "lead_description" TEXT,
  ADD COLUMN "lead_success_message" TEXT,
  ADD COLUMN "seo_title" TEXT,
  ADD COLUMN "seo_description" TEXT,
  ADD COLUMN "og_image_url" TEXT,
  ADD COLUMN "organization_name" TEXT,
  ADD COLUMN "organization_logo_url" TEXT;

ALTER TABLE "company_landing_cms"."blog_post"
  ADD COLUMN "excerpt" TEXT,
  ADD COLUMN "cover_image" TEXT,
  ADD COLUMN "seo_title" TEXT,
  ADD COLUMN "seo_description" TEXT,
  ADD COLUMN "canonical_url" TEXT,
  ADD COLUMN "og_image_url" TEXT,
  ADD COLUMN "tags" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published',
  ADD COLUMN "published_at" TIMESTAMP(3),
  ADD COLUMN "author" TEXT,
  ADD COLUMN "include_in_sitemap" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "related_service_slugs" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "related_case_study_slugs" JSONB NOT NULL DEFAULT '[]'::JSONB;

UPDATE "company_landing_cms"."blog_post"
SET "published_at" = COALESCE("source_created_at", "created_at")
WHERE "published_at" IS NULL;

ALTER TABLE "company_landing_cms"."documentation_page"
  ADD COLUMN "excerpt" TEXT,
  ADD COLUMN "cover_image" TEXT,
  ADD COLUMN "seo_title" TEXT,
  ADD COLUMN "seo_description" TEXT,
  ADD COLUMN "canonical_url" TEXT,
  ADD COLUMN "og_image_url" TEXT,
  ADD COLUMN "tags" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published',
  ADD COLUMN "published_at" TIMESTAMP(3),
  ADD COLUMN "author" TEXT,
  ADD COLUMN "include_in_sitemap" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "related_service_slugs" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "related_case_study_slugs" JSONB NOT NULL DEFAULT '[]'::JSONB;

UPDATE "company_landing_cms"."documentation_page"
SET "published_at" = COALESCE("source_created_at", "created_at")
WHERE "published_at" IS NULL;

ALTER TABLE "company_landing_cms"."project"
  ADD COLUMN "source_id" TEXT,
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "category" TEXT,
  ADD COLUMN "public_description" TEXT,
  ADD COLUMN "client_name" TEXT,
  ADD COLUMN "client_logo_url" TEXT,
  ADD COLUMN "technologies" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "screenshots" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "approved_metrics" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "contribution" TEXT,
  ADD COLUMN "demo_video_url" TEXT,
  ADD COLUMN "confidentiality" TEXT NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN "is_client_work" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "is_featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "is_published" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "synced_at" TIMESTAMP(3);

ALTER TABLE "company_landing_cms"."testimonial"
  ADD COLUMN "company" TEXT,
  ADD COLUMN "company_logo_url" TEXT,
  ADD COLUMN "source_url" TEXT,
  ADD COLUMN "is_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "consent_granted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "is_published" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "project_id" TEXT;

CREATE TABLE "company_landing_cms"."service_package" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "short_description" TEXT NOT NULL,
  "description_mdx" TEXT,
  "ideal_for" TEXT,
  "deliverables" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "technologies" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "faqs" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "timeline" TEXT,
  "price_from" INTEGER,
  "price_currency" TEXT DEFAULT 'USD',
  "icon" TEXT,
  "image_url" TEXT,
  "cta_label" TEXT,
  "cta_link" TEXT,
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "landing_page_id" INTEGER NOT NULL,
  CONSTRAINT "service_package_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."case_study" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "client_name" TEXT,
  "client_logo_url" TEXT,
  "industry" TEXT,
  "summary" TEXT NOT NULL,
  "challenge" TEXT,
  "solution_mdx" TEXT NOT NULL,
  "outcome_mdx" TEXT,
  "architecture_mdx" TEXT,
  "contribution_mdx" TEXT,
  "service_slugs" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "technologies" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "metrics" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "gallery" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "timeline" TEXT,
  "cover_image_url" TEXT,
  "demo_video_url" TEXT,
  "project_url" TEXT,
  "testimonial_quote" TEXT,
  "client_consent_granted" BOOLEAN NOT NULL DEFAULT false,
  "confidentiality" TEXT NOT NULL DEFAULT 'PRIVATE',
  "is_featured" BOOLEAN NOT NULL DEFAULT false,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "seo_title" TEXT,
  "seo_description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "landing_page_id" INTEGER NOT NULL,
  "project_id" TEXT,
  CONSTRAINT "case_study_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."proof_metric" (
  "id" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "context" TEXT,
  "tooltip" TEXT,
  "source" TEXT,
  "verification_status" TEXT NOT NULL DEFAULT 'UNVERIFIED',
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "landing_page_id" INTEGER NOT NULL,
  "source_project_id" TEXT,
  CONSTRAINT "proof_metric_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."client_logo" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logo_url" TEXT NOT NULL,
  "website_url" TEXT,
  "alt_text" TEXT,
  "consent_granted" BOOLEAN NOT NULL DEFAULT false,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "landing_page_id" INTEGER NOT NULL,
  CONSTRAINT "client_logo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."lead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "company" TEXT,
  "phone" TEXT,
  "service" TEXT NOT NULL,
  "problem" TEXT NOT NULL,
  "current_systems" TEXT,
  "budget" TEXT,
  "timeline" TEXT,
  "contact_consent" BOOLEAN NOT NULL,
  "source_path" TEXT,
  "referrer" TEXT,
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "utm_content" TEXT,
  "utm_term" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "landing_page_id" INTEGER NOT NULL,
  CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "project_landing_page_id_source_id_key" ON "company_landing_cms"."project"("landing_page_id", "source_id");
CREATE UNIQUE INDEX "project_landing_page_id_slug_key" ON "company_landing_cms"."project"("landing_page_id", "slug");
CREATE INDEX "project_landing_page_id_is_published_is_featured_order_idx" ON "company_landing_cms"."project"("landing_page_id", "is_published", "is_featured", "order");
CREATE INDEX "testimonial_landing_page_id_is_published_is_verified_order_idx" ON "company_landing_cms"."testimonial"("landing_page_id", "is_published", "is_verified", "order");
CREATE INDEX "testimonial_project_id_idx" ON "company_landing_cms"."testimonial"("project_id");
CREATE INDEX "blog_post_landing_page_id_status_published_at_idx" ON "company_landing_cms"."blog_post"("landing_page_id", "status", "published_at");
CREATE INDEX "documentation_page_landing_page_id_status_published_at_idx" ON "company_landing_cms"."documentation_page"("landing_page_id", "status", "published_at");
CREATE UNIQUE INDEX "service_package_landing_page_id_slug_key" ON "company_landing_cms"."service_package"("landing_page_id", "slug");
CREATE INDEX "service_package_landing_page_id_is_published_order_idx" ON "company_landing_cms"."service_package"("landing_page_id", "is_published", "order");
CREATE UNIQUE INDEX "case_study_landing_page_id_slug_key" ON "company_landing_cms"."case_study"("landing_page_id", "slug");
CREATE INDEX "case_study_landing_page_id_is_published_is_featured_order_idx" ON "company_landing_cms"."case_study"("landing_page_id", "is_published", "is_featured", "order");
CREATE INDEX "case_study_project_id_idx" ON "company_landing_cms"."case_study"("project_id");
CREATE INDEX "proof_metric_landing_page_id_is_published_order_idx" ON "company_landing_cms"."proof_metric"("landing_page_id", "is_published", "order");
CREATE INDEX "proof_metric_source_project_id_idx" ON "company_landing_cms"."proof_metric"("source_project_id");
CREATE INDEX "client_logo_landing_page_id_is_published_order_idx" ON "company_landing_cms"."client_logo"("landing_page_id", "is_published", "order");
CREATE INDEX "lead_landing_page_id_status_created_at_idx" ON "company_landing_cms"."lead"("landing_page_id", "status", "created_at");
CREATE INDEX "lead_landing_page_id_email_idx" ON "company_landing_cms"."lead"("landing_page_id", "email");

ALTER TABLE "company_landing_cms"."testimonial" ADD CONSTRAINT "testimonial_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "company_landing_cms"."project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."service_package" ADD CONSTRAINT "service_package_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."case_study" ADD CONSTRAINT "case_study_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."case_study" ADD CONSTRAINT "case_study_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "company_landing_cms"."project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."proof_metric" ADD CONSTRAINT "proof_metric_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."proof_metric" ADD CONSTRAINT "proof_metric_source_project_id_fkey" FOREIGN KEY ("source_project_id") REFERENCES "company_landing_cms"."project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."client_logo" ADD CONSTRAINT "client_logo_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."lead" ADD CONSTRAINT "lead_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
