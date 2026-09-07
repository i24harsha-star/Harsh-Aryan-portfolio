import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import { business } from "@/data/legal";

export const metadata: Metadata = {
  title: "Cookie Policy — Harsh Aryan",
  description:
    "This site sets no cookies and loads no third-party scripts, so no cookie consent banner is required.",
};

/**
 * The conclusion this page reaches — that no consent banner is needed — is a
 * finding about the build, not an opinion. It rests on four facts, each of them
 * checkable and each of them re-checked by `scripts/check-privacy-surface.mjs`
 * against the production output:
 *
 *   1. `next/font` downloads Inter at BUILD time and self-hosts it. No request
 *      ever goes to fonts.googleapis.com from a visitor's browser, which is the
 *      exact practice a German court found unlawful under the GDPR in 2022.
 *   2. There is no analytics package in package.json and no <script> tag
 *      pointing anywhere off-origin.
 *   3. Nothing is embedded — no iframe, no YouTube, no Calendly widget.
 *   4. The app has no API routes, no session, and no auth, so Next.js itself
 *      sets no cookie.
 *
 * If any of those four stops being true, this page is wrong and must change
 * before the change ships. The check script is what makes that fail loudly.
 */
export default function Cookies() {
  return (
    <LegalPage
      slug="cookies"
      intro="There is no cookie banner on this site because there are no cookies. This page explains what that means and what would have to change."
    >
      <h2>What this site stores on your device</h2>
      <p>
        Nothing. This site sets no cookies — not analytics cookies, not advertising
        cookies, not preference cookies, not even a &ldquo;strictly necessary&rdquo; one.
        It also does not use browser local storage, session storage or any similar
        technique to keep information on your device between visits.
      </p>
      <p>
        Your browser will cache the pages, images and fonts it downloads, as it does for
        every website. That cache is managed by your browser, is not readable by me, and is
        not a cookie.
      </p>

      <h2>Why there is no consent banner</h2>
      <p>
        Consent requirements — under the EU ePrivacy Directive, the UK&rsquo;s PECR, and
        the consent provisions of India&rsquo;s Digital Personal Data Protection Act, 2023
        — are triggered by storing or reading information on a visitor&rsquo;s device, or
        by tracking them. This site does neither, so there is nothing to ask you to consent
        to. Showing a banner anyway would be theatre, and would ask you to agree to
        something that is not happening.
      </p>

      <h2>What the site loads, in full</h2>
      <ul>
        <li>
          <strong className="font-normal text-fg">Its own HTML, CSS, JavaScript and images</strong>,
          served from this domain.
        </li>
        <li>
          <strong className="font-normal text-fg">One typeface, Inter</strong>, which is
          downloaded at build time and served from this domain. Your browser never contacts
          Google Fonts, so no request carrying your IP address reaches Google.
        </li>
        <li>
          <strong className="font-normal text-fg">PDF and spreadsheet files</strong> you
          choose to open, also served from this domain.
        </li>
      </ul>
      <p>
        There are no third-party scripts, tag managers, pixels, web beacons, embedded
        videos, embedded maps, social widgets, chat widgets, A/B testing tools, session
        recorders or heatmaps. Links to LinkedIn, Substack, Unsplash and the AEGIS.os
        project take you to those sites, where their own policies apply — but nothing from
        them is loaded here.
      </p>

      <h2>Server logs are not cookies</h2>
      <p>
        The host records ordinary request logs, including IP addresses, in order to serve
        pages and resist abuse. That happens at the server and stores nothing on your
        device. It is covered in the <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>What would change this</h2>
      <p>
        Three planned additions would each introduce third-party processing, and this page
        will be rewritten — and a consent mechanism added where one is legally required —
        before any of them goes live:
      </p>
      <ul>
        <li>
          <strong className="font-normal text-fg">Razorpay payments.</strong> The intended
          design sends you to Razorpay&rsquo;s own page rather than embedding its checkout,
          so cookies would be set by Razorpay on Razorpay&rsquo;s domain, under its own
          policy — not here.
        </li>
        <li>
          <strong className="font-normal text-fg">Calendly scheduling.</strong> Same
          reasoning: a link out, not an embedded widget. An embedded Calendly widget would
          set third-party cookies on this domain and would require consent from visitors in
          the EU and UK.
        </li>
        <li>
          <strong className="font-normal text-fg">Any analytics.</strong> None is installed
          and none is planned. If one is ever added, it will be a
          cookieless, aggregate one, and this page will say so by name.
        </li>
      </ul>

      <h2>Controlling cookies generally</h2>
      <p>
        There is nothing here for you to block, but every major browser lets you see and
        delete cookies set by any site, usually under Settings → Privacy. Blocking cookies
        will not affect anything on this site, because it does not rely on any.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${business.email}`}>{business.email}</a> and I will answer
        it.
      </p>
    </LegalPage>
  );
}
