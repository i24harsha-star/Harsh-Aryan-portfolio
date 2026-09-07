"use client";

import ChapterHead from "./ChapterHead";
import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { contact, site, chapterMeta } from "@/data/content";

export default function Contact() {
  const { numeral, label } = chapterMeta("contact");
  const scope = useGsapContext(({ self }) => {
    gsap.from(self.querySelectorAll<HTMLElement>("[data-c]"), {
      y: 24,
      opacity: 0,
      duration: 1,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: self.querySelector(".c-grid"), start: "top 82%" },
    });
  });

  return (
    <section
      id="contact"
      ref={scope as React.RefObject<HTMLElement>}
      className="chapter pb-0"
    >
      <div className="shell">
        <ChapterHead numeral={numeral}
          label={label} title={contact.title} />

        <div className="c-grid mt-16 grid lg:mt-24 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <div data-c className="eyebrow mb-6">Get in touch</div>
            <a
              data-c
              href={`mailto:${site.email}`}
              /* Hover shifts colour, not opacity. GSAP animates opacity on this
                 element via [data-c]; a CSS transition on the same property
                 fought it and left the address stuck at opacity 0. */
              className="block text-[clamp(1.25rem,3.2vw,2.5rem)] font-extralight tracking-[-0.02em] transition-colors duration-500 hover:text-[var(--accent)]"
            >
              {site.email}
            </a>
            <p data-c className="body mt-8 max-w-[42ch]">
              Open to conversations about markets, research and building things — and to
              anyone earlier in the journey who wants a straight answer.
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div data-c className="eyebrow mb-6">Elsewhere</div>
            <ul className="space-y-1">
              {site.socials.map((s) => (
                <li key={s.label} data-c>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between border-b border-[var(--line-soft)] py-4 transition-colors duration-500 hover:border-white"
                  >
                    <span className="text-base font-light">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    {/* The arrow is the visual cue for the same thing the
                        sr-only text says, so it must not be announced twice. */}
                    <span
                      aria-hidden="true"
                      className="text-fg-faint transition-transform duration-500 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div data-c className="mt-10">
              <div className="eyebrow mb-3">Based in</div>
              <p className="text-sm text-fg-muted">{site.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* The footer used to live here. It moved to <SiteFooter /> in page.tsx:
          nested inside this <section> it was the section's footer rather than
          the page's, and its "Back to start" link pointed at href="#" — which
          SmoothScroll explicitly ignores, so it went nowhere at all. */}
    </section>
  );
}
