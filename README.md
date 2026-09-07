# 个人博客

一个使用 Next.js 和 Tailwind CSS 构建的极简风格个人博客。

## 特性

- 🎨 极简设计风格
- 🌓 暗黑模式支持
- 📝 MDX 内容管理
- 🔍 全文搜索功能
- 🏷️ 标签和分类系统
- 📱 响应式布局
- 🐳 Docker 容器化开发
- 🚀 Vercel 部署优化

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **内容**: MDX + Markdown
- **搜索**: Fuse.js
- **代码高亮**: Shiki
- **部署**: Vercel

## 快速开始

### 使用 Docker（推荐）

```bash
# 复制环境变量文件
cp .env.example .env.local

# 启动开发服务器
docker compose up

# 访问 http://localhost:3000
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 项目结构

```
Blog/
├── content/              # MDX 内容文件
│   ├── posts/           # 博客文章
│   ├── projects/        # 项目展示
│   └── about.mdx        # 关于页面
├── src/
│   ├── app/             # Next.js 页面路由
│   ├── components/      # React 组件
│   ├── lib/             # 工具函数
│   ├── hooks/           # 自定义 Hooks
│   ├── types/           # TypeScript 类型
│   └── constants/       # 常量配置
├── public/              # 静态资源
└── docker-compose.yml   # Docker 配置
```

## 编写文章

在 `content/posts/` 目录下创建 `.mdx` 文件：

```markdown
---
title: "文章标题"
date: "2024-01-15"
summary: "文章摘要"
tags: ["标签1", "标签2"]
categories: ["分类"]
draft: false
---

文章内容...
```

## 添加项目

在 `content/projects/` 目录下创建 `.mdx` 文件：

```markdown
---
title: "项目名称"
description: "项目描述"
tags: ["技术栈"]
link: "https://example.com"
github: "https://github.com/username/project"
---

项目详情...
```

## 环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_TITLE=My Blog
NEXT_PUBLIC_SITE_DESCRIPTION=A minimalist personal blog
NEXT_PUBLIC_AUTHOR_NAME=Your Name
```

## 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署完成！

## Supabase 集成（预留）

项目预留了 Supabase 数据库集成接口，可用于：
- 评论系统
- 点赞功能
- 用户认证

启用时：
1. 安装 `@supabase/ssr` 和 `@supabase/supabase-js`
2. 配置 Supabase 环境变量
3. 实现 `src/lib/db.ts` 中的函数

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

## License

MIT
