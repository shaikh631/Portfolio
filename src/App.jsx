import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Nav from "./Nav.jsx";
import Hero from "./Hero.jsx";
import Projects from "./Projects.jsx";
import Skills from "./Skills.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";

const SECTION_ROUTES = {
  "/": "top",
  "/projects": "projects",
  "/skills": "skills",
  "/about": "about",
  "/contact": "contact",
};

function PortfolioPage() {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const sectionId = SECTION_ROUTES[location.pathname] ?? "top";
    const target = document.getElementById(sectionId);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { immediate: location.key === "default" });
    }
    else target.scrollIntoView({ behavior: "auto" });
  }, [location.key, location.pathname]);

  return (
    <main className="bg-espresso font-serif text-cream">
      <Nav />
      <Hero />
      <Projects />
      <Skills />
      <About />
      <Contact />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      {Object.keys(SECTION_ROUTES).map((path) => (
        <Route key={path} path={path} element={<PortfolioPage />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}