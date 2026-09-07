import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
        页面未找到
      </p>
      <p className="text-gray-500 dark:text-gray-500 mb-8">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        返回首页
      </Link>
    </div>
  )
}
