import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import Pending from "@/components/legal/Pending";
import { sessionTerms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Service Delivery — Harsh Aryan",
  description:
    "Nothing physical is shipped. How and when an online mentoring session is delivered after payment.",
};

/**
 * Razorpay's activation checklist asks every merchant for a "shipping policy",
 * which is written for people posting parcels. Answering "not applicable" on
 * the form and having no page tends to stall the review, so this page exists
 * and says plainly that there is nothing to ship and what happens instead.
 */
export default function Delivery() {
  return (
    <LegalPage
      slug="delivery"
      intro="Nothing is shipped, posted or couriered. The only thing sold here is a conversation, and it is delivered over a video call."
    >
      <h2>No physical goods</h2>
      <p>
        This site sells no physical products. There is no packaging, no courier, no
        tracking number, no delivery charge and no delivery address. Any shipping-related
        question on a payment form should be read as &ldquo;not applicable&rdquo; for this
        business.
      </p>

      <h2>What is delivered instead</h2>
      <p>
        A one-to-one mentoring session, delivered as {sessionTerms.delivery.toLowerCase()}.
        The joining link is what you receive; it arrives by email once your slot is
        confirmed.
      </p>

      <h2>How it works, step by step</h2>
      <ol>
        <li>
          You pay {sessionTerms.currencySymbol}
          {sessionTerms.price} on Razorpay&rsquo;s hosted payment page.
        </li>
        <li>
          Razorpay sends you straight to a scheduling page, where you choose a slot that
          suits you.
        </li>
        <li>
          You get a confirmation email with the date, the time and the video call link.
        </li>
        <li>You join at that time, and we talk.</li>
      </ol>
      <p>
        <strong className="font-normal text-fg">
          Your booking is only complete once you have chosen a slot
        </strong>{" "}
        — paying alone does not book anything. If you pay and then close the page before
        scheduling, email me and I will send you the scheduling link directly; you will not
        lose your money.
      </p>

      <h2>How soon</h2>
      <p>
        The confirmation email is automatic and should reach you within minutes. As for the
        session itself:
      </p>
      <p>
        {sessionTerms.schedulingWindow ?? (
          <Pending what="the realistic wait between paying and the earliest available slot. This is a delivery timeframe: a buyer is entitled to know it before paying, and Razorpay's review will look for it." />
        )}
      </p>

      <h2>If delivery fails</h2>
      <p>
        If the confirmation email does not arrive, check your spam folder first, then email
        me. If the call itself fails for a reason on my side, the{" "}
        <Link href="/refunds">Cancellation &amp; Refund Policy</Link> gives you either the
        time made up or your money back — your choice.
      </p>

      <h2>Where sessions are available</h2>
      <p>
        Anywhere with a working internet connection. Sessions are scheduled in Indian
        Standard Time (IST, UTC+5:30); the scheduling page will show you the equivalent in
        your own time zone before you confirm.
      </p>
    </LegalPage>
  );
}
