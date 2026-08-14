"use client";

import { useGsapContext, gsap, EASE } from "@/lib/motion";

/**
 * The heading block every chapter opens with: a numeral, a rule that draws
 * itself, and a display title whose lines rise out of a mask.
 */
export default function ChapterHead({
  numeral,
  label,
  title,
  standfirst,
}: {
  numeral: string;
  label: string;
  title: readonly string[];
  standfirst?: string;
}) {
  const scope = useGsapContext(({ self }) => {
    const tl = gsap
      .timeline({
        scrollTrigger: { trigger: self, start: "top 78%" },
      })
      .from(self.querySelectorAll(".head-meta"), {
        opacity: 0,
        y: 12,
        duration: 0.9,
        ease: EASE,
        stagger: 0.06,
      })
      .from(
        self.querySelector(".head-rule"),
        { scaleX: 0, duration: 1.3, ease: EASE, transformOrigin: "left center" },
        "-=0.8"
      )
      .from(
        self.querySelectorAll(".head-line"),
        { yPercent: 115, duration: 1.25, ease: EASE, stagger: 0.09 },
        "-=1.1"
      );

    // Not every chapter has a standfirst — GSAP warns on a null target.
    const standfirst = self.querySelector(".head-standfirst");
    if (standfirst) {
      tl.from(standfirst, { opacity: 0, y: 20, duration: 1, ease: EASE }, "-=0.85");
    }
  });

  return (
    <div ref={scope as React.RefObject<HTMLDivElement>}>
      <div className="mb-5 flex items-baseline justify-between gap-6">
        <span className="head-meta eyebrow">Chapter {numeral}</span>
        <span className="head-meta eyebrow hidden sm:block">{label}</span>
      </div>

      <hr className="head-rule rule mb-10" />

      <h2 className="display-sm max-w-[18ch]">
        {title.map((line) => (
          <span key={line} className="line-mask">
            <span className="head-line inline-block">{line}</span>
          </span>
        ))}
      </h2>

      {standfirst && (
        <p className="head-standfirst lede mt-8 max-w-[52ch]">{standfirst}</p>
      )}
    </div>
  );
}
