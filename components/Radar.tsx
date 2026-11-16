import { CRITERIA, type Lang } from "@/lib/content";
import type { Scores } from "@/lib/scoring";

/** Six-axis score chart. The filled shape is the final score; the dashed outline is the AI judge alone. */
export default function Radar({ final, ai, lang }: { final: Scores | null; ai: Scores | null; lang: Lang }) {
  const cx = 150, cy = 108, R = 72;
  const pt = (i: number, v: number) => {
    const a = ((-90 + 60 * i) * Math.PI) / 180, r = (R * v) / 10;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const poly = (f: (k: (typeof CRITERIA)[number]) => number) => CRITERIA.map((c, i) => pt(i, f(c)).map((n) => n.toFixed(1)).join(",")).join(" ");
  const name = (c: (typeof CRITERIA)[number]) => (lang === "th" ? c.th : c.en);
  return (
    <svg className="radar" viewBox="0 0 300 216" role="img" aria-label={CRITERIA.map((c) => `${name(c)} ${final ? final[c.k].toFixed(1) : "–"}`).join(", ")}>
      {[10, 5].map((lv) => <polygon key={lv} points={poly(() => lv)} fill="none" stroke="var(--line)" strokeWidth="1" />)}
      {CRITERIA.map((c, i) => {
        const [x, y] = pt(i, 10);
        return <line key={c.k} x1={cx} y1={cy} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="var(--line)" strokeWidth="1" />;
      })}
      {final ? <polygon points={poly((c) => final[c.k])} fill="var(--accent)" fillOpacity="0.35" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" /> : null}
      {ai ? <polygon points={poly((c) => ai[c.k])} fill="none" stroke="var(--ink)" strokeWidth="1.2" strokeDasharray="3 3" /> : null}
      {CRITERIA.map((c, i) => {
        const [x, y] = pt(i, 12.2);
        return <text key={c.k} x={x.toFixed(1)} y={(y + 4).toFixed(1)} textAnchor={i === 0 || i === 3 ? "middle" : i < 3 ? "start" : "end"}>{name(c)}</text>;
      })}
    </svg>
  );
}
