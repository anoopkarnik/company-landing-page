import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogIndexPage } from "@/components/blog/BlogIndexPage";
import { BLOG_CATEGORIES, getBlogCategoryBySlug } from "@/lib/blog-categories";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);
  if (!category) {
    return {
      title: "Blog category not found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${category.label} Insights`;
  return {
    title,
    description: category.description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: {
      title,
      description: category.description,
      url: `/blog/category/${category.slug}`,
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  if (!getBlogCategoryBySlug(categorySlug)) notFound();
  return <BlogIndexPage categorySlug={categorySlug} />;
}
