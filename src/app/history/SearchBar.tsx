"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SearchForm({ uploaders, currentQ, currentUploader }: {
  uploaders: string[];
  currentQ?: string;
  currentUploader?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(currentQ || "");

  const submit = (newQ?: string, newUploader?: string) => {
    const params = new URLSearchParams();
    const finalQ = newQ !== undefined ? newQ : q;
    const finalU = newUploader !== undefined ? newUploader : currentUploader;
    if (finalQ) params.set("q", finalQ);
    if (finalU) params.set("uploader", finalU);
    router.push("/history?" + params.toString());
  };

  return (
    <div className="mb-8 space-y-3">
      {/* 搜索框 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(q); }}
          placeholder="搜索标题、地点、描述..."
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
        <button
          onClick={() => submit()}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          搜索
        </button>
      </div>

      {/* 上传人筛选 + 清除 */}
      <div className="flex flex-wrap items-center gap-2">
        {uploaders.map((u) => (
          <button
            key={u}
            onClick={() => submit(q, currentUploader === u ? "" : u)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              currentUploader === u
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }`}
            style={currentUploader === u ? { background: "var(--accent)" } : { background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {u}
          </button>
        ))}
        {(q || currentUploader) && (
          <button
            onClick={() => { setQ(""); submit("", ""); }}
            className="text-xs px-3 py-1 rounded-full text-zinc-500 hover:text-white"
            style={{ border: "1px solid var(--border)" }}
          >
            清除
          </button>
        )}
      </div>
    </div>
  );
}

export default function SearchBar(props: { uploaders: string[]; currentQ?: string; currentUploader?: string }) {
  return (
    <Suspense>
      <SearchForm {...props} />
    </Suspense>
  );
}
