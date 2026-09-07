"use client";

import Link from "next/link";
import ChapterHead from "./ChapterHead";
import { useGsapContext, gsap, EASE } from "@/lib/motion";
import { mentoring, chapterMeta } from "@/data/content";

/**
 * The paid section.
 *
 * Payment comes FIRST, then booking. Calendly's free plan cannot collect money
 * (payments are a Standard-plan feature) and Cal.com's free plan can, but only
 * through Stripe or PayPal — Stripe India needs a registered business with
 * GSTIN, and PayPal stopped domestic Indian payments in 2021. So the button
 * points at a Razorpay Payment Page, which is free to run and settles to an
 * individual's bank account; Razorpay then redirects to the booking link.
 *
 * Until that page exists, this deliberately renders no pay control at all. A
 * button that looks like it takes money but cannot is worse than saying
 * booking opens soon.
 */
const paymentUrl = process.env.NEXT_PUBLIC_PAYMENT_URL ?? "";

export default function Mentoring() {
  const { numeral, label } = chapterMeta("mentoring");
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
          numeral={numeral}
          label={label}
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

              {paymentUrl ? (
                <>
                  {/* The label says the amount and both things that happen, so it
                      still makes sense read on its own out of context — which is
                      how a screen reader's list of links presents it. */}
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-describedby="pay-consent"
                    className="block w-full rounded-full bg-white px-6 py-4 text-center text-[0.625rem] font-medium tracking-[0.18em] uppercase text-black transition-opacity duration-500 hover:opacity-85"
                  >
                    Pay ₹{mentoring.price} and book a session
                    <span className="sr-only"> (opens Razorpay in a new tab)</span>
                  </a>

                  {/* Consent, at the point of collection rather than buried in a
                      policy page. This is the only place on the site where a
                      visitor hands over personal data, so it is the only place
                      the notice belongs. */}
                  <p id="pay-consent" className="mt-4 text-xs leading-relaxed text-fg-faint">
                    Paying takes you to Razorpay, then to a scheduling page. Your name and
                    email are used only to arrange and deliver the session — card details
                    are entered on Razorpay and are never seen or stored here. By booking
                    you agree to the <Link href="/terms" className="underline underline-offset-4 hover:text-fg">Terms</Link>,{" "}
                    the <Link href="/refunds" className="underline underline-offset-4 hover:text-fg">Refund Policy</Link>{" "}
                    and the <Link href="/privacy" className="underline underline-offset-4 hover:text-fg">Privacy Policy</Link>.
                  </p>
                </>
              ) : (
                <div>
                  {/* A real disabled button, not a div dressed as one. As a div it
                      looked like a control to a sighted reader while being
                      invisible to assistive technology, which had no way to learn
                      that booking exists but is switched off. */}
                  <button
                    type="button"
                    disabled
                    aria-describedby="booking-status"
                    className="w-full cursor-not-allowed rounded-full border border-[var(--line-soft)] px-6 py-4 text-center text-[0.625rem] font-medium tracking-[0.18em] uppercase text-fg-faint"
                  >
                    Booking opens soon
                  </button>
                  <p id="booking-status" className="mt-4 text-center text-xs leading-relaxed text-fg-faint">
                    Payments aren&rsquo;t live yet, so nothing can be bought here today. In
                    the meantime, reach me at{" "}
                    <a href="#contact" className="underline underline-offset-4 hover:text-fg">
                      the contact section
                    </a>
                    .
                  </p>
                </div>
              )}

              <p className="mt-8 text-xs leading-relaxed text-fg-faint">
                {mentoring.disclaimer}{" "}
                <Link href="/disclaimer" className="underline underline-offset-4 hover:text-fg">
                  Read the full disclaimer
                </Link>
                .
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--line-soft)] pt-6 text-[0.625rem] tracking-[0.16em] uppercase text-fg-faint">
                {[
                  { href: "/pricing", label: "Pricing" },
                  { href: "/refunds", label: "Refunds" },
                  { href: "/terms", label: "Terms" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="underline decoration-[var(--line-strong)] underline-offset-4 transition-colors duration-500 hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
