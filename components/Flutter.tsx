"use client";

import { useEffect, useRef } from "react";

type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number; colour: string };
type Fly = { x: number; y: number; ox: number; oy: number; phase: number; colour: string; size: number };

const GLITTER = ["#f7c948", "#ff9cc0", "#9fe0cb", "#ffffff", "#ffd9e6"];

/**
 * Butterflies that follow the pointer and a trail of glitter behind it.
 * Drawn on one see-through layer over the page; it never blocks clicks.
 * Switched off for visitors who ask their device for less motion.
 */
export default function Flutter() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0, h = 0, frame = 0, last = 0;
    const target = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.35 };
    const sparks: Spark[] = [];
    const flies: Fly[] = [
      { x: target.x, y: target.y, ox: -46, oy: -34, phase: 0, colour: "#ff8fb8", size: 13 },
      { x: target.x, y: target.y, ox: 52, oy: -18, phase: 2, colour: "#8fd9c2", size: 10 },
      { x: target.x, y: target.y, ox: 8, oy: 48, phase: 4, colour: "#ffd166", size: 8 },
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => {
      const far = Math.hypot(e.clientX - target.x, e.clientY - target.y);
      target.x = e.clientX;
      target.y = e.clientY;
      for (let i = 0; i < Math.min(4, 1 + far / 14) && sparks.length < 160; i++) {
        sparks.push({
          x: target.x + (Math.random() - 0.5) * 16, y: target.y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 0.8, vy: 0.2 + Math.random() * 0.9,
          life: 1, size: 2 + Math.random() * 4, colour: GLITTER[Math.floor(Math.random() * GLITTER.length)],
        });
      }
    };

    const star = (s: Spark) => {
      const r = s.size * (0.5 + s.life * 0.5);
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = s.colour;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - r);
      ctx.quadraticCurveTo(s.x, s.y, s.x + r, s.y);
      ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + r);
      ctx.quadraticCurveTo(s.x, s.y, s.x - r, s.y);
      ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - r);
      ctx.fill();
    };
    const butterfly = (f: Fly, t: number, dx: number) => {
      const flap = 0.25 + 0.75 * Math.abs(Math.sin(t * 0.012 + f.phase));
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(Math.max(-0.5, Math.min(0.5, dx * 0.04)));
      ctx.globalAlpha = 0.95;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.scale(side * flap, 1);
        ctx.fillStyle = f.colour;
        ctx.beginPath();
        ctx.ellipse(f.size * 0.6, -f.size * 0.35, f.size * 0.7, f.size * 0.55, -0.5, 0, Math.PI * 2);
        ctx.ellipse(f.size * 0.45, f.size * 0.4, f.size * 0.45, f.size * 0.4, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.beginPath();
        ctx.arc(f.size * 0.7, -f.size * 0.4, f.size * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = "#5b2940";
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size * 0.12, f.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const tick = (t: number) => {
      const dt = Math.min(40, t - last) / 16.7;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= 0.016 * dt;
        if (s.life <= 0) sparks.splice(i, 1);
        else star(s);
      }
      ctx.globalAlpha = 1;
      for (const f of flies) {
        const wobbleX = Math.sin(t * 0.0013 + f.phase) * 18, wobbleY = Math.cos(t * 0.0017 + f.phase) * 14;
        const dx = (target.x + f.ox + wobbleX - f.x) * 0.045 * dt;
        f.x += dx;
        f.y += (target.y + f.oy + wobbleY - f.y) * 0.045 * dt;
        butterfly(f, t, dx);
      }
      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} className="flutter" aria-hidden="true" />;
}
