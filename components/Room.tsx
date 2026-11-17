/**
 * The home-page picture: a Thai living room of today, with a TV showing a lively Thailand in 2600.
 * One drawing made in code; every moving part is a CSS animation (see ".room" in globals.css),
 * and all of them stop for visitors who ask their device for less motion.
 */
export default function Room({ year, label, tvLabel }: { year: number; label: string; tvLabel: string }) {
  const towers: [number, number, number, string][] = [
    [8, 62, 20, "a"], [30, 48, 16, "b"], [62, 56, 22, "c"], [88, 40, 18, "a"], [110, 60, 24, "b"],
    [138, 46, 18, "c"], [160, 58, 20, "a"], [184, 66, 26, "b"], [214, 54, 18, "c"],
  ];
  return (
    <svg className="room" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice">
      <title>{label}</title>
      <defs>
        <clipPath id="rm-screen"><rect x="200" y="130" width="240" height="140" rx="4" /></clipPath>
        <linearGradient id="rm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fd3ee" /><stop offset="0.7" stopColor="#c9f1e4" /><stop offset="1" stopColor="#ffe9b8" />
        </linearGradient>
        <radialGradient id="rm-glow"><stop offset="0" stopColor="#bff2ff" stopOpacity="0.75" /><stop offset="1" stopColor="#bff2ff" stopOpacity="0" /></radialGradient>
      </defs>

      {/* wall and floor */}
      <rect className="rm-wall" width="640" height="352" />
      <rect className="rm-floor" y="352" width="640" height="128" />
      <rect className="rm-skirt" y="346" width="640" height="8" />
      <g className="rm-plank"><path d="M0 392 H640 M0 436 H640 M120 352 V392 M360 352 V392 M560 352 V392 M240 392 V436 M470 392 V436 M90 436 V480 M330 436 V480 M600 436 V480" /></g>

      {/* window onto today's street */}
      <rect className="rm-frame" x="36" y="46" width="128" height="158" rx="4" />
      <rect className="rm-today" x="44" y="54" width="112" height="142" />
      <path className="rm-wire" d="M44 92 Q100 108 156 88 M44 104 Q100 122 156 100" />
      <path className="rm-block" d="M44 196 V150 H70 V132 H96 V160 H124 V140 H156 V196Z" />
      <path className="rm-frame" d="M98 54 H102 V196 H98Z M44 122 H156 V126 H44Z" />
      <path className="rm-curtain" d="M30 40 H76 C70 90 66 150 50 212 H30Z M170 40 H124 C130 90 134 150 150 212 H170Z" />
      <rect className="rm-rod" x="24" y="36" width="152" height="6" rx="3" />

      {/* wall clock and a calendar showing this year */}
      <circle className="rm-frame" cx="330" cy="62" r="26" />
      <circle className="rm-paper" cx="330" cy="62" r="21" />
      <path className="rm-hand" d="M330 62 V48" />
      <path className="rm-hand rm-tick" d="M330 62 V44" />
      <g>
        <rect className="rm-paper" x="492" y="56" width="84" height="112" rx="3" />
        <rect className="rm-cal" x="492" y="56" width="84" height="30" rx="3" />
        <text className="rm-caltop" x="534" y="77" textAnchor="middle">{year}</text>
        <path className="rm-calline" d="M504 100 H564 M504 114 H564 M504 128 H564 M504 142 H550" />
        <circle className="rm-cal" cx="534" cy="154" r="3" />
      </g>

      {/* TV glow, cabinet and TV */}
      <ellipse className="rm-glow" cx="320" cy="210" rx="250" ry="170" fill="url(#rm-glow)" />
      <rect className="rm-wood" x="168" y="300" width="304" height="58" rx="4" />
      <path className="rm-wood2" d="M180 312 H312 V348 H180Z M328 312 H460 V348 H328Z" />
      <circle className="rm-knob" cx="246" cy="330" r="4" /><circle className="rm-knob" cx="394" cy="330" r="4" />
      <path className="rm-wood" d="M182 358 H196 V372 H182Z M444 358 H458 V372 H444Z" />
      {/* the TV is the way in: a link down to the problems */}
      <a href="#problems" className="rm-tvlink" aria-label={tvLabel}>
      <rect className="rm-tv" x="190" y="120" width="260" height="160" rx="8" />
      <path className="rm-tv" d="M300 280 H340 V292 H366 V300 H274 V292 H300Z" />

      {/* what the TV shows: Thailand in 2600 */}
      <g clipPath="url(#rm-screen)">
        <g transform="translate(200 130)">
          <rect width="240" height="140" fill="url(#rm-sky)" />
          <circle className="rm-sun" cx="196" cy="30" r="15" />
          <g className="rm-cloud c1"><ellipse cx="0" cy="24" rx="20" ry="6" /><ellipse cx="12" cy="19" rx="12" ry="6" /></g>
          <g className="rm-cloud c2"><ellipse cx="0" cy="46" rx="16" ry="5" /><ellipse cx="-9" cy="42" rx="10" ry="5" /></g>
          {towers.map(([x, top, w, c], i) => (
            <g key={x}>
              <rect className={`rm-tower ${c}`} x={x} y={top} width={w} height={118 - top} rx="3" />
              <ellipse className="rm-green" cx={x + w / 2} cy={top} rx={w / 2 + 1} ry="4.5" />
              <rect className={`rm-lit l${i % 3}`} x={x + 4} y={top + 12} width="4" height="5" rx="1" />
              <rect className={`rm-lit l${(i + 1) % 3}`} x={x + w - 8} y={top + 24} width="4" height="5" rx="1" />
              <rect className={`rm-lit l${(i + 2) % 3}`} x={x + 4} y={top + 36} width="4" height="5" rx="1" />
            </g>
          ))}
          {/* a golden chedi among the towers */}
          <path className="rm-gold" d="M48 118 V100 C48 90 52 88 52 80 L54 52 L56 80 C56 88 60 90 60 100 V118Z" />
          {/* wind turbines */}
          <path className="rm-mast" d="M226 118 V64 M206 118 V78" />
          <g className="rm-spin t1"><path d="M226 64 V48 M226 64 L240 72 M226 64 L212 72" /></g>
          <g className="rm-spin t2"><path d="M206 78 V66 M206 78 L216 84 M206 78 L196 84" /></g>
          {/* sky train on its rail */}
          <path className="rm-rail" d="M0 100 H240 M22 100 V118 M82 100 V118 M142 100 V118 M202 100 V118" />
          <g className="rm-train"><rect x="0" y="89" width="62" height="10" rx="5" /><path className="rm-trainwin" d="M8 92 H18 M24 92 H34 M40 92 H50" /></g>
          {/* air taxis and kites */}
          <g className="rm-taxi x1"><ellipse cx="0" cy="38" rx="9" ry="4" /><path d="M-8 33 H8" /></g>
          <g className="rm-taxi x2"><ellipse cx="0" cy="60" rx="7" ry="3" /><path d="M-6 56 H6" /></g>
          <g className="rm-kite k1"><path d="M150 26 L156 34 L150 44 L144 34Z" /><path className="rm-kitestring" d="M150 44 Q146 60 152 76" /></g>
          <g className="rm-kite k2"><path d="M96 16 L101 22 L96 30 L91 22Z" /><path className="rm-kitestring" d="M96 30 Q93 42 98 54" /></g>
          {/* park and canal in front */}
          <rect className="rm-park" y="112" width="240" height="10" />
          {[14, 40, 74, 104, 132, 170, 196, 226].map((x) => <circle key={x} className="rm-green" cx={x} cy="112" r="6" />)}
          <rect className="rm-water" y="122" width="240" height="18" />
          <path className="rm-ripple" d="M10 128 H30 M60 134 H86 M120 127 H140 M170 133 H200" />
          <g className="rm-boat"><path d="M0 126 H34 L40 121 L30 130 H4Z" /><path className="rm-boatroof" d="M8 119 H24 V124 H8Z" /></g>
          {/* channel mark */}
          <rect className="rm-bug" x="8" y="8" width="52" height="16" rx="8" />
          <circle className="rm-live" cx="17" cy="16" r="3" />
          <text className="rm-bugtext" x="25" y="20">2600</text>
          <rect className="rm-shine" x="-40" y="-20" width="26" height="200" />
        </g>
      </g>
      {/* glitter that appears when the pointer is on the TV: the sign that it can be clicked */}
      <g className="rm-glitter">
        <path className="rm-spark a" d="M196 109 Q196 118 205 118 Q196 118 196 127 Q196 118 187 118 Q196 118 196 109Z" />
        <path className="rm-spark b" d="M238 106 Q238 112 244 112 Q238 112 238 118 Q238 112 232 112 Q238 112 238 106Z" />
        <path className="rm-spark c" d="M300 100 Q300 108 308 108 Q300 108 300 116 Q300 108 292 108 Q300 108 300 100Z" />
        <path className="rm-spark a" d="M366 108 Q366 114 372 114 Q366 114 366 120 Q366 114 360 114 Q366 114 366 108Z" />
        <path className="rm-spark b" d="M446 110 Q446 120 456 120 Q446 120 446 130 Q446 120 436 120 Q446 120 446 110Z" />
        <path className="rm-spark c" d="M458 169 Q458 176 465 176 Q458 176 458 183 Q458 176 451 176 Q458 176 458 169Z" />
        <path className="rm-spark a" d="M452 228 Q452 236 460 236 Q452 236 452 244 Q452 236 444 236 Q452 236 452 228Z" />
        <path className="rm-spark b" d="M440 278 Q440 284 446 284 Q440 284 440 290 Q440 284 434 284 Q440 284 440 278Z" />
        <path className="rm-spark c" d="M380 283 Q380 290 387 290 Q380 290 380 297 Q380 290 373 290 Q380 290 380 283Z" />
        <path className="rm-spark a" d="M262 282 Q262 288 268 288 Q262 288 262 294 Q262 288 256 288 Q262 288 262 282Z" />
        <path className="rm-spark b" d="M198 273 Q198 282 207 282 Q198 282 198 291 Q198 282 189 282 Q198 282 198 273Z" />
        <path className="rm-spark c" d="M182 213 Q182 220 189 220 Q182 220 182 227 Q182 220 175 220 Q182 220 182 213Z" />
        <path className="rm-spark a" d="M184 154 Q184 160 190 160 Q184 160 184 166 Q184 160 178 160 Q184 160 184 154Z" />
        <path className="rm-spark b" d="M250 155 Q250 160 255 160 Q250 160 250 165 Q250 160 245 160 Q250 160 250 155Z" />
        <path className="rm-spark c" d="M330 144 Q330 150 336 150 Q330 150 330 156 Q330 150 324 150 Q330 150 330 144Z" />
        <path className="rm-spark a" d="M400 185 Q400 190 405 190 Q400 190 400 195 Q400 190 395 190 Q400 190 400 185Z" />
        <path className="rm-spark b" d="M290 225 Q290 230 295 230 Q290 230 290 235 Q290 230 285 230 Q290 230 290 225Z" />
        <path className="rm-spark c" d="M360 244 Q360 250 366 250 Q360 250 360 256 Q360 250 354 250 Q360 250 360 244Z" />
      </g>
      </a>

      {/* low shelf with a reed diffuser: a small bottle with scent sticks */}
      <rect className="rm-wood" x="56" y="292" width="92" height="66" rx="3" />
      <path className="rm-wood2" d="M64 300 H140 V324 H64Z M64 330 H140 V352 H64Z" />
      <path className="rm-reed" d="M100 266 L84 214 M101 266 L94 208 M102 266 L103 204 M103 266 L112 208 M104 266 L122 216" />
      <rect className="rm-bottle" x="88" y="266" width="28" height="26" rx="6" />
      <rect className="rm-oil" x="90" y="278" width="24" height="12" rx="4" />
      <rect className="rm-bottleneck" x="96" y="258" width="12" height="10" rx="2" />

      {/* standing fan */}
      <ellipse className="rm-fanbase" cx="556" cy="408" rx="34" ry="9" />
      <rect className="rm-fanbase" x="552" y="282" width="8" height="126" />
      <circle className="rm-fancage" cx="556" cy="262" r="42" />
      <g className="rm-blades"><path d="M556 262 C546 240 566 232 556 262 C578 252 586 272 556 262 C566 284 546 292 556 262 C534 272 526 252 556 262Z" /></g>
      <circle className="rm-fanring" cx="556" cy="262" r="42" /><circle className="rm-fanring" cx="556" cy="262" r="27" />
      <circle className="rm-fanbase" cx="556" cy="262" r="7" />

      {/* floor mat, triangle pillow, a cat watching TV, flip-flops, a plant */}
      <path className="rm-mat" d="M170 404 H470 L520 462 H120Z" />
      <path className="rm-matline" d="M160 416 H480 M148 430 H492 M136 446 H506" />
      <path className="rm-pillow" d="M150 430 L196 430 L173 388Z" />
      <path className="rm-pillow2" d="M158 424 H188 M164 412 H182" />
      <g className="rm-cat">
        <path className="rm-tail" d="M352 432 C372 434 380 420 372 408" />
        <ellipse cx="330" cy="424" rx="24" ry="17" />
        <circle cx="314" cy="402" r="13" />
        <path d="M304 394 L302 380 L312 390Z M318 390 L326 380 L326 394Z" />
      </g>
      <g className="rm-flop"><ellipse cx="560" cy="456" rx="20" ry="8" /><ellipse cx="596" cy="446" rx="20" ry="8" /></g>
      <path className="rm-strap" d="M548 456 L562 452 L572 458 M584 446 L598 442 L608 448" />
      <path className="rm-pot" d="M14 404 H50 L46 440 H18Z" />
      <path className="rm-leafy" d="M32 404 C10 384 12 356 20 344 C28 362 34 384 32 404 C34 380 46 362 58 356 C56 378 46 394 32 404Z" />
    </svg>
  );
}
