import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

// Reveal variants. The trigger lives on an element that never moves (the row or heading),
// because an element hidden inside an overflow-hidden box is never seen by the browser as "in view".
const MASK = { hidden: { y: "105%" }, show: { y: 0, transition: { duration: 1, ease: EASE } } };
const LINE = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease: EASE } } };

/* Every row is based on something already on your resume. Edit freely. */
const ROWS = [
  {
    title: "Real-time apps",
    text: "Live features over WebSockets, like a dashboard that updates the moment a driver's radio message is classified.",
    tags: ["Socket.IO", "WebSockets", "Node.js"],
  },
  {
    title: "APIs and auth",
    text: "Authenticated REST APIs with JWT, audio upload handling and MongoDB storage, built so the frontend stays simple.",
    tags: ["Express.js", "JWT", "REST APIs", "MongoDB"],
  },
  {
    title: "Responsive interfaces",
    text: "Component-based React UIs with Redux state and Tailwind styling that hold up from phone to desktop.",
    tags: ["React.js", "Redux", "Tailwind CSS", "Vite"],
  },
  {
    title: "Media and deployment",
    text: "Image and video storage on Cloudinary, with projects deployed to Vercel and Render.",
    tags: ["Cloudinary", "Vercel", "Render"],
  },
];

function Row({ r }) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      className="group relative px-6 py-10 transition-colors duration-500 hover:bg-cream hover:text-espresso md:px-14 md:py-14"
    >
      <motion.span
        aria-hidden="true"
        variants={LINE}
        className="absolute left-0 top-0 h-px w-full origin-left bg-cream/25 transition-colors duration-500 group-hover:bg-espresso/25"
      />

      <div className="grid gap-6 md:grid-cols-[1.2fr_1.4fr_1fr] md:items-start md:gap-10">
        <h3 className="overflow-hidden pb-1 font-display text-[clamp(2.25rem,4.5vw,4.5rem)] leading-none">
          <motion.span className="block" variants={MASK}>
            {r.title}
          </motion.span>
        </h3>

        <p className="max-w-md font-serif text-lg leading-relaxed text-cream/70 transition-colors duration-500 group-hover:text-bark">
          {r.text}
        </p>

        <ul className="flex flex-wrap gap-2 md:justify-end">
          {r.tags.map((t) => (
            <li
              key={t}
              className="border border-cream/25 px-3 py-1 font-serif text-sm transition-colors duration-500 group-hover:border-espresso/30"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}

export default function Services() {
  const reduce = useReducedMotion();

  return (
    <section id="services" className="bg-espresso pt-28 text-cream md:pt-40">
      <div className="px-6 pb-16 md:px-14 md:pb-24">
        <motion.h2
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="overflow-hidden pb-2 font-display text-[clamp(4rem,13vw,13rem)] leading-none"
        >
          <motion.span className="block" variants={MASK}>
            What I do
          </motion.span>
        </motion.h2>
        <p className="mt-6 max-w-md font-serif text-xl leading-relaxed text-cream/70">
          The parts of a product I enjoy building, front to back.
        </p>
      </div>

      <ul>
        {ROWS.map((r) => (
          <Row key={r.title} r={r} />
        ))}
      </ul>

      <div className="border-t border-cream/25" />
    </section>
  );
}