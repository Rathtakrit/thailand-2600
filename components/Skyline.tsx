/**
 * A drawn Thai street along the bottom of the page top: rows of shophouses with shutters, awnings,
 * balconies, water tanks and laundry; a chedi; an elevated train; a food cart, a songthaew and a
 * tuk-tuk; utility poles with sagging wires; and a red-and-white kerb. By day the sun is out; by
 * night the moon is, and the windows glow. Flat shapes only, coloured from the tokens in globals.css.
 */

const GROUND = 166;
const SHOP_H = 30; // ground floor
const FLOOR_H = 24; // each floor above it

type Unit = { w: number; floors: number; wall: number; shop: boolean; top: "tank" | "laundry" | "none"; sign?: string };
const u = (w: number, floors: number, wall: number, shop: boolean, top: Unit["top"], sign?: string): Unit => ({ w, floors, wall, shop, top, sign });

// Left to right. "chedi" leaves a gap for the temple.
const STREET: (Unit | "chedi")[] = [
  u(52, 3, 1, true, "tank"), u(48, 4, 3, false, "none"), u(56, 3, 5, true, "laundry", "กาแฟ"), u(50, 2, 2, false, "tank"),
  "chedi",
  u(54, 4, 4, true, "none", "ข้าวแกง"), u(48, 3, 6, false, "laundry"), u(58, 3, 1, true, "tank"), u(50, 4, 2, false, "none"),
  u(52, 2, 3, true, "laundry", "ซักรีด"), u(56, 4, 5, false, "tank"), u(50, 3, 4, true, "none"), u(54, 3, 6, true, "laundry", "ของชำ"),
  u(48, 4, 1, false, "tank"), u(56, 2, 2, true, "none"), u(52, 3, 3, false, "laundry"), u(58, 4, 5, true, "tank", "ก๋วยเตี๋ยว"),
  u(50, 3, 4, false, "none"), u(54, 2, 6, true, "laundry"), u(52, 4, 1, true, "tank"), u(56, 3, 2, false, "none"), u(52, 3, 3, true, "laundry"),
];
const CHEDI_W = 96;

function Shophouse({ x, unit, n }: { x: number; unit: Unit; n: number }) {
  const { w, floors, wall, shop, top, sign } = unit;
  const h = SHOP_H + floors * FLOOR_H, roofY = GROUND - h;
  const winW = (w - 18) / 2;
  return (
    <g>
      <rect className={`sk-wall w${wall}`} x={x} y={roofY} width={w} height={h} />
      {/* Parapet: the flat roof edge every shophouse has. */}
      <rect className="sk-trim" x={x - 1} y={roofY - 3} width={w + 2} height={4} />
      {top === "tank" ? (
        <g>
          <rect className="sk-trim" x={x + w - 22} y={roofY - 8} width={2} height={6} /><rect className="sk-trim" x={x + w - 10} y={roofY - 8} width={2} height={6} />
          <rect className="sk-tank" x={x + w - 25} y={roofY - 19} width={20} height={12} rx={3} />
        </g>
      ) : null}
      {top === "laundry" ? (
        <g>
          <rect className="sk-trim" x={x + 6} y={roofY - 15} width={1.5} height={13} /><rect className="sk-trim" x={x + w - 8} y={roofY - 15} width={1.5} height={13} />
          <path className="sk-string" d={`M${x + 7},${roofY - 14} Q${x + w / 2},${roofY - 10} ${x + w - 7},${roofY - 14}`} />
          {[0.22, 0.4, 0.58, 0.76].map((t, i) => <rect key={i} className={`sk-flag f${((i + n) % 4) + 1}`} x={x + 7 + (w - 14) * t - 3} y={roofY - 12} width={6} height={7} />)}
        </g>
      ) : null}
      {Array.from({ length: floors }, (_, f) => {
        const y = roofY + 7 + f * FLOOR_H;
        return (
          <g key={f}>
            {[0, 1].map((c) => {
              const wx = x + 6 + c * (winW + 6);
              // Some windows stay dark so the lit ones read as lit at night.
              const lit = (f * 3 + c * 5 + n) % 4 !== 0;
              return (
                <g key={c}>
                  <rect className={lit ? "sk-win" : "sk-win off"} x={wx} y={y} width={winW} height={11} rx={1} />
                  <rect className="sk-trim" x={wx + winW / 2 - 0.5} y={y} width={1} height={11} />
                </g>
              );
            })}
            {/* Balcony rail under the windows, and an air-conditioner box on some floors. */}
            <path className="sk-rail-line" d={`M${x + 3},${y + 15} H${x + w - 3}`} />
            {(f + n) % 3 === 0 ? <rect className="sk-ac" x={x + w - 9} y={y + 12} width={8} height={6} rx={1} /> : null}
          </g>
        );
      })}
      {shop ? (
        <g>
          <rect className="sk-dark" x={x + 4} y={GROUND - 22} width={w - 8} height={22} />
          <polygon className={`sk-awn a${(n % 2) + 1}`} points={`${x},${GROUND - 26} ${x + w},${GROUND - 26} ${x + w + 4},${GROUND - 19} ${x - 4},${GROUND - 19}`} />
          <rect className="sk-win" x={x + 8} y={GROUND - 14} width={w - 16} height={8} rx={1} />
        </g>
      ) : (
        <g>
          {/* Folding metal shutter, closed. */}
          <rect className="sk-shutter" x={x + 4} y={GROUND - 24} width={w - 8} height={24} />
          {Array.from({ length: Math.floor((w - 8) / 5) }, (_, i) => <rect key={i} className="sk-trim thin" x={x + 6 + i * 5} y={GROUND - 24} width={0.8} height={24} />)}
        </g>
      )}
      {sign ? (
        <g>
          <rect className={`sk-sign s${(n % 3) + 1}`} x={x + 3} y={GROUND - SHOP_H - 9} width={w - 6} height={11} rx={1.5} />
          <text className="sk-signtext" x={x + w / 2} y={GROUND - SHOP_H - 0.8} textAnchor="middle">{sign}</text>
        </g>
      ) : null}
    </g>
  );
}

function Chedi({ cx }: { cx: number }) {
  return (
    <g className="sk-gold">
      <rect x={cx - 40} y={GROUND - 8} width={80} height={8} />
      <rect x={cx - 32} y={GROUND - 16} width={64} height={8} />
      <rect x={cx - 24} y={GROUND - 24} width={48} height={8} />
      {/* Bell, then rings narrowing to the spire. */}
      <path d={`M${cx - 21},${GROUND - 24} C${cx - 21},${GROUND - 52} ${cx - 7},${GROUND - 56} ${cx - 6},${GROUND - 64} H${cx + 6} C${cx + 7},${GROUND - 56} ${cx + 21},${GROUND - 52} ${cx + 21},${GROUND - 24} Z`} />
      <rect x={cx - 8} y={GROUND - 68} width={16} height={4} rx={1} />
      <polygon points={`${cx - 6},${GROUND - 68} ${cx + 6},${GROUND - 68} ${cx},${GROUND - 112}`} />
      <circle cx={cx} cy={GROUND - 113} r={2.2} />
    </g>
  );
}

// Work out where each building stands once, left to right.
const LAYOUT = (() => {
  const placed: { x: number; unit: Unit; n: number }[] = [];
  let x = -20, chediX = 0;
  STREET.forEach((item, n) => {
    if (item === "chedi") {
      chediX = x + CHEDI_W / 2;
      x += CHEDI_W;
    } else {
      placed.push({ x, unit: item, n });
      x += item.w;
    }
  });
  return { placed, chediX };
})();

export default function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1200 180" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <circle className="sk-orb" cx={648} cy={17} r={13} />
      <circle className="sk-orb-bite" cx={654} cy={13} r={11.5} />
      {[[120, 26], [330, 14], [500, 30], [840, 18], [1010, 30], [1130, 12], [760, 10], [60, 12]].map(([sx, sy], i) => (
        <path key={i} className="sk-star" d={`M${sx},${sy - 5} l1.4,3.6 3.6,1.4 -3.6,1.4 -1.4,3.6 -1.4,-3.6 -3.6,-1.4 3.6,-1.4z`} />
      ))}
      <path className="sk-cloud" d="M900,30 a12,12 0 0 1 22,-6 a15,15 0 0 1 28,4 a10,10 0 0 1 4,18 h-52 a9,9 0 0 1 -2,-16z" />
      <path className="sk-cloud" d="M170,34 a10,10 0 0 1 18,-5 a12,12 0 0 1 23,3 a8,8 0 0 1 3,15 h-42 a8,8 0 0 1 -2,-13z" />

      {/* Elevated train: concrete beam on T-shaped pillars, one carriage with a stripe. */}
      {[90, 290, 490, 690, 890, 1090].map((px) => (
        <g key={px} className="sk-concrete"><rect x={px - 4} y={44} width={8} height={122} /><rect x={px - 14} y={40} width={28} height={6} rx={2} /></g>
      ))}
      <rect className="sk-concrete" x={0} y={34} width={1200} height={7} />
      <g>
        <rect className="sk-train" x={700} y={14} width={150} height={20} rx={6} />
        <rect className="sk-stripe" x={700} y={27} width={150} height={3} />
        {[710, 732, 754, 776, 798, 820].map((wx) => <rect key={wx} className="sk-win" x={wx} y={18} width={15} height={7} rx={1.5} />)}
      </g>

      <Chedi cx={LAYOUT.chediX} />
      {LAYOUT.placed.map((b) => <Shophouse key={b.n} x={b.x} unit={b.unit} n={b.n} />)}

      {/* Utility poles with sagging wires, as on any Thai street. */}
      {[214, 618, 1022].map((px) => (
        <g key={px} className="sk-pole"><rect x={px} y={78} width={3} height={88} /><rect x={px - 9} y={84} width={21} height={2.5} /><rect x={px - 6} y={92} width={15} height={2} /></g>
      ))}
      {[84, 88, 93].map((wy, i) => (
        <path key={wy} className="sk-wire" d={`M-10,${wy + 6} Q100,${wy + 18 + i * 2} 215,${wy} Q417,${wy + 22 + i * 3} 619,${wy} Q821,${wy + 22 + i * 3} 1023,${wy} Q1120,${wy + 16 + i * 2} 1210,${wy + 6}`} />
      ))}

      {/* Food cart with its umbrella and two plastic stools. */}
      <g>
        <rect className="sk-pole" x={352} y={128} width={1.5} height={30} />
        <path className="sk-flag f1" d="M330,130 a23,13 0 0 1 15,-12 v12z" /><path className="sk-flag f3" d="M345,118 a23,13 0 0 1 15,0 v12 h-15z" /><path className="sk-flag f2" d="M360,118 a23,13 0 0 1 15,12 h-15z" />
        <rect className="sk-cart" x={334} y={146} width={38} height={13} rx={1.5} /><rect className="sk-win" x={338} y={140} width={30} height={6} rx={1} />
        <circle className="sk-dark" cx={364} cy={161} r={5} /><circle className="sk-win" cx={364} cy={161} r={1.6} />
        <polygon className="sk-flag f4" points="380,157 388,157 390,166 378,166" /><polygon className="sk-flag f2" points="394,157 402,157 404,166 392,166" />
      </g>

      {/* Songthaew: a pickup with a roofed passenger bed. */}
      <g>
        <rect className="sk-truck" x={742} y={144} width={66} height={16} rx={2} /><rect className="sk-truck" x={730} y={150} width={16} height={10} rx={2} />
        <rect className="sk-truck" x={760} y={134} width={50} height={4} rx={1.5} /><rect className="sk-truck" x={762} y={136} width={2} height={10} /><rect className="sk-truck" x={805} y={136} width={2} height={10} />
        <rect className="sk-win" x={746} y={146} width={11} height={6} rx={1} /><rect className="sk-stripe" x={762} y={151} width={46} height={2.5} />
        <circle className="sk-dark" cx={748} cy={161} r={5} /><circle className="sk-dark" cx={796} cy={161} r={5} />
      </g>

      {/* Tuk-tuk. */}
      <g>
        <path className="sk-tuk" d="M1090,146 q0,-12 12,-12 h22 q6,0 6,6 v6z" /><rect className="sk-tuk" x={1084} y={146} width={50} height={12} rx={3} />
        <rect className="sk-win" x={1096} y={138} width={12} height={8} rx={1} />
        <circle className="sk-dark" cx={1092} cy={161} r={4.5} /><circle className="sk-dark" cx={1126} cy={161} r={4.5} />
      </g>

      {/* Red-and-white kerb, then the ground the rest of the page stands on. */}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} className={i % 2 ? "sk-kerb b" : "sk-kerb"} x={i * 20} y={GROUND} width={20} height={5} />)}
      <rect className="sk-ground" x={0} y={GROUND + 5} width={1200} height={10} />
    </svg>
  );
}
