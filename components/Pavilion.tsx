/** A drawn Thai pavilion (sala) with lotus flowers, for the top of the About page. Decoration only. */
export default function Pavilion() {
  const lotus = (x: number, y: number, s: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="pv-stem" d="M0 0 C-2 14 2 26 0 44" />
      <path className="pv-petal2" d="M0 2 C-20 -4 -26 -22 -22 -30 C-10 -24 -2 -12 0 2Z" />
      <path className="pv-petal2" d="M0 2 C20 -4 26 -22 22 -30 C10 -24 2 -12 0 2Z" />
      <path className="pv-petal" d="M0 2 C-12 -8 -12 -28 0 -40 C12 -28 12 -8 0 2Z" />
      <path className="pv-petal" d="M0 2 C-14 0 -22 -10 -30 -12 C-24 0 -12 6 0 2Z" />
      <path className="pv-petal" d="M0 2 C14 0 22 -10 30 -12 C24 0 12 6 0 2Z" />
    </g>
  );
  const leaf = (x: number, y: number, r: number, key: string) => (
    <g key={key}>
      <path className="pv-stem" d={`M${x} ${y} V${y + 40}`} />
      <ellipse className="pv-leaf" cx={x} cy={y} rx={r} ry={r * 0.45} />
    </g>
  );
  const columns = [118, 186, 398, 466];
  return (
    <svg className="pavilion" viewBox="0 0 600 300" aria-hidden="true" focusable="false">
      {/* roof: three stacked tiers, each with upturned tips */}
      <g className="pv-roof">
        <path d="M300 14 L424 74 H176Z" />
        <path d="M176 70 H424 L486 110 H114Z" className="pv-roof2" />
        <path d="M114 106 H486 L548 150 H52Z" />
      </g>
      <g className="pv-tip">
        <path d="M300 16 C298 4 304 -4 316 -8 C308 0 308 8 306 18Z" />
        <path d="M178 74 C162 72 152 62 150 48 C158 60 168 64 184 66Z" />
        <path d="M422 74 C438 72 448 62 450 48 C442 60 432 64 416 66Z" />
        <path d="M116 110 C98 108 86 96 84 80 C94 94 106 100 124 102Z" />
        <path d="M484 110 C502 108 514 96 516 80 C506 94 494 100 476 102Z" />
        <path d="M54 150 C34 148 20 134 18 116 C30 132 44 140 64 142Z" />
        <path d="M546 150 C566 148 580 134 582 116 C570 132 556 140 536 142Z" />
      </g>
      <path className="pv-gable" d="M300 32 L376 70 H224Z" />
      <circle className="pv-gold" cx="300" cy="56" r="7" />
      <g className="pv-line">
        <path d="M140 92 H460 M92 130 H508 M214 60 H386" />
      </g>
      {/* beam, columns, balustrade, steps */}
      <rect className="pv-beam" x="96" y="150" width="408" height="12" rx="2" />
      {columns.map((x) => (
        <g key={x}>
          <rect className="pv-col" x={x} y="162" width="16" height="88" />
          <rect className="pv-beam" x={x - 4} y="162" width="24" height="7" rx="2" />
          <rect className="pv-beam" x={x - 4} y="243" width="24" height="7" rx="2" />
        </g>
      ))}
      <path className="pv-arch" d="M212 250 V206 C212 160 388 160 388 206 V250" />
      {[140, 152, 164, 176, 420, 432, 444, 456].map((x) => <rect key={x} className="pv-col" x={x} y="222" width="5" height="28" rx="2" />)}
      <path className="pv-line" d="M134 222 H186 M414 222 H466" />
      <path className="pv-line" d="M300 162 V184" />
      <path className="pv-gold" d="M292 184 H308 L312 204 H288Z" />
      <rect className="pv-base" x="84" y="250" width="432" height="12" rx="2" />
      <rect className="pv-base2" x="60" y="262" width="480" height="12" rx="2" />
      <rect className="pv-base" x="36" y="274" width="528" height="12" rx="2" />
      {/* lotus pond on both sides */}
      {leaf(34, 262, 26, "l1")}
      {leaf(72, 276, 20, "l2")}
      {leaf(566, 262, 26, "l3")}
      {leaf(528, 276, 20, "l4")}
      {lotus(52, 236, 0.8, "f1")}
      {lotus(20, 262, 0.55, "f2")}
      {lotus(548, 236, 0.8, "f3")}
      {lotus(582, 262, 0.55, "f4")}
    </svg>
  );
}
