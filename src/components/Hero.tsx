"use client";

import Image from "next/image";
import { useRef } from "react";
import StickyStage from "./StickyStage";
import Magnet from "./reactbits/Magnet";
import { gsap, EASE, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { hero, site } from "@/data/content";

/**
 * The opening, as a pinned three-state scene rather than a screen you scroll off:
 *
 *   0.00  the question, alone
 *   0.35  the question recedes — scaling back and dimming, not sliding away
 *   0.55  the portrait rises out of the dark behind it
 *   1.00  the name resolves over the portrait and hands off to Chapter I
 *
 * Nothing here leaves the viewport under its own power; the scene is held still
 * and its layers are moved through states against scroll distance.
 */
export default function Hero() {
  const header = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = header.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-hero-meta]"), {
        opacity: 0,
        y: 14,
        duration: 1.1,
        ease: EASE,
        stagger: 0.09,
        delay: 0.35,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <header
        ref={header}
        className="shell fixed inset-x-0 top-0 z-[60] flex items-start justify-between gap-6 pt-6"
      >
        <div
          data-hero-meta
          /* No mix-blend-difference: it promotes the fixed header into a blend
             group composited against the whole page, and over transformed and
             filtered layers scrolling beneath it that mis-paints — the pale
             rectangle seen behind Chapter II's heading. */
          className="text-[0.6875rem] font-medium tracking-[0.22em] uppercase"
        >
          {site.name}
        </div>

        <Magnet padding={70} magnetStrength={4}>
          <a
            data-hero-meta
            href="#contact"
            className="block shrink-0 rounded-full border border-line px-5 py-2.5 text-[0.625rem] font-medium tracking-[0.18em] uppercase transition-colors duration-500 ease-[var(--ease)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            Get in touch
          </a>
        </Magnet>
      </header>

      <StickyStage
        length={3.2}
        build={(tl, stage) => {
          const q = stage.querySelector(".hero-question");
          const words = stage.querySelectorAll(".hero-word");
          const portrait = stage.querySelector(".hero-portrait");
          const name = stage.querySelectorAll(".hero-name-line");
          const cue = stage.querySelector(".hero-cue");

          // Absolute start for every line. A staggered fromTo on a scrubbed
          // timeline only immediate-renders its first target, which left the
          // second line at its natural position, on top of the question. Safe
          // as a set() now that no CSS transform remains to be composed with.
          gsap.set(name, { yPercent: 120 });

          // Entrance is time-based, not scroll-based — it should play on arrival.
          gsap.from(words, {
            yPercent: 118,
            duration: 1.5,
            ease: EASE,
            stagger: 0.075,
            delay: 0.15,
          });

          tl.to(cue, { opacity: 0, duration: 0.1 }, 0)
            .to(q, { scale: 0.82, opacity: 0, filter: "blur(6px)", duration: 0.45 }, 0.05)
            .fromTo(
              portrait,
              { opacity: 0, scale: 1.35, yPercent: 6 },
              { opacity: 1, scale: 1.06, yPercent: 0, duration: 0.55 },
              0.28
            )
            .to(name, { yPercent: 0, duration: 0.22, stagger: 0.05 }, 0.45)
            // Hand off only AFTER the name has held at full strength. Overlapping
            // the exit with the name's arrival dimmed it to a 2.3:1 grey-on-grey.
            .to(stage, { opacity: 0.3, duration: 0.12 }, 0.88);
        }}
      >
        <div className="relative h-full w-full">
          {/* Layer 2 — portrait, revealed from behind the question */}
          <div className="hero-portrait absolute inset-0 opacity-0">
            <Image
              src="/img/bg-hero-2400.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-bg-img object-cover contrast-[1.18] brightness-[0.86]"
            />
            {/* Scrim weighted to the lower third, where the name sits, so the
                photograph keeps its midtones instead of going uniformly muddy. */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent md:h-[62%] md:via-[var(--bg)]/85" />
          </div>

          {/* Layer 1 — the question */}
          <div className="hero-question absolute inset-0 flex items-center">
            <div className="shell">
              <h1 className="display max-w-[16ch]">
                {hero.question.map((word) => (
                  <span key={word} className="line-mask">
                    <span className="hero-word inline-block">{word}</span>
                  </span>
                ))}
              </h1>
            </div>
          </div>

          {/* Layer 3 — the name, resolving over the portrait */}
          <div className="absolute inset-x-0 bottom-[16svh] flex items-end">
            <div className="shell">
              {/* Two lines, styled independently. At display size the descriptor
                  is 31 characters and wraps to three ragged lines on a phone, so
                  below 768px it drops to a tracked caption instead — name large,
                  descriptor small, which reads as intended rather than cramped. */}
              <h2>
                <span className="line-mask">
                  {/* No Tailwind translate here — GSAP owns this transform, and a
                      utility translate would be folded into its start value. */}
                  <span className="hero-name-line display-sm inline-block">
                    {site.name}
                  </span>
                </span>
                <span className="line-mask mt-2 md:mt-0">
                  <span className="hero-name-line hero-name-sub inline-block whitespace-nowrap">
                    Finance · Investments · Business
                  </span>
                </span>
              </h2>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="hero-cue absolute inset-x-0 bottom-[7.5svh]">
            <div className="shell flex items-end justify-between gap-6">
              <div className="text-[0.625rem] leading-[1.8] tracking-[0.18em] uppercase">
                <div className="text-fg">{hero.scrollCue[0]}</div>
                <div className="text-fg-faint">{hero.scrollCue[1]}</div>
              </div>
              <div className="hidden text-[0.625rem] tracking-[0.18em] uppercase text-fg-faint sm:block">
                {site.location}
              </div>
            </div>
          </div>
        </div>
      </StickyStage>
    </>
  );
}
