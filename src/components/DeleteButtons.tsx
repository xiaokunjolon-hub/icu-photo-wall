"use client";

import { useState } from "react";
import { deletePhoto, deleteMessage } from "@/app/actions";

export function DeletePhotoButton({ photoId, imageUrl }: { photoId: string; imageUrl: string }) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return; }
    try {
      await deletePhoto(photoId, imageUrl);
    } catch (e) {
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`text-xs shrink-0 px-2 py-1 rounded transition-colors ${
        confirming
          ? "bg-red-600 text-white"
          : "text-zinc-600 hover:text-red-400"
      }`}
    >
      {confirming ? "确认删除?" : "✕"}
    </button>
  );
}

export function DeleteMessageButton({ messageId }: { messageId: string }) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return; }
    try {
      await deleteMessage(messageId);
    } catch (e) {
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`text-xs shrink-0 px-1.5 py-0.5 rounded transition-colors ${
        confirming
          ? "bg-red-600 text-white"
          : "text-zinc-600 hover:text-red-400"
      }`}
    >
      {confirming ? "确认?" : "✕"}
    </button>
  );
}

/** 常用 emoji */
const EMOJIS = ["😂", "❤️", "👍", "🔥", "😭", "🎉", "💀", "👀", "🙏", "💩", "🤡", "🐶"];

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button type="button" onClick={() => setOpen(!open)} className="text-lg">
        😊
      </button>
      {open && (
        <span className="absolute bottom-full left-0 mb-2 p-2 rounded-lg flex gap-1 flex-wrap w-40 z-10"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => { onSelect(e); setOpen(false); }}
              className="text-lg hover:scale-125 transition-transform">
              {e}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}
