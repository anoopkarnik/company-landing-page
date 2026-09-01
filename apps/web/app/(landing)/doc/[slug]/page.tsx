import DocPostPage from "@/blocks/support/DocPostPage";
import {
    getDocumentationSeoBySlug,
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
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    let page: ContentSeoRecord | null = null;
    try {
        page = await getDocumentationSeoBySlug(slug);
    } catch {
        page = null;
    }

    if (!page) {
        return {
            title: "Documentation page not found",
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
        alternates: page.canonicalUrl ? { canonical: page.canonicalUrl } : undefined,
        openGraph: {
            type: "article",
            title,
            description,
            modifiedTime: page.updatedAt.toISOString(),
            authors: page.author ? [page.author] : undefined,
            images: image ? [{ url: image }] : undefined,
        },
        twitter: {
            card: image ? "summary_large_image" : "summary",
            title,
            description,
            images: image ? [image] : undefined,
        },
    };
}

const DocIdPage = async ({ params }: Props): Promise<ReactElement> => {
    const { slug } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.documentation.queryDocumentationBySlug.queryOptions({ slug: slug }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title='Retrieving Documentation' description='Please wait while we fetch the documentation details.' />}>
                <ErrorBoundary fallback={<ErrorState title='Error Retrieving Documentation' description='There was an error while retrieving the documentation details.' />}>
                    <DocPostPage slug={slug} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default DocIdPage;
