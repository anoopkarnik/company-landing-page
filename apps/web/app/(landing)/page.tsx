import ErrorState from "@workspace/ui/components/misc/ErrorState";
import LandingPage from "@/blocks/landing/LandingPage";
import LoadingState from "@workspace/ui/components/misc/LoadingState";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReactElement, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { Metadata } from "next";
import db from "@workspace/database/client";

// export const revalidate = 600;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await db.landingPage.findUnique({
      where: {
        key:
          process.env.NEXT_PUBLIC_SAAS_NAME?.trim() ||
          "company-landing-page",
      },
      select: {
        seoTitle: true,
        seoDescription: true,
        ogImageUrl: true,
        tagline: true,
        description: true,
      },
    });
    if (!page) return {};
    const title = page.seoTitle || page.tagline || undefined;
    const description = page.seoDescription || page.description || undefined;
    return {
      title: title ? { absolute: title } : undefined,
      description,
      alternates: { canonical: "/" },
      openGraph: {
        type: "website",
        url: "/",
        title,
        description,
        images: page.ogImageUrl ? [{ url: page.ogImageUrl }] : undefined,
      },
      twitter: {
        card: page.ogImageUrl ? "summary_large_image" : "summary",
        title,
        description,
        images: page.ogImageUrl ? [page.ogImageUrl] : undefined,
      },
    };
  } catch {
    return {};
  }
}

const HomePage = async (): Promise<ReactElement> => {
  const queryClient = getQueryClient();
  // Prefetch for SSR, but never let a transient CMS/database failure turn the
  // whole page into the Suspense fallback — the client components retry on their
  // own and both queries have their own data fallbacks.
  await Promise.allSettled([
    queryClient.ensureQueryData(trpc.landing.getLandingInfo.queryOptions()),
    queryClient.ensureQueryData(
      trpc.conversion.getPublicConversionData.queryOptions(),
    ),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingState title='Retrieving' description='Please wait while we retrieve the landing page data' />}>
        <ErrorBoundary fallback={<ErrorState title='Error Retrieving Data' description='There was an error while retrieving the data.' />}>
          <LandingPage />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default HomePage
