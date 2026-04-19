"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "#work", label: "Work", id: "work" },
  { href: "#about", label: "About", id: "about" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function StickyNavbar() {
  const [activeSection, setActiveSection] = useState("work");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={cn(
          "container-shell pointer-events-auto transition-all duration-300 ease-premium",
          isScrolled && "translate-y-0"
        )}
      >
        <div
          className={cn(
            "glass-nav flex items-center justify-between rounded-2xl px-3 py-2.5 md:px-5 md:py-3",
            isScrolled && "shadow-soft"
          )}
        >
          <Link
            href="#home"
            className="group inline-flex min-h-12 items-center gap-2 rounded-full px-1.5 py-1 transition duration-300 ease-premium md:gap-3 md:px-2"
            data-magnetic
            data-magnetic-strength="0.12"
            onClick={() => setIsOpen(false)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-glow transition duration-300 ease-premium group-hover:scale-105 group-hover:shadow-accent">
              PC
            </span>
            <span className="hidden font-display text-base font-semibold tracking-tight text-foreground min-[420px]:block md:text-lg">
              Parth Chaudhari
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "group relative rounded-full px-4 py-2 text-sm font-medium text-muted transition duration-300 ease-premium hover:-translate-y-0.5 hover:text-foreground",
                    isActive && "text-foreground"
                  )}
                  data-magnetic
                  data-magnetic-strength="0.14"
                  onClick={() => setIsOpen(false)}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full border border-transparent bg-white/0 transition duration-300 ease-premium",
                      isActive && "border-white/10 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
                      !isActive && "group-hover:border-white/10 group-hover:bg-white/5"
                    )}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition duration-300 ease-premium hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="relative h-4 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ease-premium",
                  isOpen && "top-[7px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-300 ease-premium",
                  isOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition duration-300 ease-premium",
                  isOpen && "top-[7px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>

        <div
          className={cn(
            "glass-nav mt-2 overflow-hidden rounded-2xl px-2 transition-all duration-300 ease-premium md:hidden",
            isOpen
              ? "pointer-events-auto max-h-80 py-2 opacity-100"
              : "pointer-events-none max-h-0 py-0 opacity-0"
          )}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-sm font-medium transition duration-300 ease-premium hover:bg-white/5 hover:text-foreground",
                    isActive ? "bg-white/10 text-foreground" : "text-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
