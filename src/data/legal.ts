/**
 * Legal, business and policy content — the single source of truth for every
 * page under /legal, exactly as `content.ts` is for the portfolio itself.
 *
 * Two rules carried over from `content.ts`, and they matter more here:
 *
 *   1. Nothing is invented. A policy that states a fact Harsh has not agreed to
 *      is worse than no policy, because he is bound by what it says.
 *   2. Anything awaiting his decision is `null`, never plausible filler. The
 *      pages render a visible, unmissable placeholder for a null, and
 *      `scripts/check-legal.mjs` fails the build check while any remain — so an
 *      unfinished policy cannot quietly reach a customer or a KYC reviewer.
 *
 * The policy texts below are drafted CONSERVATIVELY — where a choice existed,
 * it was made in the customer's favour, because a term that is generous is
 * never the thing that gets disputed. They still need his sign-off before
 * payments go live; see §6 of handoff.md.
 */

/** A field Harsh has to supply himself. Rendered as a visible gap, never guessed. */
export type Pending = null;

export const business = {
  /**
   * He trades as an individual, not a registered company. Saying so plainly is
   * both accurate and protective: it sets a customer's expectations correctly
   * and avoids implying a corporate entity that does not exist.
   */
  legalName: "Harsh Aryan",
  tradingAs: "Harsh Aryan",
  entityType: "Individual (sole proprietor, unregistered)" as const,

  email: "harsh.aryan.finance@gmail.com",

  /**
   * NEEDS INPUT — a postal address.
   *
   * The Consumer Protection (E-Commerce) Rules, 2020 require an e-commerce
   * seller to display a legal name and the address of its place of business,
   * and Razorpay's website review asks for the same. "Indore, Madhya Pradesh"
   * alone will not satisfy either.
   *
   * He does not have to publish the flat he sleeps in — a correspondence
   * address he actually receives post at is enough — but something has to go
   * here before ₹499 can legally change hands.
   */
  address: null as Pending,

  /**
   * NEEDS INPUT — a contact phone number.
   *
   * Same source as the address. Note this is a DIFFERENT decision from the
   * number already inside `public/docs/harsh-aryan-cv.pdf`: publishing a number
   * deliberately, on a page that explains what it is for, is a considered
   * choice; leaking it inside a PDF is not.
   */
  phone: null as Pending,

  city: "Indore",
  state: "Madhya Pradesh",
  country: "India",

  /**
   * No GSTIN. Services under the ₹20 lakh annual threshold do not require GST
   * registration, and ₹499 sessions will not approach it. Stated explicitly so
   * a customer does not expect a tax invoice that cannot be issued.
   */
  gstin: null as Pending,
  gstRegistered: false,

  /**
   * Grievance officer under the Consumer Protection (E-Commerce) Rules, 2020:
   * acknowledge within 48 hours, resolve within one month. At this size that is
   * Harsh himself, which is permitted — the rule requires a named, reachable
   * person, not a department.
   */
  grievanceOfficer: {
    name: "Harsh Aryan",
    role: "Grievance Officer",
    email: "harsh.aryan.finance@gmail.com",
    acknowledgeWithin: "48 hours",
    resolveWithin: "30 days",
  },
} as const;

/**
 * The date the current wording took effect. Bump it whenever a policy changes
 * in substance — a policy with a stale date is evidence against you, not for
 * you, because it cannot show what a customer actually agreed to.
 *
 * ISO, with the human form derived from it, so the <time datetime> attribute and
 * the words on the page can never drift apart.
 */
export const policyEffectiveDate = "2026-09-07";

export function formatPolicyDate(iso: string = policyEffectiveDate) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The domain the site is actually served from.
 *
 * NEEDS CHECKING — this is the value already assumed by `metadataBase` in
 * layout.tsx, but the deployment was never confirmed in writing. It is printed
 * on the Contact page as the business's website, which is a disclosure a
 * customer and a KYC reviewer both rely on, so it has to be right.
 */
export const siteDomain = "harsharyan.vercel.app";

export const legalPages = [
  { slug: "privacy", title: "Privacy Policy", nav: "Privacy" },
  { slug: "terms", title: "Terms & Conditions", nav: "Terms" },
  { slug: "refunds", title: "Cancellation & Refund Policy", nav: "Refunds" },
  { slug: "cookies", title: "Cookie Policy", nav: "Cookies" },
  { slug: "disclaimer", title: "Disclaimer", nav: "Disclaimer" },
  { slug: "pricing", title: "Pricing", nav: "Pricing" },
  { slug: "delivery", title: "Service Delivery", nav: "Delivery" },
  { slug: "contact", title: "Contact", nav: "Contact" },
] as const;

export type LegalSlug = (typeof legalPages)[number]["slug"];

export function legalPageMeta(slug: LegalSlug) {
  const p = legalPages.find((x) => x.slug === slug);
  if (!p) throw new Error(`unknown legal page: ${slug}`);
  return p;
}

/**
 * The mentoring session's commercial terms.
 *
 * Everything here is a promise to a paying customer, so `null` means "Harsh has
 * not decided" and the page says so rather than guessing a number he would then
 * be held to.
 */
export const sessionTerms = {
  price: 499,
  currency: "INR",
  currencySymbol: "₹",

  /** NEEDS INPUT — mirrors `mentoring.duration` in content.ts. */
  durationMinutes: null as Pending,

  /** NEEDS INPUT — how soon after paying a session can realistically happen. */
  schedulingWindow: null as Pending,

  delivery: "Online video call (Google Meet), one-to-one",

  /**
   * Drafted in the customer's favour. A full refund up to 24 hours out costs
   * almost nothing at this volume and removes the only dispute worth having.
   */
  freeCancellationHours: 24,
  refundProcessingDays: "5–7 business days",
  rescheduleAllowance: "once, at no charge, with at least 24 hours' notice",
} as const;

/**
 * Third parties that receive customer data once payments go live.
 *
 * TODAY THIS LIST IS NOT YET ACTIVE — nothing on the site contacts any of them,
 * which is why the site currently sets no cookies at all. It is written down
 * now so that the privacy and cookie policies can be updated by editing one
 * array the day the payment link is switched on, rather than being rewritten
 * from memory.
 */
export const processors = [
  {
    name: "Razorpay Software Private Limited",
    role: "Payment processing",
    dataShared: "Name, email address, payment amount and payment method details",
    note: "Card and UPI details are entered on Razorpay's own page and are never seen by, or stored on, this site.",
    policy: "https://razorpay.com/privacy/",
    live: false,
  },
  {
    name: "Calendly LLC",
    role: "Session scheduling",
    dataShared: "Name, email address and the time slot chosen",
    note: "Reached by redirect after payment, on Calendly's own domain.",
    policy: "https://calendly.com/privacy",
    live: false,
  },
  {
    name: "Vercel Inc.",
    role: "Website hosting",
    dataShared:
      "Standard server request data, including IP address, for the purpose of serving the page and protecting against abuse",
    note: "Vercel is the host, not an analytics provider; no analytics product is installed on this site.",
    policy: "https://vercel.com/legal/privacy-policy",
    live: true,
  },
] as const;
