import { cookies } from "next/headers";
import { connection } from "next/server";
import { auth } from "@/auth";
import { dict, type Lang } from "./content";

export async function getLang(): Promise<Lang> {
  return (await cookies()).get("lang")?.value === "th" ? "th" : "en";
}

/** Language, its dictionary and the signed-in user's id (or null), for one request. */
export async function getContext() {
  // Everything here is per-request, so opt out of prerendering before touching the session.
  await connection();
  const lang = await getLang();
  const session = await auth();
  return { lang, t: dict(lang), userId: session?.user?.id ?? null, userName: session?.user?.name ?? null, userImage: session?.user?.image ?? null };
}

export const fmtDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
