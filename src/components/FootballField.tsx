"use client";

import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { projects } from "@/data/content";

/**
 * The Football Field sheet, redrawn.
 *
 * Unlike ValuationChain — which draws the model's shape because no outputs were
 * available — every number here is real, read out of the workbook's own data
 * table. So this is a proper chart: a shared price axis, one range bar per
 * approach, and the market price as a reference line through all of them.
 *
 * The reference line is the whole point of the chart. Where a bar sits relative
 * to it is the claim; the comps bar sitting left of it and the DCF bars sitting
 * right of it is the disagreement the write-up is about.
 */

const X0 = 208; // left edge of the plot — leaves room for the row labels
const X1 = 962;
const ROW0 = 74;
const ROW_STEP = 46;
const BAR_H = 13;

const INK = "rgba(242, 239, 234, 0.26)";
const INK_SOFT = "rgba(242, 239, 234, 0.1)";

/** Bar treatment per row kind. The base case is the headline, so it gets brass. */
const STYLE: Record<string, { fill: string; opacity: number }> = {
  base: { fill: "var(--accent)", opacity: 0.85 },
  dcf: { fill: "rgba(242, 239, 234, 0.55)", opacity: 1 },
  comps: { fill: "rgba(242, 239, 234, 0.34)", opacity: 1 },
  market: { fill: "rgba(242, 239, 234, 0.17)", opacity: 1 },
};

export default function FootballField() {
  const { valuation } = projects.adani;
  const { field, ticks, axisMax, marketPrice } = valuation;

  const x = (v: number) => X0 + (v / axisMax) * (X1 - X0);
  const height = ROW0 + field.length * ROW_STEP + 44;

  const scope = useGsapContext(({ self }) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: self, start: "top 80%" },
    });

    // The axis arrives first so the bars have something to grow against.
    tl.from(self.querySelectorAll(".ff-axis"), {
      opacity: 0,
      duration: 0.6,
      ease: EASE,
      stagger: 0.04,
    })
      .from(
        self.querySelectorAll(".ff-label"),
        { opacity: 0, x: -10, duration: 0.6, ease: EASE, stagger: 0.07 },
        0.1
      )
      .from(
        self.querySelectorAll(".ff-bar"),
        {
          scaleX: 0,
          // Each bar starts at its own left edge, so the ranges open rightward
          // from where they actually begin rather than from the axis origin.
          transformOrigin: "left center",
          duration: 0.8,
          ease: EASE,
          stagger: 0.09,
        },
        0.2
      )
      .from(
        self.querySelectorAll(".ff-cmp"),
        { opacity: 0, duration: 0.7, ease: EASE },
        "-=0.3"
      );
  });

  return (
    <div
      ref={scope as React.RefObject<HTMLDivElement>}
      className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0"
    >
      <svg
        viewBox={`0 0 1000 ${height}`}
        className="w-full min-w-[46rem] text-fg"
        role="img"
        aria-label={`Football field valuation. ${field
          .map((f) => `${f.label}: ₹${f.low.toFixed(0)} to ₹${f.high.toFixed(0)}`)
          .join(". ")}. Market price ₹${marketPrice}.`}
      >
        {/* ---------------- axis ---------------- */}
        <g className="ff-axis">
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={x(t)}
                y1={ROW0 - 26}
                x2={x(t)}
                y2={ROW0 + field.length * ROW_STEP - 24}
                stroke={INK_SOFT}
              />
              <text
                x={x(t)}
                y={ROW0 + field.length * ROW_STEP - 4}
                textAnchor="middle"
                fill="var(--fg-faint)"
                style={{ fontSize: 10.5, letterSpacing: "0.04em" }}
              >
                {t === 0 ? "₹0" : t.toLocaleString("en-IN")}
              </text>
            </g>
          ))}
        </g>

        {/* ---------------- market price reference ---------------- */}
        <g className="ff-cmp">
          <line
            x1={x(marketPrice)}
            y1={ROW0 - 34}
            x2={x(marketPrice)}
            y2={ROW0 + field.length * ROW_STEP - 24}
            stroke="var(--fg)"
            strokeOpacity="0.5"
            strokeDasharray="3 3"
          />
          <text
            x={x(marketPrice) + 8}
            y={ROW0 - 38}
            fill="var(--fg-muted)"
            style={{ fontSize: 10.5, letterSpacing: "0.12em" }}
          >
            MARKET ₹{marketPrice}
          </text>
        </g>

        {/* ---------------- rows ---------------- */}
        {field.map((row, i) => {
          const y = ROW0 + i * ROW_STEP;
          const style = STYLE[row.kind] ?? STYLE.dcf;
          const left = x(row.low);
          const width = Math.max(x(row.high) - left, 2);

          return (
            <g key={row.label}>
              <text
                className="ff-label"
                x={X0 - 18}
                y={y + 4}
                textAnchor="end"
                fill={row.kind === "base" ? "var(--accent)" : "var(--fg-muted)"}
                style={{ fontSize: 12, letterSpacing: "-0.005em" }}
              >
                {row.label}
              </text>

              <rect
                className="ff-bar"
                x={left}
                y={y - BAR_H / 2}
                width={width}
                height={BAR_H}
                rx={BAR_H / 2}
                fill={style.fill}
                fillOpacity={style.opacity}
              />

              {/* End values, outside the bar so they never sit on the fill.
                  Each carries a background-coloured halo: the comps high of 182
                  lands within a few pixels of the ₹202.71 reference line, and
                  without the halo the dashes run straight through the digits. */}
              <text
                className="ff-label"
                x={left - 7}
                y={y + 3.5}
                textAnchor="end"
                fill="var(--fg-faint)"
                stroke="var(--bg)"
                strokeWidth={3.5}
                paintOrder="stroke"
                style={{ fontSize: 10 }}
              >
                {Math.round(row.low)}
              </text>
              <text
                className="ff-label"
                x={left + width + 7}
                y={y + 3.5}
                fill={row.kind === "base" ? "var(--accent)" : "var(--fg-faint)"}
                stroke="var(--bg)"
                strokeWidth={3.5}
                paintOrder="stroke"
                style={{ fontSize: 10 }}
              >
                {Math.round(row.high)}
              </text>
            </g>
          );
        })}

        {/* Baseline under the plot. */}
        <line
          className="ff-axis"
          x1={X0}
          y1={ROW0 + field.length * ROW_STEP - 24}
          x2={X1}
          y2={ROW0 + field.length * ROW_STEP - 24}
          stroke={INK}
        />
      </svg>
    </div>
  );
}
