---
name: web-interface-guidelines
description: Vercel's Web Interface Guidelines, distilled into checkable rules for this portfolio. Apply when writing or reviewing any component, animation, form, or style change — before committing UI work.
---

# Web Interface Guidelines

Distilled from https://vercel.com/design/guidelines. That page is documentation, not
an installable package, so the rules live here where they can actually be checked.

Rules are listed with the command that verifies them where one exists. Prefer
running the check over trusting a reading of the code.

## Motion

- **Never `transition: all`.** List properties explicitly, or a layout property
  sneaks into a transition and janks.
  `grep -rn "transition-all\|transition: all" src/`
- Animate **`transform` and `opacity`** only. Avoid `width`, `height`, `top`, `left` —
  they trigger layout on every frame.
- Honour `prefers-reduced-motion`. In this project that means `prefersReducedMotion()`
  in `src/lib/motion.ts`: the GSAP layer never starts, `StickyStage` collapses its
  runway, and counters render their real values instead of counting from zero.
- Animations must be interruptible by user input.

## Colour and contrast

- Interactive states (`:hover`, `:active`, `:focus`) carry **more** contrast than rest.
- `<meta name="theme-color">` matches the page background — set via `viewport.themeColor`.
- `color-scheme: dark` on `<html>` so scrollbars and form controls match — set via
  `viewport.colorScheme`.
- Text over imagery must be measured, not eyeballed. A scrim that crushes the whole
  frame to black flattens the photograph *and* leaves text on a mid-grey. Weight the
  scrim where the type sits. See "Verifying" below for the measurement script.

## Typography

- Typographic quotes and apostrophes (`’` `“` `”`), never straight ones.
  `grep -nE "(?<=\w)'(?=\w)" -P src/data/content.ts`
- `…` rather than three periods.
- `font-variant-numeric: tabular-nums` wherever numbers are compared — the `.mono`
  class here does this. Use it on every figure, stat and axis label.
- Non-breaking space between value and unit: `10&nbsp;MB`.

## Accessibility

- Every focusable element shows a visible, unobscured focus ring.
- Hit targets: **≥24px visual, ≥44px on mobile.**
- Prefer native elements (`button`, `a`, `label`, `table`) before `aria-*`.
- Icon-only controls need a text equivalent for non-sighted users.
- All flows keyboard-operable, following WAI-ARIA authoring patterns.

## Forms

- Keep submit enabled until submission actually starts.
- Inputs ≥16px on mobile, or iOS Safari zooms the page on focus.
- Errors next to their field; on submit, focus the first error.
- Never disable paste.

## Layout

- Verify at mobile, laptop **and** ultra-wide (zoom to 50%).
- Respect safe-area insets for notches.
- Optical alignment beats geometric — adjust ±1px when perception disagrees.

## Verifying

The browser pane in this environment runs pages hidden, which suspends
`requestAnimationFrame`; GSAP and Lenis both ride it, so nothing animates and
screenshots come out black. Use the Playwright CLI instead — it runs a visible
context (`document.visibilityState === "visible"`):

```bash
npm run verify:open          # launch and hold a browser on the dev server
npm run verify:shot          # screenshot current state
```

Drive scroll with **real wheel events** so Lenis receives them:

```bash
npx @playwright/cli mousewheel 0 300
```

To measure text contrast over an image from a real screenshot, see
`scripts/contrast.py` — it reports a WCAG ratio for a given region. AA wants
4.5:1 for body text, 3.0:1 for large text.
