import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import Pending from "@/components/legal/Pending";
import { business, sessionTerms } from "@/data/legal";
import { mentoring } from "@/data/content";

export const metadata: Metadata = {
  title: "Pricing — Harsh Aryan",
  description:
    "One product, one price: a one-to-one mentoring session at ₹499, inclusive of all taxes.",
};

/**
 * Razorpay's website review asks for a page showing what is sold and at what
 * price. It is also the clearest way to satisfy the Consumer Protection
 * (E-Commerce) Rules' requirement that the total price a consumer pays — with
 * every component broken out — is shown before they commit.
 */
export default function Pricing() {
  return (
    <LegalPage
      slug="pricing"
      intro="There is one thing for sale on this site and one price for it. No tiers, no packages, no subscription, no upsell."
    >
      <h2>What is sold</h2>
      <dl>
        <div>
          <dt>Product</dt>
          <dd>One-to-one mentoring session (online)</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>
            {sessionTerms.currencySymbol}
            {sessionTerms.price} ({sessionTerms.currency})
          </dd>
        </div>
        <div>
          <dt>Taxes</dt>
          <dd>
            Inclusive.{" "}
            {business.gstRegistered
              ? "GST is charged at the applicable rate."
              : "Not GST-registered, so no GST is charged. This also means no GST invoice can be issued — if you need one for reimbursement, this is not the right purchase for you."}
          </dd>
        </div>
        <div>
          <dt>Other charges</dt>
          <dd>
            None. No booking fee, no platform fee, no payment-gateway surcharge passed on to
            you. {sessionTerms.currencySymbol}
            {sessionTerms.price} is the total amount you pay.
          </dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd>
            {sessionTerms.durationMinutes ?? (
              <Pending what="the session length in minutes — the one figure a buyer needs in order to judge whether the price is fair." />
            )}
          </dd>
        </div>
        <div>
          <dt>Delivered as</dt>
          <dd>{sessionTerms.delivery}</dd>
        </div>
        <div>
          <dt>Recurring?</dt>
          <dd>
            No. A single session, paid once. Nothing renews, and no payment details are
            stored for a future charge.
          </dd>
        </div>
      </dl>

      <h2>What the price includes</h2>
      <ul>
        {mentoring.covers.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <h2>What it does not include</h2>
      <ul>
        {mentoring.notFor.map((c) => (
          <li key={c}>{c}</li>
        ))}
        <li>
          Any work done between sessions — document review outside the call, ongoing
          correspondence, or a follow-up session.
        </li>
      </ul>
      <p>
        The limits above are firm ones, not sales copy. In particular no investment advice
        of any kind is given in a session; see the{" "}
        <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>Payment and refunds</h2>
      <p>
        Payment is taken by Razorpay on its own hosted page. Cancellation and refund terms
        are on the <Link href="/refunds">Cancellation &amp; Refund Policy</Link> page — in
        short, cancel more than {sessionTerms.freeCancellationHours} hours ahead and you get
        everything back.
      </p>

      <h2>Currently unavailable</h2>
      <p>
        Payments are not live yet, so nothing can be bought at the moment. The price on this
        page is the price that will apply when they are. If it changes before then, this
        page changes first.
      </p>
    </LegalPage>
  );
}
