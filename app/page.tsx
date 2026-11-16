import Link from "next/link";
import Skyline from "@/components/Skyline";
import ThaiMap from "@/components/ThaiMap";
import { CATS, CRITERIA, label, REGIONS } from "@/lib/content";
import { homeStats, listProblems } from "@/lib/queries";
import { getContext } from "@/lib/session";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const thaiDigits = (n: number) => String(n).replace(/\d/g, (d) => "๐๑๒๓๔๕๖๗๘๙"[Number(d)]);

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const region = REGIONS.some((r) => r[0] === one(sp.region)) ? one(sp.region) : "";
  const cat = CATS.some((c) => c[0] === one(sp.cat)) ? one(sp.cat) : "";
  const sort = ["seen", "sol"].includes(one(sp.sort)) ? one(sp.sort) : "new";

  const { lang, t } = await getContext();
  const [stats, rows] = await Promise.all([homeStats(), listProblems({ region, cat, sort })]);
  const beYear = new Date().getFullYear() + 543;
  const hrefFor = (r?: string) => {
    const q = new URLSearchParams();
    if (r) q.set("region", r);
    if (cat) q.set("cat", cat);
    if (sort !== "new") q.set("sort", sort);
    const s = q.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <>
      <div className="hero">
        <div className="wrap heroin">
          <div>
            <p className="eyebrow">{lang === "th" ? `พ.ศ. ${thaiDigits(beYear)} → ${thaiDigits(2600)}` : `B.E. ${beYear} → 2600 · พ.ศ. ${thaiDigits(2600)}`}</p>
            <h1>{t.h1}</h1>
            <p className="lede">{t.lede}</p>
            <blockquote className="quote">{t.quote}</blockquote>
            <div className="heroact">
              <Link className="btn primary" href="/new">{t.propose}</Link>
              <a className="btn ghost" href="#how">{t.howBtn}</a>
            </div>
            <dl className="stats">
              <div><dd>{Math.max(0, 2600 - beYear)}</dd><dt>{t.stYears}</dt></div>
              <div><dd>{stats.problems}</dd><dt>{t.stProblems}</dt></div>
              <div><dd>{stats.solutions}</dd><dt>{t.stPitches}</dt></div>
            </dl>
          </div>
          <ThaiMap counts={stats.byRegion} selected={region || undefined} lang={lang} hrefFor={hrefFor} />
        </div>
        <Skyline />
      </div>

      <div className="wrap">
        <div className="toolbar">
          <h2>{region ? `${t.listIn} ${label(REGIONS, region, lang)}` : t.listAll}</h2>
          <form method="get" action="/">
            {region ? <input type="hidden" name="region" value={region} /> : null}
            <select name="cat" defaultValue={cat} aria-label={t.fCat}>
              <option value="">{t.allCats}</option>
              {CATS.map(([k]) => <option key={k} value={k}>{label(CATS, k, lang)}</option>)}
            </select>
            <select name="sort" defaultValue={sort} aria-label="Sort">
              <option value="new">{t.sortNew}</option>
              <option value="seen">{t.sortSeen}</option>
              <option value="sol">{t.sortSol}</option>
            </select>
            <button className="btn" type="submit">{t.apply}</button>
          </form>
        </div>
        {rows.length ? (
          <div className="rows">
            {rows.map((p) => (
              <Link key={p.id} className="row" href={`/p/${p.id}`}>
                <div>
                  <span className="tag">{label(CATS, p.cat, lang)} · {label(REGIONS, p.region, lang)}{p.example ? ` · ${t.example}` : ""}</span>
                  <h3>{p.title}</h3>
                  <p className="excerpt">{p.body}</p>
                </div>
                <div className="meta">
                  <div><b>{p.seen}</b><span>{t.mSeen}</span></div>
                  <div><b>{p.sols}</b><span>{t.mSol}</span></div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>{t.emptyF}</p>
            <Link className="btn" href="/">{t.clear}</Link>
          </div>
        )}
      </div>

      <div className="wrap how" id="how">
        <div>
          <h2>{t.howTitle}</h2>
          <ol className="steps">
            <li><b>{t.s1t}</b><br />{t.s1}</li>
            <li><b>{t.s2t}</b><br />{t.s2}</li>
            <li><b>{t.s3t}</b><br />{t.s3}</li>
          </ol>
        </div>
        <div>
          <h2>{t.critTitle}</h2>
          <ul className="crit">
            {CRITERIA.map((c) => (
              <li key={c.en}><b>{lang === "th" ? c.th : c.en}</b><span className="muted">{lang === "th" ? c.dth : c.den}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
