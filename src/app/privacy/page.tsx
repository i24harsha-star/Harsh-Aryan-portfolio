import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import Pending from "@/components/legal/Pending";
import { business, processors } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Harsh Aryan",
  description:
    "What this site collects, what it does not, and how to exercise your rights under India's Digital Personal Data Protection Act, 2023.",
};

/**
 * The honest version.
 *
 * The site as it stands is fully static, loads no analytics, embeds no third
 * party, self-hosts its one webfont at build time and sets no cookie of any
 * kind. So this policy says that, rather than reciting the usual paragraphs
 * about tracking pixels and advertising partners that a template would supply.
 * A policy describing collection that is not happening is not merely useless —
 * it is a false statement about how personal data is handled.
 */
export default function Privacy() {
  return (
    <LegalPage
      slug="privacy"
      intro="This site does not run analytics, does not embed third-party trackers, and does not set cookies. Almost nothing here applies to you unless you email me or, in future, pay for a session."
    >
      <h2>The short version</h2>
      <p>
        Visiting and reading this website collects no personal data about you beyond the
        server request logs that any website necessarily produces in order to send you a
        page. There is no analytics product installed, no advertising network, no social
        media pixel, no embedded video or scheduling widget, and no cookie banner —
        because there are no cookies to consent to.
      </p>
      <p>
        The only ways I come to hold information about you are the ones you choose: you
        email me, or you buy a mentoring session. Both are covered below.
      </p>

      <h2>Who is responsible for your data</h2>
      <p>
        {business.legalName}, an individual based in {business.city}, {business.state},{" "}
        {business.country}, is the data fiduciary for the purposes of India&rsquo;s Digital
        Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;), and the data
        controller for the purposes of the UK and EU GDPR where those apply.
      </p>
      <dl>
        <div>
          <dt>Contact for privacy questions</dt>
          <dd>
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </dd>
        </div>
        <div>
          <dt>Postal address</dt>
          <dd>
            {business.address ?? (
              <Pending what="a postal address for privacy and grievance correspondence." />
            )}
          </dd>
        </div>
      </dl>

      <h2>What is collected, and why</h2>

      <h3>When you read the site</h3>
      <p>
        Nothing is collected by the site itself. The pages are pre-rendered static files.
        The host, Vercel, records standard server request data — including your IP address,
        the page requested, and your browser&rsquo;s user-agent string — for the purpose of
        actually delivering the page and protecting the site against abuse. This is
        ordinary web-server logging, not analytics: I do not have a dashboard, I do not
        receive reports, and I cannot identify you from it.
      </p>

      <h3>When you email me</h3>
      <p>
        I receive whatever you put in the message: your email address, your name if you
        sign it, and anything else you choose to send. I use it to reply to you and for no
        other purpose. I do not add you to a mailing list, because there is no mailing
        list. Mail is held in Google&rsquo;s Gmail service.
      </p>

      <h3>When you buy a mentoring session</h3>
      <p>
        Payments are not live yet. When they are, payment will be taken on
        Razorpay&rsquo;s own hosted page and scheduling will happen on Calendly&rsquo;s own
        page. This means your card, UPI or netbanking details are entered on their systems,
        never on mine — I never see them and cannot store them. What reaches me is your
        name, your email address, the fact that a payment succeeded, and the slot you
        booked, so that I can turn up to the right call.
      </p>

      <h2>The legal basis for holding it</h2>
      <p>
        Under the DPDP Act, personal data given to me for a purpose you have asked for —
        answering your email, delivering a session you paid for — is processed on the basis
        of your consent, given by the act of sending it, for that stated purpose. Where the
        UK or EU GDPR applies to a visitor, the equivalent bases are performance of a
        contract (delivering a paid session) and legitimate interests (replying to
        correspondence you initiated).
      </p>

      <h2>Who else sees it</h2>
      <p>
        I do not sell personal data, and I do not share it for anyone else&rsquo;s
        marketing. The service providers below process data on my behalf in order to make
        the site and the sessions work at all:
      </p>
      <ul>
        {processors.map((p) => (
          <li key={p.name}>
            <strong className="font-normal text-fg">{p.name}</strong> — {p.role}
            {p.live ? "" : " (not yet active)"}. Data shared: {p.dataShared}. {p.note}{" "}
            <a href={p.policy} target="_blank" rel="noopener noreferrer">
              Their privacy policy
            </a>
            .
          </li>
        ))}
      </ul>
      <p>
        I may also disclose data where a law, a court or a regulator requires it. Some of
        these providers operate servers outside India, so a transfer outside India can
        occur; the DPDP Act permits this except to countries the Central Government
        specifically restricts.
      </p>

      <h2>How long it is kept</h2>
      <ul>
        <li>Email correspondence: kept while the conversation is useful, and deleted on request.</li>
        <li>
          Payment and booking records: kept for as long as tax and accounting rules require
          them to be retained, then deleted.
        </li>
        <li>
          Server logs: retained by the host under its own retention schedule; I do not
          control or extend it.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>Under the DPDP Act you may ask me to:</p>
      <ul>
        <li>tell you what personal data of yours I hold and who it has been shared with;</li>
        <li>correct, complete or update anything inaccurate;</li>
        <li>erase it, where I am not required to keep it;</li>
        <li>withdraw consent, which is as easy to do as it was to give;</li>
        <li>
          nominate someone to exercise these rights on your behalf if you die or become
          incapacitated.
        </li>
      </ul>
      <p>
        If the UK or EU GDPR applies to you, you additionally have rights of access,
        portability, restriction and objection, and a right to complain to your local
        supervisory authority.
      </p>
      <p>
        Email <a href={`mailto:${business.email}`}>{business.email}</a> to exercise any of
        these. I will acknowledge within{" "}
        {business.grievanceOfficer.acknowledgeWithin} and respond substantively within{" "}
        {business.grievanceOfficer.resolveWithin}. If you are not satisfied, the DPDP Act
        gives you a right to complain to the Data Protection Board of India.
      </p>

      <h2>Children</h2>
      <p>
        This site is aimed at university students and working adults. Mentoring sessions
        are not sold to anyone under 18. Under the DPDP Act, processing a child&rsquo;s
        personal data requires verifiable parental consent, so if you are under 18, please
        do not send me your details without a parent or guardian&rsquo;s involvement.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS and holds no customer database — there is no store of
        personal data on it to breach. Correspondence and payment records live in the
        third-party services named above, protected by their own security and by two-factor
        authentication on my accounts. No system is perfectly secure, and I will not claim
        otherwise; if a breach affecting your data occurs, the DPDP Act requires me to
        notify you and the Data Protection Board, and I will.
      </p>

      <h2>Changes</h2>
      <p>
        If the site starts doing something it does not do today — adding analytics,
        embedding a booking widget, running a newsletter — this page will be updated before
        that change goes live, and the date at the top will change with it. See also the{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>
    </LegalPage>
  );
}
