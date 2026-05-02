"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ITEMS = [
  {
    label: "Kancelárie",
    name: "Coffea Office",
    tag: "Tichý chod",
    desc: "Ideálny plne automatický stroj pre kancelárie. Jednoduchá obsluha, tichý chod, veľká zásobná nádrž.",
    machineImg: "http://files.exoweb.eu/14/ec/14eccb96-e362-4a38-acea-3a8f8b93eb53.png",
    bgImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop&q=80",
  },
  {
    label: "Retail",
    name: "Coffea Nova",
    tag: "Kompaktný prémiový",
    desc: "Elegantný dizajn s pokročilou technológiou pre maloobchodné prevádzky s vysokou priepustnosťou.",
    machineImg: "http://files.exoweb.eu/76/f3/76f31059-1160-43d3-bbf1-e0cf2553f8af.png",
    bgImg: "http://files.exoweb.eu/25/66/2566791f-88e4-4653-9fe3-fabf4205643b.png",
  },
  {
    label: "Klientske centrá",
    name: "Coffea Enjoy",
    tag: "Prémiový výber",
    desc: "Plnohodnotný barista zážitok pre showroomy, čakárne a klientske zóny.",
    machineImg: "http://files.exoweb.eu/40/7e/407e6a1e-5d80-4e65-8f32-29388c29300c.png",
    bgImg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop&q=80",
  },
  {
    label: "Čerpacie stanice",
    name: "Coffea WMF",
    tag: "Profesionálny",
    desc: "Najvýkonnejší model pre vysokú priepustnosť. Dvojkotlový systém, SelfClean, farebný displej.",
    machineImg: "http://files.exoweb.eu/38/6b/386beefa-aa34-486f-bbd2-c3009fe24e28.png",
    bgImg: "http://files.exoweb.eu/c6/03/c6034947-dcc2-41e5-b376-226f6ad589f6.png",
  },
];

export default function AccordionGrid() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      {/* ── Desktop accordion ── */}
      <div
        className="hidden md:flex h-[580px] gap-[2px] rounded-2xl overflow-hidden"
        onMouseLeave={() => setHovered(null)}
      >
        {ITEMS.map((item, i) => {
          const isActive = hovered === i;
          const isIdle   = hovered === null;

          return (
            <motion.div
              key={item.label}
              className="relative overflow-hidden cursor-pointer"
              animate={{ flexGrow: isActive ? 5 : isIdle ? 1 : 0.35 }}
              transition={{ duration: 0.65, ease: E }}
              onMouseEnter={() => setHovered(i)}
              style={{ minWidth: 54 }}
            >
              {/* 1 — dark base */}
              <div className="absolute inset-0 bg-card" />

              {/* 2 — background photo */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={item.bgImg}
                  alt={item.label}
                  fill
                  className="object-cover scale-105"
                  unoptimized
                />
              </motion.div>

              {/* 3 — gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(13,11,10,0.97) 0%, rgba(13,11,10,0.55) 45%, rgba(13,11,10,0.18) 100%)",
                }}
              />

              {/* 4 — gold left-edge glow */}
              <motion.div
                className="absolute left-0 top-10 bottom-10 w-px"
                animate={{ opacity: isActive ? 1 : 0.2 }}
                transition={{ duration: 0.4 }}
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, #c5a059 30%, #c5a059 70%, transparent)",
                }}
              />

              {/* ── Collapsed: vertical label ── */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ opacity: isActive ? 0 : 1 }}
                transition={{ duration: 0.16 }}
              >
                <span
                  className="text-white/38 text-[10px] tracking-[0.28em] uppercase font-medium select-none whitespace-nowrap"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {item.label}
                </span>
              </motion.div>

              {/* ── Expanded: floating machine image ── */}
              <motion.div
                className="absolute right-5 bottom-[185px] w-[110px] h-[140px] pointer-events-none"
                animate={{
                  opacity: isActive ? 1 : 0,
                  x:       isActive ? 0 : 28,
                  y:       isActive ? [0, -8, 0] : 0,
                }}
                transition={{
                  opacity: { duration: 0.35, delay: isActive ? 0.22 : 0 },
                  x:       { duration: 0.48, ease: E, delay: isActive ? 0.16 : 0 },
                  y:       { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                }}
              >
                <Image
                  src={item.machineImg}
                  alt={item.name}
                  fill
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 0 22px rgba(197,160,89,0.38))" }}
                  unoptimized
                />
              </motion.div>

              {/* ── Expanded: top area badge ── */}
              <motion.div
                className="absolute top-5 left-0 right-0 flex justify-center pointer-events-none"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
                transition={{ duration: 0.3, delay: isActive ? 0.12 : 0 }}
              >
                <span
                  className="px-3 py-1 rounded-full border border-gold/25 text-gold/80 text-[10px] tracking-[0.16em] uppercase"
                  style={{
                    background: "rgba(13,11,10,0.65)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  {item.label}
                </span>
              </motion.div>

              {/* ── Expanded: glass content card ── */}
              <motion.div
                className="absolute bottom-5 left-4 right-4"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 18 }}
                transition={{ duration: 0.38, ease: E, delay: isActive ? 0.18 : 0 }}
              >
                <div
                  className="relative rounded-xl border border-gold/20 p-5 overflow-hidden"
                  style={{
                    background: "rgba(26,17,16,0.72)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                  }}
                >
                  {/* shimmer top edge */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(197,160,89,0.45) 50%, transparent)",
                    }}
                  />

                  <span className="text-gold text-[10px] tracking-[0.22em] uppercase">
                    {item.tag}
                  </span>
                  <h3 className="font-display text-white font-bold text-[17px] leading-tight mt-1 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-white/45 text-[12.5px] leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white/22 text-[10.5px] uppercase tracking-[0.18em] shrink-0">
                      {item.label}
                    </span>
                    <a
                      href="#kontakt"
                      className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gold/35 text-gold text-[11.5px] font-medium transition-all duration-200 hover:bg-gold hover:text-bg hover:border-gold whitespace-nowrap"
                    >
                      Dopytovať
                      <svg
                        className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6h8M6 2l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Mobile: stacked cards ── */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ITEMS.map(item => (
          <div
            key={item.label}
            className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-card"
            style={{ minHeight: 220 }}
          >
            <Image
              src={item.bgImg}
              alt={item.label}
              fill
              className="object-cover opacity-35"
              unoptimized
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(13,11,10,0.95) 0%, transparent 65%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-gold text-[10px] tracking-[0.2em] uppercase">
                {item.tag}
              </span>
              <h3 className="font-display text-white font-bold text-lg leading-tight mt-1 mb-1.5">
                {item.name}
              </h3>
              <p className="text-white/45 text-[12.5px] leading-relaxed mb-3 line-clamp-2">
                {item.desc}
              </p>
              <a
                href="#kontakt"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gold/35 text-gold text-[11.5px] font-medium"
              >
                Dopytovať
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
