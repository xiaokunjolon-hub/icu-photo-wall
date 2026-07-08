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
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/icu-logo-light.png"
            alt="ICU"
            className="h-28 mx-auto"
          />
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
          <label className="block text-sm text-zinc-400 mb-1.5">名字（英文缩写）</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="比如 zyk"
            className="w-full px-3 py-2.5 rounded-lg text-sm mb-4 outline-none transition-colors focus:ring-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />

          {/* 密码 */}
          <label className="block text-sm text-zinc-400 mb-1.5">密码（生日 MMDD）</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="比如 0302"
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
            {loading ? "验证中..." : "进入"}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-6">
          ICU 内部站点 · 用你的名字 + 生日登录
        </p>
      </div>
    </div>
  );
}
