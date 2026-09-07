"use client";

import Image from "next/image";
import ChapterHead from "./ChapterHead";
import ScrollVelocity from "./reactbits/ScrollVelocity";
import { useGsapContext, gsap, EASE, splitWords, useReducedMotion } from "@/lib/motion";
import { about, chapterMeta } from "@/data/content";

export default function About() {
  const { numeral, label } = chapterMeta("about");
  const reducedMotion = useReducedMotion();
  const scope = useGsapContext(({ self }) => {
    // Body copy reveals word by word as it enters — slow enough to read into.
    self.querySelectorAll<HTMLElement>("[data-words]").forEach((p) => {
      const words = splitWords(p);
      gsap.from(words, {
        yPercent: 105,
        opacity: 0,
        duration: 0.85,
        ease: EASE,
        stagger: 0.012,
        scrollTrigger: { trigger: p, start: "top 82%" },
      });
    });

    // Slow parallax on the portrait — it drifts against the scroll.
    const frame = self.querySelector(".portrait-frame");
    const img = self.querySelector(".portrait-img");
    if (frame && img) {
      // Scale-only parallax anchored to the TOP of the frame.
      //
      // The photograph and the frame are both 3:4, so object-cover crops
      // nothing — every pixel lost was lost to this transform. The previous
      // version started at { yPercent: -7, scale: 1.14 }, which with a centred
      // origin took 14% off the top and cut the top of his head. Origin at the
      // top means the head is fixed and all overflow leaves from the bottom,
      // so the crop can only ever come off the feet.
      gsap.fromTo(
        img,
        { scale: 1, transformOrigin: "top center" },
        {
          scale: 1.12,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.5 },
        }
      );
      gsap.from(frame, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.6,
        ease: EASE,
        scrollTrigger: { trigger: frame, start: "top 84%" },
      });
    }

  });

  return (
    <section
      id="about"
      ref={scope as React.RefObject<HTMLElement>}
      className="chapter"
    >
      <div className="shell">
        <ChapterHead numeral={numeral}
          label={label} title={about.title} />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:col-start-1">
            <div className="portrait-frame relative aspect-[3/4] overflow-hidden">
              <Image
                src="/img/portrait-colour-1600.jpg"
                alt="Harsh Aryan, photographed in colour, three-quarter length"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="portrait-img object-cover"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-7">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} data-words className="body">
                  {p}
                </p>
              ))}
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-[var(--line-soft)] pt-10">
              {about.facts.map((f) => (
                <div key={f.label}>
                  <dt className="eyebrow mb-2">{f.label}</dt>
                  <dd className="text-sm font-light leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Full-bleed marquee of institutions.
          Velocity-reactive: it drifts on its own, accelerates with the scroll,
          and reverses when you scroll back up.

          Two accessibility problems had to be solved without losing the effect.

          The marquee paints FOUR copies of the same string so the loop can wrap
          seamlessly, which meant a screen reader read the whole list of
          institutions four times over. It is now aria-hidden, with one real list
          carrying the same names to assistive technology.

          It also animated forever regardless of the reader's motion preference —
          the one piece of motion on the site that ignored ADR-6. Under reduced
          motion it renders as a static row instead. */}
      <div className="mt-20 border-y border-[var(--line-soft)] py-6 lg:mt-28">
        {/* A bare row of institution names reads as a logo wall — the visual
            grammar of "these organisations endorse me". None of them do: some
            taught him, one certified him, several hosted competitions he entered.
            A label costs one line and removes the implication. */}
        <h3 className="eyebrow mb-4 px-[var(--gutter)]">
          Institutions named in this record — studied at, worked with, competed at, or
          certified by
        </h3>
        <ul className="sr-only">
          {about.marks.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>

        <div aria-hidden="true">
          {reducedMotion ? (
            <p className="truncate px-[var(--gutter)] text-[0.6875rem] tracking-[0.2em] uppercase text-fg-faint">
              {about.marks.join("　·　")}
            </p>
          ) : (
            <ScrollVelocity
              texts={[about.marks.join("　·　")]}
              velocity={26}
              numCopies={4}
              className="whitespace-nowrap pr-14 text-[0.6875rem] tracking-[0.2em] uppercase text-fg-faint"
            />
          )}
        </div>
      </div>
    </section>
  );
}
