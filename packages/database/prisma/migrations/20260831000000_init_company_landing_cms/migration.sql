CREATE SCHEMA IF NOT EXISTS "company_landing_cms";

CREATE TABLE "company_landing_cms"."landing_page" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT,
    "logo" TEXT,
    "dark_logo" TEXT,
    "github_link" TEXT,
    "github_username" TEXT,
    "github_repository_name" TEXT,
    "donate_now_link" TEXT,
    "tagline" TEXT,
    "description" TEXT,
    "appointment_link" TEXT,
    "code_snippet" TEXT,
    "about_heading" TEXT,
    "about" TEXT,
    "users" INTEGER,
    "subscribers" INTEGER,
    "downloads" INTEGER,
    "products_count" INTEGER,
    "service_heading" TEXT,
    "service_description" TEXT,
    "product_heading" TEXT,
    "product_description" TEXT,
    "testimonial_heading" TEXT,
    "testimonial_description" TEXT,
    "team_heading" TEXT,
    "team_description" TEXT,
    "creator" TEXT,
    "creator_link" TEXT,
    "support_email_address" TEXT,
    "company_legal_name" TEXT,
    "website_url" TEXT,
    "country" TEXT,
    "contact_number" TEXT,
    "address" TEXT,
    "version" TEXT,
    "last_updated" TEXT,
    "newsletter_heading" TEXT,
    "newsletter_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "landing_page_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "landing_page_id" INTEGER NOT NULL,
    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "type" TEXT,
    "github_link" TEXT,
    "npm_package_link" TEXT,
    "github_repo_stars" INTEGER,
    "weekly_github_clones" INTEGER,
    "weekly_npm_downloads" INTEGER,
    "notion_template_link" TEXT,
    "notion_views" INTEGER,
    "notion_downloads" INTEGER,
    "notion_rating" DOUBLE PRECISION,
    "website_link" TEXT,
    "website_views" INTEGER,
    "monthly_active_users" INTEGER,
    "youtube_video_link" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "landing_page_id" INTEGER NOT NULL,
    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "comment" TEXT NOT NULL,
    "image_url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "landing_page_id" INTEGER NOT NULL,
    CONSTRAINT "testimonial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."team_member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "landing_page_id" INTEGER NOT NULL,
    CONSTRAINT "team_member_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."social_network" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "team_member_id" TEXT NOT NULL,
    CONSTRAINT "social_network_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."footer_link" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT,
    "type" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "landing_page_id" INTEGER NOT NULL,
    CONSTRAINT "footer_link_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "landing_page_key_key" ON "company_landing_cms"."landing_page"("key");
CREATE INDEX "service_landing_page_id_order_idx" ON "company_landing_cms"."service"("landing_page_id", "order");
CREATE INDEX "project_landing_page_id_order_idx" ON "company_landing_cms"."project"("landing_page_id", "order");
CREATE INDEX "testimonial_landing_page_id_order_idx" ON "company_landing_cms"."testimonial"("landing_page_id", "order");
CREATE INDEX "team_member_landing_page_id_order_idx" ON "company_landing_cms"."team_member"("landing_page_id", "order");
CREATE INDEX "social_network_team_member_id_order_idx" ON "company_landing_cms"."social_network"("team_member_id", "order");
CREATE INDEX "footer_link_landing_page_id_order_idx" ON "company_landing_cms"."footer_link"("landing_page_id", "order");

ALTER TABLE "company_landing_cms"."service" ADD CONSTRAINT "service_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."project" ADD CONSTRAINT "project_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."testimonial" ADD CONSTRAINT "testimonial_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."team_member" ADD CONSTRAINT "team_member_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."social_network" ADD CONSTRAINT "social_network_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "company_landing_cms"."team_member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."footer_link" ADD CONSTRAINT "footer_link_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
