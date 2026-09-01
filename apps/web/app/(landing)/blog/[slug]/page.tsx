import BlogPostPage from "@/blocks/support/BlogPostPage";
import {
  getBlogSeoBySlug,
  type ContentSeoRecord,
} from "@/lib/functions/content-page-db";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ErrorState from "@workspace/ui/components/misc/ErrorState";
import LoadingState from "@workspace/ui/components/misc/LoadingState";
import type { Metadata } from "next";
import { ReactElement, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let page: ContentSeoRecord | null = null;
  try {
    page = await getBlogSeoBySlug(slug);
  } catch {
    page = null;
  }

  if (!page) {
    return {
      title: "Blog post not found",
      robots: { index: false, follow: false },
    };
  }

  const title = page.seoTitle || page.name;
  const description = page.seoDescription || page.excerpt || undefined;
  const image = page.ogImageUrl || page.coverImage || undefined;
  const tags = Array.isArray(page.tags)
    ? page.tags.filter((tag: unknown): tag is string => typeof tag === "string")
    : [];

  return {
    title,
    description,
    keywords: tags,
    authors: page.author ? [{ name: page.author }] : undefined,
    alternates: page.canonicalUrl
      ? { canonical: page.canonicalUrl }
      : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: page.publishedAt?.toISOString(),
      modifiedTime: page.updatedAt.toISOString(),
      authors: page.author ? [page.author] : undefined,
      images: image
        ? [{ url: image, alt: page.coverImageAlt || page.name }]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

const BlogIdPage = async ({ params }: Props): Promise<ReactElement> => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.blog.queryBlogBySlug.queryOptions({ slug: slug }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Retrieving Blog"
            description="Please wait while we fetch the blog details."
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Error Retrieving Blog"
              description="There was an error while retrieving the blog details."
            />
          }
        >
          <BlogPostPage slug={slug} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default BlogIdPage;
