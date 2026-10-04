import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const DOOR = [0.76, 0, 0.24, 1];
const NAME = "Ayan Shaikh".split("");

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* The monogram draws itself as the count rises, the inner diamond fills at the end,
   then the content fades and two doors split open to reveal the page.
   The parent keeps this mounted inside <AnimatePresence> until every exit below has finished. */
export default function Preloader({ onDone }) {
  const count = useMotionValue(0);
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const draw = useTransform(count, [0, 100], [0, 1]);
  const fill = useTransform(count, [86, 100], [0, 1]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const controls = animate(count, 100, {
      duration: 2.4,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        document.body.style.overflow = "";
        setTimeout(onDone, 350);
      },
    });
    return () => {
      controls.stop();
      document.body.style.overflow = "";
    };
  }, [count, onDone]);

  return (
    <div role="status" aria-label="Loading" className="fixed inset-0 z-[100] overflow-hidden">
      {/* the two doors */}
      <motion.div
        aria-hidden="true"
        exit={{ y: "-100%", transition: { duration: 1.1, ease: DOOR, delay: 0.3 } }}
        className="absolute inset-x-0 top-0 h-[50.5%] bg-espresso"
      />
      <motion.div
        aria-hidden="true"
        exit={{ y: "100%", transition: { duration: 1.1, ease: DOOR, delay: 0.3 } }}
        className="absolute inset-x-0 bottom-0 h-[50.5%] bg-espresso"
      />

      {/* soft warm light behind the content */}
      <motion.div
        aria-hidden="true"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(184,138,90,0.14),transparent_70%)]"
      />

      {/* film grain */}
      <motion.div
        aria-hidden="true"
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* content */}
      <motion.div
        exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.5, ease: EASE } }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-cream"
      >
        <div className="absolute inset-x-6 top-6 flex justify-between font-serif text-base text-cream/60 md:inset-x-14 md:top-12">
          <span>Portfolio</span>
          <span>Mumbai, India</span>
        </div>

        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
          <motion.path
            d="M48 4 92 48 48 92 4 48Z"
            stroke="var(--color-gold)"
            strokeWidth="1.25"
            pathLength={draw}
          />
          <motion.path
            d="M48 26 70 48 48 70 26 48Z"
            stroke="var(--color-cream)"
            strokeWidth="1.25"
            pathLength={draw}
            fill="var(--color-gold)"
            style={{ fillOpacity: fill }}
          />
        </svg>

        <h1 aria-label="Ayan Shaikh" className="mt-10 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-none">
          {NAME.map((ch, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden whitespace-pre pb-[0.06em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.3 + i * 0.05, ease: EASE }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: EASE }}
          className="mt-4 font-serif text-xl italic text-gold"
        >
          Full-stack developer
        </motion.p>

        <div className="absolute inset-x-6 bottom-6 md:inset-x-14 md:bottom-12">
          <div className="flex items-end justify-between">
            <span className="font-serif text-base text-cream/60">Loading</span>
            <motion.span className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none tabular-nums">
              {label}
            </motion.span>
          </div>
          <div className="mt-5 h-px bg-cream/15">
            <motion.div style={{ scaleX: draw }} className="h-full origin-left bg-gold" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}