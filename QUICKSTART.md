# 快速启动指南

## 🚀 立即开始

### 方式一：使用 Docker（推荐）

```bash
# 1. 复制环境变量文件
cp .env.example .env.local

# 2. 启动开发服务器
docker compose up

# 3. 打开浏览器访问
# http://localhost:3000
```

### 方式二：本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
# http://localhost:3000
```

## 📝 开始写作

### 创建第一篇博客文章

在 `content/posts/` 目录下创建新文件，例如 `my-first-post.mdx`：

```markdown
---
title: "我的第一篇博客"
date: "2024-01-15"
summary: "这是我的第一篇博客文章"
tags: ["生活", "随笔"]
categories: ["生活"]
draft: false
---

# 我的第一篇博客

你好，这是我的第一篇博客文章！

## 代码示例

```javascript
console.log('Hello, World!')
```

## 列表

- 第一项
- 第二项
- 第三项

> 这是一段引用
```

### 添加项目展示

在 `content/projects/` 目录下创建 `my-project.mdx`：

```markdown
---
title: "我的项目"
description: "这是一个很酷的项目"
tags: ["React", "Next.js"]
link: "https://example.com"
github: "https://github.com/username/project"
---

# 我的项目

项目详情介绍...
```

## 🎨 自定义配置

编辑 `src/constants/site.ts` 修改网站配置：

```typescript
export const siteConfig = {
  title: '你的博客名称',
  description: '你的博客描述',
  author: {
    name: '你的名字',
    email: 'your.email@example.com',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
  // ...
}
```

## 📦 部署到 Vercel

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/blog.git
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - 配置环境变量（可选）
   - 点击 "Deploy"

3. **自动部署**
   - 每次推送到 `main` 分支会自动部署
   - PR 会生成预览部署

## 🔍 功能说明

### 搜索功能

搜索会自动索引所有文章内容，访问 `/search?q=关键词` 进行搜索。

### 标签和分类

- 在文章的 frontmatter 中添加 `tags` 和 `categories`
- 访问 `/tags` 查看所有标签和分类
- 点击标签或分类可以筛选相关文章

### 暗黑模式

- 点击右上角的主题切换按钮
- 会自动记住用户偏好
- 支持系统主题偏好检测

## 🛠️ 常见问题

### Q: 如何添加图片？

将图片放在 `public/images/` 目录下，然后在 MDX 中引用：

```markdown
![图片描述](/images/my-image.png)
```

### Q: 如何修改导航菜单？

编辑 `src/constants/site.ts` 中的 `nav` 数组：

```typescript
nav: [
  { label: '首页', href: '/' },
  { label: '博客', href: '/blog' },
  // 添加更多菜单项
]
```

### Q: 如何启用 Supabase 评论系统？

1. 安装依赖：`npm install @supabase/ssr @supabase/supabase-js`
2. 配置环境变量
3. 实现 `src/lib/db.ts` 中的函数
4. 创建评论组件

## 📚 更多信息

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [MDX 文档](https://mdxjs.com/docs)
- [Vercel 文档](https://vercel.com/docs)

## 🆘 需要帮助？

如果遇到问题，请：
1. 检查 [README.md](./README.md)
2. 查看示例文章格式
3. 确保所有依赖已安装

祝你写作愉快！🎉
