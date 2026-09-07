import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import { business } from "@/data/legal";

export const metadata: Metadata = {
  title: "Disclaimer — Harsh Aryan",
  description:
    "Nothing on this site is investment advice or a research recommendation. The author is not registered with SEBI in any capacity.",
};

/**
 * The most load-bearing page on the site, and the one that did not exist.
 *
 * The portfolio publishes a 20-page equity research deck that carries current
 * market prices and target prices for around nine named, listed Indian
 * securities, presented as a model fund. That is competition work and it is
 * genuinely his — but published on a public website that ALSO sells a paid
 * service, unqualified, it looks a great deal like the pattern SEBI has spent
 * 2024–25 acting against: investment recommendations offered by an unregistered
 * person under an educational framing.
 *
 * The deck's own last page already says the author is not SEBI-registered and
 * that it is an academic project. The problem was that the website said nothing
 * at all — a reader met the recommendations first and the caveat only if they
 * opened a PDF and reached page 20. This page, the notice on Chapter III, and
 * the line in the footer put the caveat in front of the work instead of behind
 * it. See §6 of handoff.md for what is still Harsh's decision.
 */
export default function Disclaimer() {
  return (
    <LegalPage
      slug="disclaimer"
      intro="Read this before you read anything else on this site as financial guidance — because it is not, and was never produced to be."
    >
      <h2>No investment advice</h2>
      <p>
        Nothing on this website, in any document it links to, or in any mentoring session
        is investment advice, a research report prepared for you, an offer or solicitation
        to buy or sell any security, or a recommendation of any security, fund, strategy or
        product. It is not tailored to your circumstances, your risk tolerance, your tax
        position or your objectives, and it does not take them into account, because I do
        not know them.
      </p>

      <h2>Not registered with SEBI</h2>
      <p>
        {business.legalName} is{" "}
        <strong className="font-normal text-fg">
          not registered with the Securities and Exchange Board of India as an Investment
          Adviser under the SEBI (Investment Advisers) Regulations, 2013, nor as a Research
          Analyst under the SEBI (Research Analysts) Regulations, 2014
        </strong>
        , nor as a broker, portfolio manager, distributor or in any other capacity. He
        holds no licence to advise you on securities and does not do so.
      </p>
      <p>
        He is a student. The relevant qualifications are stated exactly as they are on{" "}
        <Link href="/">the portfolio</Link> — an undergraduate programme in progress, and a
        passed Level I of the <span className="whitespace-nowrap">CFA®</span> Program.
        Neither is a licence to advise.
      </p>

      <h2>About the case competition work</h2>
      <p>
        The decks in Chapter III were written for named student case competitions, under
        the time limits and slide limits those competitions set. Some of them — the equity
        research entry in particular — contain named listed companies, market prices,
        target prices and portfolio weightings, because that is what the competition brief
        asked entrants to produce.
      </p>
      <p>Those figures are, without exception:</p>
      <ul>
        <li>
          <strong className="font-normal text-fg">Academic.</strong> They were produced to
          be marked by a student judging panel, not to be invested against, and they were
          never offered to anyone as advice.
        </li>
        <li>
          <strong className="font-normal text-fg">Historic.</strong> Each was calculated on
          the date the entry was submitted — in the case of the equity research entry,
          January 2026 — using prices from around that date. They have not been reviewed,
          revisited or updated since, and they will never be. Any price or target in them
          is stale by construction.
        </li>
        <li>
          <strong className="font-normal text-fg">Not a recommendation.</strong> A price
          target written by a student for a competition is an exercise in method, not a
          view you should act on. It carries no more weight than any other homework.
        </li>
        <li>
          <strong className="font-normal text-fg">Unverified.</strong> They rest on
          publicly available data that was not independently verified, and on assumptions
          chosen to demonstrate a technique.
        </li>
      </ul>
      <p>
        The fund names, house styles and job titles inside those decks — a &ldquo;Chief
        Investment Officer&rdquo; of a fund that does not exist, and similar — are part of
        the competition&rsquo;s role-play format. No such fund exists, no money was ever
        managed, and no such position is or was held.
      </p>

      <h2>About the models and analyses</h2>
      <p>
        The Monte Carlo simulation and the earnings-quality screen in Chapter IV are
        teaching exercises built to demonstrate a method. Their outputs depend entirely on
        the assumptions fed into them; a simulation is a statement about its own inputs,
        not a forecast of the market. Historical figures are not a guide to future returns.
      </p>

      <h2>About the mentoring sessions</h2>
      <p>
        Sessions are about careers and study — CVs, exam preparation, how to structure a
        case, how to build a model properly. They are{" "}
        <strong className="font-normal text-fg">
          not a channel for stock tips, portfolio reviews or investment recommendations
        </strong>
        , and a request for one will be declined rather than quietly answered. No outcome,
        job, interview, referral or exam result is promised; see{" "}
        <Link href="/terms">clause 5 of the Terms</Link>.
      </p>

      <h2>Case competition results are not a track record</h2>
      <p>
        Placing in a student competition means a judging panel liked an argument on a
        particular day. It is not a record of investment performance, it has never been
        audited, and it says nothing about how any idea would have performed with real
        money. No claim of investment performance is made anywhere on this site, and none
        should be inferred from a competition result.
      </p>

      <h2>Third-party material and marks</h2>
      <p>
        Company names, exchange tickers, institution names, event names and certification
        marks appear here to identify what a piece of work was about or where it was
        presented. They are the property of their owners. Their appearance is not a claim
        of affiliation, sponsorship, endorsement, approval or review by any of them — not
        by any listed company named, not by any institute at whose event this work was
        presented, and not by CFA Institute.
      </p>
      <p>
        <span className="whitespace-nowrap">CFA®</span> and Chartered Financial Analyst® are
        registered trademarks owned by CFA Institute.
      </p>

      <h2>Do your own work</h2>
      <p>
        If anything here interests you as an investment idea, treat it as a starting point
        for your own research and speak to someone actually licensed to advise you.
        Investments in securities markets are subject to market risk; read all related
        documents carefully before investing. Any decision you take after reading this site
        is yours alone, and I accept no liability for it.
      </p>

      <h2>Reporting a problem</h2>
      <p>
        If you believe something on this site crosses a line — a claim that reads as advice,
        a figure that misleads, material that should not be published — tell me at{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a> and I will correct or
        remove it. That is a genuine offer, not a formality.
      </p>
    </LegalPage>
  );
}
