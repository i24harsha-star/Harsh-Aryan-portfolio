import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import Pending from "@/components/legal/Pending";
import { business, siteDomain } from "@/data/legal";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact — Harsh Aryan",
  description:
    "Business and grievance contact details for Harsh Aryan, including the Grievance Officer required under the Consumer Protection (E-Commerce) Rules, 2020.",
};

/**
 * The disclosure page.
 *
 * Rule 4(3) of the Consumer Protection (E-Commerce) Rules, 2020 requires an
 * online seller to display its legal name, the address of its place of
 * business, website details, and customer-care and grievance-officer contacts
 * "in a clear and accessible manner". Razorpay's activation review asks for the
 * same page by name. Chapter VI of the portfolio is an invitation to get in
 * touch; this is the statutory version of it.
 */
export default function Contact() {
  return (
    <LegalPage
      slug="contact"
      intro="The business and grievance details required of anyone selling online in India — and the address to write to if something has gone wrong."
    >
      <h2>Business details</h2>
      <dl>
        <div>
          <dt>Legal name</dt>
          <dd>{business.legalName}</dd>
        </div>
        <div>
          <dt>Nature of business</dt>
          <dd>
            {business.entityType}. Not a company, LLP or registered partnership; not a
            SEBI-registered intermediary of any kind.
          </dd>
        </div>
        <div>
          <dt>What is sold</dt>
          <dd>
            One-to-one career and study mentoring sessions, delivered online. See{" "}
            <Link href="/pricing">Pricing</Link>.
          </dd>
        </div>
        <div>
          <dt>Website</dt>
          <dd>
            <Link href="/">{siteDomain}</Link>
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </dd>
        </div>
        <div>
          <dt>Place of business</dt>
          <dd>
            {business.address ?? (
              <Pending what="the full postal address of the place of business. Rule 4(3) of the Consumer Protection (E-Commerce) Rules, 2020 requires it to be displayed, and Razorpay will not activate payments without it. A correspondence address you actually collect post from is enough — it does not have to be your home." />
            )}
          </dd>
        </div>
        <div>
          <dt>Telephone</dt>
          <dd>
            {business.phone ?? (
              <Pending what="a contact telephone number for customer care. Required by the same rule; a number you are willing to publish deliberately, which is a different decision from the one already printed inside the CV PDF." />
            )}
          </dd>
        </div>
        <div>
          <dt>GST registration</dt>
          <dd>
            {business.gstin ??
              "Not registered. Turnover is below the ₹20 lakh threshold at which registration for services becomes compulsory, so no GST is charged and no GST invoice can be issued."}
          </dd>
        </div>
      </dl>

      <h2>Customer care</h2>
      <p>
        For anything about a booking, a payment or a session, email{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a>. This is a one-person
        operation, so replies come from a person rather than a queue — usually within a day
        or two, and always within{" "}
        {business.grievanceOfficer.acknowledgeWithin}.
      </p>

      <h2>Grievance Officer</h2>
      <p>
        Appointed as required by the Consumer Protection (E-Commerce) Rules, 2020. If a
        complaint has not been resolved to your satisfaction through customer care, escalate
        it here.
      </p>
      <dl>
        <div>
          <dt>Name</dt>
          <dd>{business.grievanceOfficer.name}</dd>
        </div>
        <div>
          <dt>Designation</dt>
          <dd>{business.grievanceOfficer.role}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${business.grievanceOfficer.email}`}>
              {business.grievanceOfficer.email}
            </a>{" "}
            — please put &ldquo;Grievance&rdquo; in the subject line.
          </dd>
        </div>
        <div>
          <dt>Acknowledgement</dt>
          <dd>Within {business.grievanceOfficer.acknowledgeWithin} of receipt.</dd>
        </div>
        <div>
          <dt>Resolution</dt>
          <dd>Within {business.grievanceOfficer.resolveWithin} of receipt.</dd>
        </div>
      </dl>
      <p>
        If that does not resolve it, you may take the matter to the consumer commission
        where you live, or call the National Consumer Helpline on 1915. Your rights under
        the Consumer Protection Act, 2019 are not affected by anything on this site.
      </p>

      <h2>Privacy and data requests</h2>
      <p>
        To see, correct or delete personal data I hold about you, or to withdraw consent,
        use the same address. The <Link href="/privacy">Privacy Policy</Link> sets out what
        those rights are and how quickly they are answered.
      </p>

      <h2>Takedown and correction requests</h2>
      <p>
        If you own rights in something published here, if your personal data appears in a
        document on this site, or if you think a claim on it is wrong, email{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a>. Material will be taken
        down while the request is looked at, rather than after.
      </p>

      <h2>Not for business enquiries about markets</h2>
      <p>
        These addresses are not a route to investment advice, stock views or portfolio help,
        and such requests will not be answered. See the{" "}
        <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>Elsewhere</h2>
      <ul>
        {site.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
