import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/data/content";

// Inter carries a true 100 weight, which is what makes the hairline display type
// possible. Helvetica Neue Thin and Gotham — used by the reference site — are
// licensed faces we cannot serve.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harsharyan.vercel.app"),
  title: `${site.name} — Equity Research & Capital Markets`,
  description:
    "IPM at IIM Indore, CFA Level I. Equity research, financial modelling and the work behind them — case competitions, personal projects and one-to-one mentoring.",
  openGraph: {
    title: `${site.name} — Equity Research & Capital Markets`,
    description:
      "Case competition work, financial models and AEGIS.os — an AI financial intelligence platform.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} no-js`}>
      <body>
        <SmoothScroll />
        {/* Targets #top, which every route puts on its own <main>. It used to
            point at #about — an id that exists on the portfolio and nowhere
            else, so on each legal page the first thing a keyboard user reached
            was a link to nothing. SmoothScroll moves focus to the target; a
            fragment link cannot do it for itself here, because the scroll is
            intercepted. */}
        <a
          href="#top"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-black"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
