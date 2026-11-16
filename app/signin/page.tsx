import { redirect } from "next/navigation";
import { signInWith } from "@/app/actions";
import { hasDevSignIn, hasGoogle, hasLine } from "@/auth";
import { getContext } from "@/lib/session";

export default async function SignIn({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { stale } = await searchParams;
  const { t, userId } = await getContext();
  // "stale" means the session points at an account that no longer exists, so let them sign in again.
  if (userId && !stale) redirect("/");
  return (
    <div className="wrap page">
      <div className="signin">
        <h1 style={{ fontSize: "1.6rem" }}>{t.siTitle}</h1>
        <p className="muted">{t.siLede}</p>
        <form action={signInWith}>
          <input type="hidden" name="provider" value="line" />
          <button className="btn line" type="submit" disabled={!hasLine}>{t.siLine}{hasLine ? "" : ` (${t.siNotSet})`}</button>
        </form>
        <form action={signInWith}>
          <input type="hidden" name="provider" value="google" />
          <button className="btn" type="submit" disabled={!hasGoogle}>{t.siGoogle}{hasGoogle ? "" : ` (${t.siNotSet})`}</button>
        </form>
        {hasDevSignIn ? (
          <>
            <hr />
            <form className="form" action={signInWith}>
              <input type="hidden" name="provider" value="dev" />
              <h2 style={{ fontSize: "1.05rem" }}>{t.siDev}</h2>
              <p className="muted small">{t.siDevHint}</p>
              <div className="field"><label htmlFor="devName">{t.siDevName}</label><input type="text" id="devName" name="name" required maxLength={40} /></div>
              <button className="btn primary" type="submit">{t.siDevGo}</button>
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
}
