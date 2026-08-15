"use client";

/**
 * ScrollStack — adapted from React Bits
 * (https://reactbits.dev/components/scroll-stack), MIT.
 *
 * The transform maths — per-card pin window, progressive scale toward
 * `baseScale`, stack offset, depth blur — is theirs. What changed:
 *
 *   The original constructs its OWN Lenis instance and rAF loop. This page
 *   already runs one Lenis (see SmoothScroll), and two smooth-scroll engines
 *   driving the same document fight each other and stutter. So this version
 *   creates no Lenis: it reads window.scrollY, which our Lenis already drives,
 *   on a passive scroll listener coalesced into one rAF.
 *
 * Cards pin at the top of the viewport and stack behind one another, each
 * sitting slightly smaller and blurrier than the one in front.
 */

import {
  useLayoutEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

export function ScrollStackItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>;
}

type Transform = { translateY: number; scale: number; blur: number };

export default function ScrollStack({
  children,
  itemDistance = 96,
  itemScale = 0.03,
  itemStackDistance = 26,
  stackPosition = "22%",
  scaleEndPosition = "12%",
  baseScale = 0.86,
  blurAmount = 1.1,
}: {
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  blurAmount?: number;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLElement[]>([]);
  const last = useRef(new Map<number, Transform>());
  const frame = useRef(0);

  const pct = useCallback((value: string, containerHeight: number) => {
    return value.includes("%")
      ? (parseFloat(value) / 100) * containerHeight
      : parseFloat(value);
  }, []);

  const progress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const update = useCallback(() => {
    const list = cards.current;
    if (!list.length) return;

    const scrollTop = window.scrollY;
    const containerHeight = window.innerHeight;
    const stackPx = pct(stackPosition, containerHeight);
    const scaleEndPx = pct(scaleEndPosition, containerHeight);

    const endEl = scroller.current?.querySelector(".scroll-stack-end");
    const endTop = endEl
      ? endEl.getBoundingClientRect().top + window.scrollY
      : 0;

    // Which card currently sits on top of the stack — used for depth blur.
    let topIndex = 0;
    list.forEach((card, j) => {
      const top = card.getBoundingClientRect().top + window.scrollY;
      if (scrollTop >= top - stackPx - itemStackDistance * j) topIndex = j;
    });

    list.forEach((card, i) => {
      const cardTop = card.getBoundingClientRect().top + window.scrollY;
      const pinStart = cardTop - stackPx - itemStackDistance * i;
      const pinEnd = endTop - containerHeight / 2;

      const scaleProgress = progress(scrollTop, pinStart, cardTop - scaleEndPx);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      const blur =
        blurAmount && i < topIndex ? Math.max(0, (topIndex - i) * blurAmount) : 0;

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPx + itemStackDistance * i;
      }

      const next: Transform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        blur: Math.round(blur * 100) / 100,
      };

      const prev = last.current.get(i);
      const changed =
        !prev ||
        Math.abs(prev.translateY - next.translateY) > 0.1 ||
        Math.abs(prev.scale - next.scale) > 0.001 ||
        Math.abs(prev.blur - next.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${next.translateY}px, 0) scale(${next.scale})`;
        card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : "";
        last.current.set(i, next);
      }
    });
  }, [
    pct,
    progress,
    stackPosition,
    scaleEndPosition,
    itemStackDistance,
    itemScale,
    baseScale,
    blurAmount,
  ]);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const list = Array.from(
      el.querySelectorAll<HTMLElement>(".scroll-stack-card")
    );
    cards.current = list;

    list.forEach((card, i) => {
      if (i < list.length - 1) card.style.marginBottom = `${itemDistance}px`;
      if (reduce) return;
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
    });

    // Reduced motion: leave the cards as a plain stacked list.
    if (reduce) return;

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    const cache = last.current;
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
      cache.clear();
      cards.current = [];
    };
  }, [itemDistance, update]);

  return (
    <div ref={scroller}>
      {children}
      {/* Spacer so the last card can release its pin cleanly. */}
      <div className="scroll-stack-end h-[40vh] w-full" />
    </div>
  );
}
