export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* Hero 区域 */}
      <div className="text-center mb-20">
        {/* ICU Logo */}
        <div className="mb-8">
          <span
            className="inline-block text-7xl font-black px-8 py-3 rounded-xl tracking-wider"
            style={{
              background: "var(--accent)",
              color: "#fff",
              transform: "skewX(-5deg)",
            }}
          >
            ICU
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-3">兄弟们的专属地盘</h1>
        <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
          这里记录着兄弟们在一起的每一个瞬间——那些只有我们懂的梗和回忆。
        </p>
      </div>

      {/* 快捷入口卡片 */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        {/* 历史时间线 */}
        <a
          href="/history"
          className="block p-6 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="text-3xl mb-3">📜</div>
          <h3 className="font-bold mb-1">历史照片墙</h3>
          <p className="text-zinc-500 text-sm">时间线照片墙，每一张都有故事</p>
        </a>

        {/* 预留：成员列表 */}
        <div
          className="block p-6 rounded-xl opacity-50 cursor-not-allowed"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-bold mb-1">兄弟成员</h3>
          <p className="text-zinc-500 text-sm">即将上线</p>
        </div>
      </div>

      {/* 底部 */}
      <div className="text-center mt-20">
        <p className="text-zinc-600 text-xs">
          ICU © {new Date().getFullYear()} · 兄弟们的地盘
        </p>
      </div>
    </div>
  );
}
