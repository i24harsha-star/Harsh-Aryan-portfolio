#!/usr/bin/env node
/**
 * List the legal details Harsh still has to supply, and fail while any remain.
 *
 * src/data/legal.ts marks every undecided field as `null` rather than filling it
 * with plausible text, and the pages render a conspicuous placeholder wherever
 * one appears. This is the other half of that arrangement: a single command
 * that says what is still missing and why it matters, so an unfinished policy
 * cannot reach a customer or a payment-gateway reviewer by being quietly
 * forgotten.
 *
 *     node scripts/check-legal.mjs
 *
 * Exit code 1 while anything is outstanding. That is the intended state today —
 * it is a to-do list, not a broken build.
 */

import { readFileSync } from "node:fs";

const source = readFileSync("src/data/legal.ts", "utf8");

/**
 * Each entry names a field in legal.ts, what it blocks, and what Harsh actually
 * has to decide. The consequence matters more than the field name: "address is
 * null" means nothing to him, "Razorpay will not activate payments" does.
 */
const REQUIRED = [
  {
    field: "address",
    what: "A postal address for the business.",
    blocks:
      "Razorpay activation, and Rule 4(3) of the Consumer Protection (E-Commerce) Rules, 2020.",
    note: "A correspondence address you actually collect post from is enough. It does not have to be where you sleep.",
  },
  {
    field: "phone",
    what: "A contact telephone number.",
    blocks: "The same rule, and the Contact page's customer-care requirement.",
    note: "This is a separate decision from the number already printed inside public/docs/harsh-aryan-cv.pdf.",
  },
  {
    field: "durationMinutes",
    what: "How long a session lasts, in minutes.",
    blocks: "Terms clause 5, the Pricing page, and content.ts → mentoring.duration.",
    note: "Nobody can agree to buy a session of unstated length, and it is the one number that tells a buyer whether ₹499 is fair.",
  },
  {
    field: "schedulingWindow",
    what: "How soon after paying a session can realistically happen.",
    blocks: "The Service Delivery page's delivery timeframe.",
    note: "'Usually within a week' is a fine answer. Silence is not.",
  },
];

const outstanding = REQUIRED.filter((item) =>
  new RegExp(`${item.field}:\\s*null\\b`).test(source)
);

if (outstanding.length === 0) {
  console.log("check-legal: every required business and policy detail is filled in.");
  process.exit(0);
}

console.log(`\n${outstanding.length} legal detail(s) still needed from Harsh:\n`);
for (const item of outstanding) {
  console.log(`  ● ${item.what}`);
  console.log(`      blocks: ${item.blocks}`);
  console.log(`      note:   ${item.note}`);
  console.log(`      set:    src/data/legal.ts → ${item.field}\n`);
}
console.log(
  "Until these are set, the pages that need them render a visible placeholder\n" +
    "rather than inventing an answer. That is deliberate: a policy that states a\n" +
    "fact he never agreed to is worse than one with an obvious gap.\n"
);
process.exit(1);
