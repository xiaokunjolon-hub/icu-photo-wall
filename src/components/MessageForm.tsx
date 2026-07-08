"use client";

import { sendMessage } from "@/app/actions";
import { EmojiPicker } from "@/components/DeleteButtons";

export default function MessageForm({ toUser }: { toUser: string }) {
  return (
    <form action={sendMessage} className="ml-9 sm:ml-11 flex gap-2 items-center flex-wrap">
      <input type="hidden" name="to_user" value={toUser} />
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <input type="text" name="content" placeholder="留言..." required
          className="flex-1 min-w-[100px] px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        <EmojiPicker onSelect={(emoji: string) => {
          const input = document.querySelector<HTMLInputElement>('input[name="content"]');
          if (input) { input.value += emoji; input.focus(); }
        }} />
      </div>
      <label className="flex items-center gap-1 text-xs text-zinc-500 cursor-pointer shrink-0">
        <input type="checkbox" name="is_anonymous" value="true" />匿名
      </label>
      <button type="submit" className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shrink-0"
        style={{ background: "var(--accent)", color: "#fff" }}>发</button>
    </form>
  );
}
