
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../../packages/ui/src/styles/shadcn/shadcn-green.css"
import "../../../packages/ui/src/styles/custom/scroll.css"
import { ThemeProvider } from "@repo/ui/providers/theme-provider";
import "../../../packages/ui/src/styles/custom/heroBackgroundAnimation.css"
import { Toaster } from "@repo/ui/molecules/custom/v1/Toaster";
import { Analytics } from "@vercel/analytics/react"
import { companyDetails, companyName } from "../lib/constants/appDetails";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <ThemeProvider defaultTheme="dark" >
              {children}
              <Analytics/>
              <Toaster />
            </ThemeProvider>
      </body>
    </html>
  );
}
