import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import Pending from "@/components/legal/Pending";
import { business, sessionTerms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — Harsh Aryan",
  description:
    "When a mentoring session can be cancelled, rescheduled or refunded, and how long a refund takes.",
};

/**
 * Written to be generous rather than clever.
 *
 * At ₹499 and a handful of sessions, the cost of refunding someone who changed
 * their mind is trivial next to the cost of a payment dispute, a chargeback, or
 * a consumer-forum complaint. Every discretionary choice here is therefore made
 * in the customer's favour. Harsh should read it and can tighten it — but he
 * should understand that tightening it is what creates the arguments.
 */
export default function Refunds() {
  return (
    <LegalPage
      slug="refunds"
      intro="Cancel more than 24 hours before your session and you get all your money back, no questions asked. The rest of this page covers the less common cases."
    >
      <h2>Cancelling before the session</h2>
      <dl>
        <div>
          <dt>More than {sessionTerms.freeCancellationHours} hours before the start time</dt>
          <dd>
            Full refund of {sessionTerms.currencySymbol}
            {sessionTerms.price}. You do not have to give a reason.
          </dd>
        </div>
        <div>
          <dt>Less than {sessionTerms.freeCancellationHours} hours before the start time</dt>
          <dd>
            The slot was held for you and cannot realistically be filled, so no refund is
            due as of right. Ask anyway — if the circumstances warrant it, I would rather
            refund you than have you feel cheated.
          </dd>
        </div>
        <div>
          <dt>If I cancel, for any reason</dt>
          <dd>
            Full refund, or a rescheduled session at a time that suits you — your choice,
            not mine.
          </dd>
        </div>
      </dl>

      <h2>Rescheduling</h2>
      <p>
        You may reschedule {sessionTerms.rescheduleAllowance}. Rescheduling is free and
        does not use up your refund rights: if the new time also stops working, the
        cancellation terms above still apply to it.
      </p>

      <h2>If you do not turn up</h2>
      <p>
        If you do not join within 15 minutes of the start time and have not been in touch,
        the session counts as delivered and no refund is due. If something went wrong —
        your connection, a calendar mix-up, an emergency — email me the same day and I will
        reschedule you at no charge. I would rather have the conversation than keep{" "}
        {sessionTerms.currencySymbol}
        {sessionTerms.price} for a call that never happened.
      </p>

      <h2>If something goes wrong on my side</h2>
      <p>
        If I am late, if the call fails, or if the session is cut short for a reason within
        my control, you get either the missing time made up or a proportionate refund —
        again, your choice. If I simply do not show up, you get a full refund without
        having to ask twice.
      </p>

      <h2>After the session</h2>
      <p>
        Once a session has been delivered in full it is not refundable merely because the
        advice was not what you hoped to hear. What I sell is an honest hour of a
        student&rsquo;s experience, not a particular conclusion — and{" "}
        <Link href="/terms">clause 5 of the Terms</Link> is explicit that no outcome, job
        or exam result is promised.
      </p>
      <p>
        That said, if the session was not what was described on this site, tell me within 7
        days and I will refund it.
      </p>

      <h2>How to ask for a refund</h2>
      <p>
        Email <a href={`mailto:${business.email}`}>{business.email}</a> from the address you
        booked with, saying which session you mean. That is the whole process — there is no
        form and no ticket number.
      </p>
      <p>
        Receipt is acknowledged within {business.grievanceOfficer.acknowledgeWithin}.
        Approved refunds are sent back to the original payment method through Razorpay and
        normally reach you within {sessionTerms.refundProcessingDays}, though how quickly
        your bank or card issuer posts it is outside my control. Refunds are made in{" "}
        {sessionTerms.currency} to the original payment method only, and any bank charges on
        your side are yours.
      </p>

      <h2>If you are unhappy with the outcome</h2>
      <p>
        Escalate it to the Grievance Officer — details on the{" "}
        <Link href="/contact">Contact</Link> page — who will respond within{" "}
        {business.grievanceOfficer.resolveWithin}. If that still does not settle it,{" "}
        <strong className="font-normal text-fg">
          your rights under the Consumer Protection Act, 2019 are unaffected
        </strong>
        , including your right to complain to the consumer commission where you live, and
        to the National Consumer Helpline on 1915.
      </p>

      <h2>While payments are not live</h2>
      <p>
        Nothing can currently be bought on this site, so nothing can currently need
        refunding. This policy takes effect the day the payment link is switched on.
      </p>
      <p>
        {sessionTerms.schedulingWindow ?? (
          <Pending what="how soon after paying a session can normally be scheduled — a customer paying today needs to know whether that means this week or next month." />
        )}
      </p>
    </LegalPage>
  );
}
