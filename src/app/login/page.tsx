"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

/** 登录页面（带 Suspense 包裹，因为用了 useSearchParams） */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

/** 登录加载中 */
function LoginFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-zinc-500 text-sm">加载中...</div>
    </div>
  );
}

/** 登录表单 */
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username: username || "ICU 队员",
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("密码不对，再试一次");
    } else if (result?.ok) {
      window.location.href = callbackUrl;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-block text-5xl font-black mb-3 px-6 py-2 rounded-lg"
            style={{
              background: "var(--accent)",
              color: "#fff",
              transform: "skewX(-5deg)",
            }}
          >
            ICU
          </div>
          <p className="text-zinc-500 text-sm mt-3">兄弟战队 · 照片墙</p>
        </div>

        {/* 登录表单 */}
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          {/* 用户名 */}
          <label className="block text-sm text-zinc-400 mb-1.5">名字</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="输入你的名字"
            className="w-full px-3 py-2.5 rounded-lg text-sm mb-4 outline-none transition-colors focus:ring-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />

          {/* 密码 */}
          <label className="block text-sm text-zinc-400 mb-1.5">战队密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入战队密码"
            className="w-full px-3 py-2.5 rounded-lg text-sm mb-1 outline-none transition-colors focus:ring-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />

          {/* 错误提示 */}
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={!password || loading}
            className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
            style={{
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            {loading ? "验证中..." : "进入 ICU"}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-6">
          ICU 战队内部站点 · 需战队密码登录
        </p>
      </div>
    </div>
  );
}
