import { redirect } from "next/navigation";
import { createProblem } from "@/app/actions";
import { CATS, label, REGIONS } from "@/lib/content";
import { getContext } from "@/lib/session";

export default async function NewProblem() {
  const { lang, t, userId } = await getContext();
  if (!userId) redirect("/signin");
  return (
    <div className="wrap page">
      <form className="form" action={createProblem}>
        <h1 style={{ fontSize: "1.6rem" }}>{t.dpTitle}</h1>
        <div className="field"><label htmlFor="pTitle">{t.dpName}</label><input type="text" id="pTitle" name="title" required minLength={6} maxLength={160} /></div>
        <div className="field"><label htmlFor="pBody">{t.dpBody}</label><textarea id="pBody" name="body" required minLength={30} maxLength={3000} /></div>
        <div className="two">
          <div className="field">
            <label htmlFor="pCat">{t.fCat}</label>
            <select id="pCat" name="cat">{CATS.map(([k]) => <option key={k} value={k}>{label(CATS, k, lang)}</option>)}</select>
          </div>
          <div className="field">
            <label htmlFor="pRegion">{t.fRegion}</label>
            <select id="pRegion" name="region">{REGIONS.map(([k]) => <option key={k} value={k}>{label(REGIONS, k, lang)}</option>)}</select>
          </div>
        </div>
        <div><button className="btn primary" type="submit">{t.dpSubmit}</button></div>
      </form>
    </div>
  );
}
