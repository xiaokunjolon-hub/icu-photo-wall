"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function SearchForm({
  uploaders, currentQ, currentUploader, currentFrom, currentTo,
}: {
  uploaders: string[];
  currentQ?: string;
  currentUploader?: string;
  currentFrom?: string;
  currentTo?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(currentQ || "");
  const [showDate, setShowDate] = useState(!!currentFrom || !!currentTo);
  const [from, setFrom] = useState(currentFrom || "");
  const [to, setTo] = useState(currentTo || "");

  const submit = (opts?: { newQ?: string; newUploader?: string; newFrom?: string; newTo?: string }) => {
    const params = new URLSearchParams();
    const fQ = opts?.newQ !== undefined ? opts.newQ : q;
    const fU = opts?.newUploader !== undefined ? opts.newUploader : currentUploader;
    const fFrom = opts?.newFrom !== undefined ? opts.newFrom : from;
    const fTo = opts?.newTo !== undefined ? opts.newTo : to;
    if (fQ) params.set("q", fQ);
    if (fU) params.set("uploader", fU);
    if (fFrom) params.set("from", fFrom);
    if (fTo) params.set("to", fTo);
    router.push("/history?" + params.toString());
  };

  const clear = () => {
    setQ(""); setFrom(""); setTo("");
    router.push("/history");
  };

  return (
    <div className="mb-8 space-y-3">
      <div className="flex gap-2 flex-wrap">
        <input
          type="text" value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit({ newQ: q }); }}
          placeholder="搜索关键词..."
          className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
        <button onClick={() => submit()} className="px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--accent)", color: "#fff" }}>搜索</button>
        <button onClick={() => setShowDate(!showDate)}
          className={`px-3 py-2 rounded-lg text-sm ${showDate ? "text-white" : "text-zinc-400"}`}
          style={{ background: showDate ? "var(--accent)" : "var(--bg-card)", border: "1px solid var(--border)" }}
        >📅</button>
      </div>

      {showDate && (
        <div className="flex gap-2 items-center flex-wrap">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            onBlur={() => submit({ newFrom: from })}
            className="px-3 py-1.5 rounded-lg text-xs outline-none [color-scheme:dark]"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          <span className="text-zinc-500 text-xs">至</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            onBlur={() => submit({ newTo: to })}
            className="px-3 py-1.5 rounded-lg text-xs outline-none [color-scheme:dark]"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {uploaders.map((u) => (
          <button key={u}
            onClick={() => submit({ newUploader: currentUploader === u ? "" : u })}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              currentUploader === u ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
            style={currentUploader === u ? { background: "var(--accent)" } : { background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >{u}</button>
        ))}
        {(q || currentUploader || currentFrom || currentTo) && (
          <button onClick={clear}
            className="text-xs px-3 py-1 rounded-full text-zinc-500 hover:text-white"
            style={{ border: "1px solid var(--border)" }}>清除</button>
        )}
      </div>
    </div>
  );
}

export default function SearchBar(props: {
  uploaders: string[];
  currentQ?: string;
  currentUploader?: string;
  currentFrom?: string;
  currentTo?: string;
}) {
  return (
    <Suspense>
      <SearchForm {...props} />
    </Suspense>
  );
}
