import ChapterNav from "@/components/ChapterNav";
import GradualBlur from "@/components/reactbits/GradualBlur";
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

      {/* Content dissolves into the bottom edge rather than being cut by a hard
          line, so the chapter index always sits on a soft field. */}
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={1.5}
        divCount={6}
        curve="ease-out"
        zIndex={55}
      />
      <ChapterNav />
    </>
  );
}
