"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/** 上传单张照片到 R2 */
async function uploadToR2(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await r2.send(
    new PutObjectCommand({
      Bucket: "icu",
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `${R2_PUBLIC_URL}/${fileName}`;
}

/** 上传照片（支持多张） */
export async function uploadPhotos(formData: FormData) {
  const session = await auth();
  if (!session?.user?.name) throw new Error("请先登录");

  const files = formData.getAll("files") as File[];
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const event_date = formData.get("event_date") as string;
  const description = formData.get("description") as string;

  const validFiles = files.filter((f) => f.size > 0);
  if (validFiles.length === 0) throw new Error("请选择照片");
  if (!title) throw new Error("请填写标题");
  if (!event_date) throw new Error("请选择日期");

  const supabase = createServerClient();

  for (const file of validFiles) {
    const imageUrl = await uploadToR2(file);
    const { error } = await supabase.from("photos").insert({
      title,
      description: description || "",
      location: location || "",
      image_url: imageUrl,
      event_date,
      uploaded_by: session.user.name,
    });
    if (error) throw new Error(`保存失败: ${error.message}`);
  }

  revalidatePath("/history");
}

/** 删除照片（R2 + 数据库） */
export async function deletePhoto(photoId: string, imageUrl: string) {
  const session = await auth();
  if (!session?.user?.name) throw new Error("请先登录");

  // 从 R2 删除文件
  try {
    const key = imageUrl.replace(R2_PUBLIC_URL + "/", "");
    await r2.send(new DeleteObjectCommand({ Bucket: "icu", Key: key }));
  } catch {
    // R2 删除失败不阻塞
  }

  // 从数据库删除
  const supabase = createServerClient();
  const { error } = await supabase.from("photos").delete().eq("id", photoId);
  if (error) throw new Error(`删除失败: ${error.message}`);

  revalidatePath("/history");
}

/** 发送留言 */
export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.name) throw new Error("请先登录");

  const toUser = formData.get("to_user") as string;
  const content = formData.get("content") as string;
  const isAnonymous = formData.get("is_anonymous") === "true";

  if (!toUser || !content) throw new Error("请填写完整");

  const supabase = createServerClient();
  const { error } = await supabase.from("messages").insert({
    from_user: isAnonymous ? "匿名" : session.user.name,
    to_user: toUser,
    content,
    is_anonymous: isAnonymous,
  });

  if (error) throw new Error(`留言失败: ${error.message}`);

  revalidatePath("/members");
  revalidatePath("/");
}

/** 编辑照片信息 */
export async function updatePhoto(photoId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.name) throw new Error("请先登录");

  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const event_date = formData.get("event_date") as string;
  const description = formData.get("description") as string;

  if (!title || !event_date) throw new Error("标题和日期必填");

  const supabase = createServerClient();
  const { error } = await supabase
    .from("photos")
    .update({ title, location: location || "", event_date, description: description || "" })
    .eq("id", photoId);

  if (error) throw new Error(`更新失败: ${error.message}`);

  revalidatePath("/history");
  revalidatePath("/history/edit");
}

/** 删除留言 */
export async function deleteMessage(messageId: string) {
  const session = await auth();
  if (!session?.user?.name) throw new Error("请先登录");

  const supabase = createServerClient();
  const { error } = await supabase.from("messages").delete().eq("id", messageId);
  if (error) throw new Error(`删除失败: ${error.message}`);

  revalidatePath("/members");
  revalidatePath("/");
}
