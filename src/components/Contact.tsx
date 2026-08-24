"use client";

import ChapterHead from "./ChapterHead";
import { useGsapContext, gsap, EASE, countUp, formatCount } from "@/lib/motion";
import { contact, site, chapterMeta } from "@/data/content";

export default function Contact() {
  const { numeral, label } = chapterMeta("contact");
  const scope = useGsapContext(({ self }) => {
    self.querySelectorAll<HTMLElement>("[data-stat]").forEach((el) => {
      countUp(el, Number(el.dataset.stat), {
        decimals: Number(el.dataset.decimals ?? 0),
        suffix: el.dataset.suffix ?? "",
      });
    });

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

        {/* Counters */}
        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 border-y border-[var(--line-soft)] py-14 lg:mt-24 lg:grid-cols-4">
          {contact.stats.map((s) => (
            <div key={s.label}>
              <dd
                className="mono text-[clamp(2.25rem,4.6vw,4rem)] font-extralight leading-none"
                data-stat={s.value}
                data-suffix={s.suffix}
                data-decimals={"decimals" in s ? s.decimals : 0}
              >
                {formatCount(s.value, "decimals" in s ? s.decimals : 0, s.suffix)}
              </dd>
              <dt className="mt-4 text-xs leading-snug text-fg-faint">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="c-grid mt-20 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <div data-c className="eyebrow mb-6">Get in touch</div>
            <a
              data-c
              href={`mailto:${site.email}`}
              className="block text-[clamp(1.25rem,3.2vw,2.5rem)] font-extralight tracking-[-0.02em] transition-opacity duration-500 hover:opacity-65"
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
                    <span className="text-base font-light">{s.label}</span>
                    <span className="text-fg-faint transition-transform duration-500 group-hover:translate-x-1">
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

      <footer className="mt-24 border-t border-[var(--line-soft)]">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-8">
          <span className="text-[0.625rem] tracking-[0.16em] uppercase text-fg-faint">
            © {new Date().getFullYear()} {site.name}
          </span>
          <a
            href="#"
            className="text-[0.625rem] tracking-[0.16em] uppercase text-fg-faint transition-colors duration-500 hover:text-fg"
          >
            Back to start
          </a>
        </div>
      </footer>
    </section>
  );
}
