import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";

/* ---------- edit these ---------- */
const NAME = "AYAN";
const RESUME = "/Ayan_Shaikh_Resume.pdf"; // file lives in your project's public/ folder

const CREAM = "#eee4d0";
const CARAMEL = "#c98f5c";
const CORE = "#3a261a";
const EASE = [0.16, 1, 0.3, 1];

/* ---------- 3D scene ---------- */

function Ring({ radius, tilt, speed, satellite = 0.09 }) {
  const spin = useRef();
  const reduce = useReducedMotion();

  useFrame((_, dt) => {
    if (!reduce) spin.current.rotation.z += dt * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[radius, 0.012, 12, 180]} />
          <meshStandardMaterial color={CREAM} roughness={0.5} />
        </mesh>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[satellite, 32, 32]} />
          <meshStandardMaterial color={CARAMEL} roughness={0.35} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Armillary() {
  const tilt = useRef();
  const core = useRef();
  const shell = useRef();
  const reduce = useReducedMotion();

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 1)),
    []
  );

  useFrame((state, dt) => {
    // intro: grow into place inside the scene. Do not scale the canvas wrapper in CSS,
    // because R3F measures its size once on mount and would keep the smaller size.
    const p = reduce ? 1 : THREE.MathUtils.clamp((state.clock.elapsedTime - 0.4) / 1.6, 0, 1);
    tilt.current.scale.setScalar(0.7 + 0.3 * (1 - Math.pow(1 - p, 4)));

    const { pointer } = state;
    tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, pointer.x * 0.7, 3, dt);
    tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -pointer.y * 0.45, 3, dt);

    if (reduce) return;
    core.current.rotation.y += dt * 0.22;
    core.current.rotation.x += dt * 0.08;
    shell.current.rotation.y -= dt * 0.12;
    shell.current.rotation.z += dt * 0.06;
  });

  return (
    <Float speed={reduce ? 0 : 1.4} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={tilt}>
        <group ref={core}>
          <mesh>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshStandardMaterial color={CORE} flatShading roughness={0.4} metalness={0.35} />
          </mesh>
          <lineSegments geometry={edges} scale={1.004}>
            <lineBasicMaterial color={CREAM} transparent opacity={0.6} />
          </lineSegments>
        </group>

        <mesh ref={shell}>
          <icosahedronGeometry args={[1.6, 2]} />
          <meshBasicMaterial wireframe color={CARAMEL} transparent opacity={0.28} />
        </mesh>

        <Ring radius={1.85} tilt={[1.25, 0.2, 0]} speed={0.45} />
        <Ring radius={2.3} tilt={[0.4, 0.9, 0.3]} speed={-0.3} satellite={0.07} />
        <Ring radius={2.7} tilt={[1.9, -0.5, 0.8]} speed={0.2} satellite={0.055} />
      </group>
    </Float>
  );
}

function Scene({ eventSource }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8.5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      eventSource={eventSource}
      eventPrefix="client"
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} color="#f3e6cf" />
      <directionalLight position={[4, 5, 5]} intensity={2.6} color="#fff1d6" />
      <pointLight position={[-5, -3, 2]} intensity={40} color={CARAMEL} />
      <Armillary />
      <Sparkles count={40} scale={[9, 9, 4]} size={2.2} speed={0.3} color={CREAM} opacity={0.55} />
    </Canvas>
  );
}

/* A centered square that holds the disc layer or the 3D layer.
   Both layers use the same box and the same motion, so they always stay concentric. */
function StageLayer({ y, z, children }) {
  return (
    <motion.div
      style={{ y }}
      className={`pointer-events-none absolute inset-0 flex items-center justify-center md:justify-end md:pr-[2vw] ${z}`}
    >
      <div className="relative aspect-square w-[120vw] shrink-0 md:w-[min(50vw,800px)]">{children}</div>
    </motion.div>
  );
}

/* ---------- hero ---------- */

export default function Hero() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.6 });
  const titleX = useTransform(sx, [-1, 1], [16, -16]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={onMove}
      onPointerLeave={() => mx.set(0)}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(180deg,var(--color-espresso)_0%,var(--color-roast)_100%)] text-cream"
    >
      {/* film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* space for the fixed nav */}
      <div className="h-20 shrink-0" aria-hidden="true" />

      {/* name on the left; disc (back) and 3D object (front) on the right side, sharing one center */}
      <div id="top" className="relative flex flex-1 items-center justify-start px-6 md:px-14">
        <StageLayer y={stageY} z="z-0">
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.25, ease: EASE }}
            className="absolute inset-[14%] rounded-full bg-caramel"
          />
          <div aria-hidden="true" className="absolute inset-[2%] rounded-full border border-cream/15" />
        </StageLayer>

        <motion.h1
          aria-label={NAME}
          style={{ x: titleX, y: titleY }}
          className="relative z-10 -ml-1 select-none whitespace-nowrap text-left font-display md:-ml-3 text-[clamp(6rem,min(27vw,44svh),32rem)] leading-[0.86]"
        >
          {NAME.split("").map((ch, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.03em] align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.1 + i * 0.09, ease: EASE }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <StageLayer y={stageY} z="z-20">
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.55, ease: EASE }}
            className="absolute inset-0"
          >
            <Scene eventSource={sectionRef} />
          </motion.div>
        </StageLayer>
      </div>

      {/* intro */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: EASE }}
        className="relative z-30 flex flex-col gap-6 px-6 pb-8 pt-4 md:flex-row md:items-end md:justify-between md:px-14"
      >
        <div>
          <p className="font-serif text-[clamp(1.75rem,3.4vw,3.25rem)] italic leading-[1.05]">
            I build full-stack apps
            <br />
            that work in real time.
          </p>
          <p className="mt-4 max-w-md font-serif text-lg leading-relaxed text-cream/70">
            Third-year B.Tech student in Mumbai working with React, Node.js and Socket.IO.
            Looking for a software engineering internship.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/projects"
          className="group inline-flex w-fit items-center gap-6 bg-cream px-7 py-4 font-serif text-lg text-espresso transition-colors [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%)] hover:bg-caramel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
        >
          See my projects
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
          >
            <path d="M3 3 15 15M15 6v9H6" />
          </svg>
        </Link>

        <a
          href={RESUME}
          download="Ayan_Shaikh_Resume.pdf"
          className="group inline-flex w-fit items-center gap-4 border border-cream/40 px-7 py-4 font-serif text-lg transition-colors hover:bg-cream hover:text-espresso focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
        >
          Download resume
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-y-0.5"
          >
            <path d="M9 2v10M4.5 8 9 12.5 13.5 8M3 16h12" />
          </svg>
        </a>
        </div>
      </motion.div>

      <footer className="relative z-30 mx-6 flex items-center justify-between border-t border-cream/15 py-5 font-serif text-base text-cream/60 md:mx-14">
        <span>Scroll to see my work</span>
        <span className="hidden md:inline">Mumbai, India — 19.07° N 72.88° E</span>
        <span>Open to internships</span>
      </footer>
    </section>
  );
}