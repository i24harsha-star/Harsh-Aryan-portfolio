"use client";

/**
 * ScrollVelocity — React Bits (https://reactbits.dev/text-animations/scroll-velocity), MIT.
 * Vendored, converted to TypeScript, styles moved to Tailwind/inline.
 *
 * A marquee whose speed and direction follow scroll velocity: it drifts on its
 * own, accelerates as you scroll, and reverses when you scroll back up. Lenis
 * drives real window scroll, so motion's useScroll/useVelocity read it correctly
 * without extra wiring.
 *
 * Requires `motion` (Framer Motion) — the only place on the site that uses it.
 */

import { useRef, useLayoutEffect, useState, type RefObject } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";

function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const update = () => ref.current && setWidth(ref.current.offsetWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);
  return width;
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function VelocityText({
  children,
  baseVelocity,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
}: {
  children: React.ReactNode;
  baseVelocity: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) =>
    copyWidth === 0 ? "0px" : `${wrap(-copyWidth, 0, v)}px`
  );

  const directionFactor = useRef(1);
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) directionFactor.current = -1;
    else if (factor > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative overflow-hidden whitespace-nowrap">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {Array.from({ length: numCopies }, (_, i) => (
          <span className={className} key={i} ref={i === 0 ? copyRef : null}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity({
  texts = [],
  velocity = 40,
  className = "",
  numCopies = 6,
}: {
  texts: React.ReactNode[];
  velocity?: number;
  className?: string;
  numCopies?: number;
}) {
  return (
    <>
      {texts.map((text, i) => (
        <VelocityText
          key={i}
          className={className}
          baseVelocity={i % 2 !== 0 ? -velocity : velocity}
          numCopies={numCopies}
        >
          {text}
        </VelocityText>
      ))}
    </>
  );
}
