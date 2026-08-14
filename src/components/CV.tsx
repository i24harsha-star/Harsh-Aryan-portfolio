"use client";

import Image from "next/image";
import ChapterHead from "./ChapterHead";
import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { cv } from "@/data/content";

export default function CV() {
  const scope = useGsapContext(({ self }) => {
    self.querySelectorAll<HTMLElement>(".cv-entry").forEach((row) => {
      gsap.from(row, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: EASE,
        scrollTrigger: { trigger: row, start: "top 88%" },
      });
    });

    // The spine draws downward as the timeline scrolls past.
    const spine = self.querySelector(".cv-spine");
    if (spine) {
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: spine.parentElement,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        }
      );
    }
  });

  return (
    <section id="cv" ref={scope as React.RefObject<HTMLElement>} className="chapter">
      <div className="shell">
        <ChapterHead numeral="IV" label="The Record" title={cv.title} />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-14">
          {/* Download panel */}
          <div className="lg:col-span-4">
            <a href={cv.file} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="relative aspect-[1/1.414] overflow-hidden border border-[var(--line-soft)] bg-bg-raised">
                <Image
                  src={cv.cover}
                  alt="First page of Harsh Aryan's CV"
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover object-top opacity-80 transition-opacity duration-700 group-hover:opacity-100"
                />
              </div>
              <span className="mt-6 inline-block rounded-full border border-line px-6 py-3 text-[0.625rem] font-medium tracking-[0.18em] uppercase transition-colors duration-500 group-hover:bg-white group-hover:text-black">
                Download CV — PDF
              </span>
            </a>

            <div className="mt-12 space-y-8">
              <div>
                <div className="eyebrow mb-4">Certifications</div>
                <ul className="space-y-2.5">
                  {cv.certifications.map((c) => (
                    <li key={c} className="text-sm font-light leading-snug text-fg-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="eyebrow mb-4">Skills</div>
                <dl className="space-y-4">
                  {cv.skills.map((s) => (
                    <div key={s.group}>
                      <dt className="mb-1 text-xs text-fg">{s.group}</dt>
                      <dd className="text-xs leading-relaxed text-fg-faint">{s.items}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="eyebrow mb-8">Education</div>
            <div className="relative pl-7">
              <div className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-[var(--line-soft)]">
                <div className="cv-spine h-full w-full origin-top bg-white/45" />
              </div>

              <ul className="space-y-8">
                {cv.education.map((e) => (
                  <li key={e.place} className="cv-entry relative">
                    <span className="absolute -left-7 top-2 size-1.5 -translate-x-1/2 rounded-full bg-white/70" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="text-base font-light">{e.place}</h3>
                      <span className="mono text-xs text-fg-faint">{e.period}</span>
                    </div>
                    <p className="mt-1 text-sm text-fg-muted">{e.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="eyebrow mb-8 mt-16">Experience</div>
            <ul className="space-y-12">
              {cv.experience.map((e) => (
                <li key={e.place} className="cv-entry border-t border-[var(--line-soft)] pt-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-[clamp(1.125rem,1.6vw,1.375rem)] font-extralight">
                      {e.place}
                    </h3>
                    <span className="mono text-xs text-fg-faint">{e.period}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-fg-muted">{e.role}</p>
                  <ul className="mt-5 space-y-2.5">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm font-light leading-relaxed text-fg-muted">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-white/35" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
