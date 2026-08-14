"use client";

import Image from "next/image";
import ChapterHead from "./ChapterHead";
import MonteCarloChart from "./MonteCarloChart";
import IncomeQualityChart from "./IncomeQualityChart";
import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { projects } from "@/data/content";

export default function Projects() {
  const scope = useGsapContext(({ self }) => {
    self.querySelectorAll<HTMLElement>("[data-block]").forEach((block) => {
      gsap.from(block.querySelectorAll(":scope > *"), {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: EASE,
        stagger: 0.07,
        scrollTrigger: { trigger: block, start: "top 80%" },
      });
    });
  });

  const { aegis, analyses, writing } = projects;

  return (
    <section
      id="projects"
      ref={scope as React.RefObject<HTMLElement>}
      className="chapter"
    >
      <div className="shell">
        <ChapterHead
          numeral="III"
          label="Projects"
          title={projects.title}
          standfirst={projects.standfirst}
        />

        {/* ---------------------------------------------------------------- */}
        {/* AEGIS.os — the anchor project                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-20 border-t border-line pt-12 lg:mt-28">
          <div data-block className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="eyebrow mb-4">{aegis.period}</div>
              <h3 className="display-sm">{aegis.name}</h3>
              <p className="mt-3 text-sm tracking-[0.02em] text-fg-muted">{aegis.tagline}</p>

              <a
                href={aegis.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full border border-line px-6 py-3 text-[0.625rem] font-medium tracking-[0.18em] uppercase transition-colors duration-500 hover:bg-white hover:text-black"
              >
                Open the platform
              </a>

              <ul className="mt-10 flex flex-wrap gap-2">
                {aegis.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-[var(--line-soft)] px-3 py-1.5 text-[0.5625rem] tracking-[0.14em] uppercase text-fg-faint"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <p className="lede">{aegis.summary}</p>

              <ul className="mt-9 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {aegis.modules.map((m) => (
                  <li key={m} className="flex gap-3 text-sm font-light text-fg-muted">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-white/45" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <dl data-block className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--line-soft)] pt-10 sm:grid-cols-4">
            {aegis.stats.map((s) => (
              <div key={s.label}>
                <dt className="eyebrow mb-2">{s.label}</dt>
                <dd className="mono text-[clamp(1.5rem,2.6vw,2.25rem)] font-extralight">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <div data-block className="mt-16 grid gap-x-14 gap-y-10 sm:grid-cols-2">
            {aegis.principles.map((p) => (
              <div key={p.head}>
                <h4 className="mb-3 text-sm font-normal leading-snug">{p.head}</h4>
                <p className="body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Quantitative analyses, drawn from the real workbooks             */}
        {/* ---------------------------------------------------------------- */}
        {analyses.map((a) => (
          <div key={a.slug} className="mt-24 border-t border-line pt-12 lg:mt-32">
            <div data-block className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <div className="eyebrow mb-4">{a.period}</div>
                <h3 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-extralight leading-tight tracking-[-0.02em]">
                  {a.name}
                </h3>
                <p className="mt-2 text-sm text-fg-muted">{a.subtitle}</p>
                <p className="body mt-7">{a.summary}</p>
                <p className="mt-6 border-l border-line pl-5 text-sm font-light italic leading-relaxed text-fg-muted">
                  {a.finding}
                </p>
                <a
                  href={a.doc}
                  className="mt-7 inline-block border-b border-line pb-1 text-[0.6875rem] tracking-[0.16em] uppercase transition-colors duration-500 hover:border-white"
                >
                  {a.docLabel}
                </a>
              </div>

              <div className="lg:col-span-8">
                {a.slug === "monte-carlo" ? <MonteCarloChart /> : <IncomeQualityChart />}
              </div>
            </div>
          </div>
        ))}

        {/* ---------------------------------------------------------------- */}
        {/* Writing                                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-24 border-t border-line pt-12 lg:mt-32">
          <div className="eyebrow mb-10">Writing & resources</div>
          <div data-block className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {writing.map((w) => {
              const href = "doc" in w ? w.doc : w.href;
              return (
                <a
                  key={w.name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {"cover" in w && w.cover ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-raised">
                      <Image
                        src={w.cover}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover grayscale transition-[filter,transform] duration-[1.2s] ease-[var(--ease)] group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center border border-[var(--line-soft)] bg-bg-raised">
                      <span className="eyebrow">Substack</span>
                    </div>
                  )}
                  <h4 className="mt-5 text-base font-light leading-snug transition-colors duration-500 group-hover:text-white">
                    {w.name}
                  </h4>
                  <p className="mt-1.5 text-xs text-fg-faint">{w.subtitle}</p>
                  <p className="body mt-3">{w.summary}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
