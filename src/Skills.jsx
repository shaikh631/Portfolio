import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const GROUPS = [
  { name: "Languages", items: ["Java", "Python", "JavaScript", "HTML5", "CSS3"] },
  { name: "Frontend", items: ["React.js", "Redux", "Tailwind CSS", "Vite"] },
  { name: "Backend", items: ["Node.js", "Express.js", "Spring Boot", "REST APIs", "Socket.IO", "JWT"] },
  { name: "Databases", items: ["MongoDB", "MySQL"] },
  { name: "Tools and cloud", items: ["Git", "GitHub", "Vercel", "Render", "Cloudinary", "Maven"] },
  { name: "Fundamentals", items: ["Data structures and algorithms", "OOP", "DBMS", "Computer networks"] },
];

/* A tall section with a sticky viewport inside it: vertical scroll drives a horizontal track. */
export default function Skills() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // move the track by exactly (its width - viewport width)
  const transform = useTransform(scrollYProgress, (v) => `translateX(calc(${v} * (100vw - 100%)))`);
  // the ghost word moves slower than the track, which gives the section some depth
  const ghostX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section id="skills" ref={ref} className="relative h-[420vh] bg-espresso text-cream">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center">
          <motion.span
            style={{
              x: ghostX,
              color: "transparent",
              WebkitTextStroke: "1px rgba(238,228,208,0.12)",
            }}
            className="whitespace-nowrap font-display text-[42vw] leading-none"
          >
            Skills
          </motion.span>
        </div>

        <motion.div
          style={reduce ? undefined : { transform }}
          className="relative flex w-max items-start gap-[7vw] px-6 md:px-14"
        >
          <div className="flex w-[min(78vw,520px)] shrink-0 flex-col">
            <h2 className="overflow-hidden pb-2 font-display text-[clamp(4rem,10vw,9rem)] leading-none">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "105%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                Skills
              </motion.span>
            </h2>
            <p className="mt-6 max-w-sm font-serif text-xl italic leading-snug text-cream/80">
              The tools I use to build and ship full-stack apps.
            </p>
          </div>

          {GROUPS.map((g) => (
            <div key={g.name} className="w-[min(78vw,460px)] shrink-0">
              <h3 className="font-display text-[clamp(2.75rem,5.5vw,5rem)] leading-none">{g.name}</h3>
              <ul className="mt-8">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 border-t border-cream/15 py-3 font-serif text-2xl text-cream/90"
                  >
                    <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-caramel" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="absolute bottom-10 left-6 right-6 h-px bg-cream/15 md:left-14 md:right-14">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-caramel" />
        </div>
      </div>
    </section>
  );
}