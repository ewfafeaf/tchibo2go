"use client";
import { useEffect, useRef } from "react";

type P = { x: number; y: number; bx: number; by: number; vx: number; vy: number; r: number; a: number };

export default function HeroParticles({ n = 55 }: { n?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const mouse  = { x: -9999, y: -9999 };
    let ps: P[]  = [];
    let raf = 0;

    function init() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ps = Array.from({ length: n }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return { x, y, bx: x, by: y, vx: 0, vy: 0, r: Math.random() * 1.8 + 0.5, a: Math.random() * 0.38 + 0.08 };
      });
    }
    init();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    window.addEventListener("mousemove", onMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const R = 110;
      ps.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < R && d > 0) {
          const f = ((R - d) / R) * 2.8;
          p.vx += (dx / d) * f * 0.055;
          p.vy += (dy / d) * f * 0.055;
        }
        p.vx += (p.bx - p.x) * 0.009;
        p.vy += (p.by - p.y) * 0.009;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x  += p.vx;
        p.y  += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [n]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[2]" />;
}
