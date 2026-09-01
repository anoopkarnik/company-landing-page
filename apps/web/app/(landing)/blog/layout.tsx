import ErrorState from "@workspace/ui/components/misc/ErrorState";
import LoadingState from "@workspace/ui/components/misc/LoadingState";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import BlogSidebar from "@/blocks/support/BlogSidebar";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/shadcn/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Insights",
    description: "Practical notes on AI automation, n8n workflows, full-stack product development, and reliable data systems.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Insights",
        description: "Practical notes on AI automation, product development, and reliable data systems.",
        url: "/blog",
    },
};

// export const revalidate = 600;
export const dynamic = "force-dynamic";
const BlogPage = async ({ children }: { children: React.ReactNode }): Promise<React.ReactElement> => {
    const queryClient = getQueryClient();
    await Promise.all([
        // queryClient.ensureQueryData(trpc.portfolio.getPortfolioDataFromStrapi.queryOptions()),
        queryClient.ensureQueryData(trpc.blog.getBlogInfo.queryOptions()),
    ]);
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title='Retrieving' description='Please wait while we retrieve the blog page data' />}>
                <ErrorBoundary fallback={<ErrorState title='Error Retrieving Data' description='There was an error while retrieving the data.' />}>
                    <SidebarProvider>
                        <BlogSidebar />
                        <SidebarInset>
                            {children}
                        </SidebarInset>
                    </SidebarProvider>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default BlogPage
