// auth.js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";

/**
 * דוגמה לפונקציות DB — החלף בחיבור אמיתי (Prisma/Drizzle/Mongoose וכו').
 * כאן יש מצב "דמו" שמבוסס על .env:
 * - AUTH_DEMO_EMAIL
 * - AUTH_DEMO_PASSWORD (לא מומלץ לפרודקשן)
 * - AUTH_DEMO_PASSWORD_HASH (עדיף; ערך שנוצר מראש עם argon2.hash)
 */
async function findUserByEmail(email) {
  if (process.env.AUTH_DEMO_EMAIL && email === process.env.AUTH_DEMO_EMAIL) {
    return {
      id: "1",
      name: "Demo Admin",
      email,
      // אם הגדרת מראש hash בסביבה — נשתמש בו (מומלץ יותר מדמו בסיסמה גולמית)
      passwordHash: process.env.AUTH_DEMO_PASSWORD_HASH || null,
    };
  }

  // TODO: החלף בלוגיקה אמיתית מה־DB שלך:
  // const user = await db.select(...).where(eq(users.email, email)).get();
  // return user ? { id: user.id, name: user.name, email: user.email, passwordHash: user.password_hash } : null;

  return null;
}

async function verifyPassword(plain, hashFromDb) {
  // אם יש hash ב־DB (או ב־env) — נוודא איתו
  if (hashFromDb) {
    try {
      return await argon2.verify(hashFromDb, plain);
    } catch {
      return false;
    }
  }

  // מצב דמו בלבד: השוואה מול AUTH_DEMO_PASSWORD (לא לפרודקשן)
  if (process.env.AUTH_DEMO_PASSWORD) {
    return plain === process.env.AUTH_DEMO_PASSWORD;
  }

  return false;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Google, // קורא אוטומטית AUTH_GOOGLE_ID/SECRET מה־env
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        if (!creds?.email || !creds?.password) return null;

        const user = await findUserByEmail(creds.email);
        if (!user) return null;

        const ok = await verifyPassword(creds.password, user.passwordHash);
        if (!ok) return null;

        // אפשר להעשיר כאן בהרשאות/תפקידים מה־DB
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "admin",
        };
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.role = user.role || "user";
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.role) session.user.role = token.role;
      return session;
    },
    authorized: async ({ auth }) => {
      // true = יש סשן; ניתוב לא מזוהים ייעשה במידלוור
      return !!auth;
    },
  },

  pages: {
    signIn: "/login",
  },
});

/**
 * טיפ לרישום משתמש חדש (signup) עם argon2:
 *
 * import argon2 from "argon2";
 * const passwordHash = await argon2.hash(plainPassword);
 * await db.insert(users).values({ email, name, password_hash: passwordHash });
 *
 * בפרודקשן: תמיד שמור/בדוק hash בלבד — לא סיסמה גולמית.
 */
