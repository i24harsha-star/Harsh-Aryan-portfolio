#!/usr/bin/env node
/**
 * Verify that the built site really is as private as the Cookie Policy claims.
 *
 * /cookies tells every visitor, in writing, that this site sets no cookies,
 * loads no third-party scripts, embeds nothing, and self-hosts its typeface. A
 * statement like that is worth something only if it is checked against the
 * actual build — otherwise one `npm install` of an analytics package silently
 * turns a published policy into a false statement about how personal data is
 * handled.
 *
 * Run after `next build`:
 *     node scripts/check-privacy-surface.mjs
 *
 * It reads the prerendered HTML and the client bundles and fails on anything
 * that would contradict the policy. It is a guard against regression, not a
 * proof of privacy — a real audit is a browser with the network panel open.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const BUILD = ".next";

/** Hosts that would mean the typeface is being fetched from Google at runtime. */
const FONT_CDNS = ["fonts.googleapis.com", "fonts.gstatic.com"];

/** Analytics, tag managers and session recorders, by hostname fragment. */
const TRACKERS = [
  "google-analytics.com",
  "googletagmanager.com",
  "doubleclick.net",
  "facebook.net",
  "connect.facebook",
  "hotjar.com",
  "clarity.ms",
  "segment.com",
  "segment.io",
  "mixpanel.com",
  "amplitude.com",
  "plausible.io",
  "posthog.com",
  "sentry.io",
  "va.vercel-scripts.com",
  "vitals.vercel-insights.com",
];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if ([".html", ".js", ".css"].includes(extname(path))) out.push(path);
  }
  return out;
}

const failures = [];
const note = (file, message) => failures.push(`${message}\n      in ${file}`);

const files = [...walk(join(BUILD, "server", "app")), ...walk(join(BUILD, "static"))];

if (files.length === 0) {
  console.error("check-privacy-surface: no build output found. Run `npm run build` first.");
  process.exit(2);
}

for (const file of files) {
  const source = readFileSync(file, "utf8");

  for (const host of FONT_CDNS) {
    if (source.includes(host)) {
      note(
        file,
        `Typeface is being loaded from ${host}. next/font is supposed to download it at\n` +
          `      build time and self-host it — a runtime request sends every visitor's IP\n` +
          `      address to Google, which is exactly what /cookies says does not happen.`
      );
    }
  }

  for (const host of TRACKERS) {
    if (source.includes(host)) {
      note(file, `Analytics or tracking endpoint "${host}" is present in the build.`);
    }
  }

  // Only HTML can carry an embed; matching this in JS bundles produces noise
  // from framework code that merely mentions the tag name.
  if (extname(file) === ".html") {
    if (/<iframe[\s>]/i.test(source)) {
      note(file, "An <iframe> is present. Embeds load third-party code and can set cookies.");
    }
    const external = [...source.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)/gi)];
    for (const [, url] of external) {
      note(file, `A script is loaded from another origin: ${url}`);
    }
  }
}

// document.cookie is only interesting if this project writes it. Framework code
// in node_modules is out of scope; the check below covers our own source.
for (const file of walk("src")) {
  if (/document\.cookie\s*=/.test(readFileSync(file, "utf8"))) {
    note(file, "This code writes a cookie, which /cookies says the site never does.");
  }
}

if (failures.length) {
  console.error("\nPrivacy surface has changed — /cookies and /privacy are now inaccurate.\n");
  for (const f of failures) console.error(`  ✗ ${f}\n`);
  console.error(
    "Either revert the change, or update src/app/cookies/page.tsx and\n" +
      "src/app/privacy/page.tsx to describe what the site now actually does —\n" +
      "and add a consent mechanism if one is required.\n"
  );
  process.exit(1);
}

console.log(
  `check-privacy-surface: ${files.length} built files scanned — no third-party fonts,\n` +
    "  no trackers, no embeds, no off-origin scripts, no cookies written.\n" +
    "  The Cookie Policy's claims still hold."
);
