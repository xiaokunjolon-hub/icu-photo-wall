import { auth } from "@/auth";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";
import SearchBar from "./SearchBar";

export const dynamic = "force-dynamic";

interface Photo {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  event_date: string;
  uploaded_by: string;
  created_at: string;
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; uploader?: string }>;
}) {
  const session = await auth();
  const currentUser = session?.user?.name || "";
  const { q, uploader } = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">📜 历史</h1>
        <SetupGuide />
      </div>
    );
  }

  let allPhotos: Photo[] = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("event_date", { ascending: false });
    allPhotos = data || [];
  } catch (e) {
    console.error(e);
  }

  // 内存搜索（小数据量足够）
  let filtered = allPhotos;
  if (uploader) {
    filtered = filtered.filter((p) => p.uploaded_by === uploader);
  }
  if (q) {
    const kw = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(kw) ||
        (p.description || "").toLowerCase().includes(kw) ||
        (p.location || "").toLowerCase().includes(kw) ||
        p.uploaded_by.toLowerCase().includes(kw)
    );
  }

  // 收集所有上传人
  const uploaders = [...new Set(allPhotos.map((p) => p.uploaded_by).filter(Boolean))];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📜 历史</h1>

      <SearchBar uploaders={uploaders} currentQ={q} currentUploader={uploader} />

      {filtered.length === 0 ? (
        <EmptyState hasSearch={!!q || !!uploader} />
      ) : (
        <Timeline photos={filtered} currentUser={currentUser} />
      )}
    </div>
  );
}

function Timeline({ photos, currentUser }: { photos: Photo[]; currentUser: string }) {
  return (
    <div className="relative">
      <div className="absolute left-[15px] sm:left-[19px] top-0 bottom-0 w-[2px] timeline-line"
        style={{ background: "var(--accent)" }} />

      {groupByYear(photos).map(([year, yearPhotos]) => (
        <div key={year} className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center text-xs sm:text-sm font-bold z-10 shrink-0"
              style={{ background: "var(--accent)", color: "#fff" }}>
              {String(year).slice(2)}
            </div>
            <h2 className="text-lg sm:text-xl font-bold">{year}</h2>
          </div>

          <div className="space-y-6 sm:space-y-8 ml-8 sm:ml-10">
            {yearPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} currentUser={currentUser} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PhotoCard({ photo, currentUser }: { photo: Photo; currentUser: string }) {
  const date = new Date(photo.event_date);
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  const canDelete = currentUser === photo.uploaded_by;

  return (
    <div className="rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {photo.image_url ? (
        <img src={photo.image_url} alt={photo.title} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video flex items-center justify-center text-zinc-600"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
          🖼️
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="text-xs mb-2 flex flex-wrap items-center gap-x-3 gap-y-1"
          style={{ color: "var(--accent)" }}>
          <span>📅 {dateStr}</span>
          {photo.location && <span>📍 {photo.location}</span>}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-1">{photo.title}</h3>
            {photo.description && (
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-1">{photo.description}</p>
            )}
            <p className="text-zinc-600 text-xs">上传：{photo.uploaded_by}</p>
          </div>
          {canDelete && (
            <a href={`/history/edit/${photo.id}`}
              className="text-xs px-2 py-1 rounded text-zinc-500 hover:text-white transition-colors">
              ✏️ 编辑
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch?: boolean }) {
  return (
    <div className="text-center py-16 sm:py-20 rounded-xl"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="text-4xl sm:text-5xl mb-4">{hasSearch ? "🔍" : "📸"}</div>
      <h3 className="text-lg font-bold mb-2">{hasSearch ? "没找到匹配的照片" : "还没有照片"}</h3>
      <p className="text-zinc-500 text-sm">{hasSearch ? "换个关键词试试" : "去上传第一张吧"}</p>
    </div>
  );
}

function SetupGuide() {
  return (
    <div className="text-center py-16 rounded-xl"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="text-5xl mb-4">🔧</div>
      <h3 className="text-lg font-bold mb-2">数据库还没配置</h3>
      <p className="text-zinc-500 text-sm">在 Supabase SQL Editor 执行 supabase-schema.sql</p>
    </div>
  );
}

function groupByYear(photos: Photo[]): [number, Photo[]][] {
  const map = new Map<number, Photo[]>();
  for (const p of photos) {
    const y = new Date(p.event_date).getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(p);
  }
  return Array.from(map.entries());
}
