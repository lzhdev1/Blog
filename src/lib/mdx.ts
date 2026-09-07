import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post } from '@/types/post'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    summary: data.summary || '',
    tags: data.tags || [],
    categories: data.categories || [],
    image: data.image,
    draft: data.draft || false,
    readingTime: stats.text,
    content,
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) =>
    post.categories.some((c) => c.toLowerCase() === category.toLowerCase())
  )
}

export function getAllTags(): { name: string; count: number; slug: string }[] {
  const posts = getAllPosts()
  const tagCount = new Map<string, number>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const normalized = tag.toLowerCase()
      tagCount.set(normalized, (tagCount.get(normalized) || 0) + 1)
    })
  })

  return Array.from(tagCount.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.replace(/\s+/g, '-'),
    }))
    .sort((a, b) => b.count - a.count)
}

export function getAllCategories(): { name: string; count: number; slug: string }[] {
  const posts = getAllPosts()
  const categoryCount = new Map<string, number>()

  posts.forEach((post) => {
    post.categories.forEach((category) => {
      const normalized = category.toLowerCase()
      categoryCount.set(normalized, (categoryCount.get(normalized) || 0) + 1)
    })
  })

  return Array.from(categoryCount.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.replace(/\s+/g, '-'),
    }))
    .sort((a, b) => b.count - a.count)
}
