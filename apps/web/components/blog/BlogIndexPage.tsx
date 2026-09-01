"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import Link from "next/link";

import {
  BLOG_CATEGORIES,
  blogCategorySlug,
  getBlogCategoryBySlug,
  normalizeBlogCategory,
} from "@/lib/blog-categories";
import type { BlogProps } from "@/lib/ts-types/blog";
import { useTRPC } from "@/trpc/client";
import { Badge } from "@workspace/ui/components/shadcn/badge";

function isBlogPost(value: unknown): value is BlogProps {
  if (!value || typeof value !== "object") return false;
  const post = value as Record<string, unknown>;
  return (
    typeof post.id === "string" &&
    typeof post.Name === "string" &&
    typeof post.Type === "string" &&
    typeof post.order === "number" &&
    typeof post.slug === "string" &&
    typeof post["Created time"] === "string" &&
    typeof post["Last edited time"] === "string" &&
    typeof post.excerpt === "string" &&
    typeof post.coverImage === "string" &&
    typeof post.coverImageAlt === "string" &&
    typeof post.coverImageCaption === "string" &&
    typeof post.seoTitle === "string" &&
    typeof post.seoDescription === "string" &&
    typeof post.canonicalUrl === "string" &&
    typeof post.ogImageUrl === "string" &&
    Array.isArray(post.tags) &&
    typeof post.status === "string" &&
    (post.publishedAt === null || typeof post.publishedAt === "string") &&
    typeof post.author === "string" &&
    typeof post.includeInSitemap === "boolean" &&
    Array.isArray(post.relatedServiceSlugs) &&
    Array.isArray(post.relatedCaseStudySlugs)
  );
}

function displayDate(post: BlogProps) {
  const value = post.publishedAt || post["Created time"];
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function BlogCard({
  post,
  featured = false,
}: {
  post: BlogProps;
  featured?: boolean;
}) {
  const category = normalizeBlogCategory(post.Type);
  const date = displayDate(post);

  return (
    <article
      className={`group overflow-hidden rounded-3xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl ${
        featured ? "lg:grid lg:grid-cols-[1.15fr_0.85fr]" : ""
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`relative block overflow-hidden bg-muted ${
          featured ? "min-h-64 lg:min-h-full" : "aspect-[16/9]"
        }`}
        aria-label={`Read ${post.Name}`}
      >
        {post.coverImage ? (
          // CMS images can be served from administrator-configured R2 domains.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={
              post.coverImageAlt || `Conceptual illustration for ${post.Name}`
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            loading={featured ? "eager" : "lazy"}
          />
        ) : (
          <div className="grid h-full min-h-52 place-items-center bg-gradient-to-br from-primary/15 via-background to-cyan-500/10">
            <BookOpenText
              className="size-10 text-primary/70"
              aria-hidden="true"
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />
      </Link>

      <div className={`flex flex-col ${featured ? "p-7 sm:p-9" : "p-6"}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link
            href={`/blog/category/${blogCategorySlug(category)}`}
            className="font-semibold uppercase tracking-[0.14em] text-primary hover:underline"
          >
            {category}
          </Link>
          {date ? (
            <>
              <span aria-hidden="true">•</span>
              <time dateTime={post.publishedAt || post["Created time"]}>
                {date}
              </time>
            </>
          ) : null}
        </div>

        <h2
          className={`mt-4 font-bold tracking-tight text-card-foreground ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.Name}
          </Link>
        </h2>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-4 leading-7 text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}

        {post.tags.length ? (
          <div
            className="mt-5 flex flex-wrap gap-2"
            aria-label="Article topics"
          >
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary"
        >
          Read the field note
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export function BlogIndexPage({ categorySlug }: { categorySlug?: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getBlogInfo.queryOptions());
  const selectedCategory = categorySlug
    ? getBlogCategoryBySlug(categorySlug)
    : undefined;
  const publishedPosts = data.blogs.filter(isBlogPost);
  const posts = selectedCategory
    ? publishedPosts.filter(
        (post) => normalizeBlogCategory(post.Type) === selectedCategory.label,
      )
    : publishedPosts;

  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.10),transparent_34%)]">
      <section className="border-b bg-background/70 px-6 py-14 backdrop-blur sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Bayesian Labs field notes
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {selectedCategory?.label || "Build systems that survive real work."}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            {selectedCategory?.description ||
              "First-hand engineering guides for founders and operations teams working through AI automation, production SaaS, and difficult data systems."}
          </p>

          <nav
            className="mt-8 flex flex-wrap gap-2"
            aria-label="Blog categories"
          >
            <Link
              href="/blog"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                !selectedCategory
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:border-primary/50 hover:text-primary"
              }`}
            >
              All insights{" "}
              <span className="ml-1 opacity-70">{publishedPosts.length}</span>
            </Link>
            {BLOG_CATEGORIES.map((category) => {
              const count = publishedPosts.filter(
                (post) => normalizeBlogCategory(post.Type) === category.label,
              ).length;
              if (!count) return null;
              const active = selectedCategory?.slug === category.slug;
              return (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {category.label}{" "}
                  <span className="ml-1 opacity-70">{count}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className={index === 0 ? "md:col-span-2" : ""}
                >
                  <BlogCard post={post} featured={index === 0} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed bg-card p-10 text-center">
              <BookOpenText
                className="mx-auto size-9 text-primary"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-xl font-semibold">
                No published notes yet
              </h2>
              <p className="mt-2 text-muted-foreground">
                Choose another topic to explore the current library.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
