import Link from 'next/link'
import { getAllTags, getAllCategories } from '@/lib/mdx'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览文章',
}

export default function TagsPage() {
  const tags = getAllTags()
  const categories = getAllCategories()

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">标签与分类</h1>
        <p className="text-gray-600 dark:text-gray-400">
          按标签或分类浏览文章
        </p>
      </header>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.count} 篇文章
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">标签</h2>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="group px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-full hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span className="group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {tag.name}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({tag.count})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tags.length === 0 && categories.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>暂无标签或分类</p>
          <p className="text-sm mt-2">在文章的 frontmatter 中添加 tags 和 categories</p>
        </div>
      )}
    </div>
  )
}
