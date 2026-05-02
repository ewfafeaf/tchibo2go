"use client";
import { useEffect, useRef } from "react";

type Trail = { x: number; y: number; age: number };

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only on pointer-fine devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("custom-cursor");

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const mouse  = { x: -300, y: -300 };
    const cursor = { x: -300, y: -300 };
    const trail: Trail[] = [];
    let hovering = false;
    let raf = 0;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      trail.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.length > 22) trail.shift();
    }
    function onOver(e: MouseEvent) {
      hovering = !!(e.target as HTMLElement).closest("a,button,[role=button],input,select,textarea");
    }
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp cursor
      cursor.x += (mouse.x - cursor.x) * 0.16;
      cursor.y += (mouse.y - cursor.y) * 0.16;

      // Age & draw trail
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        const t = 1 - trail[i].age / 22;
        if (t <= 0) { trail.splice(i, 1); continue; }
        const r = t * 3.5;
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,169,110,${t * 0.5})`;
        ctx.fill();
      }

      const { x, y } = cursor;
      const ring = hovering ? 20 : 13;

      // Glow halo
      const g = ctx.createRadialGradient(x, y, 0, x, y, ring * 2.5);
      g.addColorStop(0, `rgba(200,169,110,${hovering ? 0.14 : 0.08})`);
      g.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(x, y, ring * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, ring, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200,169,110,${hovering ? 0.7 : 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(x, y, hovering ? 3 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,169,110,0.95)";
      ctx.fill();

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[9998] pointer-events-none" />;
}
