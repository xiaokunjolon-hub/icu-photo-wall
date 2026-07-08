-- ============================================
-- ICU 兄弟照片墙 - Supabase 数据库 Schema
-- 请在 Supabase SQL Editor 中执行
-- https://supabase.com/dashboard/project/mnlpdwymplibtxljcmeg
-- ============================================

-- 1. 照片表
CREATE TABLE IF NOT EXISTS photos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  location    TEXT DEFAULT '',
  image_url   TEXT NOT NULL,
  event_date  DATE NOT NULL,
  uploaded_by TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_photos_event_date ON photos (event_date DESC);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人查看照片"
  ON photos FOR SELECT
  USING (true);

CREATE POLICY "允许所有人新增照片"
  ON photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许所有人删除照片"
  ON photos FOR DELETE
  USING (true);

-- 2. 留言表
CREATE TABLE IF NOT EXISTS messages (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user    TEXT NOT NULL,
  to_user      TEXT NOT NULL,
  content      TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages (to_user);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人查看留言"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "允许所有人新增留言"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许所有人删除留言"
  ON messages FOR DELETE
  USING (true);
