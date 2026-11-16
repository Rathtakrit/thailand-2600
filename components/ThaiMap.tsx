import Link from "next/link";
import { dict, label, MAP, REGIONS, RKEY, type Lang } from "@/lib/content";
import Map3D from "./Map3D";

/**
 * The map on the home page: a 3D block map of the provinces, with a list of regions beside it.
 * The flat dot map is what shows while the 3D map loads, and what stays on devices that cannot draw 3D.
 * The region list is the way in for keyboards and screen readers.
 */
export default function ThaiMap({ counts, selected, lang, hrefFor }: { counts: Record<string, number>; selected?: string; lang: Lang; hrefFor: (region?: string) => string }) {
  const to = (r: string) => hrefFor(selected === r ? undefined : r);
  const t = dict(lang);
  return (
    <div className="mapbox">
      <Map3D
        counts={counts}
        selected={selected}
        thai={lang === "th"}
        regionNames={Object.fromEntries(REGIONS.map(([key]) => [key, label(REGIONS, key, lang)]))}
        hrefs={Object.fromEntries(REGIONS.map(([key]) => [key, hrefFor(key)]))}
        labels={{ hint: t.mapHint, show: t.mapShow, aria: t.mapAria }}
      >
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
      </Map3D>
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
