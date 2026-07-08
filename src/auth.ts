import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// 兄弟们的账号（用户名 → 生日密码 MMDD）
const MEMBERS: Record<string, { password: string }> = {
  lcy: { password: "1226" },
  qcy: { password: "0309" },
  lzx: { password: "0420" },
  qjk: { password: "1223" },
  zzy: { password: "1019" },
  dht: { password: "0127" },
  zyk: { password: "0302" },
};

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

        // 查找这个用户名
        const member = MEMBERS[username];
        if (!member) {
          return null; // 用户不存在
        }

        // 检查密码（生日 MMDD）
        if (typeof password === "string" && password === member.password) {
          return { id: username, name: username };
        }

        return null; // 密码错误
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
        token.name = user.name || "兄弟";
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
