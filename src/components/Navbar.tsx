"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/login") return null;

  const links = [
    { href: "/", label: "🏠 主页" },
    { href: "/history", label: "📜 历史" },
    { href: "/members", label: "👥 成员" },
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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img src="/icu-logo-light.png" alt="ICU" className="h-8 sm:h-9" />
        </Link>

        {/* 桌面导航 */}
        <div className="hidden sm:flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors text-sm ${
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
              <span className="h-14 flex items-center">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* 右侧 */}
        <div className="flex items-center gap-2 sm:gap-3 text-sm text-zinc-400">
          <span className="hidden sm:inline">{session?.user?.name || ""}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-zinc-500 hover:text-red-400 transition-colors text-sm"
          >
            退出
          </button>
          {/* 汉堡菜单 */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-zinc-400 text-xl ml-1"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div
          className="sm:hidden px-4 pb-3 space-y-1"
          style={{ background: "rgba(18, 18, 23, 0.95)" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-sm ${
                pathname === link.href ? "text-white" : "text-zinc-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="text-zinc-600 text-xs pt-1">
            {session?.user?.name}
          </div>
        </div>
      )}
    </nav>
  );
}
