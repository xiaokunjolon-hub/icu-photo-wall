import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.name) redirect("/login");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: photos } = await supabase.from("photos").select("*").eq("id", id).limit(1);

  const photo = photos?.[0];
  if (!photo) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="font-bold mb-2">找不到这张照片</h2>
        <a href="/history" className="text-sm" style={{ color: "var(--accent)" }}>← 返回历史</a>
      </div>
    );
  }

  if (photo.uploaded_by !== session.user.name) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="font-bold mb-2">只能编辑自己上传的照片</h2>
        <a href="/history" className="text-sm" style={{ color: "var(--accent)" }}>← 返回</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
      <a href="/history" className="text-sm text-zinc-500 hover:text-white mb-4 inline-block">← 返回</a>
      <h1 className="text-xl sm:text-2xl font-bold mb-6">✏️ 编辑照片</h1>
      <EditForm photo={photo} />
    </div>
  );
}
