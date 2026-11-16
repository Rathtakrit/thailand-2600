import Link from "next/link";
import { label, MAP, REGIONS, RKEY, type Lang } from "@/lib/content";

/** Dot map of Thailand by region. Dots and chips link to the region filter; the selected one links back to everything. */
export default function ThaiMap({ counts, selected, lang, hrefFor }: { counts: Record<string, number>; selected?: string; lang: Lang; hrefFor: (region?: string) => string }) {
  const to = (r: string) => hrefFor(selected === r ? undefined : r);
  return (
    <div className="mapbox">
      <svg className="map" viewBox="0 0 172 304" role="img" aria-label={lang === "th" ? "แผนที่ประเทศไทยตามภูมิภาค" : "Thailand by region"}>
        {MAP.flatMap((row, y) =>
          [...row].map((ch, x) => {
            const r = RKEY[ch];
            if (!r) return null;
            const n = counts[r] ?? 0;
            return (
              <a key={`${x}-${y}`} href={to(r)}>
                <circle className={`dot${n ? " has" : ""}${selected === r ? " sel" : ""}`} cx={x * 12 + 8} cy={y * 12 + 8} r={ch === "B" ? 5 : 4.2} opacity={n ? Math.min(1, 0.45 + n * 0.14) : 1}>
                  <title>{`${label(REGIONS, r, lang)}: ${n}`}</title>
                </circle>
              </a>
            );
          }),
        )}
      </svg>
      <div className="chips">
        {REGIONS.map(([key]) => (
          <Link key={key} className={`chip${selected === key ? " sel" : ""}`} href={to(key)} aria-current={selected === key ? "true" : undefined}>
            <span>{label(REGIONS, key, lang)}</span>
            <span className="num">{counts[key] ?? 0}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
