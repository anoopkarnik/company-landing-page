
import type { Metadata } from "next";
import "@workspace/ui/globals.css";
import "@workspace/ui/styles/animations/scroll.css";
import "@workspace/ui/styles/animations/heroBackgroundAnimation.css";
import { ThemeProvider } from "@workspace/ui/providers/theme-provider";

import { Toaster } from "@workspace/ui/components/shadcn/sonner";
import {
  geistSans,
  geistMono,
  cyberdyne,
} from "@workspace/ui/typography/font";
import { companyName } from "../lib/constants/appDetails";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { TRPCReactProvider } from "@/trpc/client";
import Support from "@/blocks/support/Support";

const publicUrl = process.env.NEXT_PUBLIC_URL || "https://bayesian-labs.com";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: {
    default: `${companyName} — AI Automation & Full-Stack Product Development`,
    template: `%s | ${companyName}`,
  },
  description:
    "AI automation, n8n workflows, production-ready MVPs, and data integrations built end-to-end for founders and operations teams.",
  keywords: [
    "AI automation consultant",
    "n8n automation",
    "MVP development",
    "full-stack product development",
    "data engineering",
    "Hyderabad software consultant",
  ],
  authors: [{ name: "Anoop Karnik Dasika", url: publicUrl }],
  creator: "Anoop Karnik Dasika",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: publicUrl,
    siteName: companyName,
    title: `${companyName} — AI Automation & Full-Stack Product Development`,
    description:
      "AI automation, n8n workflows, production-ready MVPs, and data integrations built end-to-end.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyName} — AI Automation & Full-Stack Product Development`,
    description:
      "AI automation, n8n workflows, production-ready MVPs, and data integrations built end-to-end.",
  },
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
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID && (
              <GoogleAnalytics
                gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}
              />
            )}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
