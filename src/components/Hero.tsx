"use client";

import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { hero, site } from "@/data/content";

export default function Hero() {
  const scope = useGsapContext(({ self }) => {
    const words = self.querySelectorAll<HTMLElement>(".hero-word");
    const meta = self.querySelectorAll<HTMLElement>("[data-hero-meta]");

    const tl = gsap.timeline({ delay: 0.15 });

    tl.from(words, {
      yPercent: 118,
      duration: 1.5,
      ease: EASE,
      stagger: 0.075,
    })
      .from(
        meta,
        { opacity: 0, y: 14, duration: 1, ease: EASE, stagger: 0.09 },
        "-=1.05"
      )
      .from(
        self.querySelector(".hero-rule"),
        { scaleX: 0, duration: 1.4, ease: EASE, transformOrigin: "left center" },
        "-=1.2"
      );

    // The question drifts up and dims as the first chapter takes over.
    gsap.to(self.querySelector(".hero-question"), {
      yPercent: -18,
      opacity: 0.12,
      ease: "none",
      scrollTrigger: {
        trigger: self,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  });

  return (
    <section
      ref={scope as React.RefObject<HTMLElement>}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-6 pb-10"
    >
      <header className="shell flex items-start justify-between gap-6">
        <div data-hero-meta className="text-[0.6875rem] font-medium tracking-[0.22em] uppercase">
          {site.name}
        </div>

        <div className="flex items-start gap-8 sm:gap-14">
          <ul
            data-hero-meta
            className="hidden text-[0.625rem] leading-[1.7] tracking-[0.16em] uppercase text-fg-faint sm:block"
          >
            {site.roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <a
            data-hero-meta
            href="#contact"
            className="shrink-0 rounded-full border border-line px-5 py-2.5 text-[0.625rem] font-medium tracking-[0.18em] uppercase transition-colors duration-500 hover:bg-white hover:text-black"
          >
            Get in touch
          </a>
        </div>
      </header>

      <div className="shell hero-question">
        <h1 className="display max-w-[16ch]">
          {hero.question.map((word) => (
            <span key={word} className="line-mask">
              <span className="hero-word inline-block">{word}</span>
            </span>
          ))}
        </h1>
      </div>

      <div className="shell">
        <hr className="hero-rule rule mb-6" />
        <div className="flex items-end justify-between gap-6">
          <div data-hero-meta className="text-[0.625rem] leading-[1.8] tracking-[0.18em] uppercase">
            <div className="text-fg">{hero.scrollCue[0]}</div>
            <div className="text-fg-faint">{hero.scrollCue[1]}</div>
          </div>
          <div
            data-hero-meta
            className="hidden text-[0.625rem] tracking-[0.18em] uppercase text-fg-faint sm:block"
          >
            {site.location}
          </div>
        </div>
      </div>
    </section>
  );
}
