"use client";

import { useGsapContext, gsap, EASE } from "@/lib/motion";
import data from "@/data/income-quality.json";

type Company = {
  name: string;
  average: number | null;
  median: number | null;
  difference: number | null;
};

/**
 * A dumbbell chart of average vs median NP/CFO, which is exactly the finding:
 * a short bar means the average and median agree and earnings are steady; a long
 * bar means the average is being pulled by years that don't repeat.
 */
export default function IncomeQualityChart() {
  const groups = data.groups as { label: string; companies: Company[] }[];

  const all = groups
    .flatMap((g) => g.companies)
    .flatMap((c) => [c.average, c.median])
    .filter((v): v is number => typeof v === "number");

  const min = Math.min(...all);
  const max = Math.max(...all);
  const pad = (max - min) * 0.08;
  const lo = min - pad;
  const hi = max + pad;
  const pos = (v: number) => ((v - lo) / (hi - lo)) * 100;

  const scope = useGsapContext(({ self }) => {
    gsap.from(self.querySelectorAll(".iq-row"), {
      opacity: 0,
      x: -18,
      duration: 0.8,
      ease: EASE,
      stagger: 0.07,
      scrollTrigger: { trigger: self, start: "top 80%" },
    });
    gsap.from(self.querySelectorAll<HTMLElement>(".iq-bar"), {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1,
      ease: EASE,
      stagger: 0.07,
      scrollTrigger: { trigger: self, start: "top 80%" },
    });
  });

  return (
    <div ref={scope as React.RefObject<HTMLDivElement>} className="space-y-12">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="eyebrow mb-6">
            {g.label === "Top 5" ? "Highest earnings quality" : "Lowest earnings quality"}
          </div>

          <div className="space-y-5">
            {g.companies.map((c) => {
              if (c.average === null || c.median === null) return null;
              const a = pos(c.average);
              const m = pos(c.median);
              const left = Math.min(a, m);
              const width = Math.abs(a - m);

              return (
                <div key={c.name} className="iq-row grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,13rem)_1fr_4.5rem] sm:items-center sm:gap-5">
                  <div className="truncate text-xs font-light text-fg-muted" title={c.name}>
                    {c.name.replace(/ Ltd$/, "")}
                  </div>

                  <div className="relative h-5">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--line-soft)]" />
                    <div
                      className="iq-bar absolute top-1/2 h-px -translate-y-1/2 bg-white/70"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                    {/* average */}
                    <span
                      className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                      style={{ left: `${a}%` }}
                      aria-hidden
                    />
                    {/* median — hollow, to read as the reference point */}
                    <span
                      className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[var(--bg)]"
                      style={{ left: `${m}%` }}
                      aria-hidden
                    />
                  </div>

                  <div className="mono text-right text-xs text-fg-faint">
                    {c.difference !== null ? c.difference.toFixed(2) : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-[var(--line-soft)] pt-6 text-[0.625rem] tracking-[0.14em] uppercase text-fg-faint">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-white" /> Average NP/CFO
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full border border-white" /> Median NP/CFO
        </span>
        <span>Right column — the gap between them</span>
      </div>
    </div>
  );
}
