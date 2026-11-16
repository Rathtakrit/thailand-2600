import Link from "next/link";
import { listVisuals } from "@/lib/queries";
import { getContext } from "@/lib/session";

export default async function Visuals() {
  const { t } = await getContext();
  const items = await listVisuals();
  return (
    <div className="wrap page">
      <div className="pagehead">
        <h1>{t.visHead}</h1>
        <p className="muted">{t.visLede}</p>
      </div>
      {items.length === 0 ? (
        <div className="empty"><p className="muted">{t.visEmpty}</p></div>
      ) : (
        <div className="gallery">
          {items.map((s) => (
            <Link key={s.id} className="shot" href={`/p/${s.problemId}#s-${s.id}`}>
              {s.imageId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/files/${s.imageId}`} alt={`${t.picAlt} ${s.title}`} loading="lazy" />
              ) : (
                <span className="shotmodel">{t.visModelOnly}</span>
              )}
              <h2>{s.title}</h2>
              <p className="small muted">{t.forProblem}: {s.problemTitle}</p>
              <p className="small">
                {s.authorName ?? t.someone} · <span className="num">{s.final ? `${s.final.total.toFixed(1)} ${t.outOf}` : t.notJudged}</span> · <span className="num">{s.likes}</span> {t.likesWord}
                {s.modelId && s.imageId ? <> · <span className="pill">{t.visHas3d}</span></> : null}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
