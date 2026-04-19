"use client";

import dynamic from "next/dynamic";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

import { useMotionSettings } from "@/components/motion/motion-settings-provider";
import { MotionLink } from "@/components/ui/motion-link";

const Hero3DVisual = dynamic(
  () => import("@/components/motion/hero-3d-visual").then((mod) => mod.Hero3DVisual),
  { ssr: false, loading: () => <div className="w-full h-full bg-gradient-to-br from-slate-950/50 to-slate-900/50" /> }
);

const statusItems = ["Available for opportunities", "Remote friendly", "Full-Stack specialist"];

const previewCards = [
  {
    title: "Aurora Commerce",
    type: "Case Study",
    className: "left-4 top-6 w-56 rotate-[-4deg] md:left-8 md:top-8",
  },
  {
    title: "Nova Studio",
    type: "Interactive Site",
    className: "right-3 top-28 w-52 rotate-[5deg] md:right-8 md:top-32",
  },
  {
    title: "Summit Dashboard",
    type: "Product UI",
    className: "bottom-8 left-12 w-60 rotate-[2deg] md:bottom-10 md:left-20",
  },
];

export function HeroSection() {
  const { isMobile, reduceMotion } = useMotionSettings();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 80, damping: 24, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 80, damping: 24, mass: 0.4 });
  const cardMotion = [
    {
      x: useTransform(springX, [-1, 1], reduceMotion ? [0, 0] : [-10, 10]),
      y: useTransform(springY, [-1, 1], reduceMotion ? [0, 0] : [-8, 8]),
    },
    {
      x: useTransform(springX, [-1, 1], reduceMotion ? [0, 0] : [8, -8]),
      y: useTransform(springY, [-1, 1], reduceMotion ? [0, 0] : [-6, 6]),
    },
    {
      x: useTransform(springX, [-1, 1], reduceMotion ? [0, 0] : [-6, 6]),
      y: useTransform(springY, [-1, 1], reduceMotion ? [0, 0] : [7, -7]),
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : isMobile ? 16 : 28 },
    show: { opacity: 1, y: 0 },
  };

  const headlineLine = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="home" className="hero-shell container-shell">
      <m.div
        className="hero-layout"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0, y: reduceMotion ? 0 : isMobile ? 14 : 24 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              duration: isMobile ? 0.5 : 0.8,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: isMobile ? 0.08 : 0.12,
            },
          },
        }}
      >
        <div className="hero-main-grid">
          <m.div variants={fadeUp} className="hero-copy">
            <span className="eyebrow mb-6">Full-Stack Web Developer</span>
            <m.h1
              className="hero-headline max-w-4xl"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: isMobile ? 0.08 : 0.11,
                    delayChildren: isMobile ? 0.04 : 0.08,
                  },
                },
              }}
            >
              <m.span className="block" variants={headlineLine}>
                I build scalable web applications
              </m.span>
              <m.span className="block" variants={headlineLine}>
                with{" "}
                <span className="gradient-text">clean code,</span>
              </m.span>
              <m.span className="block" variants={headlineLine}>
                and <span className="gradient-text">modern design.</span>
              </m.span>
            </m.h1>
            <p className="text-body mt-6 max-w-xl">
              Hi, I&apos;m Parth Chaudhari. I specialize in building full-stack web applications that combine
              robust backend architecture with intuitive user interfaces. Passionate about creating
              seamless digital experiences and solving complex problems through code.
            </p>
          </m.div>

          <m.div
            variants={fadeUp}
            className="hero-visual-placeholder"
            onPointerMove={(event) => {
              if (isMobile || reduceMotion) {
                return;
              }

              const rect = event.currentTarget.getBoundingClientRect();
              pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
              pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
            }}
            onPointerLeave={() => {
              pointerX.set(0);
              pointerY.set(0);
            }}
          >
            <div className="hero-visual-glow" aria-hidden="true" />
            <div className="hero-visual-orbit" aria-hidden="true" />

            <div className="relative h-full min-h-[18rem] md:min-h-[26rem]">
              {/* 3D Geometric Visual */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
                <Hero3DVisual type="smooth-sphere" colorScheme="purple" />
              </div>
            </div>
          </m.div>
        </div>

        <m.div variants={fadeUp} className="hero-bottom-strip">
          <div className="flex flex-col gap-3 sm:flex-row">
            <MotionLink href="#work" className="button-primary w-full sm:w-auto">
              View Work
            </MotionLink>
            <MotionLink href="#contact" className="button-secondary w-full sm:w-auto">
              Contact
            </MotionLink>
          </div>

          <div className="hero-status-list">
            {statusItems.map((item) => (
              <span key={item} className="hero-status-item">
                <span className="hero-status-dot" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
