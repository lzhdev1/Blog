export const siteConfig = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'LIZONGHAN',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A minimalist personal blog',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: {
    name: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'LIZONGHAN',
    email: 'lzh2411829@gmail.com',
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
  nav: [
    { label: '首页', href: '/' },
    { label: '博客', href: '/blog' },
    { label: '项目', href: '/projects' },
  ],
  postsPerPage: 10,
} as const
