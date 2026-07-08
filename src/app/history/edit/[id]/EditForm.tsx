"use client";

import { useState } from "react";
import { updatePhoto, deletePhoto } from "@/app/actions";
import { useRouter } from "next/navigation";

interface Photo {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  event_date: string;
}

export default function EditForm({ photo }: { photo: Photo }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updatePhoto(photo.id, formData);
      router.push("/history");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "保存失败");
      setSaving(false);
    }
  };

  const ic = "w-full px-3 py-2.5 rounded-lg text-sm outline-none [color-scheme:dark]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6 rounded-xl"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

      {/* 照片预览 */}
      {photo.image_url && (
        <img src={photo.image_url} alt={photo.title} className="w-full rounded-lg aspect-video object-cover" />
      )}

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">标题 *</label>
        <input type="text" name="title" defaultValue={photo.title} required className={ic}
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">日期 *</label>
        <input type="date" name="event_date" defaultValue={photo.event_date} required className={ic}
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">地点</label>
        <input type="text" name="location" defaultValue={photo.location || ""} className={ic}
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">描述</label>
        <textarea name="description" rows={3} defaultValue={photo.description || ""}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      {error && <div className="text-red-400 text-sm p-3 rounded-lg bg-red-400/10">{error}</div>}

      <DeleteSection photoId={photo.id} imageUrl={photo.image_url} />

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="flex-1 py-2.5 rounded-lg text-sm border border-zinc-700 text-zinc-400">
          取消
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40"
          style={{ background: "var(--accent)", color: "#fff" }}>
          {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}

function DeleteSection({ photoId, imageUrl }: { photoId: string; imageUrl: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return; }
    try {
      await deletePhoto(photoId, imageUrl);
      router.push("/history");
    } catch {
      setConfirming(false);
    }
  };

  return (
    <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
      <button
        type="button"
        onClick={handleDelete}
        className={`text-sm px-4 py-2 rounded-lg transition-colors ${
          confirming ? "bg-red-600 text-white" : "text-red-400 hover:text-red-300 border border-zinc-700"
        }`}
      >
        {confirming ? "确认删除？" : "🗑️ 删除照片"}
      </button>
    </div>
  );
}
