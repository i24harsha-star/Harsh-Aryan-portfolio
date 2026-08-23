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
          className="text-[0.6875rem] font-medium tracking-[0.22em] uppercase mix-blend-difference"
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

          // Hidden until the scrub brings them in; set here rather than in the
          // markup so nothing is visible before GSAP takes over.
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
              src="/img/portrait-1600.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_28%] contrast-[1.35] brightness-[0.92]"
            />
            {/* Scrim weighted to the lower third, where the name sits, so the
                photograph keeps its midtones instead of going uniformly muddy. */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-transparent" />
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
              <h2 className="display-sm">
                {[site.name, "Equity Research"].map((line) => (
                  <span key={line} className="line-mask">
                    {/* No Tailwind translate here — GSAP owns this transform, and a
                        utility translate would be folded into its start value. */}
                    <span className="hero-name-line inline-block">{line}</span>
                  </span>
                ))}
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
