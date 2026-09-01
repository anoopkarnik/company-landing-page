ALTER TABLE "company_landing_cms"."blog_post"
  ADD COLUMN "cover_image_alt" TEXT,
  ADD COLUMN "cover_image_caption" TEXT;

ALTER TABLE "company_landing_cms"."documentation_page"
  ADD COLUMN "cover_image_alt" TEXT,
  ADD COLUMN "cover_image_caption" TEXT;
