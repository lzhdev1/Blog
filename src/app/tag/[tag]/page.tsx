import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/mdx'
import { PostCard } from '@/components/common/PostCard'
import type { Metadata } from 'next'

interface TagPageProps {
  params: {
    tag: string
  }
}

export function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: tag.slug,
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tags = getAllTags()
  const tag = tags.find((t) => t.slug === params.tag)

  if (!tag) {
    return {
      title: '标签未找到',
    }
  }

  return {
    title: `标签: ${tag.name}`,
    description: `查看标记为 "${tag.name}" 的所有文章`,
  }
}

export default function TagPage({ params }: TagPageProps) {
  const tags = getAllTags()
  const tag = tags.find((t) => t.slug === params.tag)

  if (!tag) {
    notFound()
  }

  const posts = getPostsByTag(tag.name)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/tags"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 mb-8 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回所有标签
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <h1 className="text-4xl font-bold">{tag.name}</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          共 {posts.length} 篇文章
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>该标签下暂无文章</p>
        </div>
      )}
    </div>
  )
}
