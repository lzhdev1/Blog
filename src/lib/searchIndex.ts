import { getAllPosts } from './mdx'
import { getAllProjects } from './projects'

export type SearchItemKind = 'post' | 'project'

export interface SearchItem {
  kind: SearchItemKind
  slug: string
  title: string
  date?: string
  description: string
  tags: string[]
  // 供搜索的纯文本（去 MDX 语法）
  bodyText: string
}

function stripMdx(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~`>]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildSearchIndex(): SearchItem[] {
  const posts: SearchItem[] = getAllPosts().map((post) => ({
    kind: 'post',
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.summary,
    tags: post.tags,
    bodyText: stripMdx(post.content),
  }))

  const projects: SearchItem[] = getAllProjects().map((project) => ({
    kind: 'project',
    slug: project.slug,
    title: project.title,
    description: project.description,
    tags: project.tags,
    bodyText: stripMdx(project.content || ''),
  }))

  return [...posts, ...projects]
}
