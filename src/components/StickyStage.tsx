"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/motion";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * The cinematic primitive, taken from how nabilissa.com is built:
 *
 *   <div style="height: 300vh">        ← scroll runway, provides distance
 *     <div class="stage-sticky">       ← pins to the viewport for that distance
 *       ...layers scrubbed by progress
 *
 * The viewport holds still while the content is moved through states. That is
 * the whole difference between "sections scroll past" and "one scene becomes
 * the next" — it comes from pinning, not from prettier easing.
 *
 * `build` receives a timeline already bound to the runway with `scrub`, so
 * callers position tweens on a 0→1 progress track without touching triggers.
 */
export default function StickyStage({
  children,
  length = 3,
  className = "",
  stageClassName = "",
  build,
  id,
}: {
  children: ReactNode;
  /** Runway height as a multiple of the viewport. 3 = 300vh. */
  length?: number;
  className?: string;
  stageClassName?: string;
  build?: (tl: gsap.core.Timeline, stage: HTMLElement) => void;
  id?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const wrapEl = wrap.current;
    const stageEl = stage.current;
    if (!wrapEl || !stageEl || !build) return;

    // Reduced motion: no pinning, no scrub. Collapse the runway to a single
    // screen and mark the stage so its layers can be styled for a still frame —
    // otherwise layers that GSAP would have positioned stay where the markup
    // left them, which reads as a broken screen rather than a calm one.
    if (prefersReducedMotion()) {
      wrapEl.style.height = "100svh";
      wrapEl.dataset.static = "true";
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      build(tl, stageEl);
    }, stageEl);

    // Signals that GSAP has set its initial states, so layers guarded against
    // the pre-hydration flash can become visible.
    wrapEl.dataset.ready = "true";

    // Pinned layout depends on measured heights; images and webfonts landing
    // late would otherwise leave every downstream trigger offset.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrap}
      id={id}
      className={className}
      style={{ height: `${length * 100}svh` }}
    >
      <div ref={stage} className={`stage-sticky ${stageClassName}`}>
        {children}
      </div>
    </div>
  );
}
