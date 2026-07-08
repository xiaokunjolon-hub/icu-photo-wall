"use client";

import { useState, useRef } from "react";
import { uploadPhotos } from "@/app/actions";
import { useRouter } from "next/navigation";

interface PlaceSuggestion {
  name: string;
  district: string;
  address: string;
}

export default function UploadPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const searchPlaces = (query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://restapi.amap.com/v3/assistant/inputtips?key=${process.env.NEXT_PUBLIC_AMAP_KEY}&keywords=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        if (data.tips) {
          const filtered = data.tips.filter((t: { name: string }) => t.name);
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        }
      } catch {}
    }, 300);
  };

  const selectPlace = (place: PlaceSuggestion) => {
    setLocation(place.name);
    setShowSuggestions(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { longitude, latitude } = pos.coords;
        const res = await fetch(
          `https://restapi.amap.com/v3/geocode/regeo?key=${process.env.NEXT_PUBLIC_AMAP_KEY}&location=${longitude.toFixed(6)},${latitude.toFixed(6)}&extensions=base`
        );
        const data = await res.json();
        if (data.regeocode?.formatted_address) setLocation(data.regeocode.formatted_address);
      } catch {}
      setLocating(false);
    }, () => setLocating(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await uploadPhotos(new FormData(e.currentTarget));
      router.push("/history");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "上传失败");
      setLoading(false);
    }
  };

  const ic = "w-full px-3 py-2.5 rounded-lg text-sm outline-none [color-scheme:dark]";

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">📸 上传照片</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5 p-4 sm:p-6 rounded-xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        {/* 照片选择（多张） */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">照片（可多选）</label>
          <input
            type="file"
            name="files"
            accept="image/*"
            multiple
            required
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-zinc-700 file:text-white"
          />
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {previews.map((url, i) => (
                <img key={i} src={url} alt="" className="h-20 rounded-lg shrink-0 object-cover" />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">标题 *</label>
          <input type="text" name="title" required className={ic}
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">日期 *</label>
          <input type="date" name="event_date" required className={ic}
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        </div>

        <div className="relative">
          <label className="block text-sm text-zinc-400 mb-1.5">地点</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input ref={inputRef} type="text" name="location" value={location}
                onChange={(e) => { setLocation(e.target.value); searchPlaces(e.target.value); }}
                className={ic}
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  {suggestions.map((s, i) => (
                    <button key={i} type="button" onClick={() => selectPlace(s)}
                      className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50 border-b border-zinc-800 last:border-0">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-zinc-500 text-xs ml-2">{s.district}{s.address}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={getCurrentLocation} disabled={locating}
              className="px-3 py-2.5 rounded-lg text-sm shrink-0 disabled:opacity-50"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              {locating ? "⏳" : "📍"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">描述</label>
          <textarea name="description" rows={3}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        </div>

        {error && <div className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10">{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: "var(--accent)", color: "#fff" }}>
          {loading ? "上传中..." : `上传${previews.length > 0 ? ` (${previews.length}张)` : ""}`}
        </button>
      </form>
    </div>
  );
}
