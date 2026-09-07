"use client";

import Image from "next/image";
import Link from "next/link";
import ChapterHead from "./ChapterHead";
import ScrollStack, { ScrollStackItem } from "./reactbits/ScrollStack";
import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { competitions, chapterMeta } from "@/data/content";

export default function Competitions() {
  const { numeral, label } = chapterMeta("competitions");
  const scope = useGsapContext(({ self }) => {
    // The cards themselves are driven by ScrollStack, which owns their
    // `transform` and `filter` outright — animating the same card here would
    // mean two writers fighting over one property every frame. Only the
    // contents get a reveal, and only on the way in.
    self.querySelectorAll<HTMLElement>(".case-row").forEach((row) => {
      gsap.from(row.querySelectorAll(".case-body > *"), {
        y: 22,
        opacity: 0,
        duration: 0.9,
        ease: EASE,
        stagger: 0.06,
        scrollTrigger: { trigger: row, start: "top 88%" },
      });
    });

    // Photo strip drifts sideways as the page scrolls past it.
    const strip = self.querySelector<HTMLElement>(".photo-strip");
    if (strip) {
      gsap.fromTo(
        strip,
        { x: 0 },
        {
          // Never negative: with few enough photos the strip is narrower than
          // the viewport, and a negative distance would drift it rightwards
          // off the screen instead of holding still.
          x: () => -Math.max(0, strip.scrollWidth - window.innerWidth * 0.92),
          ease: "none",
          scrollTrigger: {
            trigger: strip.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        }
      );
    }
  });

  return (
    <section
      id="competitions"
      ref={scope as React.RefObject<HTMLElement>}
      className="chapter"
    >
      <div className="shell">
        <ChapterHead
          numeral={numeral}
          label={label}
          title={competitions.title}
          standfirst={competitions.standfirst}
        />

        {/* The notice sits BEFORE the decks, not after them and not only in the
            footer.

            Several of these entries contain named listed companies with market
            prices, target prices and portfolio weightings, because that is what
            the competition briefs asked for. Published unqualified on a site
            that also sells a paid service, that reads like investment
            recommendations from an unregistered person — the exact pattern SEBI
            has been acting against. The decks' own last pages already say they
            are academic and that the author is not SEBI-registered; the problem
            was that a reader met the recommendation first and the caveat on page
            twenty, if at all. */}
        <aside
          aria-labelledby="case-work-notice"
          className="mt-14 max-w-[68ch] border-l-2 border-[var(--accent)] pl-6"
        >
          <h3 id="case-work-notice" className="eyebrow mb-3">
            Before you open these
          </h3>
          <p className="text-sm font-light leading-relaxed text-fg-muted">
            These are student competition entries, written to a brief and a deadline and
            never updated since. Some contain company names, share prices and price targets
            — all of them calculated on the date of submission and stale ever since.{" "}
            <strong className="font-normal text-fg">
              None of it is investment advice or a recommendation
            </strong>
            , and I am not registered with SEBI in any capacity.{" "}
            <Link
              href="/disclaimer"
              className="underline decoration-[var(--line-strong)] underline-offset-4 transition-colors duration-500 hover:text-[var(--accent)]"
            >
              Full disclaimer
            </Link>
            .
          </p>
        </aside>

        {/* The five cases pin one behind another and stack, each settling a
            little smaller and softer than the one in front. */}
        <ScrollStack itemDistance={110} itemStackDistance={22} baseScale={0.88}>
          {competitions.items.map((item) => (
            <ScrollStackItem
              key={item.slug}
              // Solid background rather than backdrop-blur: each card already
              // carries a filter: blur() for stack depth, and compositing five
              // backdrop-filters underneath that drops frames while scrolling.
              className="case-row grid items-center gap-8 border border-[var(--line-soft)] bg-[#101010] p-6 lg:grid-cols-12 lg:gap-14 lg:p-10"
            >
              <div className="lg:col-span-7">
                <a
                  href={item.doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-frame group relative block aspect-[16/9] overflow-hidden bg-bg-raised"
                  aria-label={`Open the ${item.event} deck (PDF, ${item.pages} pages, opens in a new tab)`}
                >
                  <Image
                    src={item.cover}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    /* No greyscale and no scrim: unlike the PDF page-one covers
                       these are purpose-made dark artwork already in the site's
                       register, and desaturating them throws away the one thing
                       that distinguishes each competition. */
                    className="case-img object-cover transition-transform duration-[1.2s] ease-[var(--ease)] group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-4 right-4 rounded-full border border-white/40 bg-black/70 px-3.5 py-1.5 text-[0.5625rem] tracking-[0.18em] uppercase">
                    View deck · {item.pages}pp
                  </span>
                </a>
              </div>

              <div className="case-body lg:col-span-5">
                <div className="eyebrow mb-3">{item.host}</div>
                <h3 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-extralight leading-tight tracking-[-0.02em]">
                  {item.event}
                </h3>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-sm font-normal">{item.result}</span>
                  <span className="text-xs text-fg-faint">{item.date}</span>
                </div>
                <div className="mt-1 text-xs text-fg-faint">{item.resultNote}</div>

                <p className="body mt-6">{item.summary}</p>

                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                  <a
                    href={item.doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-line pb-1 text-[0.6875rem] tracking-[0.16em] uppercase transition-colors duration-500 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Open deck
                    <span className="sr-only">
                      {" "}
                      for {item.event} (PDF, {item.pages} pages, opens in a new tab)
                    </span>
                  </a>
                  {"extraDoc" in item && item.extraDoc && (
                    <a
                      href={item.extraDoc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-line pb-1 text-[0.6875rem] tracking-[0.16em] uppercase text-fg-muted transition-colors duration-500 hover:border-white hover:text-fg"
                    >
                      {item.extraDoc.label}
                      <span className="sr-only"> (PDF, opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      {/* Full-bleed photo strip */}
      <div className="bleed mt-24 overflow-hidden lg:mt-32">
        <div className="photo-strip flex w-max gap-4">
          {competitions.photos.map((p) => (
            <figure key={p.src} className="relative w-[78vw] shrink-0 sm:w-[52vw] lg:w-[40vw]">
              <div className="relative aspect-[4/3] overflow-hidden bg-bg-raised">
                <Image
                  src={p.src}
                  alt={p.caption}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 40vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[0.5625rem] tracking-[0.18em] uppercase text-fg-faint">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
