import Link from 'next/link'
import { formatDate } from '@/lib/date'
import type { Post } from '@/types/post'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
          {/* Date and Reading Time */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>

          {/* Summary */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {post.summary}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
