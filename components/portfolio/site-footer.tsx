import { ScrollReveal } from "@/components/portfolio/scroll-reveal";
import { MotionLink } from "@/components/ui/motion-link";

export function SiteFooter() {
  return (
    <footer className="container-shell pb-8 pt-4 md:pb-10">
      <ScrollReveal distance={20}>
        <div className="footer-cta">
          <div className="footer-light" aria-hidden="true" />

          <div className="relative z-10 max-w-3xl">
            <span className="eyebrow mb-6">Let&apos;s Work Together</span>
            <h2 className="font-display text-3xl font-bold tracking-display text-foreground sm:text-4xl md:text-6xl">
              Ready to build something amazing? Let&apos;s create it together.
            </h2>
            <p className="text-body mt-5 max-w-2xl">
              I&apos;m available for freelance projects, full-time opportunities, and collaborations.
              Whether it&apos;s a web application, API development, or complete product redesign—I'm here to help
              bring your vision to life with clean code and thoughtful design.
            </p>
          </div>

          <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row">
            <MotionLink href="/#contact" className="button-primary w-full sm:w-auto">
              Start a Project
            </MotionLink>
            <MotionLink href="/#work" className="button-secondary w-full sm:w-auto">
              View Work
            </MotionLink>
          </div>

          <div className="relative z-10 mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>(c) 2026 Parth Chaudhari. Crafted with care.</p>
            <div className="flex gap-4">
              <a
                href="mailto:Parthchaudhari4678@gmail.com"
                className="transition duration-300 ease-premium hover:text-foreground"
                data-magnetic
                data-magnetic-strength="0.12"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/parth-chaudhari-63088a282"
                className="transition duration-300 ease-premium hover:text-foreground"
                data-magnetic
                data-magnetic-strength="0.12"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/parthch6"
                className="transition duration-300 ease-premium hover:text-foreground"
                data-magnetic
                data-magnetic-strength="0.12"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
