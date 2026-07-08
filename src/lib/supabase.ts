import { createClient } from "@supabase/supabase-js";

// 检查 Supabase 是否已配置
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url"
  );
}

// 客户端 Supabase（浏览器组件中使用）
export function createBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase 未配置，请在 .env.local 中设置 SUPABASE 环境变量");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// 服务端 Supabase（Server Components / API Routes 中使用）
export function createServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase 未配置");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
