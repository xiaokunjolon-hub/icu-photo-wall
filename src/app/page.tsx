export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center mb-14 sm:mb-20">
        <img src="/icu-logo-light.png" alt="ICU" className="h-24 sm:h-36 mx-auto" />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
        <a href="/history" className="block p-4 sm:p-6 rounded-xl transition-all hover:scale-[1.02]"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📜</div>
          <h3 className="font-bold text-sm sm:text-base mb-1">历史</h3>
          <p className="text-zinc-500 text-xs sm:text-sm">照片时间线</p>
        </a>
        <a href="/members" className="block p-4 sm:p-6 rounded-xl transition-all hover:scale-[1.02]"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">👥</div>
          <h3 className="font-bold text-sm sm:text-base mb-1">成员</h3>
          <p className="text-zinc-500 text-xs sm:text-sm">7人 · 留言</p>
        </a>
        <a href="/upload" className="block p-4 sm:p-6 rounded-xl transition-all hover:scale-[1.02]"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📸</div>
          <h3 className="font-bold text-sm sm:text-base mb-1">上传</h3>
          <p className="text-zinc-500 text-xs sm:text-sm">添加照片</p>
        </a>
      </div>
    </div>
  );
}
