import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const MASK = { hidden: { y: "105%" }, show: { y: 0, transition: { duration: 1.1, ease: EASE } } };

/* ---------- small illustrations (swap for real screenshots when you have them) ---------- */

function WaveVisual() {
  const reduce = useReducedMotion();
  const bars = Array.from({ length: 30 }, (_, i) => ({
    h: 25 + ((i * 37) % 70),
    d: 1.1 + ((i * 13) % 9) / 10,
  }));

  return (
    <div className="flex h-full w-full flex-col justify-between p-10">
      <div className="flex h-44 items-center gap-[5px]">
        {bars.map((b, i) => (
          <motion.span
            key={i}
            className="block w-full bg-cream/80"
            style={{ height: `${b.h}%` }}
            animate={reduce ? undefined : { scaleY: [1, 0.35, 1] }}
            transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut", delay: (i % 7) * 0.08 }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {["Calm", "Stressed", "Tired", "Frustrated"].map((l) => (
          <span
            key={l}
            className={`px-3 py-1.5 font-serif text-base ${
              l === "Stressed" ? "bg-cream text-espresso" : "border border-cream/30 text-cream/70"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function FraudVisual() {
  const rows = [
    { who: "Card payment", risk: 12, note: "Allowed", flag: false },
    { who: "New device, new payee", risk: 86, note: "Held before payment", flag: true },
    { who: "Recurring transfer", risk: 24, note: "Allowed", flag: false },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-center gap-8 p-10">
      {rows.map((r, i) => (
        <motion.div key={r.who} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-20%" }}>
          <div className="flex items-baseline justify-between font-serif text-lg">
            <span>{r.who}</span>
            <span className={r.flag ? "text-gold" : "text-cream/60"}>{r.note}</span>
          </div>
          <div className="mt-3 h-1 bg-cream/15">
            <motion.div
              className={`h-full origin-left ${r.flag ? "bg-gold" : "bg-cream/70"}`}
              style={{ width: `${r.risk}%` }}
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 1.2, delay: 0.2 + i * 0.15, ease: EASE } },
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MediaVisual() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-[12%] top-[14%] h-[50%] w-[44%] -rotate-6 border border-cream/20 bg-roast" />
      <div className="absolute right-[12%] top-[22%] h-[50%] w-[44%] rotate-3 bg-caramel/80" />
      <div className="absolute left-[30%] top-[38%] flex h-[48%] w-[40%] items-center justify-center bg-cream">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M12 8 32 20 12 32Z" className="fill-espresso" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- data ---------- */

const PROJECTS = [
  {
    title: "The Silent Co-Driver",
    kind: "Real-time driver stress analyzer",
    blurb:
      "Transcribes driver radio audio and classifies each message as calm, stressed, tired or frustrated with the Groq LLM API. Results reach the team dashboard instantly over Socket.IO.",
    tech: ["React", "Redux", "Tailwind", "Node.js", "Express", "MongoDB", "Socket.IO", "Groq"],
    links: [
      { label: "Live demo", href: "https://driver-stress-analyzer.vercel.app" },
      { label: "GitHub", href: "https://github.com/shaikh631/driver-stress-analyzer" },
    ],
    bg: "bg-roast",
    Visual: WaveVisual,
  },
  {
    title: "CyberShield",
    kind: "Pre-payment fraud detection",
    blurb:
      "Evaluates transaction and user signals while a payment is being processed, and flags suspicious activity before the payment completes.",
    tech: ["React", "Node.js", "Express", "REST APIs"],
    links: [
      { label: "Live demo", href: "https://cybershield-fraud-intelligence.vercel.app" },
      { label: "GitHub", href: "https://github.com/shaikh631/cybershield-fraud-intelligence" },
    ],
    bg: "bg-cocoa",
    Visual: FraudVisual,
  },
  {
    title: "Vynzo",
    kind: "Social media platform (MegaBlog)",
    blurb:
      "A full-stack social platform for posts, videos and reels. REST APIs on Node and Express, MongoDB for data, and Cloudinary for image and video storage.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Cloudinary"],
    links: [
      { label: "Frontend", href: "https://github.com/shaikh631/MegaBlog" },
      { label: "Backend", href: "https://github.com/shaikh631/NodeJsBackend" },
    ],
    bg: "bg-bark",
    Visual: MediaVisual,
  },
];

/* ---------- card ---------- */

function Card({ p, index, total, progress }) {
  // while the next card slides over this one, shrink and dim it
  const isLast = index === total - 1;
  const start = isLast ? 0 : index / (total - 1);
  const end = isLast ? 1 : (index + 1) / (total - 1);
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.92]);
  const dim = useTransform(progress, [start, end], [0, isLast ? 0 : 0.6]);
  const { Visual } = p;

  return (
    <div className="sticky top-0 flex h-[100svh] items-center px-4 pb-6 pt-24 md:px-10">
      <motion.article
        style={{ scale, transformOrigin: "50% 0%" }}
        className={`relative grid h-full max-h-[760px] w-full grid-cols-1 overflow-hidden text-cream md:grid-cols-[1.1fr_1fr] ${p.bg} [clip-path:polygon(0_0,calc(100%-28px)_0,100%_28px,100%_100%,0_100%)]`}
      >
        <div className="flex flex-col justify-between p-8 md:p-14">
          <div>
            <p className="font-serif text-xl italic text-gold">{p.kind}</p>
            <h3 className="mt-4 font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.95]">{p.title}</h3>
            <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-cream/75">{p.blurb}</p>
          </div>

          <div>
            <ul className="flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <li key={t} className="border border-cream/25 px-3 py-1 font-serif text-sm text-cream/80">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-8">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 border-b border-cream/40 pb-1 font-serif text-lg transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  {l.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    <path d="M3 11 11 3M4.5 3H11v6.5" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden bg-black/20 md:block">
          <Visual />
        </div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 z-10 bg-espresso"
        />
      </motion.article>
    </div>
  );
}

/* ---------- section ---------- */

export default function Projects() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="projects" className="bg-cream text-espresso">
      <div className="px-6 pb-16 pt-28 md:px-14 md:pb-24 md:pt-40">
        <motion.h2
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="overflow-hidden pb-2 font-display text-[clamp(4rem,13vw,13rem)] leading-none"
        >
          <motion.span className="block" variants={MASK}>
            Selected work
          </motion.span>
        </motion.h2>
        <p className="mt-6 max-w-md font-serif text-xl leading-relaxed text-bark">
          Three full-stack projects, each with its code on GitHub.
        </p>
      </div>

      <div ref={ref} className="relative">
        {PROJECTS.map((p, i) => (
          <Card key={p.title} p={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>

      <div className="h-24 md:h-40" />
    </section>
  );
}