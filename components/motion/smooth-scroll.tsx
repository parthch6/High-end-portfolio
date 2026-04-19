"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

import { useMotionSettings } from "@/components/motion/motion-settings-provider";

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const { isMobile, reduceMotion } = useMotionSettings();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: isMobile ? 0.16 : 0.09,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      syncTouch: false,
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [isMobile, reduceMotion]);

  return children;
}
