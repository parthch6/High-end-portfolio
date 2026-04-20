import type { Metadata } from "next";

import { HeroSection } from "@/components/portfolio/hero-section";
import { PortfolioSections } from "@/components/portfolio/portfolio-sections";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { StickyNavbar } from "@/components/portfolio/sticky-navbar";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Full-Stack Web Developer",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Full-Stack Web Developer | Parth Chaudhari",
    description: siteConfig.description,
    url: siteConfig.url,
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
    title: "Full-Stack Web Developer | Parth Chaudhari",
    description: siteConfig.description,
    images: ["/projects/aurora-commerce.svg"],
  },
};

export default function HomePage() {
  return (
    <main className="page-shell min-h-screen">
      <StickyNavbar />
      <HeroSection />
      <PortfolioSections />
      <SiteFooter />
    </main>
  );
}
