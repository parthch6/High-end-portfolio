"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

import { useMotionSettings } from "@/components/motion/motion-settings-provider";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 32,
}: ScrollRevealProps) {
  const { isMobile, reduceMotion } = useMotionSettings();
  const revealDistance = reduceMotion ? 0 : isMobile ? Math.min(distance, 18) : distance;

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: revealDistance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: isMobile ? 0.14 : 0.25 }}
      transition={{
        duration: isMobile ? 0.42 : 0.7,
        delay: isMobile ? Math.min(delay, 0.08) : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}
