/**
 * A drawn town along the bottom of the page top: houses, a temple roof, a tall tower and a raised
 * train line, with bunting strung between rooftops. By day the sun is out; by night the moon is,
 * and the windows glow. Flat shapes only, coloured from the tokens in globals.css.
 */

const GROUND = 150;

type Roof = "gable" | "flat" | "dome" | "tiered";
// [left edge, width, height, roof shape, wall colour 1-4, roof colour 1-3]
const BUILDINGS: [number, number, number, Roof, number, number][] = [
  [-10, 70, 46, "gable", 1, 1], [64, 54, 70, "flat", 3, 2], [122, 78, 40, "gable", 2, 3], [204, 46, 92, "dome", 4, 1],
  [254, 84, 52, "tiered", 1, 2], [342, 60, 64, "gable", 3, 1], [406, 50, 38, "flat", 2, 3], [460, 72, 58, "gable", 4, 2],
  [536, 44, 104, "dome", 3, 1], [584, 86, 44, "gable", 1, 3], [674, 58, 72, "flat", 2, 2], [736, 90, 54, "tiered", 4, 1],
  [830, 62, 42, "gable", 3, 3], [896, 48, 84, "dome", 1, 2], [948, 80, 50, "gable", 2, 1], [1032, 56, 66, "flat", 4, 3],
  [1092, 74, 44, "gable", 1, 2], [1170, 60, 60, "gable", 3, 1],
];
// Bunting hangs between these rooftop points: [x1, y1, x2, y2].
const BUNTING: [number, number, number, number][] = [[91, 80, 227, 46], [366, 66, 558, 38], [703, 78, 920, 58]];

function roof(x: number, w: number, top: number, kind: Roof, cls: string) {
  const mid = x + w / 2;
  if (kind === "gable") return <polygon className={cls} points={`${x - 5},${top} ${mid},${top - w * 0.42} ${x + w + 5},${top}`} />;
  if (kind === "dome") return (
    <g className={cls}>
      <path d={`M${x},${top} a${w / 2},${w / 2} 0 0 1 ${w},0 z`} />
      <rect x={mid - 1.5} y={top - w / 2 - 16} width={3} height={18} />
      <circle cx={mid} cy={top - w / 2 - 18} r={3.5} />
    </g>
  );
  if (kind === "tiered") return (
    <g className={cls}>
      <polygon points={`${x - 8},${top} ${mid},${top - 20} ${x + w + 8},${top}`} />
      <polygon points={`${x + 8},${top - 13} ${mid},${top - 34} ${x + w - 8},${top - 13}`} />
      <polygon points={`${x + 22},${top - 27} ${mid},${top - 50} ${x + w - 22},${top - 27}`} />
      <rect x={mid - 1.2} y={top - 62} width={2.4} height={14} />
    </g>
  );
  return <rect className={cls} x={x - 3} y={top - 5} width={w + 6} height={6} rx={2} />;
}

function windows(x: number, w: number, top: number, h: number) {
  const cols = Math.max(1, Math.floor((w - 12) / 18)), rows = Math.max(1, Math.floor((h - 14) / 22));
  const gap = (w - cols * 9) / (cols + 1);
  const out = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    // Leave a few windows dark so the lit ones read as lit.
    const lit = (c * 3 + r * 5 + Math.round(x)) % 4 !== 0;
    out.push(<rect key={`${r}-${c}`} className={lit ? "sk-win" : "sk-win off"} x={x + gap + c * (9 + gap)} y={top + 10 + r * 22} width={9} height={12} rx={2} />);
  }
  return out;
}

export default function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1200 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <circle className="sk-orb" cx={640} cy={52} r={22} />
      <circle className="sk-orb-bite" cx={650} cy={46} r={19} />
      {[[120, 30], [300, 18], [470, 40], [820, 24], [1010, 36], [1130, 16], [560, 14], [220, 52]].map(([x, y], i) => (
        <path key={i} className="sk-star" d={`M${x},${y - 5} l1.4,3.6 3.6,1.4 -3.6,1.4 -1.4,3.6 -1.4,-3.6 -3.6,-1.4 3.6,-1.4z`} />
      ))}
      <path className="sk-cloud" d="M890,40 a12,12 0 0 1 22,-6 a15,15 0 0 1 28,4 a10,10 0 0 1 4,18 h-52 a9,9 0 0 1 -2,-16z" />
      <path className="sk-cloud" d="M150,56 a10,10 0 0 1 18,-5 a12,12 0 0 1 23,3 a8,8 0 0 1 3,15 h-42 a8,8 0 0 1 -2,-13z" />

      {/* Raised train line with one rounded carriage: the "2600" part of the town. */}
      <rect className="sk-rail" x={0} y={84} width={1200} height={4} rx={2} />
      {[60, 240, 420, 600, 780, 960, 1140].map((x) => <rect key={x} className="sk-rail" x={x} y={86} width={5} height={66} />)}
      <g>
        <rect className="sk-train" x={440} y={68} width={92} height={17} rx={8.5} />
        {[452, 470, 488, 506].map((x) => <rect key={x} className="sk-win" x={x} y={72} width={11} height={7} rx={2} />)}
      </g>

      {BUILDINGS.map(([x, w, h, kind, wall, top]) => (
        <g key={x}>
          <rect className={`sk-wall w${wall}`} x={x} y={GROUND - h} width={w} height={h + 12} />
          {roof(x, w, GROUND - h, kind, `sk-roof r${top}`)}
          {windows(x, w, GROUND - h, h)}
        </g>
      ))}

      {BUNTING.map(([x1, y1, x2, y2], n) => {
        const sag = 14, flags = Math.round((x2 - x1) / 18);
        const at = (t: number): [number, number] => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + sag * 4 * t * (1 - t)];
        return (
          <g key={n}>
            <path className="sk-string" d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + sag * 2} ${x2},${y2}`} />
            {Array.from({ length: flags - 1 }, (_, i) => {
              const [fx, fy] = at((i + 1) / flags);
              return <polygon key={i} className={`sk-flag f${(i % 4) + 1}`} points={`${fx - 4.5},${fy} ${fx + 4.5},${fy} ${fx},${fy + 10}`} />;
            })}
          </g>
        );
      })}

      <rect className="sk-ground" x={0} y={GROUND} width={1200} height={12} />
    </svg>
  );
}
