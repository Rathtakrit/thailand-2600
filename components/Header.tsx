import Link from "next/link";
import { setLang, signOutNow } from "@/app/actions";
import { getContext } from "@/lib/session";

export default async function Header() {
  const { lang, t, userId, userName, userImage } = await getContext();
  return (
    <header className="top">
      <div className="wrap topin">
        <Link className="brand" href="/">THAILAND <b>2600</b></Link>
        <span className="grow" />
        <form action={setLang}>
          <input type="hidden" name="lang" value={lang === "th" ? "en" : "th"} />
          <button className="btn ghost" type="submit">{lang === "th" ? "EN" : "ไทย"}</button>
        </form>
        {userId ? (
          <>
            <span className="me">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {userImage ? <img src={userImage} alt="" referrerPolicy="no-referrer" /> : null}
              {userName}
            </span>
            <form action={signOutNow}><button className="btn ghost" type="submit">{t.signOut}</button></form>
          </>
        ) : (
          <Link className="btn ghost" href="/signin">{t.signIn}</Link>
        )}
        <Link className="btn primary" href="/new">{t.propose}</Link>
      </div>
    </header>
  );
}
