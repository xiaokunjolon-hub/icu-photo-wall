# ICU 战队照片墙 — 项目状态

## 基本信息

| 项目 | 详情 |
|------|------|
| 项目名称 | ICU 战队照片墙 (ICU Team Photo Wall) |
| 项目路径 | `D:\Projects\bro-photo-wall` |
| 技术栈 | Next.js 16 + NextAuth v5 + Supabase + Tailwind CSS |
| 部署目标 | Vercel（免费） + Supabase（免费） |
| 当前进度 | **Step 1 — 框架搭建完成，待配置 Supabase 和部署** |
| Git | 已初始化，无 remote |

## 已完成的页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 登录页 | `/login` | ICU 暗黑风，团队共享密码登录 |
| 主页 | `/` | ICU 战队主页，快捷入口 |
| 历史时间线 | `/history` | 照片时间线，按年份分组，含标题+日期+备注 |

## 认证系统

- NextAuth v5（Credentials Provider）
- 团队密码存在环境变量 `ICU_TEAM_PASSWORD`
- 所有页面（除登录页和 API）都受中间件保护，未登录自动跳转登录页

## 数据库（Supabase 待配置）

- 表：`photos`（id, title, description, image_url, event_date, created_at）
- 存储：Supabase Storage 存照片文件
- Schema 文件：`supabase-schema.sql`

## 下一步

1. 去 [supabase.com](https://supabase.com) 创建免费项目
2. 获取 URL 和密钥，填入 `.env.local`
3. 在 Supabase SQL Editor 执行 `supabase-schema.sql`
4. 创建 Storage bucket 存照片
5. 部署到 Vercel
