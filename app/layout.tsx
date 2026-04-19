import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { MotionSettingsProvider } from "@/components/motion/motion-settings-provider";
import { PremiumCursor } from "@/components/motion/premium-cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description:
    "A modern, minimal portfolio built with Next.js App Router and Tailwind CSS.",
  applicationName: "Portfolio",
  keywords: ["portfolio", "next.js", "tailwind css", "typescript"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    title: "Portfolio",
    description:
      "A modern, minimal portfolio built with Next.js App Router and Tailwind CSS.",
    siteName: "Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio",
    description:
      "A modern, minimal portfolio built with Next.js App Router and Tailwind CSS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          spaceGrotesk.variable,
          "font-body bg-background text-foreground antialiased"
        )}
      >
        <MotionSettingsProvider>
          <MotionProvider>
            <SmoothScroll>
              <PremiumCursor />
              {children}
            </SmoothScroll>
          </MotionProvider>
        </MotionSettingsProvider>
      </body>
    </html>
  );
}
