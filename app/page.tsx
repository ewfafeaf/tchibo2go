"use client";

import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useMotionValue, useSpring, useInView,
  type Variants,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import AOS from "aos";
import "aos/dist/aos.css";

const CustomCursor  = dynamic(() => import("./components/CustomCursor"),  { ssr: false });
const HeroParticles = dynamic(() => import("./components/HeroParticles"), { ssr: false });
const AccordionGrid = dynamic(() => import("./components/AccordionGrid"), { ssr: false });

// ─── Constants ───────────────────────────────────────────────────────────────
const E: [number, number, number, number] = [0.22, 1, 0.36, 1];
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.75, ease: E } },
};
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Kávovary", children: [
    { label: "Coffea Office", href: "#kavovary" }, { label: "Coffea Nova", href: "#kavovary" },
    { label: "Coffea Enjoy",  href: "#kavovary" }, { label: "Coffea WMF",  href: "#kavovary" },
    { label: "Nábytok",       href: "#kavovary" },
  ]},
  { label: "SAM_ID", children: [
    { label: "Predstavenie systému", href: "#samid" }, { label: "SAM_ID v praxi", href: "#samid" },
    { label: "Hotely",               href: "#oblasti" }, { label: "Retail",         href: "#oblasti" },
  ]},
  { label: "Technická údržba", children: [
    { label: "Úprava vody (Brita)", href: "#udrzba" },
    { label: "Hygiena (Cafetto)",   href: "#udrzba" },
  ]},
  { label: "Spotrebný materiál", children: [
    { label: "Káva Tchibo", href: "#material" }, { label: "Mlieko",  href: "#material" },
    { label: "Čaj",         href: "#material" }, { label: "Nonfood", href: "#material" },
  ]},
  { label: "Oblasti",  href: "#oblasti" },
  { label: "O nás",    href: "#o-nas"   },
  { label: "Kontakt",  href: "#kontakt" },
];

const COFFEE_MODELS = [
  {
    name: "Coffea Office",
    tag: "Kancelárske riešenie",
    desc: "Ideálny plne automatický stroj pre kancelárie. Jednoduchá obsluha, tichý chod, veľká zásobná nádrž.",
    img: "http://files.exoweb.eu/14/ec/14eccb96-e362-4a38-acea-3a8f8b93eb53.png",
  },
  {
    name: "Coffea Nova",
    tag: "Kompaktný prémiový",
    desc: "Elegantný dizajn s pokročilou technológiou. Pripraví dokonalé espresso pre náročné prevádzky.",
    img: "http://files.exoweb.eu/76/f3/76f31059-1160-43d3-bbf1-e0cf2553f8af.png",
  },
  {
    name: "Coffea Enjoy",
    tag: "Prémiový výber",
    desc: "Plnohodnotný barista zážitok s jednoduchým ovládaním. Vhodný pre hotely, reštaurácie i kaviarně.",
    img: "http://files.exoweb.eu/40/7e/407e6a1e-5d80-4e65-8f32-29388c29300c.png",
  },
  {
    name: "Coffea WMF",
    tag: "Profesionálny",
    desc: "Najvýkonnejší model pre vysokú priepustnosť. Dvojkotlový systém, farebný displej, SelfClean.",
    img: "http://files.exoweb.eu/38/6b/386beefa-aa34-486f-bbd2-c3009fe24e28.png",
  },
];

const AREAS = [
  { label: "Kancelárie",  desc: "Zvýšte produktivitu kvalitnou kávou",     img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&auto=format&fit=crop&q=80", span2: true  },
  { label: "Hotely",      desc: "Prémiový zážitok pre vašich hostí",        img: "http://files.exoweb.eu/c6/03/c6034947-dcc2-41e5-b376-226f6ad589f6.png",                         span2: false },
  { label: "Reštaurácie", desc: "Dokonalé espresso k vášmu menu",           img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&auto=format&fit=crop&q=80", span2: false },
  { label: "Retail",      desc: "Zvýšte tržby predajom kvalitnej kávy",     img: "http://files.exoweb.eu/25/66/2566791f-88e4-4653-9fe3-fabf4205643b.png",                         span2: false },
  { label: "Pekárne",     desc: "Káva ku každému pečivu",                   img: "http://files.exoweb.eu/e9/04/e9047c82-62ba-4ec7-ba42-be8d3901d52a.png",                         span2: true  },
  { label: "Gastro",      desc: "Kompletné riešenie pre gastro prevádzky",  img: "http://files.exoweb.eu/3e/b7/3eb77cff-1b41-4536-be73-851474d9b895.png",                         span2: false },
];

const WHY_US = [
  { icon: "💰", title: "Bez poplatkov tretím stranám", desc: "Všetky služby priamo od nás — bez skrytých provízií ani sprostredkovateľov." },
  { icon: "🤝", title: "Všetko z jednej ruky",         desc: "Kávovar, servis, materiál, SAM_ID systém — jeden partner, jedna zmluva." },
  { icon: "⏱️", title: "20+ rokov skúseností",          desc: "Dlhodobá prítomnosť na slovenskom trhu s kávovými zariadeniami." },
  { icon: "🛡️", title: "Servis po celom SR",            desc: "Vlastná servisná sieť s garantovanou dobou zásahu do 48 hodín." },
];

const HERO_STATS = [
  { to: 500, suffix: "+", label: "Inštalácií" },
  { to: 20,  suffix: "+", label: "Rokov skúseností" },
  { to: 24,  suffix: "/7", label: "Podpora" },
  { to: 98,  suffix: "%",  label: "Spokojnosť" },
];

const CALC_MODELS = [
  { name: "Coffea Office", cpp: 0.28 },
  { name: "Coffea Nova",   cpp: 0.25 },
  { name: "Coffea Enjoy",  cpp: 0.22 },
  { name: "Coffea WMF",    cpp: 0.20 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16"
    >
      <span className="text-gold text-[11px] tracking-[0.22em] uppercase">{eyebrow}</span>
      <motion.div
        className="gold-divider my-3"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
      />
      <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight">{title}</h2>
      {sub && <p className="mt-4 text-white/40 text-sm max-w-md mx-auto">{sub}</p>}
    </motion.div>
  );
}

function FillBtn({ href, onClick, children, outline = false }: {
  href?: string; onClick?: () => void; children: React.ReactNode; outline?: boolean;
}) {
  const cls = `relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[13px] font-semibold tracking-wide cursor-pointer select-none ${
    outline ? "border border-white/20 text-white/70" : "border border-gold text-gold"
  }`;
  const inner = (
    <>
      <motion.span
        className="absolute inset-0 bg-gold"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "0% 50%" }}
      />
      <motion.span
        className="relative z-10"
        initial={{ color: outline ? "rgba(255,255,255,0.7)" : "#c8a96e" }}
        whileHover={{ color: "#0c0b09" }}
        transition={{ duration: 0.15, delay: 0.1 }}
      >
        {children}
      </motion.span>
    </>
  );
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

function TiltCard({ children, className, variants }: { children: React.ReactNode; className?: string; variants?: Variants }) {
  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);
  const rx = useSpring(useTransform(yMv, [-0.5, 0.5], [7, -7]), { stiffness: 280, damping: 24 });
  const ry = useSpring(useTransform(xMv, [-0.5, 0.5], [-7, 7]), { stiffness: 280, damping: 24 });
  return (
    <motion.div
      variants={variants}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); xMv.set((e.clientX - r.left) / r.width - 0.5); yMv.set((e.clientY - r.top) / r.height - 0.5); }}
      onMouseLeave={() => { xMv.set(0); yMv.set(0); }}
      className={className}
    >{children}</motion.div>
  );
}

function CountUp({ to, suffix = "", dur = 2200 }: { to: number; suffix?: string; dur?: number }) {
  const ref  = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round((1 - (1 - p) ** 3) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, dur]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function AnimNum({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const mv = useMotionValue(value);
  const sp = useSpring(mv, { stiffness: 120, damping: 22 });
  const [disp, setDisp] = useState(value);
  useEffect(() => {
    mv.set(value);
    return sp.on("change", v => setDisp(v));
  }, [value]);
  return <span>{disp.toFixed(decimals)}</span>;
}

// ─── Calculator ───────────────────────────────────────────────────────────────
function Calculator() {
  const [cups,  setCups]  = useState(100);
  const [model, setModel] = useState(0);
  const cpp    = CALC_MODELS[model].cpp;
  const daily  = cups * cpp;
  const monthly = daily * 22;
  const rival  = cups * 0.40 * 22;
  const saving = rival - monthly;
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-gold/20 bg-card p-8 md:p-12 backdrop-blur-sm"
        style={{ boxShadow: "0 0 60px rgba(200,169,110,0.07)" }}>
        {/* Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Šálky kávy / deň</span>
            <span className="font-display text-2xl font-bold text-gold">{cups}</span>
          </div>
          <input type="range" min={10} max={500} step={5} value={cups} onChange={e => setCups(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-white/25 text-xs mt-1.5"><span>10</span><span>500</span></div>
        </div>

        {/* Model select */}
        <div className="mb-10">
          <span className="text-white/60 text-sm block mb-3">Model kávovaru</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CALC_MODELS.map((m, i) => (
              <button key={m.name} onClick={() => setModel(i)}
                className={`py-2.5 px-3 rounded-xl border text-[12px] font-medium transition-all duration-200 ${
                  model === i ? "border-gold bg-gold/12 text-gold" : "border-white/10 text-white/40 hover:border-gold/30 hover:text-white/70"
                }`}>
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Denné náklady",    val: daily,   suf: "€",   dec: 2 },
            { label: "Mesačné náklady",  val: monthly, suf: "€",   dec: 0 },
            { label: "Cena konkurencie", val: rival,   suf: "€",   dec: 0 },
            { label: "Ušetríte/mes.",    val: saving,  suf: "€",   dec: 0 },
          ].map(({ label, val, suf, dec }) => (
            <div key={label} className={`rounded-xl p-4 border ${label === "Ušetríte/mes." ? "border-gold/30 bg-gold/8" : "border-white/[0.07] bg-white/[0.02]"}`}>
              <div className={`font-display text-xl font-bold ${label === "Ušetríte/mes." ? "text-gold" : "text-white"}`}>
                <AnimNum value={val} decimals={dec} />{suf}
              </div>
              <div className="text-white/35 text-[11px] mt-1 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-white/25 text-[11px] text-center">
          * Kalkulácia je orientačná. Cena závisí od vybraného modelu a podmienok zmluvy. Konkurenčná cena 0,40€/šálka.
        </p>
      </div>
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  type Status = "idle" | "loading" | "success";
  const [focused,  setFocused]  = useState<string | null>(null);
  const [status,   setStatus]   = useState<Status>("idle");
  const [form,     setForm]     = useState({ name: "", email: "", phone: "", type: "", message: "" });

  const fields = [
    { id: "name",    label: "Meno a priezvisko",  type: "text",  half: true  },
    { id: "email",   label: "E-mail",              type: "email", half: true  },
    { id: "phone",   label: "Telefónne číslo",     type: "tel",   half: true  },
    { id: "type",    label: "Typ prevádzky",       type: "select",half: true,
      options: ["Kancelária","Hotel","Reštaurácia","Retail","Pekáreň","Wellness","Iné"] },
    { id: "message", label: "Správa",              type: "textarea",half: false },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1800);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border border-gold/20 bg-card p-8 md:p-12 overflow-hidden"
        style={{ boxShadow: "0 0 80px rgba(200,169,110,0.08)" }}
      >
        {/* Glass shimmer */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,169,110,0.05) 0%, transparent 70%)" }} />

        <div className="relative grid grid-cols-2 gap-x-6 gap-y-7">
          {fields.map(f => (
            <div key={f.id} className={f.half ? "" : "col-span-2"}>
              <label className="block text-white/40 text-[12px] tracking-wide mb-2 uppercase">{f.label}</label>
              <div className="relative">
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none resize-none focus:border-gold/40 transition-colors duration-200"
                    onFocus={() => setFocused(f.id)}
                    onBlur={() => setFocused(null)}
                    value={form.message}
                    onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                  />
                ) : f.type === "select" ? (
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none focus:border-gold/40 transition-colors duration-200"
                    style={{ color: form.type ? "#fff" : "rgba(255,255,255,0.25)" }}
                    onFocus={() => setFocused(f.id)}
                    onBlur={() => setFocused(null)}
                    value={form.type}
                    onChange={e => setForm(v => ({ ...v, type: e.target.value }))}
                  >
                    <option value="" disabled className="bg-[#1a1915]">Vyberte...</option>
                    {f.options!.map(o => <option key={o} value={o} className="bg-[#1a1915]">{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-gold/40 transition-colors duration-200"
                    onFocus={() => setFocused(f.id)}
                    onBlur={() => setFocused(null)}
                    value={form[f.id as keyof typeof form]}
                    onChange={e => setForm(v => ({ ...v, [f.id]: e.target.value }))}
                  />
                )}
                {/* Animated bottom border */}
                <motion.span
                  className="absolute bottom-0 left-0 h-px bg-gold rounded-full"
                  style={{ width: "100%" }}
                  animate={{ scaleX: focused === f.id ? 1 : 0, originX: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.button key="idle" type="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full py-4 rounded-full bg-gold text-[#0c0b09] font-semibold text-[13px] tracking-wide hover:bg-gold-light transition-colors duration-200 relative overflow-hidden">
                Odoslať správu
              </motion.button>
            )}
            {status === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full py-4 rounded-full border border-gold/30 flex items-center justify-center gap-3 text-gold text-sm">
                <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                </motion.svg>
                Odosielam...
              </motion.div>
            )}
            {status === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="w-full py-4 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center gap-2 text-gold text-sm">
                <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                  className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <motion.path d="M20 6L9 17l-5-5" />
                </motion.svg>
                Správa odoslaná! Ozveme sa vám čoskoro.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled,     setScrolled]    = useState(false);
  const [mobileOpen,   setMobileOpen]  = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY    = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">
      <CustomCursor />

      {/* ══ NAVBAR ══ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 lg:px-10 transition-all duration-500 ${
          scrolled ? "py-3 bg-[#0c0b09]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                   : "py-5 bg-transparent"
        }`}
      >
        {/* Logo */}
        <motion.a href="#" whileHover={{ textShadow: "0 0 20px rgba(200,169,110,0.8)" }}
          className="font-display text-[22px] font-bold text-gold tracking-wide select-none z-10">
          Tchibo2Go
        </motion.a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item, i) => (
            <div key={item.label} className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(i)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={"href" in item ? item.href : "#"}
                className="relative group flex items-center gap-1 px-3 py-2 text-[13px] text-white/55 hover:text-gold transition-colors duration-200"
              >
                {item.label}
                {item.children && (
                  <svg className="w-3 h-3 opacity-40" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
                  </svg>
                )}
                {/* Underline */}
                <span className="absolute bottom-0 left-3 right-3 h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-250 ease-out" />
              </a>

              {/* Dropdown */}
              <AnimatePresence>
                {item.children && openDropdown === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 pt-2 z-50"
                  >
                    <div className="bg-[#0f0e0b]/96 backdrop-blur-2xl border border-white/[0.09] rounded-xl overflow-hidden min-w-[200px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                      {item.children.map((c, j) => (
                        <motion.a
                          key={c.label} href={c.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.04 }}
                          className="block px-5 py-2.5 text-[13px] text-white/50 hover:text-gold hover:bg-white/[0.04] transition-colors duration-150"
                        >
                          {c.label}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <FillBtn href="#kalkulator">Kalkulačka</FillBtn>
          {/* Hamburger */}
          <button className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(v => !v)}>
            {[0,1,2].map(i => (
              <motion.span key={i} className="block w-5 h-px bg-gold/70 rounded-full"
                animate={mobileOpen ? (i === 1 ? { opacity: 0 } : { rotate: i === 0 ? 45 : -45, y: i === 0 ? 6 : -6 }) : { rotate: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.22 }} />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0c0b09]/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-6">
            {NAV_ITEMS.map((item, i) => (
              <motion.a key={item.label} href={"href" in item ? item.href : "#"}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="font-display text-2xl text-white/70 hover:text-gold transition-colors"
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Particles */}
        <HeroParticles />

        {/* Rings decoration — pure CSS on compositor thread */}
        <div className="absolute inset-0 flex items-center justify-end pr-[8%] pointer-events-none overflow-hidden z-[1]">
          {([500, 700, 900] as const).map((s, i) => (
            <div key={s} className="absolute rounded-full border border-gold/[0.06]"
              style={{
                width: s, height: s,
                animation: `${i % 2 === 0 ? "orbit-cw" : "orbit-ccw"} ${30 + i * 10}s linear infinite`,
                willChange: "transform",
              }} />
          ))}
        </div>

        {/* Content */}
        <motion.div style={{ y: textY, opacity, willChange: "transform, opacity" }}
          className="relative z-[3] flex-1 flex items-center max-w-7xl mx-auto w-full px-8 xl:px-16 pt-28 pb-48">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

            {/* Left */}
            <div className="flex flex-col items-start">
              <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
                className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/30 text-gold text-[11px] tracking-[0.2em] uppercase">
                Premium Coffee Solutions
              </motion.span>

              <h1 className="font-display text-[clamp(2.8rem,5.5vw,5rem)] font-bold leading-[1.08] tracking-tight mb-7">
                {/* Word-by-word animation */}
                {"Vášeň pre kávu,".split(" ").map((w, i) => (
                  <motion.span key={i} className="inline-block mr-[0.28em]"
                    initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.35 + i * 0.1, ease: E }}>
                    {w}
                  </motion.span>
                ))}
                <br />
                <motion.span className="gradient-animate inline-block"
                  initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.7, ease: E }}>
                  profesionálne
                </motion.span>
                <br />
                {"riešenia.".split(" ").map((w, i) => (
                  <motion.span key={i} className="inline-block mr-[0.28em]"
                    initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.85 + i * 0.1, ease: E }}>
                    {w}
                  </motion.span>
                ))}
              </h1>

              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}
                className="text-white/50 text-[clamp(1rem,1.5vw,1.1rem)] max-w-md leading-[1.8] mb-10">
                Dodávame prémiové kávovary Tchibo, SAM_ID kreditný systém, servis a spotrebný materiál pre podniky po celom Slovensku.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-wrap gap-4">
                <FillBtn href="#kavovary">Naše kávovary</FillBtn>
                <FillBtn href="#kontakt" outline>Kontaktujte nás</FillBtn>
              </motion.div>
            </div>

            {/* Right — coffee machine */}
            <div className="hidden lg:flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
                className="relative w-[420px] h-[520px]"
              >
                {/* Orbital rings — pure CSS on compositor thread */}
                {([1.05, 1.22, 1.40] as const).map((s, i) => (
                  <div key={i} className="absolute inset-0 rounded-full"
                    style={{
                      border: `1px ${i === 1 ? "dashed" : "solid"} rgba(200,169,110,0.07)`,
                      transform: `scale(${s})`,
                      animation: `${i % 2 === 0 ? "orbit-cw" : "orbit-ccw"} ${22 + i * 10}s linear infinite`,
                      willChange: "transform",
                    }} />
                ))}
                {/* Glow */}
                <div className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(200,169,110,0.18) 0%, transparent 68%)", filter: "blur(30px)" }} />
                {/* Float + 3D rotate */}
                <motion.div className="absolute inset-0"
                  animate={{ y: [0, -14, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
                  <motion.div className="absolute inset-0"
                    animate={{ rotateY: [0, 6, 0, -6, 0] }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    style={{ transformPerspective: 1200 }}>
                    <Image src="http://files.exoweb.eu/17/14/171404be-2f46-4496-8b34-81eb8223662f.png"
                      alt="Tchibo kávovar" fill className="object-contain" priority unoptimized />
                  </motion.div>
                </motion.div>
                {/* Pulsing glow ring */}
                <motion.div className="absolute -inset-6 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 65%)", filter: "blur(20px)" }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.3 }}
          className="absolute bottom-0 inset-x-0 z-[3] border-t border-white/[0.07] bg-[#0c0b09]/70 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4">
            {HERO_STATS.map((s, i) => (
              <div key={s.label} className={`flex flex-col items-center gap-1 text-center py-1.5 ${i < 3 ? "border-r border-white/[0.07]" : ""}`}>
                <span className="font-display text-2xl md:text-3xl font-bold text-gold">
                  <CountUp to={s.to} suffix={s.suffix} />
                </span>
                <span className="text-[11px] text-white/32 uppercase tracking-[0.1em]">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ KÁVOVARY ACCORDION ══ */}
      <section id="kavovary" className="relative py-36 px-4 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-bg to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Naša ponuka"
            title={<>Kávovary Tchibo<br /><span className="text-white/30">pre každú prevádzku</span></>}
            sub="Vyberáme len overené modely s dlhodobou technickou podporou a zárukou servisu na celom Slovensku."
          />
          <AccordionGrid />
        </div>
      </section>

      {/* ══ KALKULAČKA ══ */}
      <section id="kalkulator" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Finančné plánovanie"
            title={<>Kalkulačka nákladov<br /><span className="text-white/30">na kávu pre vašu prevádzku</span></>}
            sub="Zadajte počet šálok denne a vyberte model kávovaru. Okamžite uvidíte reálne náklady a porovnanie s konkurenciou."
          />
          <Calculator />
        </div>
      </section>

      {/* ══ SAM_ID ══ */}
      <section id="samid" className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,169,110,0.055) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 border-y border-gold/[0.07] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.85, ease: E }}>
              <span className="text-gold text-[11px] tracking-[0.22em] uppercase">Kreditný systém</span>
              <div className="gold-divider my-3" style={{ margin: "12px 0" }} />
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-tight mb-6">
                SAM_ID<br /><span className="text-white/30">Bezhotovostná káva</span>
              </h2>
              <p className="text-white/50 text-[14px] leading-[1.9] mb-6">
                SAM_ID je inteligentný kreditný systém pre správu kávových zariadení. Každý zamestnanec má vlastnú kartu — bez hotovosti, s plnou kontrolou.
              </p>
              <ul className="space-y-3 mb-8">
                {["Bez hotovosti — platba kartou alebo čipom","Sledovanie spotreby v reálnom čase","Nastavenie kreditných limitov pre každého","Kompatibilné so všetkými modelmi Tchibo","Mesačné prehľady a reporty","Integrácia s dochádzkovým systémom"].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/55 text-sm">
                    <span className="mt-1 w-4 h-4 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2 h-2 text-gold" viewBox="0 0 8 8" fill="currentColor"><path d="M7 1L3 6 1 4" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round"/></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <FillBtn href="#kontakt">Mám záujem o SAM_ID</FillBtn>
            </motion.div>

            {/* Right — stats */}
            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.85, ease: E }}
              className="grid grid-cols-2 gap-4">
              {[
                { to: 300, suffix: "+", label: "Aktívnych SAM_ID zariadení" },
                { to: 98,  suffix: "%", label: "Zákazníkov odporúča systém" },
                { to: 12,  suffix: "s", label: "Priemerný čas identifikácie" },
                { to: 0,   suffix: "€", label: "Skrytých poplatkov" },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: E }}
                  className="rounded-2xl border border-white/[0.07] bg-card p-6 hover:border-gold/20 transition-colors duration-300">
                  <div className="font-display text-3xl font-bold text-gold mb-2">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="text-white/40 text-[12.5px] leading-relaxed">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TECHNICKÁ ÚDRŽBA ══ */}
      <section id="udrzba" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Servis a údržba"
            title={<>Technická starostlivosť<br /><span className="text-white/30">o vaše zariadenia</span></>}
            sub="Predchádzame problémom skôr, než nastanú. Pravidelná údržba predlžuje životnosť zariadenia a zaručuje kvalitnú kávu."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "💧", title: "Úprava vody (Brita)", desc: "Správna tvrdosť vody je základom dobrej kávy a dlhej životnosti kávovaru. Inštalácia a výmena filtrov Brita." },
              { icon: "🧴", title: "Hygiena (Cafetto)", desc: "Profesionálne čistenie a dezinfekcia celého systému produktmi Cafetto. Pravidelný servisný cyklus." },
              { icon: "⚙️", title: "Preventívna údržba", desc: "Pravidelné prehliadky, nastavenie mletia, kalibrácia a výmena opotrebených dielov. Záruka na prácu." },
            ].map((s, i) => (
              <div key={s.title} className="gpu" data-aos="zoom-in" data-aos-delay={String(i * 120)}>
              <TiltCard
                className="group rounded-2xl border border-white/[0.07] bg-card p-8 hover:border-gold/25 cursor-default transition-colors duration-300">
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}
                  className="text-3xl mb-5 inline-block">{s.icon}</motion.div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/45 text-[13.5px] leading-relaxed">{s.desc}</p>
              </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OBLASTI ══ */}
      <section id="oblasti" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Kde nás nájdete"
            title={<>Oblasti použitia<br /><span className="text-white/30">pre každú prevádzku</span></>}
          />
          {/* Masonry-like grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: "200px" }}>
            {AREAS.map((a, i) => (
              <motion.div key={a.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, ease: E, delay: (i % 3) * 0.08 }}
                className={`relative overflow-hidden rounded-2xl border border-white/[0.07] group cursor-default hover:border-gold/35 transition-all duration-500 ${a.span2 ? "row-span-2" : ""}`}
              >
                <Image src={a.img} alt={a.label} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gold/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Gold border animation */}
                <motion.div className="absolute inset-0 rounded-2xl border-2 border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <div className="font-display text-white font-bold text-lg leading-tight">{a.label}</div>
                  <div className="text-white/50 text-[12.5px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{a.desc}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-gold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <span>Zistiť viac</span>
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PREČO MY ══ */}
      <section id="o-nas" className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Prečo my"
            title={<>Váš spoľahlivý partner<br /><span className="gradient-animate">pre kávový biznis</span></>}
          />
          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_US.map(w => (
              <TiltCard key={w.title} variants={fadeUp}
                className="group rounded-2xl border border-white/[0.07] bg-card p-7 hover:border-gold/25 cursor-default transition-colors duration-300">
                <motion.div whileHover={{ rotate: [0, -12, 12, 0], scale: 1.1 }} transition={{ duration: 0.5 }}
                  className="text-3xl mb-5 inline-block">{w.icon}</motion.div>
                <h3 className="font-display text-[17px] font-bold text-white mb-3 leading-tight">{w.title}</h3>
                <p className="text-white/40 text-[13px] leading-relaxed">{w.desc}</p>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ REFERENCIE ══ */}
      <section className="relative py-20 px-6 border-y border-gold/[0.07]"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,169,110,0.05) 0%, transparent 70%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="font-display text-xl md:text-2xl text-white/60 leading-relaxed italic">
            „Spolupráca s Tchibo2Go nám ušetrila čas aj peniaze. Jeden kontakt, jeden partner — vždy spoľahlivý servis a výborná káva."
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-6 text-gold/70 text-sm">
            — Riaditeľ, hotelová sieť Slovakia Hotels
          </motion.div>
        </div>
      </section>

      {/* ══ KONTAKT ══ */}
      <section id="kontakt" className="relative py-28 px-6">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,169,110,0.055) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeader
            eyebrow="Kontakt"
            title={<>Napíšte nám<br /><span className="text-white/30">odpovieme do 24 hodín</span></>}
          />

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: E }}
              className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <span className="font-display text-xl font-bold text-gold">Tchibo2Go</span>
                <p className="mt-3 text-white/40 text-sm leading-[1.9]">
                  Váš partner pre kompletné kávové riešenia. Kávovary, servis, SAM_ID a spotrebný materiál — všetko z jednej ruky.
                </p>
              </div>
              {[
                { label: "E-mail",    val: "eurosam@eurosam.sk",    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Telefón",   val: "+421 911 825 134",       icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                { label: "Telefón 2", val: "+421 902 959 777",       icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                { label: "Adresa",    val: "Horná Skotňa 2717\n02401 Kysucké Nové Mesto", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d={c.icon}/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/30 text-[11px] uppercase tracking-wide mb-0.5">{c.label}</div>
                    <div className="text-white/70 text-sm whitespace-pre-line">{c.val}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: E }}
              className="lg:col-span-3">
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer id="footer" className="relative border-t border-white/[0.07] pt-16 pb-8 px-8 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,110,0.05) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="md:col-span-2">
              <span className="font-display text-2xl font-bold text-gold">Tchibo2Go</span>
              <p className="mt-4 text-white/35 text-[13px] leading-[1.85] max-w-xs">
                Prémiové kávovary Tchibo, SAM_ID kreditný systém, servis a spotrebný materiál. Váš kompletný kávový partner na Slovensku.
              </p>
              <div className="mt-6 flex gap-3">
                {(["M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
                   "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"] as string[]).map((d, i) => (
                  <motion.a key={i} href="#" whileHover={{ scale: 1.15, color: "#c8a96e", filter: "drop-shadow(0 0 8px rgba(200,169,110,0.5))" }}
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 transition-colors duration-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d={d}/>
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold text-[12px] tracking-[0.15em] uppercase mb-5">Navigácia</h4>
              <ul className="space-y-3">
                {[["Kávovary","#kavovary"],["SAM_ID","#samid"],["Technická údržba","#udrzba"],["Oblasti","#oblasti"],["O nás","#o-nas"]].map(([l,h]) => (
                  <li key={l}><a href={h} className="text-white/35 text-[13px] hover:text-gold transition-colors duration-200">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-[12px] tracking-[0.15em] uppercase mb-5">Kontakt</h4>
              <ul className="space-y-3 text-white/35 text-[13px]">
                <li>eurosam@eurosam.sk</li>
                <li>+421 911 825 134</li>
                <li>+421 902 959 777</li>
                <li className="leading-relaxed">Horná Skotňa 2717<br />02401 Kysucké Nové Mesto</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-white/22 text-[12px]">
            <span>© 2024 Tchibo2Go. Všetky práva vyhradené.</span>
            {/* Scroll to top */}
            <motion.button whileHover={{ scale: 1.1, color: "#c8a96e" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-white/30 hover:text-gold transition-colors duration-200">
              <motion.svg whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
              Späť hore
            </motion.button>
          </div>
        </div>
      </footer>
    </div>
  );
}
