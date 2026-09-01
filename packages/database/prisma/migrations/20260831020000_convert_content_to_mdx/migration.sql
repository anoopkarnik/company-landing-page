ALTER TABLE "company_landing_cms"."blog_post"
  RENAME COLUMN "content" TO "mdx";

ALTER TABLE "company_landing_cms"."blog_post"
  ALTER COLUMN "mdx" TYPE TEXT USING "mdx"::TEXT;

ALTER TABLE "company_landing_cms"."documentation_page"
  RENAME COLUMN "content" TO "mdx";

ALTER TABLE "company_landing_cms"."documentation_page"
  ALTER COLUMN "mdx" TYPE TEXT USING "mdx"::TEXT;

