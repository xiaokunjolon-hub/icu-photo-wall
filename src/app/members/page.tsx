import { auth } from "@/auth";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { MEMBERS_LIST, getMember } from "@/lib/members";
import { sendMessage } from "@/app/actions";
import { revalidatePath } from "next/cache";

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

  // 获取所有留言
  let allMessages: Message[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      allMessages = data || [];
    } catch (e) {
      // 表还没建，忽略
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">👥 兄弟们</h1>
      <p className="text-zinc-500 text-sm mb-8">
        7 个人 · 点击名字看留言、写留言
      </p>

      {/* 成员网格 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {MEMBERS_LIST.map((member) => {
          const messages = allMessages.filter((m) => m.to_user === member.id);
          const latestMsg = messages[0];

          return (
            <div key={member.id}>
              <a
                href={`/members#msg-${member.id}`}
                className="block p-5 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* 头像 */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    {member.id[0]}
                  </div>
                  <div>
                    <div className="font-bold">{member.id}</div>
                    <div className="text-xs text-zinc-500">
                      🎂 {member.birthday}
                    </div>
                  </div>
                </div>

                {/* 最新留言预览 */}
                {latestMsg ? (
                  <p className="text-xs text-zinc-500 truncate">
                    {latestMsg.is_anonymous ? "匿名" : latestMsg.from_user}：{latestMsg.content}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-600">还没有留言</p>
                )}

                {/* 留言数 */}
                {messages.length > 0 && (
                  <div className="mt-2 text-xs" style={{ color: "var(--accent)" }}>
                    💬 {messages.length} 条留言
                  </div>
                )}
              </a>
            </div>
          );
        })}
      </div>

      {/* 留言区（按成员分区） */}
      <h2 className="text-xl font-bold mb-6">💬 留言板</h2>

      {MEMBERS_LIST.map((member) => {
        const messages = allMessages.filter((m) => m.to_user === member.id);
        return (
          <div key={member.id} id={`msg-${member.id}`} className="mb-8">
            {/* 成员标题 */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {member.id[0]}
              </div>
              <h3 className="font-bold">{member.id}</h3>
              <span className="text-xs text-zinc-500">🎂 {member.birthday}</span>
            </div>

            {/* 留言列表 */}
            <div className="space-y-3 mb-4 ml-11">
              {messages.length === 0 ? (
                <p className="text-sm text-zinc-600 py-4">还没有留言，写一条吧 ↓</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl text-sm"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-xs text-zinc-400">
                        {msg.is_anonymous ? "🎭 匿名" : msg.from_user}
                      </span>
                      <span className="text-xs text-zinc-600">
                        {new Date(msg.created_at).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                    <p className="text-zinc-300">{msg.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* 留言表单 */}
            <MessageForm
              toUser={member.id}
              currentUser={currentUser}
            />
          </div>
        );
      })}
    </div>
  );
}

/** 留言表单（客户端组件） */
function MessageForm({
  toUser,
  currentUser,
}: {
  toUser: string;
  currentUser: string;
}) {
  // 不能给自己留言
  if (toUser === currentUser) {
    return (
      <div className="ml-11 text-xs text-zinc-600">
        （这是你自己，不能给自己留言 😄）
      </div>
    );
  }

  return (
    <form
      action={sendMessage}
      className="ml-11 flex gap-2 items-start"
    >
      <input type="hidden" name="to_user" value={toUser} />
      <input
        type="text"
        name="content"
        placeholder={`给 ${toUser} 留言...`}
        required
        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      />
      <label className="flex items-center gap-1 text-xs text-zinc-500 cursor-pointer shrink-0 pt-2">
        <input type="checkbox" name="is_anonymous" value="true" />
        匿名
      </label>
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-sm font-medium shrink-0"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        发送
      </button>
    </form>
  );
}
