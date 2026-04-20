import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { MotionSettingsProvider } from "@/components/motion/motion-settings-provider";
import { PremiumCursor } from "@/components/motion/premium-cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { siteConfig } from "@/lib/site";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s | Parth Chaudhari",
  },
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${siteConfig.name} | Full-Stack Web Developer`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/projects/aurora-commerce.svg",
        width: 1200,
        height: 630,
        alt: "Parth Chaudhari portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Full-Stack Web Developer`,
    description: siteConfig.description,
    images: ["/projects/aurora-commerce.svg"],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Full-Stack Web Developer",
  sameAs: [siteConfig.links.linkedin, siteConfig.links.github],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Full-Stack Development",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.siteName,
  url: siteConfig.url,
  description: siteConfig.description,
  author: {
    "@type": "Person",
    name: siteConfig.name,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, websiteSchema]),
          }}
        />
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
