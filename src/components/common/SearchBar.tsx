'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import type { SearchItem } from '@/lib/searchIndex'

interface TagMatch {
  tag: string
  count: number
}

interface ParsedQuery {
  tagFilters: string[]
  keyword: string
}

// 解析查询：提取 tag:xxx 语法
function parseQuery(raw: string): ParsedQuery {
  const tagFilters: string[] = []
  let remaining = raw

  const tagRegex = /tag:("([^"]+)"|'([^']+)'|(\S+))/g
  let match: RegExpExecArray | null
  const keywordParts: string[] = []
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

function renderHighlighted(text: string, keyword: string) {
  if (!text) return null
  if (!keyword.trim()) return <>{text}</>
  try {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const parts = text.split(regex)
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 text-inherit rounded px-0.5">
              {part}
            </mark>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </>
    )
  } catch {
    return <>{text}</>
  }
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [allItems, setAllItems] = useState<SearchItem[]>([])
  const [allTags, setAllTags] = useState<TagMatch[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isFocused, setIsFocused] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 加载搜索索引
  useEffect(() => {
    if (loadState !== 'loading') return
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch('/api/search')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: SearchItem[] = await res.json()
        if (cancelled) return

        if (!Array.isArray(data)) throw new Error('Invalid search index')

        setAllItems(data)

        // 聚合所有标签
        const tagMap = new Map<string, number>()
        data.forEach((item) => {
          ;(item.tags || []).forEach((tag) => {
            const key = tag.toLowerCase()
            tagMap.set(key, (tagMap.get(key) || 0) + 1)
          })
        })
        setAllTags(
          Array.from(tagMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
        )

        setLoadState('ready')
      } catch (err) {
        console.error('[SearchBar] failed to load index:', err)
        if (!cancelled) setLoadState('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [loadState])

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fuse 实例
  const fuse = useMemo<Fuse<SearchItem> | null>(() => {
    if (!allItems.length) return null
    try {
      return new Fuse<SearchItem>(
        allItems,
        {
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
        }
      )
    } catch (err) {
      console.error('[SearchBar] Fuse init error:', err)
      return null
    }
  }, [allItems])

  const parsed = useMemo(() => parseQuery(query), [query])

  // 搜索结果
  const results = useMemo<SearchItem[]>(() => {
    const hasTagFilter = parsed.tagFilters.length > 0
    const hasKeyword = parsed.keyword.length > 0

    if (!hasTagFilter && !hasKeyword) return []

    try {
      let items: SearchItem[]

      if (hasKeyword && fuse) {
        items = fuse.search(parsed.keyword).map((r) => r.item)
      } else if (hasKeyword) {
        const kw = parsed.keyword.toLowerCase()
        items = allItems.filter(
          (it) =>
            it.title.toLowerCase().includes(kw) ||
            it.description.toLowerCase().includes(kw) ||
            (it.tags || []).some((t) => t.toLowerCase().includes(kw))
        )
      } else {
        items = allItems
      }

      if (hasTagFilter) {
        items = items.filter((item) =>
          parsed.tagFilters.every((tf) =>
            (item.tags || []).some((t) => t.toLowerCase() === tf)
          )
        )
      }

      return items.slice(0, 8)
    } catch (err) {
      console.error('[SearchBar] search error:', err)
      return []
    }
  }, [fuse, parsed, allItems])

  // 标签建议
  const tagSuggestions = useMemo<TagMatch[]>(() => {
    const kw = parsed.keyword.toLowerCase()
    const excluded = new Set(parsed.tagFilters)

    let suggestions: TagMatch[]
    if (kw) {
      suggestions = allTags.filter((t) => t.tag.includes(kw) && !excluded.has(t.tag))
    } else if (parsed.tagFilters.length > 0) {
      suggestions = allTags.filter((t) => !excluded.has(t.tag))
    } else {
      suggestions = []
    }

    return suggestions.slice(0, 5)
  }, [allTags, parsed])

  // 当查询变化时重置 activeIndex
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const hasTagRow = tagSuggestions.length > 0 && (parsed.keyword || parsed.tagFilters.length > 0)
  const totalRows = results.length + (hasTagRow ? 1 : 0)
  const showDropdown =
    isFocused && isOpen && loadState === 'ready' && (totalRows > 0 || parsed.tagFilters.length > 0)

  // 跳转到全量搜索结果页
  function goToSearchPage(q: string) {
    const trimmed = q.trim()
    if (!trimmed) return
    setIsOpen(false)
    inputRef.current?.blur()
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      // 回车：跳转到全量搜索结果页（区分标签/文章/项目）
      goToSearchPage(query)
      return
    }

    if (!showDropdown) {
      if (e.key === 'Escape') setIsOpen(false)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % Math.max(totalRows, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + totalRows) % Math.max(totalRows, 1))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  function getItemHref(item: SearchItem): string {
    return item.kind === 'post' ? `/posts/${item.slug}` : `/projects`
  }

  function handleTagClick(tag: string) {
    if (parsed.tagFilters.includes(tag.toLowerCase())) return
    const existingTagParts = parsed.tagFilters.map((t) => `tag:${t}`).join(' ')
    const keywordPart = parsed.keyword
    setQuery(`${existingTagParts} tag:${tag} ${keywordPart}`.trim() + ' ')
    setIsOpen(true)
    inputRef.current?.focus()
  }

  function handleClear() {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setIsFocused(true)
            setIsOpen(true)
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={
            loadState === 'loading'
              ? '加载搜索索引…'
              : loadState === 'error'
              ? '搜索不可用'
              : '搜索文章/项目，回车查看全部结果'
          }
          disabled={loadState === 'error'}
          className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="清空搜索"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        // IMPORTANT: prevent mousedown inside the dropdown from blurring the input,
        // otherwise the dropdown unmounts before click events can fire on child Links/buttons.
        <div
          className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50"
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* 当前 tag 筛选展示 */}
          {parsed.tagFilters.length > 0 && (
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400">筛选标签：</span>
              {parsed.tagFilters.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs"
                >
                  {t}
                  <button
                    onClick={() => {
                      const newFilters = parsed.tagFilters.filter((x) => x !== t)
                      const rest = newFilters.map((x) => `tag:${x}`).join(' ')
                      setQuery(`${rest} ${parsed.keyword}`.trim() + (parsed.keyword ? ' ' : ''))
                    }}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                    aria-label={`移除标签 ${t}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 标签建议 */}
          {tagSuggestions.length > 0 && (
            <div className="border-b border-gray-100 dark:border-gray-800">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {parsed.keyword ? '匹配标签' : '热门标签'}
              </div>
              {tagSuggestions.map((suggestion, idx) => {
                const globalIdx = results.length + idx
                const isActive = globalIdx === activeIndex
                return (
                  <button
                    key={suggestion.tag}
                    type="button"
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                    onClick={() => handleTagClick(suggestion.tag)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors text-left ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded">
                        tag:
                      </span>
                      <span className="font-medium">{suggestion.tag}</span>
                    </span>
                    <span className="text-xs text-gray-400">{suggestion.count} 篇</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* 搜索结果 */}
          {results.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {results.length} 个结果 · 按回车查看全部
              </div>
              {results.map((item, idx) => {
                const isActive = idx === activeIndex
                const href = getItemHref(item)
                return (
                  <Link
                    key={`${item.kind}-${item.slug}`}
                    href={href}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className={`block px-3 py-2.5 border-t border-gray-50 dark:border-gray-800/50 first:border-t-0 transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded ${
                          item.kind === 'post'
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {item.kind === 'post' ? '文章' : '项目'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {renderHighlighted(item.title, parsed.keyword)}
                        </div>
                        {item.description && (
                          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {renderHighlighted(item.description, parsed.keyword)}
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* 无结果 */}
          {results.length === 0 && (parsed.keyword || parsed.tagFilters.length > 0) && (
            <div className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              没有找到匹配的内容
            </div>
          )}

          {/* 底部提示 */}
          {totalRows > 0 && (
            <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  <kbd className="px-1 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-[9px]">↑↓</kbd>
                  导航
                </span>
                <span className="flex items-center gap-0.5">
                  <kbd className="px-1 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-[9px]">↵</kbd>
                  查看全部
                </span>
                <span className="flex items-center gap-0.5">
                  <kbd className="px-1 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-[9px]">esc</kbd>
                  关闭
                </span>
              </span>
              <span>模糊匹配已开启</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
