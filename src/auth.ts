import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MEMBER_PASSWORDS } from "@/lib/members";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      authorize: async (credentials) => {
        const username =
          typeof credentials?.username === "string"
            ? credentials.username.toLowerCase().trim()
            : "";
        const password = credentials?.password;

        const expectedPassword = MEMBER_PASSWORDS[username];
        if (!expectedPassword) {
          return null;
        }

        if (typeof password === "string" && password === expectedPassword) {
          return { id: username, name: username };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.name = user.name || "成员";
        token.sub = user.id; // 用户名 id
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.sub as string;
      }
      return session;
    },
  },
});
