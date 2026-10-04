import { motion, useScroll, useSpring } from "framer-motion";

const EMAIL = "mailto:ayan.codes9819@gmail.com";
const RESUME = "/Ayan_Shaikh_Resume.pdf"; // file lives in your project's public/ folder
const NAV = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

/* The header uses mix-blend-difference, so cream text turns dark over the
   cream sections and stays cream over the dark ones without any scroll logic. */
export default function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gold"
      />

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-cream mix-blend-difference md:px-14">
        <a
          href="#top"
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M17 2 32 17 17 32 2 17Z" />
            <path d="M17 9 25 17 17 25 9 17Z" />
          </svg>
          <span className="leading-none">
            <span className="block font-display text-2xl tracking-wide">Ayan Shaikh</span>
            <span className="mt-1 block font-serif text-sm opacity-70">Full-stack developer</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden gap-10 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative font-serif text-lg opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={RESUME}
            download="Ayan_Shaikh_Resume.pdf"
            className="hidden bg-cream px-4 py-2 font-serif text-base text-espresso transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:inline-block"
          >
            Resume
          </a>
          <a
            href={EMAIL}
            className="border border-cream/40 px-4 py-2 font-serif text-base transition-colors hover:bg-cream hover:text-espresso focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            Get in touch
          </a>
        </div>
      </header>
    </>
  );
}