'use client';

import dynamic from "next/dynamic";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ScrollReveal } from "@/components/portfolio/scroll-reveal";

const OptimizedParticleSphere = dynamic(
  () => import("@/components/motion/optimized-particle-sphere").then((mod) => mod.OptimizedParticleSphere),
  { ssr: false, loading: () => <div className="w-full h-96 bg-gradient-to-br from-slate-950 to-slate-900 rounded-lg" /> }
);

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

const sectionItems = [
  {
    id: "about",
    eyebrow: "About",
    title: "Full-Stack developer building modern web experiences.",
    description:
      "I'm Parth Chaudhari, a passionate full-stack web developer with expertise in both frontend and backend technologies. I love creating scalable applications that solve real problems. When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or learning about the latest web development trends.",
  },
  {
    id: "contact",
    eyebrow: "Contact",
    title: "Let's collaborate on your next project.",
    description:
      "Whether you have an exciting project, want to discuss web development, or just want to connect—feel free to reach out. I'm always open to opportunities and conversations about building great digital products.",
    contacts: [
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
        value: "yourprofile",
        href: "https://github.com/yourprofile",
      },
      {
        label: "Twitter",
        value: "@yourhandle",
        href: "https://twitter.com/yourhandle",
      },
    ],
  },
];

export function PortfolioSections() {
  return (
    <div className="container-shell space-y-4 pb-20 sm:space-y-6 md:pb-section">
      <ScrollReveal distance={24}>
        <section
          id="work"
          className="surface-panel scroll-mt-24 px-4 py-8 sm:px-6 sm:py-10 md:scroll-mt-28 md:px-10 md:py-14"
        >
          <span className="eyebrow">Selected Work</span>
          <div className="mt-6 max-w-3xl">
            <h2 className="font-display text-3xl font-bold tracking-display text-foreground md:text-5xl">
              Signature digital products with strong visual intent.
            </h2>
            <p className="text-body mt-5 max-w-prose">
              Reusable project cards make it easy to expand this portfolio with
              case studies, launches, and product stories while keeping the
              presentation sharp and consistent.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
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

      {sectionItems.map((section, index) => (
        <ScrollReveal key={section.id} delay={0.04 * (index + 1)} distance={24}>
          <section
            id={section.id}
            className="surface-panel scroll-mt-24 px-4 py-8 sm:px-6 sm:py-10 md:scroll-mt-28 md:px-10 md:py-14"
          >
            <span className="eyebrow">{section.eyebrow}</span>
            <div className="mt-6 max-w-3xl">
              <h2 className="font-display text-3xl font-bold tracking-display text-foreground md:text-5xl">
                {section.title}
              </h2>
              <p className="text-body mt-5 max-w-prose">{section.description}</p>
              
              {section.id === "contact" && "contacts" in section && (
                <div className="mt-8 space-y-4">
                  {section.contacts.map((contact) => (
                    <div key={contact.label} className="flex items-start gap-4">
                      <div className="min-w-24">
                        <p className="text-sm font-medium text-muted">{contact.label}</p>
                      </div>
                      <a
                        href={contact.href}
                        target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={contact.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className="text-foreground font-medium hover:text-brand-gradient transition-colors"
                      >
                        {contact.value}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </ScrollReveal>
      ))}
    </div>
  );
}
