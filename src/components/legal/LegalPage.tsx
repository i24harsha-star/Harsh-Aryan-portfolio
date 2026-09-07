import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import {
  policyEffectiveDate,
  formatPolicyDate,
  legalPageMeta,
  type LegalSlug,
} from "@/data/legal";

/**
 * The shell every legal page renders inside.
 *
 * Static and server-rendered on purpose. The portfolio is a pinned, scrubbed,
 * GSAP-driven scene; a refund policy is a document. Loading the motion stack
 * here would buy nothing and would put a reader who needs to find one clause
 * behind a 3.2-viewport runway to do it.
 */
export default function LegalPage({
  slug,
  intro,
  children,
}: {
  slug: LegalSlug;
  /** One sentence under the title saying what this page is for, in plain words. */
  intro: string;
  children: React.ReactNode;
}) {
  const { title } = legalPageMeta(slug);

  return (
    <>
      <header className="shell flex items-center justify-between gap-6 py-6">
        <Link
          href="/"
          className="text-[0.6875rem] font-medium tracking-[0.22em] uppercase transition-colors duration-500 hover:text-[var(--accent)]"
        >
          Harsh Aryan
        </Link>
        <Link
          href="/"
          className="shrink-0 rounded-full border border-[var(--line-strong)] px-5 py-2.5 text-[0.625rem] font-medium tracking-[0.18em] uppercase transition-colors duration-500 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
        >
          Back to the portfolio
        </Link>
      </header>

      <main id="top" className="shell pt-16 pb-8 lg:pt-24">
        <div className="legal">
          <p className="eyebrow mb-5">Legal</p>
          <h1 className="text-[clamp(2rem,4.4vw,3.5rem)] font-extralight leading-[1.05] tracking-[-0.03em]">
            {title}
          </h1>
          <p className="lede mt-6">{intro}</p>
          <p className="mt-6 text-xs text-fg-faint">
            Last updated{" "}
            <time dateTime={policyEffectiveDate}>{formatPolicyDate()}</time>
          </p>

          <hr className="rule my-12" />

          {children}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
