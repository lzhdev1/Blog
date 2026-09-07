import Link from 'next/link'
import { redirect } from 'next/navigation'
import Fuse from 'fuse.js'
import { buildSearchIndex, type SearchItem } from '@/lib/searchIndex'
import { getAllTags } from '@/lib/mdx'

interface SearchPageProps {
  searchParams: { q?: string }
}

interface ParsedQuery {
  tagFilters: string[]
  keyword: string
}

function parseQuery(raw: string): ParsedQuery {
  const tagFilters: string[] = []
  const keywordParts: string[] = []
  const tagRegex = /tag:("([^"]+)"|'([^']+)'|(\S+))/g
  let match: RegExpExecArray | null
  let lastIndex = 0

  while ((match = tagRegex.exec(raw)) !== null) {
    const value = match[2] || match[3] || match[4] || ''
    if (value) tagFilters.push(value.toLowerCase())
    keywordParts.push(raw.slice(lastIndex, match.index))
    lastIndex = match.index + match[0].length
  }
  keywordParts.push(raw.slice(lastIndex))

  return {
    tagFilters,
    keyword: keywordParts.join(' ').trim(),
  }
}

// Split highlighted text into React-renderable pieces
function renderHighlighted(text: string, keyword: string) {
  if (!text) return null
  if (!keyword.trim()) return <>{text}</>
  try {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 text-inherit rounded px-0.5">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  } catch {
    return <>{text}</>
  }
}

export const metadata = {
  title: '搜索',
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const rawQuery = searchParams.q?.trim() || ''
  if (!rawQuery) redirect('/')

  const parsed = parseQuery(rawQuery)
  const allItems = buildSearchIndex()
  const allTags = getAllTags()

  // Search posts/projects
  let matchedItems: SearchItem[] = []
  try {
    const fuse = new Fuse<SearchItem>(allItems, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.15 },
        { name: 'bodyText', weight: 0.05 },
      ],
      threshold: 0.4,
      includeMatches: true,
      ignoreLocation: true,
      minMatchCharLength: 1,
    })

    if (parsed.keyword) {
      matchedItems = fuse.search(parsed.keyword).map((r) => r.item)
    } else {
      matchedItems = allItems
    }

    if (parsed.tagFilters.length > 0) {
      matchedItems = matchedItems.filter((item) =>
        parsed.tagFilters.every((tf) =>
          (item.tags || []).some((t) => t.toLowerCase() === tf)
        )
      )
    }
  } catch {
    matchedItems = []
  }

  const posts = matchedItems.filter((i) => i.kind === 'post')
  const projects = matchedItems.filter((i) => i.kind === 'project')

  // Find matching tags (by keyword)
  const kw = parsed.keyword.toLowerCase()
  const matchedTags = kw
    ? allTags.filter((t) => t.name.toLowerCase().includes(kw))
    : parsed.tagFilters.length > 0
    ? allTags.filter((t) => parsed.tagFilters.includes(t.name.toLowerCase()))
    : []

  // When only tag filter is present (no keyword), show all tagged items grouped by tag
  const showAllTags = parsed.tagFilters.length > 0 && !kw

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            首页
          </Link>
          <span>/</span>
          <span>搜索</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          搜索结果
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          关键词：<span className="font-mono text-[var(--color-primary)]">"{rawQuery}"</span>
          {parsed.tagFilters.length > 0 && (
            <> · 标签筛选：{parsed.tagFilters.map((t) => (
              <span key={t} className="inline-block ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-sm">
                {t}
              </span>
            ))}</>
          )}
        </p>
      </header>

      {/* Tag section */}
      {matchedTags.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h2 className="text-xl font-bold">标签</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">({matchedTags.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="group inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-full hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  {tag.name}
                </span>
                <span className="text-xs text-gray-400">{tag.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Posts section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-bold">文章</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">({posts.length})</span>
        </div>
        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((item) => (
              <Link
                key={item.slug}
                href={`/posts/${item.slug}`}
                className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                      {renderHighlighted(item.title, parsed.keyword)}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {renderHighlighted(item.description, parsed.keyword)}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {item.date && (
                    <time className="text-xs text-gray-400 shrink-0 mt-1">
                      {item.date}
                    </time>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            没有找到匹配的文章
          </p>
        )}
      </section>

      {/* Projects section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h2 className="text-xl font-bold">项目</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">({projects.length})</span>
        </div>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((item) => (
              <Link
                key={item.slug}
                href="/projects"
                className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                  {renderHighlighted(item.title, parsed.keyword)}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {renderHighlighted(item.description, parsed.keyword)}
                  </p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            没有找到匹配的项目
          </p>
        )}
      </section>
    </div>
  )
}
