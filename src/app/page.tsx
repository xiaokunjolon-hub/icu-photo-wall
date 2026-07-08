export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* Logo */}
      <div className="text-center mb-20">
        <img
          src="/icu-logo-light.png"
          alt="ICU"
          className="h-36 mx-auto"
        />
      </div>

      {/* 快捷入口 */}
      <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto">
        <a
          href="/history"
          className="block p-6 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="text-3xl mb-3">📜</div>
          <h3 className="font-bold mb-1">历史</h3>
          <p className="text-zinc-500 text-sm">照片时间线</p>
        </a>

        <a
          href="/members"
          className="block p-6 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-bold mb-1">成员</h3>
          <p className="text-zinc-500 text-sm">7 个人 · 留言板</p>
        </a>

        <a
          href="/upload"
          className="block p-6 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="text-3xl mb-3">📸</div>
          <h3 className="font-bold mb-1">上传</h3>
          <p className="text-zinc-500 text-sm">添加照片</p>
        </a>
      </div>
    </div>
  );
}
