import { auth } from "@/auth";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { MEMBERS_LIST } from "@/lib/members";
import { DeleteMessageButton } from "@/components/DeleteButtons";
import MessageForm from "@/components/MessageForm";

export const dynamic = "force-dynamic";

interface Message {
  id: string;
  from_user: string;
  to_user: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
}

export default async function MembersPage() {
  const session = await auth();
  const currentUser = session?.user?.name || "";

  let allMessages: Message[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      allMessages = data || [];
    } catch {}
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">👥 成员</h1>
      <p className="text-zinc-500 text-sm mb-6 sm:mb-8">7 个人 · 留言板</p>

      {/* 成员网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
        {MEMBERS_LIST.map((member) => {
          const msgs = allMessages.filter((m) => m.to_user === member.id);
          const latest = msgs[0];
          return (
            <a key={member.id} href={`/members#msg-${member.id}`}
              className="block p-3 sm:p-5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm uppercase"
                  style={{ background: "var(--accent)", color: "#fff" }}>{member.id[0]}</div>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base truncate">{member.id}</div>
                  <div className="text-xs text-zinc-500">🎂 {member.birthday}</div>
                </div>
              </div>
              {latest ? (
                <p className="text-xs text-zinc-500 truncate">
                  {latest.is_anonymous ? "匿名" : latest.from_user}：{latest.content}
                </p>
              ) : (
                <p className="text-xs text-zinc-600">还没有留言</p>
              )}
              {msgs.length > 0 && (
                <div className="mt-1 sm:mt-2 text-xs" style={{ color: "var(--accent)" }}>
                  💬 {msgs.length} 条
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* 留言区 */}
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">💬 留言板</h2>

      {MEMBERS_LIST.map((member) => {
        const msgs = allMessages.filter((m) => m.to_user === member.id);
        return (
          <div key={member.id} id={`msg-${member.id}`} className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase"
                style={{ background: "var(--accent)", color: "#fff" }}>{member.id[0]}</div>
              <h3 className="font-bold text-sm sm:text-base">{member.id}</h3>
              <span className="text-xs text-zinc-500">🎂 {member.birthday}</span>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 ml-9 sm:ml-11">
              {msgs.length === 0 ? (
                <p className="text-sm text-zinc-600 py-3">还没有留言</p>
              ) : (
                msgs.map((msg) => (
                  <div key={msg.id} className="p-3 sm:p-4 rounded-xl text-sm"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-zinc-400">
                          {msg.is_anonymous ? "🎭 匿名" : msg.from_user}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {new Date(msg.created_at).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      {currentUser === msg.from_user && (
                        <DeleteMessageButton messageId={msg.id} />
                      )}
                    </div>
                    <p className="text-zinc-300 break-words">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            {member.id !== currentUser && (
              <MessageForm toUser={member.id} />
            )}
            {member.id === currentUser && (
              <div className="ml-9 sm:ml-11 text-xs text-zinc-600">（这是你自己）</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

