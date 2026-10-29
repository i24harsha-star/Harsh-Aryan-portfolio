"use client";

import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { projects } from "@/data/content";

/**
 * The Adani Power model's architecture, drawn.
 *
 * There is no screenshot of the workbook and none of its outputs have been
 * supplied, so this deliberately draws the model's *shape* rather than its
 * results: operating drivers feed three statements, the statements produce free
 * cash flow, cash flow is valued three ways, and the three ways resolve into one
 * football field. Every node is a stage that exists in the model — nothing here
 * implies a number.
 *
 * Geometry lives in this file and labels come from `projects.adani.chain`, so
 * the diagram and the list underneath it can never drift apart.
 *
 * Hand-placed in a 1000x215 viewBox rather than laid out with flex + absolute
 * connectors: the fan and the convergence are curves between specific points,
 * and chasing those with DOM measurement would reflow on every resize.
 */

/** Node centres, in viewBox units, in chain order. */
const CX = [70, 250, 430, 630, 880] as const;

const LABEL_Y = 180;

/** Faint ink, matching --line-soft/--line but usable as an SVG paint. */
const INK = "rgba(242, 239, 234, 0.26)";
const INK_SOFT = "rgba(242, 239, 234, 0.13)";
const BRASS = "var(--accent)";

export default function ValuationChain() {
  const { chain } = projects.adani;

  const scope = useGsapContext(({ self }) => {
    // Flow lines draw themselves. Set the dash here rather than in the markup:
    // under reduced motion this setup never runs, and a dash baked into the JSX
    // would leave every connector permanently invisible.
    const flows = self.querySelectorAll<SVGPathElement>(".vc-flow");
    flows.forEach((path) => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: self, start: "top 78%" },
    });

    tl.from(self.querySelectorAll(".vc-stage"), {
      opacity: 0,
      y: 14,
      duration: 0.8,
      ease: EASE,
      stagger: 0.12,
    })
      .to(
        flows,
        { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.1 },
        0.25
      )
      // The field arrives last and alone — it is the output of everything left
      // of it, so it should not fade in alongside the stages that feed it.
      .from(
        self.querySelectorAll(".vc-field"),
        { opacity: 0, scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: EASE, stagger: 0.08 },
        "-=0.2"
      );
  });

  return (
    <div
      ref={scope as React.RefObject<HTMLDivElement>}
      // Bleeds to the screen edge on phones so a dense diagram gets the full
      // width to scroll within, instead of the shell's gutters eating it.
      className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0"
    >
      <svg
        viewBox="0 0 1000 215"
        className="w-full min-w-[52rem] text-fg"
        role="img"
        aria-label={`Model architecture: ${chain.map((s) => s.label.join(" ")).join(", then ")}.`}
      >
        <defs>
          <marker
            id="vc-tip"
            viewBox="0 0 8 8"
            refX="7.5"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 Z" fill={INK} />
          </marker>
          <marker
            id="vc-tip-brass"
            viewBox="0 0 8 8"
            refX="7.5"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--accent)" fillOpacity="0.75" />
          </marker>
        </defs>

        {/* ---------------- flow lines, behind the nodes ---------------- */}
        <g fill="none" stroke={INK} strokeWidth="1">
          <path className="vc-flow" d="M102 105 H 204" markerEnd="url(#vc-tip)" />
          <path className="vc-flow" d="M288 105 H 390" markerEnd="url(#vc-tip)" />

          {/* Cash flow fans out to the three valuation approaches. */}
          <path className="vc-flow" d="M462 105 C 500 105, 516 69, 552 69" markerEnd="url(#vc-tip)" />
          <path className="vc-flow" d="M462 105 H 552" markerEnd="url(#vc-tip)" />
          <path className="vc-flow" d="M462 105 C 500 105, 516 141, 552 141" markerEnd="url(#vc-tip)" />

          {/* And the three approaches converge on one range. */}
          <g stroke={BRASS} strokeOpacity="0.5">
            <path className="vc-flow" d="M700 69 C 744 69, 800 105, 840 105" markerEnd="url(#vc-tip-brass)" />
            <path className="vc-flow" d="M700 105 H 840" markerEnd="url(#vc-tip-brass)" />
            <path className="vc-flow" d="M700 141 C 744 141, 800 105, 840 105" markerEnd="url(#vc-tip-brass)" />
          </g>
        </g>

        {/* ---------------- 01 · operating drivers ---------------- */}
        <g className="vc-stage">
          <rect x="38" y="73" width="64" height="64" fill="none" stroke={INK} />
          {/* Four levers — the assumptions that drive everything downstream. */}
          <g stroke={INK} strokeWidth="1">
            <line x1="52" y1="88" x2="88" y2="88" />
            <line x1="52" y1="99" x2="88" y2="99" />
            <line x1="52" y1="110" x2="88" y2="110" />
            <line x1="52" y1="121" x2="88" y2="121" />
          </g>
          <g fill="var(--fg)">
            <circle cx="78" cy="88" r="2.5" />
            <circle cx="64" cy="99" r="2.5" />
            <circle cx="83" cy="110" r="2.5" />
            <circle cx="69" cy="121" r="2.5" />
          </g>
        </g>

        {/* ---------------- 02 · three statements ---------------- */}
        <g className="vc-stage">
          <rect x="212" y="79" width="76" height="14" fill="none" stroke={INK} />
          <rect x="212" y="98" width="76" height="14" fill="none" stroke={INK} />
          <rect x="212" y="117" width="76" height="14" fill="none" stroke={INK} />
          <g stroke={INK_SOFT} strokeWidth="1">
            <line x1="220" y1="86" x2="256" y2="86" />
            <line x1="220" y1="105" x2="262" y2="105" />
            <line x1="220" y1="124" x2="250" y2="124" />
          </g>
        </g>

        {/* ---------------- 03 · free cash flow ---------------- */}
        <g className="vc-stage">
          <rect x="398" y="73" width="64" height="64" fill="none" stroke={INK} />
          {/* Three chevrons falling — cash coming out of the statements. */}
          <g fill="none" stroke={INK} strokeWidth="1.25" strokeLinecap="round">
            <path d="M416 91 L430 101 L444 91" />
            <path d="M416 103 L430 113 L444 103" />
            <path d="M416 115 L430 125 L444 115" />
          </g>
        </g>

        {/* ---------------- 04 · three approaches ---------------- */}
        <g className="vc-stage">
          {[
            { y: 56, text: "DCF — FCFF" },
            { y: 92, text: "Comparables" },
            { y: 128, text: "Market-based" },
          ].map((row) => (
            <g key={row.text}>
              <rect x="560" y={row.y} width="140" height="26" fill="none" stroke={INK} />
              <text
                x="630"
                y={row.y + 17}
                textAnchor="middle"
                fill="var(--fg-muted)"
                style={{ fontSize: 11, letterSpacing: "0.03em" }}
              >
                {row.text}
              </text>
            </g>
          ))}
        </g>

        {/* ---------------- 05 · football field ---------------- */}
        <g className="vc-stage">
          <rect x="848" y="73" width="64" height="64" fill="none" stroke={BRASS} strokeOpacity="0.55" />
          {/* A schematic football field: three ranges stacked, one reference
              line through them. No axis and no ticks, because no valuation
              output has been supplied — this is the chart's shape, not its
              numbers. */}
          <line x1="880" y1="82" x2="880" y2="128" stroke={BRASS} strokeOpacity="0.45" strokeWidth="1" />
          <g fill={BRASS} fillOpacity="0.8">
            <rect className="vc-field" x="858" y="88" width="44" height="5" rx="2.5" />
            <rect className="vc-field" x="864" y="101" width="32" height="5" rx="2.5" />
            <rect className="vc-field" x="854" y="114" width="52" height="5" rx="2.5" />
          </g>
        </g>

        {/* ---------------- numerals and labels ---------------- */}
        {chain.map((stage, i) => {
          const last = i === chain.length - 1;
          return (
            <g key={stage.numeral} className="vc-stage">
              <text
                x={CX[i]}
                y="36"
                textAnchor="middle"
                fill={last ? BRASS : "var(--fg-faint)"}
                fillOpacity={last ? 0.75 : 1}
                style={{ fontSize: 10, letterSpacing: "0.22em" }}
              >
                {stage.numeral}
              </text>
              <text
                x={CX[i]}
                y={LABEL_Y}
                textAnchor="middle"
                fill={last ? BRASS : "var(--fg)"}
                style={{ fontSize: 13.5, letterSpacing: "-0.01em" }}
              >
                {stage.label.map((line, j) => (
                  <tspan key={line} x={CX[i]} dy={j === 0 ? 0 : 17}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
