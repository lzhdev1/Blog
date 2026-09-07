import { getAllPosts } from '@/lib/mdx'
import { PostCard } from '@/components/common/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '博客',
  description: '所有博客文章',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">所有文章</h1>
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
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>暂无文章</p>
          <p className="text-sm mt-2">在 content/posts 目录中添加 MDX 文件开始写作吧！</p>
        </div>
      )}
    </div>
  )
}
