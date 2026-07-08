"use client";

import { useState } from "react";
import { uploadPhoto } from "@/app/actions";

export default function UploadPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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
          <label className="block text-sm text-zinc-400 mb-1.5">选择照片</label>
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
            placeholder="比如：2024年跨年聚会"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
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
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* 地点 */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">地点</label>
          <input
            type="text"
            name="location"
            placeholder="比如：太仓万达"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* 描述/备注 */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">详情描述</label>
          <textarea
            name="description"
            rows={3}
            placeholder="当时发生了什么、什么情况..."
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
          {loading ? "上传中..." : "上传照片"}
        </button>
      </form>
    </div>
  );
}
