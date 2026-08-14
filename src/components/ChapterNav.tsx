"use client";

import { useEffect, useRef, useState } from "react";
import { chapters } from "@/data/content";

/**
 * Fixed chapter index with a progress line, mirroring the reference site's
 * navigation. Appears once the hero has been scrolled past, so the opening
 * screen stays uncluttered.
 *
 * Built on IntersectionObserver and a plain scroll listener rather than
 * ScrollTrigger: this is navigation, so it has to keep working for readers with
 * reduced motion, where the GSAP layer is never started.
 */
export default function ChapterNav() {
  const [active, setActive] = useState<string>(chapters[0].id);
  const [visible, setVisible] = useState(false);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.querySelector("main > section");

    // Reveal the index once the hero is mostly out of the way.
    const heroObserver = hero
      ? new IntersectionObserver(
          ([entry]) => setVisible(entry.intersectionRatio < 0.35),
          { threshold: [0, 0.35, 1] }
        )
      : null;
    if (hero && heroObserver) heroObserver.observe(hero);

    // Track which chapter owns the middle of the viewport.
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) sectionObserver.observe(el);
    });

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        if (progress.current) progress.current.style.transform = `scaleY(${ratio})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      heroObserver?.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className={`pointer-events-none fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 pl-[max(1.25rem,2.2vw)] transition-opacity duration-700 lg:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative flex gap-4">
        <div className="relative w-px shrink-0 bg-[var(--line-soft)]">
          <div
            ref={progress}
            className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-white/70"
          />
        </div>

        <ul className="pointer-events-auto space-y-3.5">
          {chapters.map((c) => {
            const on = active === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="group flex items-baseline gap-2.5 text-[0.5625rem] tracking-[0.2em] uppercase"
                  aria-current={on ? "true" : undefined}
                >
                  <span
                    className={`mono w-5 transition-colors duration-500 ${
                      on ? "text-fg" : "text-fg-faint"
                    }`}
                  >
                    {c.numeral}
                  </span>
                  <span
                    className={`transition-colors duration-500 group-hover:text-fg ${
                      on ? "text-fg" : "text-fg-faint"
                    }`}
                  >
                    {c.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
