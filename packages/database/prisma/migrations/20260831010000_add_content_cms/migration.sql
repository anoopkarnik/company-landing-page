CREATE TABLE "company_landing_cms"."blog_post" (
    "id" TEXT NOT NULL,
    "source_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,
    "source_created_at" TIMESTAMP(3),
    "source_updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "landing_page_id" INTEGER NOT NULL,
    CONSTRAINT "blog_post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_landing_cms"."documentation_page" (
    "id" TEXT NOT NULL,
    "source_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,
    "source_created_at" TIMESTAMP(3),
    "source_updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "landing_page_id" INTEGER NOT NULL,
    CONSTRAINT "documentation_page_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_post_landing_page_id_slug_key" ON "company_landing_cms"."blog_post"("landing_page_id", "slug");
CREATE UNIQUE INDEX "blog_post_landing_page_id_source_id_key" ON "company_landing_cms"."blog_post"("landing_page_id", "source_id");
CREATE INDEX "blog_post_landing_page_id_order_idx" ON "company_landing_cms"."blog_post"("landing_page_id", "order");
CREATE UNIQUE INDEX "documentation_page_landing_page_id_slug_key" ON "company_landing_cms"."documentation_page"("landing_page_id", "slug");
CREATE UNIQUE INDEX "documentation_page_landing_page_id_source_id_key" ON "company_landing_cms"."documentation_page"("landing_page_id", "source_id");
CREATE INDEX "documentation_page_landing_page_id_order_idx" ON "company_landing_cms"."documentation_page"("landing_page_id", "order");

ALTER TABLE "company_landing_cms"."blog_post" ADD CONSTRAINT "blog_post_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_landing_cms"."documentation_page" ADD CONSTRAINT "documentation_page_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "company_landing_cms"."landing_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
