import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("test_database");
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // Verifica email temporaneamente disattivata - la riattiveremo
        // insieme a Resend più avanti
        // if (user.emailVerificato === false) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.nome,
          tipo: user.tipo,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tipo = user.tipo;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.tipo = token.tipo;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Quando ci si registra con Google, salva l'utente nel database
      // se non esiste già
      if (account.provider === "google") {
        const client = await clientPromise;
        const db = client.db("test_database");
        const existing = await db
          .collection("users")
          .findOne({ email: user.email });

        if (!existing) {
          await db.collection("users").insertOne({
            email: user.email,
            nome: user.name,
            tipo: "sponsee", // default per chi si registra con Google
            provider: "google",
            emailVerificato: true,
            createdAt: new Date(),
          });
        }
      }
      return true;
    },
  },
});
