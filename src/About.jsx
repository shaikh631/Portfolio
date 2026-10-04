import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const MASK = { hidden: { y: "105%" }, show: { y: 0, transition: { duration: 1.1, ease: EASE } } };

/* Edit this paragraph, the scroll effect adapts to any length. */
const TEXT =
  "I'm a third-year B.Tech student in Artificial Intelligence and Machine Learning at Thakur College of Engineering and Technology in Mumbai. I build full-stack apps with React, Node.js and MongoDB, including real-time features, authenticated REST APIs and responsive interfaces. I've solved over 750 LeetCode problems, taken part in more than 25 hackathons and deployed three projects. Right now I'm looking for a software engineering internship where I can write clean, reliable code on a larger team.";

const WORDS = TEXT.split(" ");

function Word({ word, index, progress }) {
  const total = WORDS.length;
  const start = index / total;
  const end = Math.min(1, (index + 4) / total);
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

function Count({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (n) => `${Math.round(n)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduce) value.set(to);
    else animate(value, to, { duration: 1.8, ease: EASE });
  }, [inView, reduce, to, value]);

  return <motion.span ref={ref}>{text}</motion.span>;
}

const FACTS = [
  { to: 750, suffix: "+", label: "LeetCode problems solved" },
  { to: 25, suffix: "+", label: "hackathons" },
  { to: 3, suffix: "", label: "full-stack projects" },
];

export default function About() {
  const textRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "end 0.5"],
  });

  return (
    <section id="about" className="bg-cream text-espresso">
      <div className="grid gap-10 px-6 py-32 md:grid-cols-[1fr_2.2fr] md:gap-16 md:px-14 md:py-48">
        <div className="self-start md:sticky md:top-32">
          <motion.h2
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            className="overflow-hidden pb-2 font-display text-[clamp(4rem,9vw,9rem)] leading-none"
          >
            <motion.span className="block" variants={MASK}>
              About
            </motion.span>
          </motion.h2>
        </div>

        <div>
          <p
            ref={textRef}
            aria-label={TEXT}
            className="font-serif text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.2]"
          >
            {reduce
              ? TEXT
              : WORDS.map((w, i) => <Word key={i} word={w} index={i} progress={scrollYProgress} />)}
          </p>

          <dl className="mt-20 grid grid-cols-3 gap-6 border-t border-espresso/20 pt-8">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none">
                  <Count to={f.to} suffix={f.suffix} />
                </dt>
                <dd className="mt-3 font-serif text-lg leading-snug text-bark">{f.label}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 max-w-xl font-serif text-lg leading-relaxed text-bark">
            B.Tech in Artificial Intelligence and Machine Learning, Mumbai University, CGPA 7.95. MongoDB
            certified, with workshops and events from Microsoft, Azure, AWS, Paytm, MongoDB and STC.
          </p>
        </div>
      </div>
    </section>
  );
}