"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/content";

export type DrawLabels = Pick<Dict, "drawHint" | "drawUndo" | "drawClear" | "drawDone" | "drawCancel" | "drawColour" | "thin" | "mid" | "thick">;

// The drawing's own pixel size. On screen the canvas scales to the width available.
const W = 1200, H = 900;
const COLOURS = ["#1b1f4b", "#e08a00", "#c0392b", "#2e8b57", "#2a7fd6", "#ffffff"];
const SIZES: [number, keyof DrawLabels][] = [[5, "thin"], [10, "mid"], [22, "thick"]];

type Stroke = { colour: string; size: number; points: [number, number][] };

function paintStroke(ctx: CanvasRenderingContext2D, s: Stroke, from = 0) {
  ctx.strokeStyle = ctx.fillStyle = s.colour;
  ctx.lineWidth = s.size;
  ctx.lineCap = ctx.lineJoin = "round";
  if (s.points.length === 1) {
    ctx.beginPath();
    ctx.arc(s.points[0][0], s.points[0][1], s.size / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.beginPath();
  const start = Math.max(0, from - 1);
  ctx.moveTo(s.points[start][0], s.points[start][1]);
  for (let i = start + 1; i < s.points.length; i++) ctx.lineTo(s.points[i][0], s.points[i][1]);
  ctx.stroke();
}

/** A finger-first drawing pad. Strokes are kept as a list so Undo is exact and cheap on a phone. */
export default function DrawPad({ backgroundUrl, t, onDone, onCancel }: { backgroundUrl?: string; t: DrawLabels; onDone: (drawing: Blob) => void; onCancel: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const background = useRef<HTMLImageElement | null>(null);
  const [colour, setColour] = useState(COLOURS[0]);
  const [size, setSize] = useState(SIZES[1][0]);
  const [count, setCount] = useState(0);
  const [hasBackground, setHasBackground] = useState(false);

  const redraw = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    const bg = background.current;
    if (bg) {
      const k = Math.min(W / bg.naturalWidth, H / bg.naturalHeight);
      const w = bg.naturalWidth * k, h = bg.naturalHeight * k;
      ctx.drawImage(bg, (W - w) / 2, (H - h) / 2, w, h);
    }
    for (const s of strokes.current) paintStroke(ctx, s);
  }, []);

  useEffect(() => {
    redraw();
    if (!backgroundUrl) return;
    const img = new Image();
    img.onload = () => {
      background.current = img;
      setHasBackground(true);
      redraw();
    };
    img.src = backgroundUrl;
    return () => {
      img.onload = null;
    };
  }, [backgroundUrl, redraw]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height];
  };

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    current.current = { colour, size, points: [point(e)] };
    const ctx = e.currentTarget.getContext("2d");
    if (ctx) paintStroke(ctx, current.current);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    const s = current.current;
    if (!s) return;
    const before = s.points.length;
    s.points.push(point(e));
    const ctx = e.currentTarget.getContext("2d");
    if (ctx) paintStroke(ctx, s, before);
  }
  function up() {
    if (!current.current) return;
    strokes.current.push(current.current);
    current.current = null;
    setCount(strokes.current.length);
  }
  function undo() {
    strokes.current.pop();
    setCount(strokes.current.length);
    redraw();
  }
  function clear() {
    strokes.current = [];
    setCount(0);
    redraw();
  }
  function done() {
    canvas.current?.toBlob((blob) => blob && onDone(blob), "image/jpeg", 0.88);
  }

  return (
    <div className="pad">
      <span className="muted small">{t.drawHint}</span>
      <div className="padbar" role="group" aria-label={t.drawColour}>
        {COLOURS.map((c, i) => (
          <button key={c} type="button" className={`sw${colour === c ? " on" : ""}`} style={{ background: c }} aria-label={`${t.drawColour} ${i + 1}`} aria-pressed={colour === c} onClick={() => setColour(c)} />
        ))}
      </div>
      <div className="padbar">
        {SIZES.map(([n, key]) => (
          <button key={n} type="button" className={`btn${size === n ? " on" : ""}`} aria-pressed={size === n} onClick={() => setSize(n)}>{t[key]}</button>
        ))}
        <span className="grow" />
        <button type="button" className="btn" disabled={count === 0} onClick={undo}>{t.drawUndo}</button>
        <button type="button" className="btn" disabled={count === 0} onClick={clear}>{t.drawClear}</button>
      </div>
      <canvas ref={canvas} className="padcanvas" width={W} height={H} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      <div className="acts" style={{ marginTop: 0 }}>
        <button type="button" className="btn primary" disabled={count === 0 && !hasBackground} onClick={done}>{t.drawDone}</button>
        <button type="button" className="link" onClick={onCancel}>{t.drawCancel}</button>
      </div>
    </div>
  );
}
