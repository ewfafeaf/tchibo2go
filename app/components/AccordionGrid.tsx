"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ITEMS = [
  {
    shortLabel: "OFFICE",
    label:      "Kancelárie",
    name:       "Coffea Office",
    tag:        "Tichý chod",
    desc:       "Ideálny plne automatický stroj pre kancelárie. Jednoduchá obsluha, tichý chod, veľká zásobná nádrž.",
    machineImg: "http://files.exoweb.eu/14/ec/14eccb96-e362-4a38-acea-3a8f8b93eb53.png",
    bgImg:      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop&q=80",
  },
  {
    shortLabel: "RETAIL",
    label:      "Retail",
    name:       "Coffea Nova",
    tag:        "Kompaktný prémiový",
    desc:       "Elegantný dizajn s pokročilou technológiou pre maloobchodné prevádzky s vysokou priepustnosťou.",
    machineImg: "http://files.exoweb.eu/76/f3/76f31059-1160-43d3-bbf1-e0cf2553f8af.png",
    bgImg:      "http://files.exoweb.eu/25/66/2566791f-88e4-4653-9fe3-fabf4205643b.png",
  },
  {
    shortLabel: "CLIENTS",
    label:      "Klientske centrá",
    name:       "Coffea Enjoy",
    tag:        "Prémiový výber",
    desc:       "Plnohodnotný barista zážitok pre showroomy, čakárne a klientske zóny.",
    machineImg: "http://files.exoweb.eu/40/7e/407e6a1e-5d80-4e65-8f32-29388c29300c.png",
    bgImg:      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop&q=80",
  },
  {
    shortLabel: "WMF",
    label:      "Čerpacie stanice",
    name:       "Coffea WMF",
    tag:        "Profesionálny",
    desc:       "Najvýkonnejší model pre vysokú priepustnosť. Dvojkotlový systém, SelfClean, farebný displej.",
    machineImg: "http://files.exoweb.eu/38/6b/386beefa-aa34-486f-bbd2-c3009fe24e28.png",
    bgImg:      "http://files.exoweb.eu/c6/03/c6034947-dcc2-41e5-b376-226f6ad589f6.png",
  },
];

export default function AccordionGrid() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      {/* ── Desktop accordion ── */}
      <div
        className="hidden md:flex h-[620px] rounded-2xl overflow-hidden border border-white/[0.06]"
        onMouseLeave={() => setHovered(null)}
      >
        {ITEMS.map((item, i) => {
          const isActive = hovered === i;

          return (
            <motion.div
              key={item.label}
              className="relative overflow-hidden cursor-pointer"
              animate={{ flexGrow: isActive ? 3 : 1 }}
              transition={{ duration: 0.6, ease: E }}
              onMouseEnter={() => setHovered(i)}
              style={{ minWidth: 68 }}
            >
              {/* ── 1: background photo (always visible) ── */}
              <div className="absolute inset-0">
                <Image
                  src={item.bgImg}
                  alt={item.label}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* ── 2: dark mask — fades back on hover ── */}
              <motion.div
                className="absolute inset-0 bg-bg"
                animate={{ opacity: isActive ? 0.36 : 0.80 }}
                transition={{ duration: 0.55 }}
              />

              {/* ── 3: bottom gradient for text contrast ── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(13,11,10,0.97) 0%, rgba(13,11,10,0.55) 38%, transparent 65%)",
                }}
              />

              {/* ── 4: thin gold divider between cards ── */}
              {i < ITEMS.length - 1 && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(197,160,89,0.22) 25%, rgba(197,160,89,0.22) 75%, transparent)",
                  }}
                />
              )}

              {/* ══ COLLAPSED STATE ══ */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                animate={{ opacity: isActive ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-px h-10"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, rgba(197,160,89,0.4))",
                    }}
                  />
                  <span
                    className="text-white/55 text-[11px] font-black tracking-[0.32em] uppercase whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {item.shortLabel}
                  </span>
                  <div
                    className="w-px h-10"
                    style={{
                      background:
                        "linear-gradient(to top, transparent, rgba(197,160,89,0.4))",
                    }}
                  />
                </div>
              </motion.div>

              {/* ══ EXPANDED STATE ══ */}

              {/* floating machine image */}
              <motion.div
                className="absolute right-6 top-8 w-[130px] h-[170px] pointer-events-none"
                animate={{
                  opacity: isActive ? 1 : 0,
                  x:       isActive ? 0 : 40,
                  y:       isActive ? [0, -10, 0] : 0,
                }}
                transition={{
                  opacity: { duration: 0.32, delay: isActive ? 0.2 : 0 },
                  x:       { duration: 0.5, ease: E, delay: isActive ? 0.15 : 0 },
                  y:       { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
                }}
              >
                <Image
                  src={item.machineImg}
                  alt={item.name}
                  fill
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 8px 32px rgba(197,160,89,0.45))" }}
                  unoptimized
                />
              </motion.div>

              {/* content block */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-7"
                animate={{
                  opacity: isActive ? 1 : 0,
                  y:       isActive ? 0 : 20,
                }}
                transition={{ duration: 0.38, ease: E, delay: isActive ? 0.16 : 0 }}
              >
                {/* tag line */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-px bg-gold/50 shrink-0" />
                  <span className="text-gold text-[10px] tracking-[0.26em] uppercase font-semibold">
                    {item.tag}
                  </span>
                </div>

                {/* massive title */}
                <h3
                  className="font-display font-black text-white leading-[0.93] tracking-tight mb-4"
                  style={{ fontSize: "clamp(2rem, 3.2vw, 3.4rem)" }}
                >
                  {item.name}
                </h3>

                {/* description */}
                <p className="text-white/50 text-[13px] leading-relaxed mb-6 max-w-[290px]">
                  {item.desc}
                </p>

                {/* CTA */}
                <a
                  href="#kontakt"
                  className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold/40 text-gold text-[12px] font-semibold tracking-wide transition-all duration-200 hover:bg-gold hover:text-bg hover:border-gold"
                  style={{
                    backdropFilter: "blur(10px)",
                    background: "rgba(13,11,10,0.45)",
                  }}
                >
                  Dopytovať
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Mobile: stacked cards ── */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ITEMS.map(item => (
          <div
            key={item.label}
            className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-card"
            style={{ minHeight: 240 }}
          >
            <Image
              src={item.bgImg}
              alt={item.label}
              fill
              className="object-cover opacity-40"
              unoptimized
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(13,11,10,0.97) 0%, transparent 60%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-gold text-[10px] tracking-[0.22em] uppercase font-semibold">
                {item.tag}
              </span>
              <h3 className="font-display text-white font-black text-2xl leading-tight mt-1 mb-2">
                {item.name}
              </h3>
              <p className="text-white/45 text-[12.5px] leading-relaxed mb-3 line-clamp-2">
                {item.desc}
              </p>
              <a
                href="#kontakt"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gold/35 text-gold text-[11.5px] font-semibold"
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
