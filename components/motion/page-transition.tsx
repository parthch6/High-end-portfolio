"use client";

import { AnimatePresence, m } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useMotionSettings } from "@/components/motion/motion-settings-provider";

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { isMobile, reduceMotion } = useMotionSettings();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={
          reduceMotion
            ? { opacity: 1 }
            : isMobile
              ? { opacity: 0, y: 8 }
              : { opacity: 0, y: 18, filter: "blur(8px)" }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : isMobile
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        exit={
          reduceMotion
            ? { opacity: 1 }
            : isMobile
              ? { opacity: 0, y: -4 }
              : { opacity: 0, y: -10, filter: "blur(6px)" }
        }
        transition={{
          duration: reduceMotion ? 0 : isMobile ? 0.22 : 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
