# Harsh Aryan — portfolio

A single-page portfolio built in the style of [nabilissa.com](https://nabilissa.com): one long
scroll broken into chapters, near-black and white only, with scroll-driven motion.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis

---

## Running it

```bash
npm run dev
```

Then open http://localhost:3000.

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run check:legal` | Lists the business/policy details still missing from `src/data/legal.ts` |
| `npm run check:contrast` | Measures the design tokens against WCAG 2.2 AA |
| `npm run check:privacy` | Confirms the built site still matches what `/cookies` promises (run after `build`) |
| `npm run check:pii` | Confirms no published PDF carries someone else's email address |
| `./scripts/prepare-assets.sh` | Rebuild everything in `public/` from the source assets |

### `?static=1`

In development only, adding `?static=1` to the URL disables all motion and renders every
section in its final state. Useful for checking layout, and necessary in automated browsers,
which run pages hidden — that suspends `requestAnimationFrame`, and both GSAP and Lenis are
driven by it, so without this the page looks blank in screenshots.

---

## Where the content lives

Almost everything is in **`src/data/content.ts`** — headings, body copy, the competition list,
project descriptions, CV entries, the mentoring offer. Edit that file rather than the
components.

Everything legal and commercial is in **`src/data/legal.ts`** — the business details, the
grievance officer, the session's price and terms, and the list of third parties that will
receive customer data once payments go live.

Both files follow the same rule: **anything still awaiting Harsh's decision is left empty
rather than filled with plausible text.** In `content.ts` that is the string `NEEDS INPUT`;
in `legal.ts` it is `null`, and the page renders a conspicuous dashed placeholder wherever
one appears. `npm run check:legal` lists what is outstanding and what each item blocks.

---

## Legal and compliance

The site has eight policy pages at `/privacy`, `/terms`, `/refunds`, `/cookies`,
`/disclaimer`, `/pricing`, `/delivery` and `/contact`, linked from a footer on every route.
Three things about them are worth knowing before editing anything:

**There is no cookie banner because there are no cookies.** The build sets none, loads no
third-party script, embeds nothing, and self-hosts Inter at build time via `next/font`, so
no visitor request ever reaches Google. `/cookies` states this to every reader as a fact.
`npm run check:privacy` re-checks it against the production output and fails if an
analytics package, an embed or an off-origin script appears — because at that point the
published policy would be a false statement about how personal data is handled, and a
consent mechanism would probably be required.

**`/disclaimer` is load-bearing, not boilerplate.** The competition decks contain named
listed companies with market prices and price targets. Published beside a paid service by
someone not registered with SEBI, that needs the caveat in front of the work rather than on
page twenty of a PDF. Chapter III carries a notice above the decks and the footer carries a
one-line version.

**Published PDFs are checked for other people's contact details.**
`scripts/redact-pdf.py` finds email addresses — by OCR where a page is a flat image, which
is how five of the decks are built — and destroys the pixels of any address that is not
Harsh's own. It runs inside `prepare-assets.sh`, and again in `--check` mode at the end of
it, so regenerating the assets cannot quietly republish a teammate's address. His own
details are deliberately left alone; that is his call to make.

Anything still awaiting a decision is marked `NEEDS INPUT` in that file.

Two files are generated from Harsh's actual workbooks by `scripts/extract-data.py` and should
not be hand-edited:

- `src/data/income-quality.json` — NP/CFO by company, FY2014–FY2025
- `src/data/monte-carlo.json` — 10,000 simulated outcomes, binned for the histogram

---

## Assets

`scripts/prepare-assets.sh` reads from `../Website Assets/` and writes into `public/`. It is
safe to re-run.

It does three things worth knowing about:

1. **Only Harsh's own work is published.** The source folder also holds company annual reports,
   broker research notes, organisers' problem statements and rulebooks, and a teammate's
   certificate. Republishing those would be copyright infringement, so they are excluded by
   omission — the script copies an explicit list, it does not sweep a directory.

2. **The design decks are rasterised.** The Canva exports are 17–28 MB each; rebuilding them
   from page renders cuts ~90% with no visible loss. Deliberately *not* rasterised:
   `harsh-aryan-cv.pdf` (must stay selectable text for applicant tracking systems), the
   two-page handout, and the UDGAM research report (dense text, and flattening saved only 16%).

3. **Deck covers are rendered via CoreGraphics**, not `qlmanage -t`, which silently caps
   thumbnails around 435px regardless of the size flag and leaves covers visibly soft.

Requires macOS (CoreGraphics) plus `pyobjc-framework-Quartz`, `openpyxl`, `pandas` and
`Pillow` in the Python on `PATH`.

---

## Mentoring & payments

The mentoring section renders a price but **no live pay button**, because the gateway is not
connected yet. A control that looks like it takes money but cannot is worse than saying
booking opens soon.

To switch it on, set both of these and redeploy:

```
NEXT_PUBLIC_BOOKING_LIVE=true
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/<your-link>
```

Razorpay keys must **never** go in a `NEXT_PUBLIC_*` variable — anything with that prefix is
compiled into the JavaScript sent to every visitor. Order creation and signature verification
belong in a server route.

Razorpay also will not activate an account until the site publishes Terms, a Privacy Policy, a
Refund/Cancellation Policy and a contact route. Those pages are not written yet.

---

## Accessibility notes

- Reduced motion is respected: the GSAP layer never starts, and counters render their real
  values in the HTML rather than counting up from zero.
- The chapter index uses IntersectionObserver, not ScrollTrigger, so navigation keeps working
  when motion is off.
- `html.no-js` reveals all animated content if JavaScript fails.
