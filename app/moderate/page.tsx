import Link from "next/link";
import { moderateVisual } from "@/app/actions";
import ModelView from "@/components/ModelView";
import { isModerator } from "@/lib/moderation";
import { listReported } from "@/lib/queries";
import { getContext } from "@/lib/session";

export default async function Moderate() {
  const { t, userId } = await getContext();
  if (!isModerator(userId)) {
    return (
      <div className="wrap page">
        <div className="pagehead">
          <h1>{t.modHead}</h1>
          <p className="muted">{t.modNot}</p>
          {userId ? <p className="small">{t.modYourId} <code>{userId}</code>. {t.modHow}</p> : <p className="small"><Link href="/signin?next=%2Fmoderate">{t.signIn}</Link></p>}
        </div>
      </div>
    );
  }
  const items = await listReported();
  const Act = ({ id, what, text, primary }: { id: string; what: string; text: string; primary?: boolean }) => (
    <form action={moderateVisual}>
      <input type="hidden" name="solutionId" value={id} />
      <input type="hidden" name="what" value={what} />
      <button className={primary ? "btn primary" : "btn"} type="submit">{text}</button>
    </form>
  );
  return (
    <div className="wrap page">
      <div className="pagehead">
        <h1>{t.modHead}</h1>
        <p className="muted">{t.modLede}</p>
      </div>
      {items.length === 0 ? <div className="empty"><p className="muted">{t.modEmpty}</p></div> : null}
      {items.map((s) => (
        <article className="sol" key={s.id} style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem" }}><Link href={`/p/${s.problemId}#s-${s.id}`}>{s.title}</Link></h2>
            <p className="muted small">{s.authorName ?? t.someone} · <span className="num">{s.reports}</span> {s.reports === 1 ? t.modReport : t.modReports}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {s.imageId ? <img className="vis" src={`/files/${s.imageId}`} alt={`${t.picAlt} ${s.title}`} /> : null}
          {s.modelId ? <ModelView src={`/files/${s.modelId}`} alt={`${t.modelAlt} ${s.title}`} hint={t.modelRotate} loading={t.modelLoading} /> : null}
          <div className="acts" style={{ marginTop: 0 }}>
            {s.imageId ? <Act id={s.id} what="image" text={t.modRemovePic} primary /> : null}
            {s.modelId ? <Act id={s.id} what="model" text={t.modRemoveModel} primary /> : null}
            <Act id={s.id} what="keep" text={t.modKeep} />
          </div>
        </article>
      ))}
    </div>
  );
}
