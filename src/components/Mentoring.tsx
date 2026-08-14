"use client";

import ChapterHead from "./ChapterHead";
import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { mentoring } from "@/data/content";

/**
 * The paid section.
 *
 * The payment gateway is not connected yet, so this deliberately does NOT render
 * a live "Pay ₹499" button. Showing a pay control that cannot take money — or
 * that silently does nothing — is worse than saying booking opens soon. Flip
 * NEXT_PUBLIC_BOOKING_LIVE to "true" once Razorpay keys and a Calendly link are
 * in place, and the real call to action renders instead.
 */
const bookingLive = process.env.NEXT_PUBLIC_BOOKING_LIVE === "true";
const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

export default function Mentoring() {
  const scope = useGsapContext(({ self }) => {
    gsap.from(self.querySelectorAll<HTMLElement>("[data-m]"), {
      y: 26,
      opacity: 0,
      duration: 1,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: self.querySelector(".m-grid"), start: "top 80%" },
    });

    const price = self.querySelector<HTMLElement>(".m-price");
    if (price) {
      gsap.from(price, {
        scale: 0.88,
        opacity: 0,
        duration: 1.2,
        ease: EASE,
        scrollTrigger: { trigger: price, start: "top 86%" },
      });
    }
  });

  return (
    <section
      id="mentoring"
      ref={scope as React.RefObject<HTMLElement>}
      className="chapter"
    >
      <div className="shell">
        <ChapterHead
          numeral="V"
          label="Mentoring"
          title={mentoring.title}
          standfirst={mentoring.standfirst}
        />

        <div className="m-grid mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div data-m>
              <div className="eyebrow mb-5">What we can cover</div>
              <ul className="space-y-3.5">
                {mentoring.covers.map((c) => (
                  <li key={c} className="flex gap-4 text-[clamp(0.9375rem,1.15vw,1.0625rem)] font-light leading-relaxed">
                    <span className="mt-2.5 size-1 shrink-0 rounded-full bg-white/55" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div data-m className="mt-12 border-t border-[var(--line-soft)] pt-9">
              <div className="eyebrow mb-5">What this isn&rsquo;t</div>
              <ul className="space-y-2.5">
                {mentoring.notFor.map((c) => (
                  <li key={c} className="text-sm font-light text-fg-faint">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price card */}
          <div className="lg:col-span-5">
            <div className="m-price border border-line p-9 sm:p-11">
              <div className="eyebrow mb-6">One-to-one session</div>

              <div className="flex items-baseline gap-2">
                <span className="mono text-[clamp(3rem,6vw,4.75rem)] font-extralight leading-none">
                  ₹{mentoring.price}
                </span>
                <span className="text-sm text-fg-faint">per session</span>
              </div>

              <hr className="rule my-8" />

              {bookingLive && calendly ? (
                <a
                  href={calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full bg-white px-6 py-4 text-center text-[0.625rem] font-medium tracking-[0.18em] uppercase text-black transition-opacity duration-500 hover:opacity-85"
                >
                  Book a session
                </a>
              ) : (
                <div>
                  <div className="w-full cursor-not-allowed rounded-full border border-[var(--line-soft)] px-6 py-4 text-center text-[0.625rem] font-medium tracking-[0.18em] uppercase text-fg-faint">
                    Booking opens soon
                  </div>
                  <p className="mt-4 text-center text-xs leading-relaxed text-fg-faint">
                    Payments aren&rsquo;t live yet. In the meantime, reach me at{" "}
                    <a href="#contact" className="underline underline-offset-4 hover:text-fg">
                      the contact section
                    </a>
                    .
                  </p>
                </div>
              )}

              <p className="mt-8 text-xs leading-relaxed text-fg-faint">
                {mentoring.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
