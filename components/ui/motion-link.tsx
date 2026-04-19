"use client";

import Link, { type LinkProps } from "next/link";
import { m } from "framer-motion";
import type { ReactNode } from "react";

import { useMotionSettings } from "@/components/motion/motion-settings-provider";
import { cn } from "@/lib/utils";

type MotionLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  magnetic?: boolean;
};

export function MotionLink({
  children,
  className,
  magnetic = true,
  ...props
}: MotionLinkProps) {
  const { isMobile, reduceMotion } = useMotionSettings();

  return (
    <Link {...props} className="inline-flex">
      <m.span
        className={cn(className)}
        data-magnetic={magnetic ? true : undefined}
        data-magnetic-strength="0.18"
        whileHover={
          reduceMotion || isMobile ? undefined : { y: -2, scale: 1.01 }
        }
        whileTap={reduceMotion ? undefined : { scale: isMobile ? 0.985 : 0.98 }}
        transition={{
          duration: isMobile ? 0.16 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </m.span>
    </Link>
  );
}
