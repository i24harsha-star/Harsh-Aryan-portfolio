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
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} no-js`}>
      <body>
        <SmoothScroll />
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
