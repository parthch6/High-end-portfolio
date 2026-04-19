import type { Metadata } from "next";
import Image from "next/image";

import { ScrollReveal } from "@/components/portfolio/scroll-reveal";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { MotionLink } from "@/components/ui/motion-link";

const outcomes = [
  { label: "Conversion Lift", value: "+38%" },
  { label: "Engagement Time", value: "+52%" },
  { label: "Checkout Drop-Off", value: "-24%" },
];

const processSteps = [
  {
    title: "Audit and Framing",
    description:
      "Mapped the full storefront journey, identified hesitation points, and focused the redesign around trust, flow, and product clarity.",
  },
  {
    title: "System and Narrative",
    description:
      "Built a visual system that could support editorial storytelling, premium merchandising, and fast decision-making across every breakpoint.",
  },
  {
    title: "Testing and Refinement",
    description:
      "Validated hierarchy, interaction pacing, and product detail presentation through iterative prototypes before final implementation.",
  },
];

export const metadata: Metadata = {
  title: "Aurora Commerce Case Study",
  description:
    "A premium ecommerce case study covering the problem, approach, design process, and outcomes.",
};

export default function AuroraCommerceCaseStudyPage() {
  return (
    <main className="page-shell min-h-screen pb-20 md:pb-section">
      <section className="container-shell pt-28 md:pt-32">
        <ScrollReveal className="mx-auto max-w-5xl">
          <MotionLink
            href="/#work"
            className="button-secondary mb-8 inline-flex"
          >
            Back to Work
          </MotionLink>

          <div className="case-study-hero">
            <div className="max-w-3xl">
              <span className="eyebrow mb-6">Case Study</span>
              <h1 className="font-display text-4xl font-bold tracking-display text-foreground md:text-6xl">
                Reframing Aurora Commerce as a{" "}
                <span className="gradient-text">premium product story</span>.
              </h1>
              <p className="case-study-lead mt-6 max-w-2xl">
                Aurora Commerce is a conceptual luxury storefront redesign. The
                goal was to turn a functional ecommerce experience into a more
                deliberate, emotionally resonant product journey.
              </p>
            </div>

            <div className="case-study-meta">
              <div>
                <p className="case-study-meta-label">Role</p>
                <p className="case-study-meta-value">Product Designer and Developer</p>
              </div>
              <div>
                <p className="case-study-meta-label">Scope</p>
                <p className="case-study-meta-value">Strategy, UI system, front-end</p>
              </div>
              <div>
                <p className="case-study-meta-label">Timeline</p>
                <p className="case-study-meta-value">6 weeks</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="container-shell mt-6 sm:mt-8">
        <ScrollReveal className="case-study-image-block">
          <Image
            src="/projects/aurora-commerce.svg"
            alt="Aurora Commerce overview"
            width={1200}
            height={900}
            className="h-auto w-full rounded-[1.8rem] object-cover"
            priority
            sizes="(min-width: 1280px) 72rem, 100vw"
          />
        </ScrollReveal>
      </section>

      <section className="container-shell mt-14 space-y-4 sm:mt-16 sm:space-y-6 md:mt-20">
        <ScrollReveal className="case-study-section">
          <div className="case-study-copy">
            <span className="eyebrow">Project Overview</span>
            <h2 className="case-study-title">A storefront designed to feel curated, not crowded.</h2>
            <p className="case-study-text">
              The brand needed a calmer digital presence with stronger
              hierarchy, richer storytelling, and a clearer path from discovery
              to purchase. Instead of adding more content, the solution focused
              on editing, pacing, and emphasis.
            </p>
          </div>
          <div className="case-study-aside">
            <p className="case-study-meta-label">Primary Goals</p>
            <ul className="case-study-list">
              <li>Elevate the perceived quality of the brand</li>
              <li>Clarify product value faster</li>
              <li>Reduce friction across the purchase journey</li>
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal className="case-study-section" delay={0.08}>
          <div className="case-study-copy">
            <span className="eyebrow">Problem</span>
            <h2 className="case-study-title">The experience felt busy, flat, and harder to trust than the product itself.</h2>
            <p className="case-study-text">
              The original interface packed too much visual weight into every
              screen. Dense content, weak hierarchy, and inconsistent component
              behavior made the browsing flow feel mechanical rather than
              considered.
            </p>
          </div>
          <div className="case-study-image-stack">
            <Image
              src="/case-study/aurora-problem.svg"
              alt="Problem exploration board"
              width={1200}
              height={720}
              className="case-study-image"
              loading="lazy"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="case-study-section" delay={0.12}>
          <div className="case-study-copy">
            <span className="eyebrow">Approach</span>
            <h2 className="case-study-title">Simplify the path, amplify the signal.</h2>
            <p className="case-study-text">
              Every decision aimed to make the interface feel more editorial and
              less transactional. That meant stronger contrast, more breathing
              room, tighter content groupings, and a visual rhythm that guides
              attention naturally.
            </p>
          </div>
          <div className="case-study-aside">
            <p className="case-study-meta-label">Guiding Principles</p>
            <ul className="case-study-list">
              <li>Show fewer things, more clearly</li>
              <li>Create momentum through pacing and layout</li>
              <li>Use motion only to reinforce hierarchy</li>
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal className="case-study-section case-study-section--stack" delay={0.16}>
          <div className="case-study-copy">
            <span className="eyebrow">Design Process</span>
            <h2 className="case-study-title">From structural clarity to polished interaction.</h2>
            <p className="case-study-text">
              The design process moved from flow mapping to system definition to
              interactive refinement, always testing whether the interface felt
              more legible and more premium at each step.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="surface-panel p-5 sm:p-6">
                <p className="case-study-meta-label">0{index + 1}</p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-display text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-body-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>

          <Image
            src="/case-study/aurora-process.svg"
            alt="Aurora Commerce design process boards and wireframes"
            width={1400}
            height={840}
            className="case-study-image"
            loading="lazy"
            sizes="(min-width: 1280px) 72rem, 100vw"
          />
        </ScrollReveal>

        <ScrollReveal className="case-study-section case-study-section--stack" delay={0.2}>
          <div className="case-study-copy">
            <span className="eyebrow">Final Result</span>
            <h2 className="case-study-title">A commerce experience that feels composed, fast, and unmistakably premium.</h2>
            <p className="case-study-text">
              The final result balances storytelling with conversion. Product
              presentation feels more focused, supporting content has clearer
              hierarchy, and the full journey carries a stronger sense of tone.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Image
              src="/case-study/aurora-result-main.svg"
              alt="Final result storefront layout"
              width={1400}
              height={920}
              className="case-study-image"
              loading="lazy"
              sizes="(min-width: 1024px) 52vw, 100vw"
            />
            <div className="grid gap-4 sm:gap-6">
              <Image
                src="/case-study/aurora-result-detail-a.svg"
                alt="Product detail refinement"
                width={900}
                height={440}
                className="case-study-image"
                loading="lazy"
                sizes="(min-width: 1024px) 32vw, 100vw"
              />
              <Image
                src="/case-study/aurora-result-detail-b.svg"
                alt="Checkout and conversion refinements"
                width={900}
                height={440}
                className="case-study-image"
                loading="lazy"
                sizes="(min-width: 1024px) 32vw, 100vw"
              />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="case-study-section case-study-section--stack" delay={0.24}>
          <div className="case-study-copy">
            <span className="eyebrow">Key Outcomes</span>
            <h2 className="case-study-title">Measured gains backed by a clearer product story.</h2>
            <p className="case-study-text">
              Beyond cleaner visuals, the redesign produced a sharper narrative
              and a more trustworthy purchase journey. The result is a stronger
              connection between brand perception and product performance.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {outcomes.map((outcome) => (
              <div key={outcome.label} className="surface-panel p-5 sm:p-6">
                <p className="font-display text-4xl font-bold tracking-display gradient-text">
                  {outcome.value}
                </p>
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-muted">
                  {outcome.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
      <SiteFooter />
    </main>
  );
}
