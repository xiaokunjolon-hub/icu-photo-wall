"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // 登录页不显示导航栏
  if (pathname === "/login") return null;

  const links = [
    { href: "/", label: "🏠 主页" },
    { href: "/history", label: "📜 历史" },
    { href: "/members", label: "👥 兄弟" },
    { href: "/upload", label: "📸 上传" },
  ];

  return (
    <nav
      style={{
        background: "rgba(18, 18, 23, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 左侧 Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/icu-logo-light.png" alt="ICU" className="h-9" />
        </Link>

        {/* 中间导航 */}
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname === link.href
                  ? "text-white font-medium"
                  : "text-zinc-400 hover:text-white"
              }`}
              style={
                pathname === link.href
                  ? { borderBottom: "2px solid var(--accent)" }
                  : {}
              }
            >
              <span className="h-14 flex items-center text-sm">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* 右侧用户 */}
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span>{session?.user?.name || "兄弟"}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-zinc-500 hover:text-red-400 transition-colors"
          >
            退出
          </button>
        </div>
      </div>
    </nav>
  );
}
