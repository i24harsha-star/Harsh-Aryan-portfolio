"use client";

/**
 * GradualBlur — React Bits (https://reactbits.dev/animations/gradual-blur), MIT.
 * Vendored, trimmed to the props this site uses and converted to TypeScript.
 * No dependencies.
 *
 * Stacks several masked backdrop-filter layers so content dissolves into the
 * page edge instead of being cut off by a hard line. Used along the bottom edge
 * so the chapter index always sits on a soft field rather than on top of text.
 */

import React, { useMemo } from "react";

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const DIRECTION: Record<string, string> = {
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

type GradualBlurProps = {
  position?: "top" | "bottom";
  strength?: number;
  height?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  opacity?: number;
  curve?: keyof typeof CURVE_FUNCTIONS;
  /** "page" fixes it to the viewport; otherwise it fills its parent. */
  target?: "page" | "parent";
};

function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  divCount = 5,
  exponential = false,
  zIndex = 1000,
  opacity = 1,
  curve = "linear",
  target = "parent",
}: GradualBlurProps) {
  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / divCount;
    const curveFunc = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;
    const direction = DIRECTION[position] ?? "to bottom";

    for (let i = 1; i <= divCount; i++) {
      const progress = curveFunc(i / divCount);
      const blurValue = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * strength
        : 0.0625 * (progress * divCount + 1) * strength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const mask = `linear-gradient(${direction}, ${gradient})`;

      divs.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
          }}
        />
      );
    }
    return divs;
  }, [position, strength, divCount, exponential, opacity, curve]);

  const isPage = target === "page";

  return (
    <div
      aria-hidden
      style={{
        position: isPage ? "fixed" : "absolute",
        height,
        width: "100%",
        left: 0,
        right: 0,
        [position]: 0,
        pointerEvents: "none",
        // Upstream adds 100 for page targets, which would put the blur above
        // the chapter index and smear it. The caller's value is used as given.
        zIndex,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {blurDivs}
      </div>
    </div>
  );
}

export default React.memo(GradualBlur);
