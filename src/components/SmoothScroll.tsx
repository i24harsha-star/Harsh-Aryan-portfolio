"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Move keyboard focus to an in-page anchor's target.
 *
 * A fragment link normally does this for free, but every anchor on this site is
 * intercepted and preventDefault()ed so Lenis can own the scroll — which
 * silently cancels the focus move as well. The result was a skip link that
 * scrolled the page and left focus behind it in the header, and a chapter index
 * that a keyboard user could activate without ever arriving anywhere.
 *
 * `preventScroll` is not optional: without it the browser's own jump fights
 * Lenis's tween and the page lurches.
 */
function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) {
    // Sections are not focusable. Make this one focusable just long enough to
    // receive focus, then take it back out of the tab order on blur so it does
    // not become a phantom stop for everyone tabbing through the page.
    el.setAttribute("tabindex", "-1");
    el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
  }
  el.focus({ preventScroll: true });
}

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

    /**
     * Focus management runs whether or not the motion layer does — a reader with
     * reduced motion uses the skip link and the chapter index too.
     */
    const onAnchorFocus = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      const id = link?.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector<HTMLElement>(id);
      if (target) focusTarget(target);
    };
    document.addEventListener("click", onAnchorFocus);

    if (prefersReducedMotion()) {
      return () => document.removeEventListener("click", onAnchorFocus);
    }

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

    // Anchor links have to go through Lenis, not native scrolling. Focus is
    // handled separately by onAnchorFocus above, which still runs for these.
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
      document.removeEventListener("click", onAnchorFocus);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
