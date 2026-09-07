import Link from "next/link";
import { site } from "@/data/content";
import { legalPages, business } from "@/data/legal";

/**
 * The footer, shared by the portfolio and every legal page.
 *
 * A server component with no motion: it is the one part of the site that has to
 * be reachable, readable and machine-parsable under every condition — including
 * with JavaScript off, which is how a payment-gateway KYC reviewer will
 * sometimes see it.
 *
 * It also does real compliance work. The Consumer Protection (E-Commerce)
 * Rules, 2020 require a seller's legal name and contact route to be displayed
 * "in a clear and accessible manner", and policy links that exist but are not
 * linked from anywhere are not accessible. Putting them here means every page
 * carries them.
 */
export default function SiteFooter({
  /** The home page's chapter index is fixed over the bottom edge; legal pages have none. */
  clearChapterNav = false,
}: {
  clearChapterNav?: boolean;
}) {
  return (
    <footer className="mt-24 border-t border-[var(--line-soft)]">
      <div
        className="shell py-12"
        style={clearChapterNav ? { paddingBottom: "calc(var(--nav-h) + 2rem)" } : undefined}
      >
        <nav aria-label="Policies" className="mb-10">
          <h2 className="eyebrow mb-5">Policies &amp; business information</h2>
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {legalPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="text-xs text-fg-muted underline decoration-[var(--line-strong)] underline-offset-4 transition-colors duration-500 hover:text-fg hover:decoration-[var(--accent)]"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-t border-[var(--line-soft)] pt-8">
          <div className="text-xs leading-relaxed text-fg-faint">
            {/* Legal name and status, stated plainly. He is an individual, not a
                company, and a customer is entitled to know that before paying. */}
            <p className="text-fg-muted">
              {business.legalName} — {business.entityType}
            </p>
            <p className="mt-1">
              {business.city}, {business.state}, {business.country} ·{" "}
              <a
                href={`mailto:${business.email}`}
                className="underline decoration-[var(--line-strong)] underline-offset-4 transition-colors duration-500 hover:text-fg"
              >
                {business.email}
              </a>
            </p>
            <p className="mt-3">
              © {new Date().getFullYear()} {site.name}. Site content and case work are the
              author&rsquo;s own; third-party names and marks belong to their owners.
            </p>
            {/* CFA Institute's trademark guide requires this attribution wherever
                its marks appear on a webpage. The footer is on every page, so
                one notice here covers all of them. */}
            <p className="mt-1">
              CFA® and Chartered Financial Analyst® are registered trademarks owned by CFA
              Institute.
            </p>
          </div>

          {/* Not a recommendation, not advice — repeated in the footer because it
              is the one place a reader always passes, and because SEBI's concern
              with financial content online is precisely that the caveat lives
              somewhere the reader never reaches. */}
          <p className="max-w-[36ch] text-xs leading-relaxed text-fg-faint">
            Nothing on this site is investment advice or a recommendation to buy or sell any
            security.{" "}
            <Link
              href="/disclaimer"
              className="underline decoration-[var(--line-strong)] underline-offset-4 transition-colors duration-500 hover:text-fg"
            >
              Read the full disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
