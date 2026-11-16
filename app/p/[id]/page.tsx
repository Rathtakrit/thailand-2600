import Link from "next/link";
import { addComment, askJudge, removeOwn, saveReview, toggleLike, toggleVote, translate } from "@/app/actions";
import AutoRefresh from "@/components/AutoRefresh";
import ModelView from "@/components/ModelView";
import PitchForm from "@/components/PitchForm";
import Radar from "@/components/Radar";
import { aiEnabled } from "@/lib/ai";
import { CATS, CRITERIA, label, REGIONS, type Dict, type Lang } from "@/lib/content";
import { getProblem } from "@/lib/queries";
import { finalScore } from "@/lib/scoring";
import { fmtDate, getContext } from "@/lib/session";

const hasThai = (s: string) => /[฀-๿]/.test(s);

function Remove({ kind, rid, label: text }: { kind: string; rid: string; label: string }) {
  return (
    <form action={removeOwn} className="inline">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={rid} />
      <button className="link small" type="submit">{text}</button>
    </form>
  );
}

/** Translate button, or the show original / show translation toggle once a translation exists. */
function TrControl({ kind, id, problemId, foreign, translated, showOrig, canAsk, t }: { kind: string; id: string; problemId: string; foreign: boolean; translated: boolean; showOrig: boolean; canAsk: boolean; t: Dict }) {
  if (!foreign) return null;
  if (translated) return showOrig ? <Link className="link small" href={`/p/${problemId}`}>{t.showTr}</Link> : <Link className="link small" href={`/p/${problemId}?orig=1`}>{t.showOrig}</Link>;
  if (!canAsk) return null;
  return (
    <form action={translate} className="inline">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="problemId" value={problemId} />
      <button className="link small" type="submit">{t.trTo}</button>
    </form>
  );
}

export default async function ProblemPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { lang, t, userId } = await getContext();
  const data = await getProblem(id, userId, lang);

  if (!data) {
    return (
      <div className="wrap page">
        <Link className="back" href="/">{t.back}</Link>
        <p>{t.notFound}</p>
      </div>
    );
  }
  const { problem: p, sols, comments, liked, seenByMe, reviewsBy, myReviews, tr } = data;
  const showOrig = sp.orig === "1";
  const ai = aiEnabled();
  const canAsk = ai && !!userId;
  const foreign = (text: string) => (hasThai(text) ? "th" : "en") !== (lang as Lang);
  const pick = (kind: string, rid: string) => (showOrig ? undefined : tr.get(`${kind}:${rid}`));
  const pTr = pick("problem", p.id);

  const ranked = sols
    .map((s) => ({ s, status: s.status, final: finalScore(s.ai?.scores, reviewsBy.get(s.id) ?? []) }))
    .sort((a, b) => (b.final?.total ?? -1) - (a.final?.total ?? -1) || b.s.likes - a.s.likes);
  const anyPending = ranked.some((r) => r.status === "pending");

  return (
    <div className="wrap page">
      {anyPending ? <AutoRefresh /> : null}
      <Link className="back" href="/">{t.back}</Link>
      {sp.limit === "1" ? <p className="notice">{t.limitHit}</p> : null}
      <div className="phead">
        <span className="tag">{label(CATS, p.cat, lang)} · {label(REGIONS, p.region, lang)}{p.example ? ` · ${t.example}` : ""}</span>
        <h1>{pTr?.title ?? p.title}</h1>
        <p className="prose">{pTr?.body ?? p.body}</p>
        <div className="muted small" style={{ marginTop: 10 }}>
          {t.by} {p.authorName ?? t.someone} · {fmtDate(p.createdAt, lang)}{" "}
          <TrControl kind="problem" id={p.id} problemId={p.id} foreign={foreign(p.title + p.body)} translated={tr.has(`problem:${p.id}`)} showOrig={showOrig} canAsk={canAsk} t={t} />
        </div>
        <div className="acts">
          <form action={toggleVote}>
            <input type="hidden" name="problemId" value={p.id} />
            <button className={`btn${seenByMe ? " on" : ""}`} type="submit" aria-pressed={seenByMe}>{seenByMe ? t.seen : t.seeToo} · <span className="num">{p.seen}</span></button>
          </form>
          {userId && p.authorId === userId ? <Remove kind="problem" rid={p.id} label={t.remove} /> : null}
        </div>
      </div>

      <h2 className="sec">{t.solsT} · <span className="num">{sols.length}</span></h2>
      {sols.length === 0 ? <p className="muted">{t.noSols}</p> : null}
      {ranked.map(({ s, status, final }) => {
        const cs = comments.filter((c) => c.solutionId === s.id);
        const isLiked = liked.has(s.id);
        const sTr = pick("solution", s.id);
        const mine = myReviews.get(s.id);
        const isAuthor = !!userId && s.authorId === userId;
        const statusText = status === "pending" ? t.judging : status === "failed" ? t.judgeFailed : status === "refused" ? t.judgeRefused : ai ? t.notJudged : t.judgeOff;
        const basis = !final ? "" : final.hasAi ? (final.people ? `${t.aiPlus} ${final.people}` : t.aiOnly) : `${t.peopleOnly} ${final.people}`;
        return (
          <article className="sol" key={s.id}>
            <div className="solside">
              <Radar final={final?.by ?? null} ai={s.ai?.scores ?? null} lang={lang} />
              {final ? (
                <>
                  <div className="total">{final.total.toFixed(1)} <small>{t.outOf}</small></div>
                  <div className="muted small">{basis}</div>
                </>
              ) : null}
              {status !== "done" ? <div className={`muted small${status === "pending" ? " pulse" : ""}`}>{statusText}</div> : null}
              {isAuthor && ai && (status === "none" || status === "failed") ? (
                <form action={askJudge}>
                  <input type="hidden" name="solutionId" value={s.id} />
                  <button className="btn" type="submit">{t.askAi}</button>
                </form>
              ) : null}
            </div>

            <div className="solmain">
              <div>
                <h3>{sTr?.title ?? s.title}</h3>
                <div className="muted small">
                  {t.by} {s.authorName ?? t.someone} · {fmtDate(s.createdAt, lang)}{" "}
                  <TrControl kind="solution" id={s.id} problemId={p.id} foreign={foreign(s.title + s.body)} translated={tr.has(`solution:${s.id}`)} showOrig={showOrig} canAsk={canAsk} t={t} />
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {s.imageId ? <img className="vis" src={`/files/${s.imageId}`} alt={`${t.picAlt} ${s.title}`} loading="lazy" /> : null}
              {s.modelId ? <ModelView src={`/files/${s.modelId}`} alt={`${t.modelAlt} ${s.title}`} hint={t.modelRotate} loading={t.modelLoading} /> : null}
              <p className="prose">{sTr?.body ?? s.body}</p>

              {s.ai ? (
                <dl className="verdict">
                  {s.ai.objection ? <div><dt>{t.objection}</dt><dd>{sTr?.objection ?? s.ai.objection}</dd></div> : null}
                  {s.ai.improve ? <div><dt>{t.improve}</dt><dd>{sTr?.improve ?? s.ai.improve}</dd></div> : null}
                  {s.ai.vision ? <div><dt>{t.vision}</dt><dd className="vision">{sTr?.vision ?? s.ai.vision}</dd></div> : null}
                </dl>
              ) : null}

              {final ? (
                <div className="crows">
                  {CRITERIA.map((c) => {
                    const note = sTr?.[`n_${c.k}`] ?? s.ai?.notes[c.k];
                    return (
                      <div className="crow" key={c.k}>
                        <span>{lang === "th" ? c.th : c.en}</span>
                        <span className="bar"><i style={{ width: `${final.by[c.k] * 10}%` }} /></span>
                        <span className="v num">{final.by[c.k].toFixed(1)}</span>
                        {s.ai ? <span className="note">{t.ai} {s.ai.scores[c.k]}{note ? ` · ${note}` : ""}</span> : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="acts" style={{ marginTop: 0 }}>
                <form action={toggleLike}>
                  <input type="hidden" name="solutionId" value={s.id} />
                  <button className={`btn${isLiked ? " on" : ""}`} type="submit" aria-pressed={isLiked}>{isLiked ? t.liked : t.like} · <span className="num">{s.likes}</span></button>
                </form>
                {isAuthor ? <Remove kind="solution" rid={s.id} label={t.remove} /> : null}
              </div>

              {userId ? (
                <details className="review">
                  <summary>{mine ? t.adjusted : t.adjust}</summary>
                  <form className="form" action={saveReview} key={JSON.stringify(mine ?? s.ai?.scores ?? null)}>
                    <input type="hidden" name="solutionId" value={s.id} />
                    <p className="muted small">{t.drHint}</p>
                    <div className="scoregrid">
                      {CRITERIA.map((c) => (
                        <label key={c.k}>
                          <span>{lang === "th" ? c.th : c.en}</span>
                          <select name={c.k} defaultValue={String(mine?.[c.k] ?? s.ai?.scores[c.k] ?? 5)}>
                            {Array.from({ length: 11 }, (_, n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </label>
                      ))}
                    </div>
                    <div><button className="btn primary" type="submit">{t.saveScores}</button></div>
                  </form>
                </details>
              ) : null}

              <div className="cmts">
                <h4>{t.comments} · <span className="num">{cs.length}</span></h4>
                {cs.map((c) => (
                  <div className="cmt" key={c.id}>
                    <div className="small muted">
                      {c.authorName ?? t.someone} · {fmtDate(c.createdAt, lang)}{" "}
                      <TrControl kind="comment" id={c.id} problemId={p.id} foreign={foreign(c.body)} translated={tr.has(`comment:${c.id}`)} showOrig={showOrig} canAsk={canAsk} t={t} />{" "}
                      {userId && c.authorId === userId ? <Remove kind="comment" rid={c.id} label={t.remove} /> : null}
                    </div>
                    <p>{pick("comment", c.id)?.body ?? c.body}</p>
                  </div>
                ))}
                {userId ? (
                  <form className="cform" action={addComment}>
                    <input type="hidden" name="solutionId" value={s.id} />
                    <input type="text" name="body" maxLength={600} required aria-label={t.cPh} placeholder={t.cPh} />
                    <button className="btn" type="submit">{t.cSend}</button>
                  </form>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}

      {userId ? (
        <details className="pitch" open={sols.length === 0}>
          <summary>{t.pitchBtn}</summary>
          <PitchForm problemId={p.id} t={t} />
        </details>
      ) : (
        <p className="notice" style={{ marginTop: 28 }}>{t.needSignIn} <Link href="/signin">{t.signIn}</Link></p>
      )}
    </div>
  );
}
