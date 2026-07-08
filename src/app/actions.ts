"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// R2 客户端（兼容 S3 API）
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

/** 上传照片 → R2 存储 + Supabase 数据库 */
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

  if (!file || file.size === 0) throw new Error("请选择照片");
  if (!title) throw new Error("请填写标题");
  if (!event_date) throw new Error("请选择日期");

  // 1. 上传到 Cloudflare R2
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await r2.send(
    new PutObjectCommand({
      Bucket: "icu-photos",
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    })
  );

  const imageUrl = `${R2_PUBLIC_URL}/${fileName}`;

  // 2. 写入 Supabase 数据库
  const supabase = createServerClient();
  const { error: dbError } = await supabase.from("photos").insert({
    title,
    description,
    location: location || "",
    image_url: imageUrl,
    event_date,
    uploaded_by: session.user.name,
  });

  if (dbError) {
    throw new Error(`保存失败: ${dbError.message}`);
  }

  revalidatePath("/history");
  redirect("/history");
}

/** 发送留言 → Supabase */
export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.name) {
    throw new Error("请先登录");
  }

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
