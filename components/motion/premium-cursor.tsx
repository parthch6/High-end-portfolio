"use client";

import { useEffect, useRef } from "react";

import { useMotionSettings } from "@/components/motion/motion-settings-provider";

type Point = {
  x: number;
  y: number;
};

const cursorSize = 18;

export function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { isMobile, reduceMotion } = useMotionSettings();

  useEffect(() => {
    if (isMobile || reduceMotion || !cursorRef.current || !ringRef.current) {
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const target: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current: Point = { ...target };
    let frameId = 0;

    const resetMagneticElement = (element: Element) => {
      (element as HTMLElement).style.transform = "";
    };

    const moveMagneticElement = (element: Element, event: PointerEvent) => {
      const targetElement = element as HTMLElement;
      const rect = targetElement.getBoundingClientRect();
      const strength = Number(targetElement.dataset.magneticStrength ?? 0.24);
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;

      targetElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      const magneticTarget = (event.target as Element | null)?.closest(
        "[data-magnetic]"
      );

      document.querySelectorAll("[data-magnetic].is-magnetic").forEach((item) => {
        if (item !== magneticTarget) {
          item.classList.remove("is-magnetic");
          resetMagneticElement(item);
        }
      });

      if (magneticTarget) {
        magneticTarget.classList.add("is-magnetic");
        moveMagneticElement(magneticTarget, event);
        ring.classList.add("cursor-ring--active");
      } else {
        ring.classList.remove("cursor-ring--active");
      }
    };

    const handlePointerLeave = () => {
      ring.classList.remove("cursor-ring--active");
      document.querySelectorAll("[data-magnetic].is-magnetic").forEach((item) => {
        item.classList.remove("is-magnetic");
        resetMagneticElement(item);
      });
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;

      cursor.style.transform = `translate3d(${target.x - cursorSize / 2}px, ${
        target.y - cursorSize / 2
      }px, 0)`;
      ring.style.transform = `translate3d(${current.x - 24}px, ${
        current.y - 24
      }px, 0)`;

      frameId = requestAnimationFrame(animate);
    };

    document.documentElement.classList.add("has-premium-cursor");
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.documentElement.classList.remove("has-premium-cursor");
      handlePointerLeave();
    };
  }, [isMobile, reduceMotion]);

  if (isMobile || reduceMotion) {
    return null;
  }

  return (
    <>
      <div ref={ringRef} className="premium-cursor-ring" aria-hidden="true" />
      <div ref={cursorRef} className="premium-cursor-dot" aria-hidden="true" />
    </>
  );
}
