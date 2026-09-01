import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getQueryClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function CaseStudiesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.ensureQueryData(trpc.landing.getLandingInfo.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
