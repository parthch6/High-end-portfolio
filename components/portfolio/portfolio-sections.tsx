"use client";

import { ProjectCard } from "@/components/portfolio/project-card";
import { ScrollReveal } from "@/components/portfolio/scroll-reveal";

const projects = [
  {
    image: "/projects/aurora-commerce.svg",
    title: "Aurora Commerce",
    description:
      "A refined storefront system with editorial layouts, premium product storytelling, and conversion-focused motion.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
    href: "/case-study/aurora-commerce",
    ctaLabel: "Case Study",
  },
  {
    image: "/projects/nova-studio.svg",
    title: "Nova Studio",
    description:
      "A creative studio site built around immersive visuals, smooth interactions, and a striking narrative flow.",
    techStack: ["React", "Framer Motion", "CMS", "Vercel"],
    href: "/case-study/aurora-commerce",
    ctaLabel: "Case Study",
  },
  {
    image: "/projects/summit-dashboard.svg",
    title: "Summit Dashboard",
    description:
      "A modern analytics experience that balances dense product data with clarity, hierarchy, and confident UI polish.",
    techStack: ["App Router", "Charts", "Design System", "API"],
    href: "#contact",
    ctaLabel: "View Project",
  },
];

const capabilities = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    items: ["Node.js", "API design", "Databases", "Auth", "Integrations"],
  },
  {
    title: "Product",
    items: ["UI systems", "Responsive layouts", "Performance", "Accessibility"],
  },
];

const contacts = [
  {
    label: "Email",
    value: "Parthchaudhari4678@gmail.com",
    href: "mailto:Parthchaudhari4678@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "Parth Chaudhari",
    href: "https://linkedin.com/in/parth-chaudhari-63088a282",
  },
  {
    label: "GitHub",
    value: "parthch6",
    href: "https://github.com/parthch6",
  },
];

export function PortfolioSections() {
  return (
    <div className="container-shell pb-20 md:pb-section">
      <ScrollReveal distance={24}>
        <section
          id="work"
          className="section-space scroll-mt-24 border-t border-white/10 md:scroll-mt-28"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <span className="eyebrow">Selected Work</span>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-normal text-foreground sm:text-4xl md:text-5xl">
                Signature digital products with strong visual intent.
              </h2>
            </div>
            <p className="text-body max-w-2xl lg:justify-self-end">
              Case studies, product interfaces, and responsive experiences organized
              around clear hierarchy, thoughtful motion, and fast implementation.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ScrollReveal
                key={project.title}
                delay={0.06 * index}
                distance={20}
              >
                <ProjectCard {...project} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.04} distance={24}>
        <section
          id="about"
          className="section-space scroll-mt-24 border-t border-white/10 md:scroll-mt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <span className="eyebrow">About</span>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-normal text-foreground sm:text-4xl md:text-5xl">
                Full-stack developer building modern web experiences.
              </h2>
            </div>

            <div className="lg:pt-16">
              <p className="text-body max-w-3xl">
                I&apos;m Parth Chaudhari, a full-stack web developer focused on
                scalable applications, refined interfaces, and clean implementation
                details. I enjoy turning product ideas into fast, responsive, and
                maintainable digital experiences.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {capabilities.map((capability) => (
                  <div key={capability.title} className="surface-panel p-5">
                    <h3 className="font-display text-xl font-bold tracking-normal text-foreground">
                      {capability.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {capability.items.map((item) => (
                        <span key={item} className="project-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.08} distance={24}>
        <section
          id="contact"
          className="section-space scroll-mt-24 border-t border-white/10 md:scroll-mt-28"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(320px,0.7fr)] lg:items-start lg:gap-14">
            <div>
              <span className="eyebrow">Contact</span>
              <h2 className="mt-6 font-display text-3xl font-bold tracking-normal text-foreground sm:text-4xl md:text-5xl">
                Let&apos;s collaborate on your next project.
              </h2>
              <p className="text-body mt-5 max-w-2xl">
                Whether you have an exciting project, want to discuss web
                development, or just want to connect, I&apos;m open to opportunities
                and conversations about building thoughtful digital products.
              </p>
            </div>

            <div className="grid gap-3">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={contact.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="surface-panel group flex min-w-0 flex-col gap-2 p-5 transition duration-300 ease-premium hover:border-white/20 hover:bg-white/[0.07] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium text-muted">{contact.label}</span>
                  <span className="min-w-0 break-all text-base font-semibold text-foreground transition-colors group-hover:text-white sm:break-normal sm:text-right">
                    {contact.value}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
