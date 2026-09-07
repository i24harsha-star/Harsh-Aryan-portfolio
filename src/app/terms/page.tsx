import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import Pending from "@/components/legal/Pending";
import { business, sessionTerms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — Harsh Aryan",
  description:
    "The terms on which this website is provided and one-to-one mentoring sessions are sold.",
};

export default function Terms() {
  return (
    <LegalPage
      slug="terms"
      intro="These terms cover two different things: reading this website, which is free and asks nothing of you, and buying a mentoring session, which is a contract."
    >
      <h2>1. Who you are dealing with</h2>
      <p>
        This site is operated by {business.legalName}, an individual based in{" "}
        {business.city}, {business.state}, {business.country}, trading in his own name.{" "}
        <strong className="font-normal text-fg">
          This is not a company, a firm, a registered investment adviser or a research
          entity
        </strong>
        , and nothing here should be read as the output of one.
      </p>
      <dl>
        <div>
          <dt>Legal name</dt>
          <dd>{business.legalName}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{business.entityType}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>
            {business.address ?? (
              <Pending what="the place-of-business address required of an online seller under the Consumer Protection (E-Commerce) Rules, 2020." />
            )}
          </dd>
        </div>
      </dl>

      <h2>2. What this website is</h2>
      <p>
        A personal portfolio. It shows academic work, case competition entries, personal
        projects and writing, and it advertises a paid mentoring session. It is a record of
        what one student has done. It is not a financial service, not a research service,
        and not a source of recommendations — see the{" "}
        <Link href="/disclaimer">Disclaimer</Link>, which is part of these terms.
      </p>

      <h2>3. Using the site</h2>
      <p>You may read it, share links to it, and download the documents it offers. You may not:</p>
      <ul>
        <li>
          republish the documents, decks, models or writing as your own, or strip the
          author&rsquo;s name from them;
        </li>
        <li>
          use anything here as the basis of an investment decision, or present it to anyone
          else as research or advice;
        </li>
        <li>
          scrape the site for personal data, or use the contact address for unsolicited
          marketing;
        </li>
        <li>attempt to disrupt, overload or gain unauthorised access to the site.</li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        The text, layout, code, charts and original documents on this site are the
        author&rsquo;s own work and remain his. Case competition entries were produced for
        the competitions named and are shown as a record of participation.
      </p>
      <p>
        Some work was produced in teams; those documents are shown with the team&rsquo;s
        branding intact and remain the joint work of their authors. Company names, logos,
        exchange tickers, institution names and certification marks — including{" "}
        <span className="whitespace-nowrap">CFA®</span>, Bloomberg, and the names of the
        institutes at whose events this work was presented — belong to their respective
        owners and appear here descriptively, to identify what the work was about or where
        it was done. Their appearance is not a claim of affiliation, sponsorship,
        endorsement or approval by any of them.
      </p>
      <p>
        If you own rights in anything reproduced here and want it removed, email{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a> and it will be taken down
        while the claim is looked at.
      </p>

      <h2>5. Mentoring sessions</h2>
      <p>
        A session is a one-to-one conversation about studying for and applying to finance
        roles. Booking one creates a contract between you and {business.legalName} on these
        terms.
      </p>
      <dl>
        <div>
          <dt>Price</dt>
          <dd>
            {sessionTerms.currencySymbol}
            {sessionTerms.price} per session, inclusive of all taxes.{" "}
            {business.gstRegistered
              ? ""
              : "Not GST-registered, so no GST is charged and no tax invoice can be issued."}
          </dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd>
            {sessionTerms.durationMinutes ?? (
              <Pending what="the session length, in minutes. A customer cannot agree to buy a session of unstated duration, so this must be set before payments are switched on." />
            )}
          </dd>
        </div>
        <div>
          <dt>Delivered as</dt>
          <dd>{sessionTerms.delivery}</dd>
        </div>
      </dl>

      <h3>What is promised</h3>
      <p>
        That I turn up on time, prepared, for the length of session you paid for, and give
        you my honest opinion based on my own experience.
      </p>

      <h3>What is not promised</h3>
      <ul>
        <li>
          <strong className="font-normal text-fg">No job, internship, interview,
          referral or placement</strong>, and no influence over any recruiter, firm or
          institution. Nobody can sell you that, and anyone offering it is misleading you.
        </li>
        <li>
          <strong className="font-normal text-fg">No investment, trading, tax or legal
          advice</strong>, and no recommendation on any specific security, fund or
          strategy. This is a hard limit, not a formality: see the{" "}
          <Link href="/disclaimer">Disclaimer</Link>.
        </li>
        <li>
          <strong className="font-normal text-fg">No exam result.</strong> Nothing said in
          a session guarantees you will pass anything.
        </li>
        <li>No ongoing mentorship, availability between sessions, or guaranteed reply times.</li>
      </ul>

      <h3>Your side of it</h3>
      <p>
        Give accurate information when booking, join at the time you booked, and treat the
        session as confidential in both directions — I will not repeat what you tell me,
        and I ask you not to record or republish the session without my agreement.
      </p>
      <p>
        Sessions are for people aged 18 or over. I may decline or cancel a booking and
        refund it in full if the request falls outside what I can honestly help with, or if
        a session becomes abusive.
      </p>

      <h2>6. Payment</h2>
      <p>
        Payment is taken through Razorpay on Razorpay&rsquo;s own hosted page. I never see
        or store your card, UPI or bank details. A booking is confirmed when payment
        succeeds and you have a scheduled slot — not when payment alone succeeds.
      </p>

      <h2>7. Cancellations and refunds</h2>
      <p>
        Set out in full in the{" "}
        <Link href="/refunds">Cancellation &amp; Refund Policy</Link>, which forms part of
        these terms.
      </p>

      <h2>8. Liability</h2>
      <p>
        The site and its documents are provided as they are, without warranty that they are
        accurate, current or fit for any particular purpose. Career and study decisions you
        take after a session are yours.
      </p>
      <p>
        Where liability can lawfully be limited, my total liability arising from a session
        or from your use of this site is limited to the amount you actually paid — that is,{" "}
        {sessionTerms.currencySymbol}
        {sessionTerms.price}. I am not liable for indirect or consequential loss, including
        lost opportunities, lost earnings or investment losses.
      </p>
      <p>
        Nothing in these terms limits liability for fraud, for death or personal injury
        caused by negligence, or for anything else that cannot lawfully be limited.{" "}
        <strong className="font-normal text-fg">
          Your rights as a consumer under the Consumer Protection Act, 2019 are not
          affected by anything written here
        </strong>
        , including your right to bring a complaint before the consumer commission where
        you live.
      </p>

      <h2>9. Complaints</h2>
      <p>
        Email <a href={`mailto:${business.email}`}>{business.email}</a>, marked for the
        attention of the Grievance Officer. Receipt is acknowledged within{" "}
        {business.grievanceOfficer.acknowledgeWithin} and complaints are resolved within{" "}
        {business.grievanceOfficer.resolveWithin}, as required by the Consumer Protection
        (E-Commerce) Rules, 2020. Full details on the{" "}
        <Link href="/contact">Contact</Link> page.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        These terms may change. The version in force for your booking is the one published
        on the day you paid, and the date at the top of this page tells you which that is.
        Continuing to use the site after a change means you accept the current version.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Subject to your statutory consumer
        rights described in clause 8, the courts at {business.city}, {business.state} have
        jurisdiction.
      </p>
    </LegalPage>
  );
}
