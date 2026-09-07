import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllCategories, getPostsByCategory } from '@/lib/mdx'
import { PostCard } from '@/components/common/PostCard'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: {
    category: string
  }
}

export function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = getAllCategories()
  const category = categories.find((c) => c.slug === params.category)

  if (!category) {
    return {
      title: '分类未找到',
    }
  }

  return {
    title: `分类: ${category.name}`,
    description: `查看 "${category.name}" 分类下的所有文章`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categories = getAllCategories()
  const category = categories.find((c) => c.slug === params.category)

  if (!category) {
    notFound()
  }

  const posts = getPostsByCategory(category.name)

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
        返回所有分类
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h1 className="text-4xl font-bold">{category.name}</h1>
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
          <p>该分类下暂无文章</p>
        </div>
      )}
    </div>
  )
}
