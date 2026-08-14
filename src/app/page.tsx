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
      <ChapterNav />
      <main>
        <Hero />
        <About />
        <Competitions />
        <Projects />
        <CV />
        <Mentoring />
        <Contact />
      </main>
    </>
  );
}
