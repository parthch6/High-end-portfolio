"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";

import { useMotionSettings } from "@/components/motion/motion-settings-provider";

type ProjectCardProps = {
  image: string;
  title: string;
  description: string;
  techStack: string[];
  href: string;
  ctaLabel: string;
};

export function ProjectCard({
  image,
  title,
  description,
  techStack,
  href,
  ctaLabel,
}: ProjectCardProps) {
  const { isMobile, reduceMotion } = useMotionSettings();

  return (
    <m.article
      className="project-card group"
      whileHover={
        reduceMotion || isMobile ? undefined : { y: -8, scale: 1.01 }
      }
      whileTap={reduceMotion || !isMobile ? undefined : { scale: 0.992 }}
      transition={{
        duration: isMobile ? 0.18 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-brand-gradient opacity-0 blur-2xl transition duration-500 ease-premium group-hover:opacity-20"
        aria-hidden="true"
      />

      <div className="project-card-frame">
        <div className="project-card-image">
          <Image
            src={image}
            alt={`${title} preview`}
            fill
            className="object-cover object-center transition duration-500 ease-premium group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, calc(100vw - 2rem)"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-6">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-display text-foreground">
              {title}
            </h3>
            <p className="mt-3 text-body-sm text-muted">{description}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span key={item} className="project-tag">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={href}
              className="project-link"
              data-magnetic
              data-magnetic-strength="0.14"
            >
              <span>{ctaLabel}</span>
              <span
                aria-hidden="true"
                className="transition duration-300 ease-premium group-hover:translate-x-1"
              >
                {"->"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </m.article>
  );
}
