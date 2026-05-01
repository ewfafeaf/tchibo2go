"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const stats = [
  { value: "500+", label: "Inštalácií" },
  { value: "15+", label: "Rokov skúseností" },
  { value: "24/7", label: "Podpora" },
  { value: "98%", label: "Spokojnosť" },
];

const features = [
  {
    title: "Kávovary Tchibo",
    badge: "Najobľúbenejšie",
    description:
      "Prémiové kávovary Tchibo pre každý podnik. Od espresso strojov po plne automatické zariadenia prispôsobené vašim potrebám.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    title: "Technická údržba",
    badge: "Servis 24/7",
    description:
      "Profesionálny servis a preventívna údržba vašich zariadení. Rýchle zásahy technického tímu kedykoľvek to potrebujete.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "SAM_ID Systém",
    badge: "Inovatívne",
    description:
      "Pokročilý systém správy a monitorovania zariadení. Sledujte stav, spotrebu a výkon v reálnom čase cez intuitívny dashboard.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

/* ── Particle system ── */
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
};

function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 9 + 6,
        delay: Math.random() * 5,
        drift: Math.random() * 35 + 15,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-p.drift / 2, p.drift / 2, -p.drift / 2], opacity: [0.12, 0.45, 0.12] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── 3D tilt card ── */
function TiltCard({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);
  const rotateX = useSpring(useTransform(yMv, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(xMv, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 25,
  });

  return (
    <motion.div
      variants={variants}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        xMv.set((e.clientX - r.left) / r.width - 0.5);
        yMv.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        xMv.set(0);
        yMv.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Page ── */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/[0.06] backdrop-blur-xl bg-[#0c0b09]/80"
      >
        <span className="text-2xl font-bold font-display text-gold tracking-wide select-none">
          Tchibo2Go
        </span>
        <div className="hidden md:flex items-center gap-8 text-[13px] text-white/50">
          {["Produkty", "O nás", "Kontakt"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(" ", "-")}`}
              className="hover:text-gold transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
        <motion.a
          href="#kontakt"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/40 text-gold text-[13px] hover:bg-gold/10 transition-colors duration-200"
        >
          Kontaktujte nás
        </motion.a>
      </motion.nav>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col overflow-hidden"
      >
        {/* Particles */}
        <Particles />

        {/* Ambient glow — offset to the left where the text sits */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
            style={{
              background:
                "radial-gradient(circle, rgba(200,169,110,0.09) 0%, transparent 68%)",
            }}
          />
        </div>

        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[480px] h-[480px] rounded-full border border-gold/[0.07]" />
          <div className="absolute w-[780px] h-[780px] rounded-full border border-gold/[0.04]" />
          <div className="absolute w-[1080px] h-[1080px] rounded-full border border-gold/[0.025]" />
        </div>

        {/* Parallax wrapper */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-8 xl:px-16 pt-24 pb-44"
        >
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-20 items-center w-full">
            {/* ── Left: text ── */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="inline-block mb-7 px-4 py-1.5 rounded-full border border-gold/30 text-gold text-[11px] tracking-[0.2em] uppercase"
              >
                Premium Coffee Solutions
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: EASE }}
                className="font-display text-[clamp(2.6rem,5.5vw,4.8rem)] font-bold leading-[1.08] tracking-tight mb-7"
              >
                Vášeň pre kávu,
                <br />
                <span className="gradient-animate">profesionálne</span>
                <br />
                riešenia
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="text-white/50 text-[clamp(1rem,1.6vw,1.15rem)] max-w-md leading-relaxed mb-10"
              >
                Dodávame prémiové kávovary Tchibo, zabezpečujeme servis a
                správu pre podniky po celom Slovensku.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-3.5 rounded-full bg-gold text-[#0c0b09] font-semibold text-[13px] tracking-wide hover:bg-gold-light transition-colors duration-200"
                >
                  Zobraziť produkty
                </motion.a>
                <motion.a
                  href="#kontakt"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-3.5 rounded-full border border-white/15 text-white/70 text-[13px] tracking-wide hover:border-gold/35 hover:text-gold transition-all duration-200"
                >
                  Kontaktujte nás
                </motion.a>
              </motion.div>
            </div>

            {/* ── Right: coffee machine image ── */}
            <div className="hidden lg:flex items-center justify-center">
              {/* Entry: fade + slide from right */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
                className="relative"
              >
                {/* Float: up-down loop */}
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* 3D rotation with perspective */}
                  <motion.div
                    animate={{ rotateY: [0, 5, 0, -5, 0] }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.8,
                    }}
                    style={{ transformPerspective: 1200 }}
                  >
                    <div className="relative">
                      {/* Gold ground glow */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gold/20 blur-3xl rounded-full" />
                      {/* Rim highlight */}
                      <div className="absolute inset-0 rounded-3xl ring-1 ring-gold/15 z-20 pointer-events-none" />

                      <Image
                        src="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80"
                        alt="Tchibo espresso kávovar"
                        width={500}
                        height={540}
                        className="rounded-3xl object-cover relative z-10"
                        priority
                      />

                      {/* Bottom fade to blend with background */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent via-transparent to-[#0c0b09]/50 z-20 pointer-events-none" />
                      {/* Left fade */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0c0b09]/15 to-transparent z-20 pointer-events-none" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.1 }}
          className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/[0.07] bg-[#0c0b09]/70 backdrop-blur-sm"
        >
          <div className="max-w-4xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-1 text-center py-2 ${
                  i < stats.length - 1 ? "border-r border-white/[0.07]" : ""
                }`}
              >
                <span className="font-display text-2xl md:text-3xl font-bold text-gold">
                  {stat.value}
                </span>
                <span className="text-[11px] text-white/35 uppercase tracking-[0.12em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-32 px-6">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0c0b09] to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block mb-4 text-gold text-[11px] tracking-[0.2em] uppercase">
              Naše služby
            </span>
            <h2 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight">
              Kompletné riešenia
              <br />
              <span className="text-white/30">pre váš podnik</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-5"
          >
            {features.map((feature) => (
              <TiltCard
                key={feature.title}
                variants={fadeUp}
                className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 hover:border-gold/25 hover:bg-white/[0.04] transition-all duration-300 cursor-default"
              >
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors duration-300">
                  {feature.icon}
                </div>

                <span className="inline-block mb-4 px-2.5 py-1 rounded-full bg-gold/10 text-gold text-[10px] tracking-[0.12em] uppercase">
                  {feature.badge}
                </span>

                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/45 text-[13.5px] leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-gold text-[13px] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  <span>Zistiť viac</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-[12px]">
          <span className="font-display text-gold/70 text-base font-semibold">
            Tchibo2Go
          </span>
          <span>© 2026 Tchibo2Go. Všetky práva vyhradené.</span>
          <span>Slovensko</span>
        </div>
      </footer>
    </div>
  );
}
