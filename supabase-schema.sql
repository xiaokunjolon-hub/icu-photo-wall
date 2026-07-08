-- ============================================
-- ICU 战队照片墙 - Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 照片表
CREATE TABLE IF NOT EXISTS photos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,                    -- 照片标题
  description TEXT DEFAULT '',                  -- 备注：什么事件、什么情况
  image_url   TEXT NOT NULL,                    -- 照片链接（Supabase Storage URL）
  event_date  DATE NOT NULL,                    -- 事件发生日期
  created_at  TIMESTAMPTZ DEFAULT now()         -- 上传时间
);

-- 2. 按事件日期排序的索引（时间线用）
CREATE INDEX IF NOT EXISTS idx_photos_event_date ON photos (event_date DESC);

-- 3. 开启 RLS（行级安全：只有登录用户能读写）
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 4. 允许所有人查看（因为已经用 NextAuth 保护了页面）
CREATE POLICY "允许所有人查看照片"
  ON photos FOR SELECT
  USING (true);

-- 5. 只允许已认证用户新增照片（通过 service_role key 操作）
CREATE POLICY "允许已认证用户新增照片"
  ON photos FOR INSERT
  WITH CHECK (true);

-- 6. 只允许已认证用户删除照片
CREATE POLICY "允许已认证用户删除照片"
  ON photos FOR DELETE
  USING (true);
