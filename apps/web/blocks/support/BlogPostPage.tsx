"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MdxContent } from "@/components/mdx/MdxContent";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ReactElement } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { RelatedContentLinks } from "@/components/mdx/RelatedContentLinks";
import { blogCategorySlug, normalizeBlogCategory } from "@/lib/blog-categories";

interface Props {
  slug: string;
}

const BlogPostPage = ({ slug }: Props): ReactElement => {
  const trpc = useTRPC();
  const { data: mdx } = useSuspenseQuery(
    trpc.blog.queryBlogBySlug.queryOptions({ slug: slug }),
  );
  const { data: blog } = useSuspenseQuery(trpc.blog.getBlogInfo.queryOptions());

  //console.log(blocks);

  if (!mdx) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">No blog found.</p>
      </div>
    );
  }

  const currentBlog = blog.blogs.find((blog) => blog.slug === slug);
  const relatedServiceSlugs = Array.isArray(currentBlog?.relatedServiceSlugs)
    ? currentBlog.relatedServiceSlugs.filter(
        (item): item is string => typeof item === "string",
      )
    : [];
  const relatedCaseStudySlugs = Array.isArray(
    currentBlog?.relatedCaseStudySlugs,
  )
    ? currentBlog.relatedCaseStudySlugs.filter(
        (item): item is string => typeof item === "string",
      )
    : [];
  const structuredData = currentBlog
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: currentBlog.Name,
        description:
          currentBlog.excerpt || currentBlog.seoDescription || undefined,
        datePublished: currentBlog.publishedAt || currentBlog["Created time"],
        dateModified: currentBlog["Last edited time"],
        author: currentBlog.author
          ? { "@type": "Person", name: currentBlog.author }
          : undefined,
        publisher: { "@type": "Organization", name: "Bayesian Labs" },
        image: currentBlog.ogImageUrl || currentBlog.coverImage || undefined,
        mainEntityOfPage:
          currentBlog.canonicalUrl ||
          `${process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") || ""}/blog/${slug}`,
      }).replace(/</g, "\\u003c")
    : null;
  const category = normalizeBlogCategory(currentBlog?.Type || "General");

  return (
    <div className="container relative mx-auto my-10 max-w-5xl px-6 py-16">
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      ) : null}
      <div className="mb-10 border-b border-border/40 pb-8">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> All insights
        </Link>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Blog</span>
          <span aria-hidden="true">/</span>
          <Link
            href={`/blog/category/${blogCategorySlug(category)}`}
            className="font-medium text-foreground hover:text-primary"
          >
            {category}
          </Link>
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
          {currentBlog?.Name}
        </h1>
        {currentBlog?.excerpt ? (
          <p className="mb-4 max-w-3xl text-lg leading-7 text-muted-foreground">
            {currentBlog.excerpt}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {currentBlog?.author ? <span>By {currentBlog.author}</span> : null}
          <div className="flex items-center gap-1">
            <span>Last updated:</span>
            <span className="text-foreground">
              {formatDistanceToNow(
                new Date(currentBlog?.["Last edited time"] || new Date()),
                { addSuffix: true },
              )}
            </span>
          </div>
        </div>
      </div>

      {currentBlog?.coverImage ? (
        <figure className="mb-12 overflow-hidden rounded-3xl border bg-muted shadow-xl">
          {/* CMS images can be served from administrator-configured R2 domains. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentBlog.coverImage}
            alt={
              currentBlog.coverImageAlt ||
              `Conceptual illustration for ${currentBlog.Name}`
            }
            className="aspect-[16/9] w-full object-cover"
          />
          {currentBlog.coverImageCaption ? (
            <figcaption className="border-t bg-card px-5 py-3 text-sm leading-6 text-muted-foreground">
              {currentBlog.coverImageCaption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-zinc dark:prose-invert prose-lg mx-auto max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg"
      >
        <MdxContent source={mdx} />
      </motion.article>
      <RelatedContentLinks
        serviceSlugs={relatedServiceSlugs}
        caseStudySlugs={relatedCaseStudySlugs}
      />
    </div>
  );
};

export default BlogPostPage;
