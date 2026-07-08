"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** 上传照片 */
export async function uploadPhoto(formData: FormData) {
  const session = await auth();
  if (!session?.user?.name) {
    throw new Error("请先登录");
  }

  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const event_date = formData.get("event_date") as string;
  const description = formData.get("description") as string;

  if (!file || file.size === 0) {
    throw new Error("请选择照片");
  }
  if (!title) {
    throw new Error("请填写标题");
  }
  if (!event_date) {
    throw new Error("请选择日期");
  }

  const supabase = createServerClient();

  // 1. 上传照片到 Supabase Storage
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const fileBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`上传失败: ${uploadError.message}`);
  }

  // 2. 获取公开链接
  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(fileName);

  // 3. 写入数据库
  const { error: dbError } = await supabase.from("photos").insert({
    title,
    description,
    location: location || "",
    image_url: publicUrl,
    event_date,
    uploaded_by: session.user.name,
  });

  if (dbError) {
    throw new Error(`保存失败: ${dbError.message}`);
  }

  revalidatePath("/history");
  redirect("/history");
}

/** 发送留言 */
export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.name) {
    throw new Error("请先登录");
  }

  const toUser = formData.get("to_user") as string;
  const content = formData.get("content") as string;
  const isAnonymous = formData.get("is_anonymous") === "true";

  if (!toUser || !content) {
    throw new Error("请填写完整");
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("messages").insert({
    from_user: isAnonymous ? "匿名" : session.user.name,
    to_user: toUser,
    content,
    is_anonymous: isAnonymous,
  });

  if (error) {
    throw new Error(`留言失败: ${error.message}`);
  }

  revalidatePath("/members");
  revalidatePath("/");
}
