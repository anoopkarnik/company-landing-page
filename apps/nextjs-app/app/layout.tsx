
import type { Metadata } from "next";
import "../../../packages/ui/src/styles/shadcn/shadcn-green.css"
import "../../../packages/ui/src/styles/custom/scroll.css"
import "../../../packages/ui/src/styles/custom/heroBackgroundAnimation.css"
import { ThemeProvider } from "@repo/ui/providers/theme-provider";

import { Toaster } from "@repo/ui/molecules/custom/v1/Toaster";
import { geistSans, geistMono, cyberdyne } from "@repo/ui/typography/font";
import { companyDetails } from "../lib/constants/landing-page/about";
import { companyName } from "../lib/constants/appDetails";
import { VercelAnalytics } from "@repo/analytics/vercel.ts";
import { GoogleAnalytics } from "@repo/analytics/google.ts";

export const metadata: Metadata = {
  title: companyName,
  description: companyDetails
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${geistMono.variable} ${cyberdyne.variable} antialiased`}
      >
            <ThemeProvider defaultTheme="dark" >
              {children}
              <VercelAnalytics/>
              <Toaster />
            </ThemeProvider>
            <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID as string}/>
      </body>
    </html>
  );
}
