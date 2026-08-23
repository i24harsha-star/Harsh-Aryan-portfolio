"use client";

import { useEffect, useRef, useState } from "react";
import { chapters } from "@/data/content";

/**
 * Chapter index along the bottom edge, following nabilissa.com's construction:
 *
 *   - one flex row across the full width, fixed to the bottom
 *   - inactive items hold a fixed min-width; the ACTIVE item flex-grows to take
 *     the remaining space, so the row rebalances as you move through the story
 *   - each item carries its own hairline with a progress fill that runs 0→100%
 *     across that chapter only
 *   - a small square marker sits at the right of each item and becomes a ring
 *     when active (see .chapter-decor in globals.css)
 *   - hovering slides a light panel up from below and inverts the label
 *
 * Built on IntersectionObserver and a passive scroll listener rather than
 * ScrollTrigger, so navigation still works for readers with reduced motion,
 * where the GSAP layer never starts.
 */
export default function ChapterNav() {
  const [active, setActive] = useState<string>(chapters[0].id);
  const [hovered, setHovered] = useState<string | null>(null);
  const fills = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
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
        const y = window.scrollY;
        const vh = window.innerHeight;
        for (const c of chapters) {
          const el = document.getElementById(c.id);
          const fill = fills.current[c.id];
          if (!el || !fill) continue;
          const top = el.getBoundingClientRect().top + y;
          // Measure against the section's own span so each line fills exactly
          // while its chapter is on screen.
          const span = Math.max(el.offsetHeight - vh * 0.45, 1);
          const p = Math.min(1, Math.max(0, (y - top + vh * 0.55) / span));
          fill.style.width = `${p * 100}%`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex gap-2 px-[var(--gutter)] pb-5 lg:gap-5"
    >
      {chapters.map((c, i) => {
        const on = active === c.id;
        const isLast = i === chapters.length - 1;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            data-active={on}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
            aria-current={on ? "true" : undefined}
            /* The link is the hit area — 44px on mobile, 28px on desktop, per
               the ≥24px / ≥44px touch-target rule. The visual strip stays
               1.45rem and sits at the bottom of it, so the row still reads as
               a hairline while remaining comfortably tappable. */
            className={`pointer-events-auto flex h-11 items-end lg:h-7 ${
              on
                ? "shrink grow basis-0 min-w-[6rem]"
                : "shrink-0 grow-0 basis-auto min-w-[2.25rem] lg:min-w-[11.4375rem]"
            } transition-[flex-grow] duration-500 ease-[var(--ease)]`}
          >
            <span className="chapter-item relative block h-[1.45rem] w-full overflow-hidden py-1">
              {/* light panel that slides up on hover */}
              <span
                className="absolute inset-0 bg-[var(--fg)] transition-transform duration-[600ms] ease-[var(--ease)]"
                style={{
                  transform: hovered === c.id ? "translateY(0)" : "translateY(110%)",
                }}
                aria-hidden
              />

              <span
                className={`relative z-[2] block text-[0.5625rem] tracking-[0.2em] uppercase transition-[opacity,color] duration-[600ms] ease-[var(--ease)] ${
                  hovered === c.id ? "text-[var(--bg)]" : "text-[var(--fg)]"
                } ${on || hovered === c.id ? "opacity-100" : "opacity-50"}`}
              >
                <span className="lg:hidden">{on ? `Chapter ${c.numeral}` : c.numeral}</span>
                <span className="hidden lg:inline">Chapter {c.numeral}</span>
                <span className="hidden xl:inline"> — {c.label}</span>
              </span>

              {/* square marker; becomes a ring when active */}
              <span
                className={`chapter-decor absolute top-1.5 z-[2] hidden size-[0.5625rem] bg-[var(--fg)] opacity-20 lg:block ${
                  isLast ? "left-0" : "right-0"
                }`}
                aria-hidden
              />

              {/* hairline + per-chapter progress fill */}
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-[rgba(242,239,234,0.2)]"
                aria-hidden
              >
                <span
                  ref={(el) => {
                    fills.current[c.id] = el;
                  }}
                  className="absolute left-0 top-0 block h-full w-0 bg-[var(--accent)]"
                />
              </span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}
