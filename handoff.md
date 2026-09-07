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

5. **Mentoring is not live and cannot be** until he decides four things. The policies are
   now written and drafted conservatively in the customer's favour, but two numbers are
   still his:
   - **session length** — `legal.ts → sessionTerms.durationMinutes`, and
     `content.ts → mentoring.duration` which is still literally `"NEEDS INPUT"`;
   - **scheduling window** — how soon after paying a session can actually happen
     (`legal.ts → sessionTerms.schedulingWindow`).
   The refund window (24h), reschedule allowance and no-show rule are drafted and need
   only his sign-off. Run `npm run check:legal` for the live list.

6. **Legal pages now exist** — eight of them, at `/privacy`, `/terms`, `/refunds`,
   `/cookies`, `/disclaimer`, `/pricing`, `/delivery`, `/contact`. Razorpay's activation
   review asks for six (shipping, contact, pricing, terms, privacy, refunds); all six are
   covered. **Two business details still block activation**: a postal address and a phone
   number (`legal.ts → business.address` / `.phone`). Both render a visible dashed
   placeholder until he supplies them — deliberately, so an unfinished policy cannot ship
   quietly.

7. **`about.facts` no longer says "CFA Level II candidate".** His CV does say it, but CFA
   Institute's trademark guidance is explicit that passing Level I does *not* confer
   candidate status — only registering for Level II does — and that progress must be
   described factually. The site now says "Passed Level I of the CFA® Program (2026)",
   which is true either way. **If he is actually registered for Level II, the candidate
   line can go back.** Ask him. (This is the same claim §14 says was once inferred and
   removed; it came back via the CV rewrite.)

8. **The UDGAM equity research deck contains live-looking stock recommendations.**
   Twenty pages, roughly nine named listed Indian securities, each with a current market
   price and a target price ("CMP: INR 919 / TP: INR 1,300"), presented as a model fund
   with a SEBI-style risk-o-meter. It is genuine competition work and its own last page
   already says the author is not SEBI-registered and that it is an academic project —
   but the *website* said nothing, so a reader met the recommendations first and the
   caveat on page twenty if ever. Chapter III now carries a notice above the decks, the
   footer carries a one-line version, and `/disclaimer` carries the full text.
   **Still his decision:** whether to keep publishing a deck with price targets on named
   stocks at all while also selling a paid service. See "Legal & compliance" below.

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
5. ~~Write the four legal pages~~ — **done**, eight pages, linked from a footer that now
   appears on every route. Outstanding before Razorpay KYC: postal address, phone,
   session length, scheduling window. `npm run check:legal` lists them.
6. Delete the merged `hero-background-and-tagline` branch, local and remote.
7. **Ask him about the four decisions in §6.5–6.8** — they are the only things still
   blocking payments, and three of them touch his identity or his money, so they are not
   for an agent to decide.

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

## 15. Legal & Compliance — what was done, and what is still his

Added in the legal/accessibility pass. Read this before touching anything in
`src/app/*/page.tsx`, `src/data/legal.ts` or `public/docs/`.

### The pages
Eight, all static server components with no GSAP: `/privacy`, `/terms`, `/refunds`,
`/cookies`, `/disclaimer`, `/pricing`, `/delivery`, `/contact`. Content lives in
`src/data/legal.ts`; the shell is `src/components/legal/LegalPage.tsx`. `SiteFooter`
links all eight from every route, including the portfolio.

Razorpay's activation review asks for six pages — shipping, contact us, pricing, terms,
privacy, cancellation/refunds. `/delivery` is the "shipping policy" (there is nothing to
ship; saying so on a page is what gets the review past it).

### No cookie banner, and that is the correct answer
The site sets no cookies, loads no third-party script, embeds nothing, and self-hosts
Inter at build time through `next/font` — so no visitor request reaches Google Fonts,
which is the practice a German court found unlawful under the GDPR in 2022. With no
storage on the device and no tracking, nothing triggers consent under the ePrivacy
Directive, PECR or the DPDP Act. **A banner would be theatre.**

`npm run check:privacy` re-verifies this against the production build and fails on
third-party fonts, trackers, iframes, off-origin scripts or `document.cookie` writes.
**If that check ever fails, `/cookies` has become a false statement — fix the page or
revert the change.** Embedding Calendly rather than linking to it is the most likely way
to break it.

### The SEBI exposure — the biggest risk on this site
`udgam-iitg-equity-research.pdf` is 20 pages of equity research carrying CMP and target
prices for roughly nine named listed Indian securities, presented as a fund with a
SEBI-style risk-o-meter and a "Chief Investment Officer" title for a fund that does not
exist. It is real competition work, and its own last page says the author is not
SEBI-registered and that it is an academic project.

The website said none of that. Now: a notice above the decks in Chapter III, a line in
the footer on every page, and `/disclaimer` in full. **What is still his decision** is
whether to keep publishing price targets on named stocks at all while selling a paid
service — SEBI spent 2024–25 acting against exactly the "education" framing, and the
December 2025 Avadhut Sathe order is the one to read.

### Third-party personal data
- **Fixed.** A teammate's institute address `i24mayurij@iimidr.ac.in` was printed in a
  footer on 25 pages across five decks. Because the decks are rasterised it was invisible
  to text search and fully legible to readers. `scripts/redact-pdf.py` OCRs each page and
  destroys the pixels — it rewrites the embedded JPEG rather than drawing a box over it,
  so the address is not recoverable by extracting the image. Wired into
  `prepare-assets.sh` so regenerating cannot bring it back, with a `--check` pass at the
  end of the script.
- **Fixed.** `public/img/work/udgam-result.jpg` was an Unstop leaderboard screenshot
  carrying nine other competitors' names and institutions. Nothing referenced it, but
  anything in `public/` is served, so it was reachable at a public URL. Removed, and
  `img.py:work()` emptied so it is not regenerated.
- **Left alone, deliberately — his call, per §14.** His own mobile number in
  `harsh-aryan-cv.pdf`, and his institute address plus mobile inside the UDGAM deck's
  disclaimer page. The redaction script has an explicit allowlist so it never touches
  them.

### Claims corrected
- "CFA Level II candidate" → "Passed Level I of the CFA® Program" (see §6.7).
- "A Bloomberg Terminal costs about $24,000 a year" → "tens of thousands of dollars a
  year". The precise figure was unsourced and below Bloomberg's own published rate.
- UDGAM "National Finalist · Rank 1" → "Joint top score of 9.5". The result sheet shows
  **four teams tied at rank one**; "Rank 1" alone read as sole first place.
- The institution marquee now carries a label. Unlabelled it read as a logo wall, i.e.
  "these organisations endorse me" — one of them (Bloomberg) is a free online certificate.
- **No fake reviews or testimonials were found.** There are none on the site, and none
  should be added: a fabricated testimonial is a straightforward unfair trade practice
  under the Consumer Protection Act, 2019.

### Accessibility
- `--fg-faint` measured **3.00:1** against the background and is used for every eyebrow,
  caption, date and footer line on the site. Raised to 5.10:1. `npm run check:contrast`
  reads the tokens straight out of `globals.css` and fails on any pairing below AA.
- New `--line-strong` token at 3.22:1 for borders that are the only thing drawing the edge
  of a control (WCAG 1.4.11). `--line` stays soft for decorative rules.
- Anchor links moved focus nowhere: every `a[href^="#"]` is intercepted and
  `preventDefault()`ed so Lenis can own the scroll, which cancels the browser's own focus
  move. `SmoothScroll` now focuses the target explicitly. **This affected the skip link
  and the entire chapter index.**
- The skip link pointed at `#about`, an id that exists only on the portfolio — so on each
  legal page the first thing a keyboard user reached was a link to nothing. Now `#top`,
  which every route defines.
- "Booking opens soon" was a `<div>` dressed as a button: it looked like a control and was
  invisible to assistive technology. Now a real `<button disabled>`.
- "Back to start" pointed at `href="#"`, which `SmoothScroll` explicitly ignores. Gone
  with the old footer.
- The institution marquee ran forever regardless of `prefers-reduced-motion` — the one
  piece of motion ignoring ADR-6 — and painted four copies of the list, so a screen reader
  read every institution four times. Now `aria-hidden` with one real list beside it, and
  static under reduced motion.
- `IncomeQualityChart` encoded average and median as two dots with neither number in text.
  A visually-hidden data table now carries the same figures.

**Known gap, honestly:** WCAG 2.2.2 (Pause, Stop, Hide) wants an on-page control to stop
moving content, not only an OS setting. The marquee honours `prefers-reduced-motion` but
has no visible pause button, because one would be out of register with the design. Adding
it is a small change if he wants strict conformance.

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
