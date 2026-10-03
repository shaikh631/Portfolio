import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";

const EASE = [0.16, 1, 0.3, 1];
const EMAIL_ADDRESS = "ayan.codes9819@gmail.com";

const LINKS = [
  { label: "Resume (PDF)", href: "/Ayan_Shaikh_Resume.pdf", download: true },
  { label: "GitHub", href: "https://github.com/shaikh631" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ayan-shaikh-60b271219" },
  { label: "LeetCode", href: "https://leetcode.com/u/ayan_9819/" },
];

function Letters({ text }) {
  const reduce = useReducedMotion();
  return text.split("").map((ch, i) => (
    <span key={i} aria-hidden="true" className="inline-block overflow-hidden whitespace-pre pb-[0.04em] align-bottom">
      <motion.span
        className="inline-block"
        initial={reduce ? false : { y: "105%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1, delay: i * 0.05, ease: EASE }}
      >
        {ch}
      </motion.span>
    </span>
  ));
}

/* Pulls its child toward the cursor while the pointer is over it. */
function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const onMove = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-espresso pt-24 text-cream"
    >
      {/* marquee moves with scroll */}
      <div aria-hidden="true" className="pointer-events-none overflow-hidden">
        <motion.div
          style={{
            x: marqueeX,
            color: "transparent",
            WebkitTextStroke: "1px rgba(238,228,208,0.35)",
          }}
          className="flex w-max gap-12 whitespace-nowrap font-display text-[clamp(5rem,14vw,13rem)] leading-none"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>Open to internships</span>
          ))}
        </motion.div>
      </div>

      <div className="px-6 py-16 md:px-14">
        <h2 aria-label="Let's talk" className="font-display text-[clamp(4.5rem,16vw,16rem)] leading-[0.9]">
          <Letters text="LET'S TALK" />
        </h2>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="max-w-lg font-serif text-[clamp(1.5rem,2.6vw,2.5rem)] italic leading-tight">
              Have a role or a project in mind? Send me a note.
            </p>
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="mt-6 inline-block border-b border-cream/40 pb-1 font-serif text-xl transition-colors hover:border-caramel hover:text-caramel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream md:text-2xl"
            >
              {EMAIL_ADDRESS}
            </a>
          </div>

          <Magnetic>
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="grid h-44 w-44 place-items-center rounded-full bg-caramel font-serif text-2xl text-espresso transition-colors duration-300 hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream md:h-52 md:w-52"
            >
              Say hello
            </a>
          </Magnetic>
        </div>
      </div>

      <div>
        <ul className="mx-6 md:mx-14">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                {...(l.download
                  ? { download: "Ayan_Shaikh_Resume.pdf" }
                  : { target: "_blank", rel: "noreferrer" })}
                className="group flex items-center justify-between border-t border-cream/15 py-5 font-serif text-3xl transition-all duration-300 hover:pl-4 hover:text-caramel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
              >
                {l.label}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                >
                  <path d="M3 11 11 3M4.5 3H11v6.5" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <footer className="mx-6 flex items-center justify-between border-t border-cream/15 py-6 font-serif text-base text-cream/60 md:mx-14">
          <span>© {new Date().getFullYear()} Mohammed Ayan Hafiz Shaikh</span>
          <Link to="/" className="transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
            Back to top
          </Link>
        </footer>
      </div>
    </section>
  );
}