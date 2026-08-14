"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export const EASE = "power3.out";

/**
 * Respect the OS "reduce motion" setting — skip animation, show the content.
 *
 * In development, `?static=1` forces the same path. Automated browser panes run
 * with the page hidden, which suspends requestAnimationFrame entirely; GSAP and
 * Lenis are both rAF-driven, so without this every reveal would sit at its
 * starting opacity of 0 and the page would look blank when screenshotted.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (
    process.env.NODE_ENV === "development" &&
    new URLSearchParams(window.location.search).has("static")
  ) {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scoped GSAP context. Everything created inside is reverted on unmount, which
 * matters under React strict mode where effects run twice — without this you
 * get duplicated ScrollTriggers and elements that never reach opacity 1.
 */
export function useGsapContext(
  setup: (ctx: { self: HTMLElement }) => void,
  deps: unknown[] = []
) {
  const scope = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-reveal], [data-reveal-line] > *"), {
        opacity: 1,
        y: 0,
        clearProps: "all",
      });
      return;
    }

    registerGsap();
    let ctx: gsap.Context;
    try {
      ctx = gsap.context(() => setup({ self: el }), el);
    } catch (err) {
      // A throw inside setup would leave every element stuck at its "from"
      // state — visibly a blank section. Surface it and reveal the content.
      console.error("[motion] setup failed", el.id || el.className, err);
      gsap.set(el.querySelectorAll("[data-reveal], [data-block] > *"), { opacity: 1, y: 0 });
      return;
    }

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}

/** Fade-and-rise, staggered. The default reveal for most blocks. */
export function reveal(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  return gsap.from(targets, {
    y: 34,
    opacity: 0,
    duration: 1.1,
    ease: EASE,
    stagger: 0.08,
    ...vars,
  });
}

/**
 * Split a block of text into per-word spans wrapped in overflow-hidden lines,
 * so words can rise out of a mask. Returns the word elements to animate.
 *
 * Done manually rather than with GSAP's SplitText, which is a paid plugin.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "done") {
    return Array.from(el.querySelectorAll<HTMLElement>(".word-inner"));
  }

  const words = (el.textContent ?? "").split(/\s+/).filter(Boolean);
  el.textContent = "";

  const inners: HTMLElement[] = [];
  words.forEach((word, i) => {
    const mask = document.createElement("span");
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    mask.style.verticalAlign = "top";

    const inner = document.createElement("span");
    inner.className = "word-inner";
    inner.style.display = "inline-block";
    inner.textContent = word;

    mask.appendChild(inner);
    el.appendChild(mask);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    inners.push(inner);
  });

  el.dataset.split = "done";
  return inners;
}

/** Format a counter value the same way in HTML and during the animation. */
export function formatCount(v: number, decimals = 0, suffix = "") {
  const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-IN");
  return `${n}${suffix}`;
}

/**
 * Count a number up as it scrolls into view.
 *
 * The element must already contain its final value in the HTML, so that readers
 * with reduced motion — and anyone whose JavaScript never runs — see the real
 * number instead of a zero.
 */
export function countUp(
  el: HTMLElement,
  to: number,
  { decimals = 0, suffix = "" }: { decimals?: number; suffix?: string } = {}
) {
  if (prefersReducedMotion()) {
    el.textContent = formatCount(to, decimals, suffix);
    return;
  }
  const obj = { n: 0 };
  return gsap.to(obj, {
    n: to,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 85%" },
    onUpdate() {
      el.textContent = formatCount(obj.n, decimals, suffix);
    },
  });
}

export { gsap, ScrollTrigger };
