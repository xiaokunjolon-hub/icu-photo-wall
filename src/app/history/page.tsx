import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";

// 禁止静态预渲染（因为数据来自数据库）
export const dynamic = "force-dynamic";

// 照片数据类型
interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  event_date: string;
  created_at: string;
}

export default async function HistoryPage() {
  // Supabase 还没配置 → 显示提示
  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-16">
          <h1 className="text-3xl font-bold mb-3">📜 ICU 历史</h1>
          <p className="text-zinc-500">
            用照片和故事记录我们一起走过的路
          </p>
        </div>
        <SetupGuide />
      </div>
    );
  }

  let photoList: Photo[] = [];

  try {
    const supabase = createServerClient();
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      console.error("读取照片失败:", error);
    }

    photoList = photos || [];
  } catch (e) {
    console.error("连接 Supabase 失败:", e);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* 页面标题 */}
      <div className="mb-16">
        <h1 className="text-3xl font-bold mb-3">📜 ICU 历史</h1>
        <p className="text-zinc-500">用照片和故事记录我们一起走过的路</p>
      </div>

      {/* 时间线 */}
      {photoList.length === 0 ? (
        <EmptyState />
      ) : (
        <Timeline photos={photoList} />
      )}
    </div>
  );
}

/** 时间线组件 */
function Timeline({ photos }: { photos: Photo[] }) {
  return (
    <div className="relative">
      {/* 竖线 */}
      <div
        className="absolute left-[19px] top-0 bottom-0 w-[2px] timeline-line"
        style={{ background: "var(--accent)" }}
      />

      {/* 按年份分组 */}
      {groupByYear(photos).map(([year, yearPhotos]) => (
        <div key={year} className="mb-12">
          {/* 年份标题 */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-sm font-bold z-10 shrink-0"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {String(year).slice(2)}
            </div>
            <h2 className="text-xl font-bold">{year}</h2>
          </div>

          {/* 该年的照片 */}
          <div className="space-y-8 ml-10">
            {yearPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** 单张照片卡片 */
function PhotoCard({ photo }: { photo: Photo }) {
  const date = new Date(photo.event_date);
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* 照片 */}
      <div
        className="w-full aspect-video bg-cover bg-center"
        style={{
          backgroundImage: photo.image_url
            ? `url(${photo.image_url})`
            : undefined,
          background: photo.image_url
            ? undefined
            : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        {!photo.image_url && (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            🖼️ 照片占位
          </div>
        )}
      </div>

      {/* 信息区 */}
      <div className="p-5">
        {/* 日期 */}
        <div className="text-xs mb-2" style={{ color: "var(--accent)" }}>
          📅 {dateStr}
        </div>

        {/* 标题 */}
        <h3 className="font-bold text-lg mb-2">{photo.title}</h3>

        {/* 备注：什么事件、什么情况 */}
        {photo.description && (
          <p className="text-zinc-400 text-sm leading-relaxed">
            {photo.description}
          </p>
        )}
      </div>
    </div>
  );
}

/** 空状态：还没上传照片 */
function EmptyState() {
  return (
    <div
      className="text-center py-20 rounded-xl"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="text-5xl mb-4">📸</div>
      <h3 className="text-lg font-bold mb-2">还没有照片</h3>
      <p className="text-zinc-500 text-sm">
        在 Supabase 数据库中添加照片后，这里就会出现 ICU 的历史时间线
      </p>
    </div>
  );
}

/** Supabase 还没配置的引导界面 */
function SetupGuide() {
  return (
    <div
      className="text-center py-16 rounded-xl"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="text-5xl mb-4">🔧</div>
      <h3 className="text-lg font-bold mb-2">数据库还没配置</h3>
      <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
        需要先去{" "}
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 underline"
        >
          supabase.com
        </a>{" "}
        创建免费项目，然后在 .env.local 中填入 Supabase 的 URL 和密钥，最后在 SQL Editor 中执行 supabase-schema.sql 创建表。
      </p>
    </div>
  );
}

/** 按年份分组照片 */
function groupByYear(photos: Photo[]): [number, Photo[]][] {
  const map = new Map<number, Photo[]>();
  for (const p of photos) {
    const y = new Date(p.event_date).getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(p);
  }
  return Array.from(map.entries());
}
