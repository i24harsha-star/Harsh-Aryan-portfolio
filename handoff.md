# Harsh Aryan Portfolio — Development Handoff

**Written:** 2026-09-07
**Repo:** https://github.com/i24harsha-star/Harsh-Aryan-portfolio
**Local path:** `~/Files/Work/Projects/Portfolio/harsh-aryan-portfolio`
**Source assets (outside the repo):** `~/Files/Work/Projects/Portfolio/Website Assets/`

> This is a **different project from AEGIS OS**. Harsh asked explicitly that the two never
> be mixed: separate folder, separate GitHub repo, separate Vercel project. If you are
> reading this inside `aegis-os/`, you are in the wrong directory.

> **The owner is non-technical.** Give exact click-by-click instructions for anything he
> must do himself. Never hand him a developer one-liner and assume he'll know what to do
> with it.

---

## 1. Project Vision & Goal

A single-page personal portfolio for Harsh Aryan — IPM student at IIM Indore, CFA Level I
passed, targeting investment banking / equity research / PE-VC. It exists to be sent to
recruiters and to sell ₹499 one-to-one mentoring sessions.

**Design reference: https://nabilissa.com** — he rates its motion very highly and wants
that feel reproduced. His content is finance (decks, numbers, documents), not architecture
photography, so the *visual material* differs even though the *motion language* matches.

Content scope, in reading order:

| Chapter | Section | Content |
|---|---|---|
| I | Who I Am | Reflective personal copy + colour portrait + institution marquee |
| II | The Record | CV — education, achievements, experience, projects, leadership, skills |
| III | Case Work | Five national case competitions, decks, event photos |
| IV | Projects | AEGIS.os, earnings-quality analysis, Monte Carlo, writing |
| V | Mentoring | The ₹499 offer (payment not yet live) |
| VI | Contact | Email, socials |

---

## 2. Current Architecture State

**Stack:** Next.js 16.3.1 (App Router) · React 19.2.8 · TypeScript · Tailwind v4 ·
GSAP 3.15 + ScrollTrigger · Lenis 1.3.26 · `motion` 13.1 (Framer, one component only)

Fully static — `next build` prerenders the single route. No API routes, no database, no
server state. Everything is a client component because everything animates.

```
src/
  app/
    layout.tsx          Inter font, metadata, viewport (themeColor #0c0b0a)
    page.tsx            Section order + top/bottom gradient scrims + ChapterNav
    globals.css         Design tokens, type scale, .stage-sticky, chapter-nav CSS
  components/
    Hero.tsx            Pinned 3-state opening (question → portrait → name)
    StickyStage.tsx     THE cinematic primitive — see §8
    SmoothScroll.tsx    Lenis wired into the GSAP ticker
    ChapterNav.tsx      Fixed BOTTOM chapter index (nabilissa construction)
    ChapterHead.tsx     Shared chapter heading (numeral, rule, masked title)
    About.tsx  CV.tsx  Competitions.tsx  Projects.tsx  Mentoring.tsx  Contact.tsx
    MonteCarloChart.tsx      SVG histogram from real workbook data
    IncomeQualityChart.tsx   Dumbbell chart from real workbook data
    reactbits/          Vendored React Bits components (MIT) — see §8
      Magnet.tsx        as-is, no deps
      GradualBlur.tsx   as-is, NOT currently used — see §7
      ScrollVelocity.tsx as-is, needs `motion`
      ScrollStack.tsx   maths kept, Lenis removed — see §8
  data/
    content.ts          ALL copy and structured content. Edit this, not components.
    income-quality.json  generated — do not hand-edit
    monte-carlo.json     generated — do not hand-edit
  lib/
    motion.ts           registerGsap, prefersReducedMotion, useGsapContext,
                        splitWords, countUp, formatCount, EASE
    useIsomorphicLayoutEffect.ts
scripts/
  prepare-assets.sh   orchestrates everything below; safe to re-run
  img.py              cover / thumb / portrait / background / photos / work
  pdf.py              compress / flatten / pages  (macOS CoreGraphics)
  extract-data.py     workbooks → src/data/*.json
  contrast.py         WCAG contrast from a real screenshot
```

**`src/data/content.ts` is the single source of truth for copy.** Almost every text change
is an edit to that file, not to a component.

---

## 3. Completed Work So Far

Twelve commits, all merged to `main`:

- `d8f6c08` v0.1 — full six-chapter site built from scratch
- `5ce6c6f` Bottom chapter index + pinned cinematic scroll (the nabilissa study)
- `c570d96` Design tooling (taste-skill, Playwright CLI) + hero contrast fix
- `762ac7c` New hero background photograph + "Finance · Investments · Business"
- `b991bfb` About: new copy, colour portrait, crop that keeps his head
- `28e9832` Hero overlap + scroll artefacts + warm palette
- `80b4314` Case Work photos: only what is in the source folder, in colour
- `5617f87` CV preview: stop clipping it down both sides
- `27bcfc3` Chapter reorder + updated resume + case thumbnails
- `f1b6f66` Contact: drop counter row, fix two overlaps
- `8f44210` Mentoring: payment first, then booking
- `5d7c859` The Record: rebuilt from the rewritten resume ← HEAD

---

## 4. Current Git / Repo Status

```
branch:  main   (= production; Vercel deploys from here)
remote:  https://github.com/i24harsha-star/Harsh-Aryan-portfolio.git
status:  clean, 0 uncommitted
HEAD:    5d7c859
```

`hero-background-and-tagline` still exists locally and on the remote. It was merged
fast-forward into `main` and is **fully redundant** — safe to delete both copies.

There was a PR opened via the compare URL but never merged through GitHub; the merge was
done locally instead. Do not go looking for a merged PR.

**Deployment status: UNCONFIRMED.** He was given click-by-click Vercel import steps and
said "I'll set it up later" about payments, then asked for the site to go live. It is not
known whether he actually completed the Vercel import. **Ask him for the live URL before
assuming anything is deployed.** Nothing in the repo requires environment variables to
build, so an import should succeed with all defaults.

---

## 5. Files Actively Being Edited (hot files)

| File | Why it's hot |
|---|---|
| `src/data/content.ts` | Every copy change lands here. Rewritten twice for resume updates. |
| `src/components/CV.tsx` | Just restructured for the new grouped resume (§3, last commit). |
| `src/app/globals.css` | Design tokens + several bug fixes live here. |
| `scripts/img.py` | Grows a mode each time a new asset type appears. |
| `scripts/prepare-assets.sh` | The publish whitelist — see §9. |

---

## 6. Current Problems / Open Questions

1. **Chapter I heading contradicts its own copy.** It still reads
   *"Numbers, and what they hide"* over four paragraphs about preferring better questions
   to answers. Flagged to him three times; he has not chosen. Suggested replacements:
   `["Better questions,", "than answers"]` or `["Still", "becoming"]`. One-line change in
   `content.ts`.

2. **Scroll glitch — unverified.** He reported glitching and a pale rectangle artefact.
   Four compositing hazards were removed (§7). It could not be reproduced headlessly
   because headless Chromium has no real compositor. **He has never confirmed whether it
   is fixed.** Ask.

3. **`434 VC` is only in Chapter II.** Investment Analyst at a New York VC, Aug 2026–present,
   is arguably the strongest item on the site but appears only in the CV record. It probably
   deserves a proper block in Chapter IV. Raised, not yet decided.

4. **Earnings Quality / Monte Carlo dropped from his resume** but still shown as Chapter IV
   showcases with live charts. Left deliberately (a showcase may hold more than a one-page
   CV), but confirm that is intended.

5. **Mentoring is not live and cannot be** until he decides: session length, refund window,
   cancellation/reschedule terms, no-show policy. `content.ts → mentoring.duration` is
   still literally `"NEEDS INPUT"`.

6. **Four legal pages do not exist** — Terms, Privacy, Cancellation & Refunds, Contact Us.
   Razorpay requires all four to activate an account. This blocks payments entirely.

7. **Mobile chapter-nav tap targets are 36×44px.** Height passes the 44px guideline, width
   does not. Matches the reference site's own treatment; left as-is deliberately.

---

## 7. Things Tried That Failed — Do Not Repeat

**This section will save you hours. Read it.**

### The browser pane cannot verify motion
The in-app Browser pane *and* the Chrome MCP tab both run pages with
`document.visibilityState === "hidden"`. That **suspends `requestAnimationFrame`
entirely** (measured: 0 ticks/second). GSAP's ticker and Lenis both ride rAF, so:

- nothing animates
- every `gsap.from` element sits at its start state (usually `opacity: 0`)
- screenshots come back black once scrolled
- programmatic `window.scrollTo` fires **no scroll events at all**

Hours were lost diagnosing "bugs" that were only this. **Use `@playwright/cli`** — it runs
`visibilityState: "visible"`. See §12.

### CSS transforms collide with GSAP — three separate times
GSAP **parses an existing CSS transform and keeps it as a base**, appending its own on top.

- Tailwind `translate-y-full` + `yPercent: 120` → element stuck below its mask
- CSS `.hero-name-line { transform: translateY(120%) }` + `yPercent: 120` →
  `translate(0%,120%) translate(0,79px)` = double the travel
- A staggered `fromTo` on a scrubbed timeline **only immediate-renders its first target**,
  leaving later elements exposed

**Rule: never put `transform` in CSS on an element GSAP animates.** The anti-flash guard
must use `visibility` (untouched by the tween), revealed by a `data-ready` flag that
`StickyStage` sets after building.

### CSS opacity transitions collide with GSAP too
The contact email carried `transition-opacity duration-500` for a hover effect while GSAP
animated its opacity. They fought; the address rendered at **opacity 0 on the finished
page**. Hover now shifts colour instead. Three other `transition-opacity` uses were checked
and are *not* on GSAP-animated elements — leave them.

### A global `* { min-width: 0 }` silently killed every `min-w-*` utility
Added early to stop grid overflow. It has the same specificity as Tailwind utilities and
came later in the cascade, so it overrode all of them site-wide — including the chapter
nav's own widths. Now scoped to `.shell > *` and `[class*="grid-cols"] > *`.

### `qlmanage -t` caps thumbnail resolution
Silently produces ~435px-wide renders regardless of the `-s` flag. Deck covers were soft.
PDF rendering now goes through CoreGraphics (`scripts/pdf.py pages`).

### Next's image optimiser caches on path, not content
Replacing an image at the same path served the **old bytes** — greyscale photos kept
appearing after they were regenerated in colour. 59 stale entries were sitting in
`.next/dev/cache/images`. `rm -rf .next/dev/cache/images` after regenerating assets. The
same can affect visitors holding a cached copy after deploy.

### Emitting several widths per image was pointless
`next/image` derives its own responsive variants from one source. Three widths each of the
portrait and hero background shipped ~2MB nothing linked to. **One source file per image.**

### `GradualBlur` was removed from the page
Six stacked `backdrop-filter` layers pinned to the viewport force the compositor to
re-blur that strip every scroll frame. Over a near-black page it is visually
indistinguishable from a plain gradient. The component is still in `reactbits/` if a
lighter background ever wants it — but do not put it back without a reason.

### Stripe / Cal.com is a dead end for payments in India
Researched and confirmed (§10). Do not suggest it again.

---

## 8. Important Architecture Decisions

**ADR-1 — The cinematic feel is structural, not easing.**
Studied nabilissa.com live in-browser. It runs the same GSAP + Lenis stack. The difference
is a *sticky stage*:

```
<div style="height: 320svh">      ← scroll runway, provides distance
  <div class="stage-sticky">      ← position:sticky; top:0; height:100svh; overflow:hidden
    ...absolutely-positioned layers scrubbed against progress
```

The viewport is **held still** while content moves through states. That is what makes one
scene morph into the next instead of sliding past. `StickyStage.tsx` implements it; `build`
receives a timeline already bound with `scrub`.

**ADR-2 — Signature easing is `cubic-bezier(.83,0,.17,1)`** (easeInOutQuint), lifted from
the reference. An ease-*out* reads snappy; an ease-in-*out* reads deliberate, and that slow
departure is most of the "expensive" feeling.

**ADR-3 — Warm ink, not neutral black.** `--bg #0c0b0a`, `--fg #f2efea`. Neutral black
against pure white reads as a wireframe. One accent, **brass `--accent #c8a882`**, spent
only on *state* — current chapter, link hover, selection, focus ring. Never decoration.

**ADR-4 — Chapter numerals are derived, not hard-coded.** `chapterMeta(id)` in
`content.ts` looks them up from the `chapters` array. **Reordering that array is the entire
edit for a reorder.** Previously six files each carried their own numeral and drifted.

**ADR-5 — ScrollStack builds no Lenis.** Upstream creates its own Lenis instance and rAF
loop; this page already runs one, and two smooth-scroll engines on one document fight each
other. The vendored copy reads `window.scrollY` on a passive listener instead.

**ADR-6 — Reduced motion is a real path, not an afterthought.** `prefersReducedMotion()`
short-circuits the GSAP layer; `StickyStage` collapses its runway and sets
`data-static="true"`; counters render their true values in HTML rather than counting from
zero; `ChapterNav` uses IntersectionObserver so navigation survives with motion off.

**ADR-7 — Kokonut card-stack was evaluated and rejected.** Click-to-expand product cards on
Framer springs — wrong register for this site.

---

## 9. Content & Asset Model

### Where content lives
`src/data/content.ts` — `site`, `hero`, `chapters`, `about`, `competitions`, `projects`,
`cv`, `mentoring`, `contact`. Anything still undecided is marked `NEEDS INPUT` rather than
filled with plausible filler. **Keep that convention.**

### The asset pipeline
`./scripts/prepare-assets.sh` reads from `../Website Assets/` and writes into `public/`.
Safe to re-run; it overwrites, never deletes.

- **Publishes an explicit whitelist, never a directory sweep.** Removing a file from the
  source must remove it from the site.
- **Design decks are rasterised** — Canva exports are 17–28 MB each; flattening cuts ~90%
  with no visible loss. Deliberately *not* flattened: `harsh-aryan-cv.pdf` (must stay
  selectable text for applicant tracking systems), the two-page handout, and the UDGAM
  research report (dense text, only 16% saving).
- **Deck-cover footer trim is opt-in per document** (`cover <pdf> <slug> [fraction]`). The
  five WhiteRock decks get `0.07`; the CV must not, because trimming changed its ratio from
  0.707 to 0.760 and `object-cover` then clipped it down both sides.
- **Case thumbnails** are purpose-made artwork from `Website Assets/Thumbnail/`, normalised
  to exactly 16:9 with the excess taken **off the right** — every one is left-aligned type
  with decoration on the right, so a centred crop clips the titles. Shown **without**
  greyscale or a scrim; they are already in the site's register.

### PUBLISHING CAUTIONS — read before adding any asset

**Third-party copyright — never publish.** `Website Assets/` also contains company annual
reports (Swiggy, Colgate, P&G, ION), six broker research notes (ICICI Securities, ICICI Pru
AMC, Muthoot, Tata), and the organisers' problem statements and rulebooks. These are study
material, not his work.

**A teammate's personal data.** The WhiteRock decks carry **both teammates' email addresses**
in a footer on every page — Mayuri Jalin's is not his to publish. Cover images are trimmed,
but **the PDFs themselves still contain it.** The stage photograph shows the closing slide
with both addresses; those two bands are blurred at build time via `REDACTIONS` in
`scripts/img.py`. `Mayuri Jalin.pdf` (her certificate) is excluded entirely.

**His own CV carries his phone number** and is offered as a public download. He has been
told twice; it is his call.

---

## 10. Environment Variables

Only one, and it is optional:

```
NEXT_PUBLIC_PAYMENT_URL=      # Razorpay Payment Page URL; empty ⇒ "Booking opens soon"
```

`.env.example` also lists `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` for a future
server-side flow. **Never rename a secret to `NEXT_PUBLIC_*`** — that prefix inlines the
value into the JavaScript every visitor downloads.

**The site builds and deploys with no environment variables set.**

### Payment research (verified 2026-09-02 — do not re-derive)

| Option | Verdict |
|---|---|
| Calendly free | Cannot collect payment (Standard feature); cannot redirect after booking. Fine as a **destination**. |
| Cal.com free | *Can* collect payment — but only Stripe/PayPal. |
| Stripe India | Needs registered business: GSTIN, business PAN, business-name bank account. **Not available to him.** |
| PayPal | Stopped domestic Indian payments in 2021. |
| **Razorpay** | Individual account needs only PAN + Aadhaar + matching bank account. ₹0 setup, ₹0 AMC, 2% + 18% GST ≈ **₹12 on ₹499**. Payment Pages are free, need no website, and support **"Redirect to your website"** after success. |

**Chosen flow:** Razorpay Payment Page (₹499) → redirect → Calendly (free) → Google Meet
(free on Calendly's free plan).

**Known limitation:** the Calendly link is unlisted, not locked — someone with the URL
could book without paying. Acceptable at this volume; ask for the payment ID in the booking
form. Locking it properly needs a server-side webhook flow.

---

## 11. Next Immediate Steps

1. **Get the live Vercel URL from him** and verify the production build in a real browser.
   Production differs from dev in fonts, image optimisation and compositing — exactly the
   areas that caused the reported glitch.
2. **Ask whether the scroll glitch is gone.** Unverifiable from here.
3. **Settle the Chapter I heading** (§6.1) — a one-line change.
4. **Decide on `434 VC` in Chapter IV** (§6.3).
5. When he supplies session length + refund/cancellation terms: **write the four legal
   pages**, link them in the footer, and hand him the URLs for Razorpay KYC.
6. Delete the merged `hero-background-and-tagline` branch, local and remote.

---

## 12. Commands / Testing

```bash
cd ~/Files/Work/Projects/Portfolio/harsh-aryan-portfolio

npm run dev            # http://localhost:3000
npm run build          # must pass before every commit
npx tsc --noEmit       # types
npx eslint .           # lint

./scripts/prepare-assets.sh                 # rebuild everything in public/
rm -rf .next/dev/cache/images               # ALWAYS after regenerating images
```

### Verifying motion — use Playwright, not the browser pane

```bash
npm run verify:open                          # opens a VISIBLE browser on :3000
npx @playwright/cli mousewheel 0 300         # real wheel events — Lenis needs these
npm run verify:shot                          # screenshot → .playwright-cli/
npx @playwright/cli eval "() => …"           # inspect computed styles / geometry
```

Programmatic `window.scrollTo` does **not** drive Lenis. Use `mousewheel`.

### Measuring contrast objectively

```bash
python3 scripts/contrast.py <shot.png> <top> <bottom> <left> <right>
```
Reports a WCAG ratio from real pixels. It caught hero text at **2.30:1** that looked
perfectly fine by eye (AA needs 4.5 body / 3.0 large).

### Dev-only escape hatch
`http://localhost:3000/?static=1` disables all motion and renders every section in its
final state. Gated behind `NODE_ENV === "development"`; it does not ship.

### Design skills
`.claude/skills/` holds five taste-skill skills (gitignored — they arrived with no licence
file, so they are not redistributed) plus `web-interface-guidelines`, which **is** committed
and is ours. Restore the others with `npx skills experimental_install`.

---

## 13. Roadmap

**Near term:** legal pages → Razorpay KYC → Payment Page → Calendly → flip
`NEXT_PUBLIC_PAYMENT_URL`.

**Content still missing:** AEGIS.os interface screenshots and launch video (Chapter IV has
no imagery for its anchor project); more Substack essays as he writes them.

**Possible later:** server-side Razorpay webhook issuing one-time booking links; a custom
domain; per-case detail pages if the case work outgrows the stack.

---

## 14. Advice for the Next Session

- **Read §7 first.** Most of the "bugs" in this project were tool artefacts or
  CSS-versus-GSAP collisions, and both classes are easy to re-encounter.
- **Verify with Playwright and measure with `contrast.py`.** This project has repeatedly
  looked fine and been objectively wrong. Do not trust a screenshot from the browser pane,
  and do not trust your eye on contrast.
- **Edit `content.ts`, not components,** for anything that is words.
- **Never claim more than his own CV claims.** "CFA Level II candidate" was once inferred
  and had to be removed. When his resume drops a skill (Python, R) or an achievement
  (Unsplash's 1.7M), drop it from the site too.
- **Check `Website Assets/` before every asset task** — he adds, removes and replaces files
  between sessions without saying so. Twice the site was serving generated copies of source
  files that no longer existed.
- **He is non-technical.** Anything he must do himself gets numbered click-by-click steps.
- **Flag rather than silently decide** on anything touching his identity, credentials, a
  teammate's data, or money.
