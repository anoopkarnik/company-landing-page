
import type { Metadata } from "next";
import "@workspace/ui/globals.css"
import "@workspace/ui/styles/animations/scroll.css"
import "@workspace/ui/styles/animations/heroBackgroundAnimation.css"
import { ThemeProvider } from "@workspace/ui/providers/theme-provider"

import { Toaster } from "@workspace/ui/components/shadcn/sonner";
import { geistSans, geistMono, cyberdyne } from "@workspace/ui/typography/font"
import { companyDetails } from "../lib/constants/landing-page/about";
import { companyName } from "../lib/constants/appDetails";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { TRPCReactProvider } from "@/trpc/client";
import Support from "@/blocks/Support";

export const metadata: Metadata = {
  title: companyName,
  description: companyDetails
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeColor = process.env.NEXT_PUBLIC_THEME || "green";

  return (
    <html lang="en" suppressHydrationWarning className={`theme-${themeColor}`}>
      <body
        className={`${geistSans.className} ${geistMono.variable} ${cyberdyne.variable} antialiased`}
      >
        <TRPCReactProvider>
          <ThemeProvider>
            {children}
            <Support />
            <Toaster />
            <Analytics />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID as string} />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

