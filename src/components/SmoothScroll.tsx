"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scrolling, driven off GSAP's ticker.
 *
 * The two have to share one clock: if Lenis runs its own RAF loop while
 * ScrollTrigger runs on GSAP's, pinned sections drift by a frame and jitter.
 * So Lenis's raf is called from gsap.ticker and lagSmoothing is disabled.
 */
export default function SmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.remove("no-js");

    if (prefersReducedMotion()) return;

    registerGsap();

    const lenis = new Lenis({
      duration: 1.15,
      // Long, soft tail — the slow settle is most of the "expensive" feel.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Handy in development for jumping to a scroll offset from the console.
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links have to go through Lenis, not native scrolling.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    /**
     * Lenis only emits "scroll" for input it handles itself (wheel, touch).
     * Native scrolling — keyboard PageDown/arrows, dragging the scrollbar,
     * find-in-page, or landing on a #hash — bypasses it entirely. Without this
     * listener ScrollTrigger keeps its cached scroll position of 0, no reveal
     * ever fires, and every section below the fold stays permanently invisible.
     *
     * Updating ScrollTrigger here fixes the reveals; re-syncing Lenis stops the
     * page from lurching back when the user next touches the wheel.
     */
    let syncing = false;
    const onNativeScroll = () => {
      ScrollTrigger.update();
      if (syncing) return;
      if (Math.abs(lenis.scroll - window.scrollY) > 2) {
        syncing = true;
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        requestAnimationFrame(() => {
          syncing = false;
        });
      }
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    // Late-loading images change page height; ScrollTrigger needs to be told.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // Webfonts reflow the tall display type, which moves every trigger below it.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
