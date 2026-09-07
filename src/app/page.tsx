import ChapterNav from "@/components/ChapterNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Competitions from "@/components/Competitions";
import Projects from "@/components/Projects";
import CV from "@/components/CV";
import Mentoring from "@/components/Mentoring";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      {/* id="top" is the skip link's destination and is present on every route. */}
      <main id="top">
        <Hero />
        <About />
        <CV />
        <Competitions />
        <Projects />
        <Mentoring />
        <Contact />
      </main>

      {/* Matching scrim at the top. The header is fixed, so every chapter's
          eyebrow row passes underneath it — "HARSH ARYAN" landed on top of
          "CHAPTER VI", and the CTA on top of "CONTACT". Content now dissolves
          into the top edge before it reaches the header. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-20 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/80 to-transparent"
      />

      {/* A plain gradient, not GradualBlur.
          Six stacked backdrop-filter layers pinned to the viewport force the
          compositor to re-sample and blur that strip on every scroll frame. Over
          a near-black page the blur is all but invisible next to a gradient, so
          it was paying a per-frame cost for no visible gain. The component is
          still in the repo if it is ever wanted on a lighter background. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] h-24 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-transparent"
      />
      {/* Lifted out of Contact.tsx. A <footer> nested inside a <section> is the
          section's footer, not the page's, so assistive technology never
          announced it as the site footer — and the policy links it now carries
          have to be reachable from every page, not from one chapter. */}
      <SiteFooter clearChapterNav />

      <ChapterNav />
    </>
  );
}
