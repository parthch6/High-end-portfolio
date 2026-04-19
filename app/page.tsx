import { HeroSection } from "@/components/portfolio/hero-section";
import { PortfolioSections } from "@/components/portfolio/portfolio-sections";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { StickyNavbar } from "@/components/portfolio/sticky-navbar";

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
