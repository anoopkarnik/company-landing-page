import ErrorState from "@workspace/ui/components/misc/ErrorState";
import LoadingState from "@workspace/ui/components/misc/LoadingState";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import DocSidebar from "@/blocks/support/DocSidebar";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/shadcn/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation",
    description: "Technical guides, delivery documentation, and implementation notes for AI automation and full-stack systems.",
    alternates: { canonical: "/doc" },
    openGraph: {
        title: "Documentation",
        description: "Technical guides and implementation notes for AI automation and full-stack systems.",
        url: "/doc",
    },
};

// export const revalidate = 600;
export const dynamic = "force-dynamic";
const DocumentationPage = async ({ children }: { children: React.ReactNode }): Promise<React.ReactElement> => {
    const queryClient = getQueryClient();
    await Promise.all([
        // queryClient.ensureQueryData(trpc.portfolio.getPortfolioDataFromStrapi.queryOptions()),
        queryClient.ensureQueryData(trpc.documentation.getDocumentationInfo.queryOptions()),
    ]);
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title='Retrieving' description='Please wait while we retrieve the documentation page data' />}>
                <ErrorBoundary fallback={<ErrorState title='Error Retrieving Data' description='There was an error while retrieving the data.' />}>
                    <SidebarProvider>
                        <DocSidebar />
                        <SidebarInset>
                            {children}
                        </SidebarInset>
                    </SidebarProvider>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default DocumentationPage
