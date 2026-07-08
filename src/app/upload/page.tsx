"use client";

import { useState, useRef, useEffect } from "react";
import { uploadPhoto } from "@/app/actions";

/** 地点搜索建议 */
interface PlaceSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function UploadPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // 地点搜索
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locating, setLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 搜索地点（防抖）
  const searchPlaces = (query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=zh`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        // 搜索失败忽略
      }
    }, 400);
  };

  // 选择建议
  const selectPlace = (place: PlaceSuggestion) => {
    setLocation(place.display_name);
    setShowSuggestions(false);
  };

  // 获取当前位置
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("浏览器不支持定位");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=zh`
          );
          const data = await res.json();
          if (data.display_name) {
            setLocation(data.display_name);
          }
        } catch {
          setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        }
        setLocating(false);
      },
      () => {
        setError("无法获取位置，请手动输入");
        setLocating(false);
      }
    );
  };

  // 点击外部关闭建议
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await uploadPhoto(formData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "上传失败，再试一次";
      setError(message);
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg text-sm outline-none [color-scheme:dark]";

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">📸 上传照片</h1>
      <p className="text-zinc-500 text-sm mb-8">记录一起经历的每个瞬间</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-6 rounded-xl"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* 照片选择 */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">照片</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-700 file:text-white hover:file:bg-zinc-600"
          />
          {preview && (
            <img
              src={preview}
              alt="预览"
              className="mt-3 rounded-lg max-h-48 object-cover"
            />
          )}
        </div>

        {/* 标题 */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">标题 *</label>
          <input
            type="text"
            name="title"
            required
            className={inputClass}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* 日期 */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">日期 *</label>
          <input
            type="date"
            name="event_date"
            required
            className={inputClass}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* 地点（带搜索） */}
        <div className="relative">
          <label className="block text-sm text-zinc-400 mb-1.5">地点</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                name="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  searchPlaces(e.target.value);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className={inputClass}
                placeholder="输入地点名称搜索"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
              {/* 搜索建议下拉 */}
              {showSuggestions && (
                <div
                  className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectPlace(s)}
                      className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50 border-b border-zinc-800 last:border-0 truncate"
                    >
                      📍 {s.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locating}
              className="px-3 py-2.5 rounded-lg text-sm font-medium shrink-0 disabled:opacity-50"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              title="使用当前位置"
            >
              {locating ? "⏳" : "📍"}
            </button>
          </div>
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">描述</label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* 错误 */}
        {error && (
          <div className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10">
            {error}
          </div>
        )}

        {/* 提交 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {loading ? "上传中..." : "上传"}
        </button>
      </form>
    </div>
  );
}
