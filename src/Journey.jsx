import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const NODE = { hidden: { scale: 0 }, show: { scale: 1, transition: { duration: 0.6, ease: EASE } } };
const CONTENT = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const MASK = { hidden: { y: "105%" }, show: { y: 0, transition: { duration: 1.1, ease: EASE } } };

/* All entries come from your resume. Add years here if you want a dated timeline. */
const ENTRIES = [
  {
    title: "B.Tech, Artificial Intelligence and Machine Learning",
    place: "Thakur College of Engineering and Technology, Mumbai University",
    detail:
      "Third year, CGPA 7.95. Coursework in data structures and algorithms, object-oriented programming, DBMS and computer networks.",
  },
  {
    title: "Entrance exams",
    place: "JEE Main and MHT-CET",
    detail: "81 percentile in JEE Main and 91 percentile in MHT-CET.",
  },
  {
    title: "750+ LeetCode problems",
    place: "Problem solving",
    detail: "Steady practice across data structures, algorithms and problem solving.",
  },
  {
    title: "25+ hackathons",
    place: "Including the Adobe Hackathon",
    detail: "Built working prototypes in teams under tight deadlines.",
  },
  {
    title: "MongoDB certification",
    place: "Certification",
    detail: "Certified in MongoDB, the database behind two of my projects.",
  },
  {
    title: "Workshops and events",
    place: "Microsoft, Azure, AWS, Paytm, MongoDB and STC",
    detail: "Took part in technical events and workshops hosted by these companies.",
  },
];

export default function Journey() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.5"] });

  return (
    <section id="journey" className="bg-roast text-cream">
      <div className="grid gap-10 px-6 py-32 md:grid-cols-[1fr_2fr] md:gap-16 md:px-14 md:py-48">
        <div className="self-start md:sticky md:top-32">
          <motion.h2
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            className="overflow-hidden pb-2 font-display text-[clamp(4rem,9vw,9rem)] leading-none"
          >
            <motion.span className="block" variants={MASK}>
              Journey
            </motion.span>
          </motion.h2>
          <p className="mt-6 max-w-xs font-serif text-xl italic leading-snug text-cream/70">
            Education, practice and the events that shaped how I build.
          </p>
        </div>

        <div ref={listRef} className="relative">
          {/* the line fills as you scroll */}
          <div aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-cream/15">
            <motion.div
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
              className="h-full origin-top bg-gold"
            />
          </div>

          <ol>
            {ENTRIES.map((e) => (
              <motion.li
                key={e.title}
                initial={reduce ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-20%" }}
                className="relative pb-16 pl-12 last:pb-0"
              >
                <motion.span
                  aria-hidden="true"
                  variants={NODE}
                  className="absolute left-0 top-2 h-[15px] w-[15px] rotate-45 bg-gold"
                />
                <motion.div variants={CONTENT}>
                  <h3 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-tight">{e.title}</h3>
                  <p className="mt-2 font-serif text-lg italic text-gold">{e.place}</p>
                  <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-cream/70">{e.detail}</p>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}