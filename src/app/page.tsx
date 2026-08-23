import ChapterNav from "@/components/ChapterNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Competitions from "@/components/Competitions";
import Projects from "@/components/Projects";
import CV from "@/components/CV";
import Mentoring from "@/components/Mentoring";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Competitions />
        <Projects />
        <CV />
        <Mentoring />
        <Contact />
      </main>

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
      <ChapterNav />
    </>
  );
}
