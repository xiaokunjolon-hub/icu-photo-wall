import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // 登录表单：只需密码（团队共用）
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      authorize: async (credentials) => {
        const password = credentials?.password;
        const username =
          typeof credentials?.username === "string"
            ? credentials.username
            : "ICU 队员";

        // 检查密码是否匹配团队密码
        if (
          typeof password === "string" &&
          password === process.env.ICU_TEAM_PASSWORD
        ) {
          return { id: "icu-member", name: username };
        }

        // 密码错误
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // 自定义登录页
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.name = user.name || "ICU 队员";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
