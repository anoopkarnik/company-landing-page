import BlogPostPage from "@/blocks/support/BlogPostPage";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ErrorState from "@workspace/ui/components/misc/ErrorState";
import LoadingState from "@workspace/ui/components/misc/LoadingState";
import { ReactElement, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{ slug: string }>
}

const BlogIdPage = async ({ params }: Props): Promise<ReactElement> => {
    const { slug } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.blog.queryBlogBySlug.queryOptions({ slug: slug }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title='Retrieving Blog' description='Please wait while we fetch the blog details.' />}>
                <ErrorBoundary fallback={<ErrorState title='Error Retrieving Blog' description='There was an error while retrieving the blog details.' />}>
                    <BlogPostPage slug={slug} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default BlogIdPage;