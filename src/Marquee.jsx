import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const ITEMS = [
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Socket.IO",
  "Tailwind CSS",
  "Redux",
  "Spring Boot",
  "MySQL",
  "Java",
  "Python",
  "JWT",
];

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-8 font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-none">{t}</span>
          <span className="h-2 w-2 rotate-45 bg-espresso" />
        </span>
      ))}
    </div>
  );
}

/* Drifts left on its own. Scrolling speeds it up, and scrolling up reverses it. */
export default function Marquee() {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);

  // two identical rows side by side, so wrapping between -50% and 0% is seamless
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * -2 * (delta / 1000);
    if (boost.get() < 0) dir.current = -1;
    else if (boost.get() > 0) dir.current = 1;
    move += dir.current * move * boost.get();
    base.set(base.get() + move);
  });

  return (
    <section className="overflow-hidden bg-caramel py-6 text-espresso">
      <span className="sr-only">{ITEMS.join(", ")}</span>
      <motion.div aria-hidden="true" style={{ x: reduce ? 0 : x }} className="flex w-max">
        <Row />
        <Row />
      </motion.div>
    </section>
  );
}