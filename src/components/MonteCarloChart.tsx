"use client";

import { useGsapContext, gsap, EASE, countUp, formatCount } from "@/lib/motion";
import data from "@/data/monte-carlo.json";

const W = 1000;
const H = 300;

/**
 * The real distribution from Harsh's workbook — all 10,000 iterations, binned.
 * Bars grow from the baseline on scroll, left to right.
 */
export default function MonteCarloChart() {
  const { counts, edges } = data.histogram;
  const peak = Math.max(...counts);
  const bw = W / counts.length;

  const scope = useGsapContext(({ self }) => {
    gsap.from(self.querySelectorAll<SVGRectElement>(".mc-bar"), {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 0.9,
      ease: EASE,
      stagger: 0.012,
      scrollTrigger: { trigger: self, start: "top 82%" },
    });

    gsap.from(self.querySelector(".mc-mean"), {
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      scrollTrigger: { trigger: self, start: "top 82%" },
    });

    self.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      countUp(el, Number(el.dataset.count), {
        decimals: Number(el.dataset.decimals ?? 0),
      });
    });
  });

  const meanX = ((data.results.average - edges[0]) / (edges[edges.length - 1] - edges[0])) * W;

  return (
    <div ref={scope as React.RefObject<HTMLDivElement>}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Distribution of ${data.inputs.iterations.toLocaleString("en-IN")} simulated outcomes, averaging ${data.results.average.toLocaleString("en-IN")}`}
      >
        {counts.map((c, i) => {
          const h = (c / peak) * (H - 24);
          return (
            <rect
              key={i}
              className="mc-bar"
              x={i * bw + 1}
              y={H - h}
              width={bw - 2}
              height={h}
              fill="rgba(255,255,255,0.62)"
            />
          );
        })}

        <line
          className="mc-mean"
          x1={meanX}
          x2={meanX}
          y1={0}
          y2={H}
          stroke="white"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <line x1={0} x2={W} y1={H} y2={H} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      </svg>

      <div className="mono mt-3 flex justify-between text-[0.5625rem] tracking-[0.14em] uppercase text-fg-faint">
        <span>₹{Math.round(data.results.minimum).toLocaleString("en-IN")}</span>
        <span>Mean ₹{Math.round(data.results.average).toLocaleString("en-IN")}</span>
        <span>₹{Math.round(data.results.maximum).toLocaleString("en-IN")}</span>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--line-soft)] pt-8 sm:grid-cols-4">
        {[
          { label: "Iterations", value: data.inputs.iterations, decimals: 0 },
          { label: "Initial investment", value: data.inputs.initialInvestment, decimals: 0 },
          { label: "Mean outcome", value: data.results.average, decimals: 0 },
          { label: "Std deviation", value: data.results.stdDev, decimals: 0 },
        ].map((s) => (
          <div key={s.label}>
            <dt className="eyebrow mb-2">{s.label}</dt>
            <dd
              className="mono text-[clamp(1.25rem,2vw,1.75rem)] font-extralight"
              data-count={s.value}
              data-decimals={s.decimals}
            >
              {formatCount(s.value, s.decimals)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
