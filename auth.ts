import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Line from "next-auth/providers/line";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export const hasLine = !!(process.env.AUTH_LINE_ID && process.env.AUTH_LINE_SECRET);
export const hasGoogle = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
/** A name-only sign-in for local testing. Never available in production. */
export const hasDevSignIn = process.env.NODE_ENV !== "production";

const providers: Provider[] = [];
if (hasLine) providers.push(Line);
if (hasGoogle) providers.push(Google);
if (hasDevSignIn) {
  providers.push(
    Credentials({
      id: "dev",
      name: "Local test account",
      credentials: { name: { label: "Name" } },
      authorize(input) {
        const name = String(input?.name ?? "").trim().slice(0, 40);
        return name ? { id: name.toLowerCase(), name } : null;
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    // On sign-in, find or create our own user row and carry its id in the session token.
    async jwt({ token, user, account }) {
      if (account && user) {
        const db = await getDb();
        const providerAccountId = account.providerAccountId ?? String(user.id);
        const where = and(eq(schema.users.provider, account.provider), eq(schema.users.providerAccountId, providerAccountId));
        const name = (user.name ?? "").trim().slice(0, 60) || "Member";
        const [found] = await db.select().from(schema.users).where(where);
        if (found) {
          await db.update(schema.users).set({ name, image: user.image ?? null }).where(where);
          token.uid = found.id;
        } else {
          const id = crypto.randomUUID();
          await db.insert(schema.users).values({ id, provider: account.provider, providerAccountId, name, image: user.image ?? null });
          token.uid = id;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      return session;
    },
  },
});
