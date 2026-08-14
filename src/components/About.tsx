"use client";

import Image from "next/image";
import ChapterHead from "./ChapterHead";
import { useGsapContext, gsap, EASE, splitWords } from "@/lib/motion";
import { about } from "@/data/content";

export default function About() {
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
      gsap.fromTo(
        img,
        { yPercent: -7, scale: 1.14 },
        {
          yPercent: 7,
          scale: 1.14,
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

    // Institution marks scroll horizontally, forever.
    const track = self.querySelector<HTMLElement>(".marks-track");
    if (track) {
      gsap.to(track, {
        xPercent: -50,
        duration: 34,
        ease: "none",
        repeat: -1,
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
        <ChapterHead numeral="I" label="Who I Am" title={about.title} />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:col-start-1">
            <div className="portrait-frame relative aspect-[3/4] overflow-hidden">
              <Image
                src="/img/portrait-1200.jpg"
                alt="Harsh Aryan"
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

      {/* Full-bleed marquee of institutions */}
      <div className="bleed mt-20 overflow-hidden border-y border-[var(--line-soft)] py-6 lg:mt-28">
        <div className="marks-track flex w-max gap-14 pr-14">
          {[...about.marks, ...about.marks].map((m, i) => (
            <span
              key={`${m}-${i}`}
              className="whitespace-nowrap text-[0.6875rem] tracking-[0.2em] uppercase text-fg-faint"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
