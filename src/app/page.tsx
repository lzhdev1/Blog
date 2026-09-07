import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { PostCard } from '@/components/common/PostCard'
import { PersonalIntroWrapper } from '@/components/common/PersonalIntroWrapper'
import { PortfolioSection } from '@/components/common/PortfolioSection'

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5)

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 h-full">
        {/* Left Column - Personal Introduction */}
        <div className="md:col-span-3 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
          <PersonalIntroWrapper />
        </div>

        {/* Center Column - Recent Posts */}
        <div className="md:col-span-6 h-full overflow-y-auto">
          <section className="px-8 pt-2 pb-8">
            <div className="pb-4 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">最新文章</h2>
                <Link
                  href="/blog"
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  查看全部 →
                </Link>
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <p>暂无文章</p>
                <p className="text-sm mt-2">在 content/posts 目录中添加 MDX 文件开始写作吧！</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Portfolio */}
        <div className="md:col-span-3 border-l border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
          <PortfolioSection />
        </div>
      </div>
    </div>
  )
}
