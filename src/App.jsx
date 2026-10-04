import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Preloader from "./Preloader";
import Nav from "./Nav";
import SideDots from "./SideDots";
import Hero from "./Hero";
import Marquee from "./Marquee";
import Services from "./Services";
import Projects from "./Projects";
import Skills from "./Skills";
import About from "./About";
import Journey from "./Journey";
import Contact from "./Contact";

export default function App() {
  // Skip the loading screen for people who prefer reduced motion.
  const [loading, setLoading] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const done = useCallback(() => setLoading(false), []);

  // Smooth scrolling. Skip this effect if your project already starts Lenis somewhere else.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Preloader key="preloader" onDone={done} />}</AnimatePresence>

      {/* Everything mounts when the loader finishes, so the hero's intro plays as the curtain lifts. */}
      {!loading && (
        <main className="bg-espresso font-serif text-cream">
          <Nav />
          <SideDots />
          <Hero />
          <Marquee />
          <Services />
          <Projects />
          <Skills />
          <About />
          <Journey />
          <Contact />
        </main>
      )}
    </>
  );
}