import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "services", label: "What I do" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

/* Fixed index on the right edge. Uses mix-blend-difference like the nav,
   so it stays readable over both dark and cream sections. */
export default function SideDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 text-cream mix-blend-difference lg:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={on ? "true" : undefined}
            className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            <span className="font-serif text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              {s.label}
            </span>
            <span
              className={`block h-px bg-current transition-all duration-500 ${
                on ? "w-10 opacity-100" : "w-4 opacity-50 group-hover:w-6 group-hover:opacity-100"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}