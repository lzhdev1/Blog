'use client'

import { useState, useEffect } from 'react'
import Fuse from 'fuse.js'

interface SearchIndexItem {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  bodyText: string
}

export function useSearch() {
  const [index, setIndex] = useState<SearchIndexItem[]>([])
  const [fuse, setFuse] = useState<Fuse<SearchIndexItem> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load search index
    fetch('/_search/index.json')
      .then((res) => res.json())
      .then((data) => {
        setIndex(data)
        const fuseInstance = new Fuse(data, {
          keys: [
            { name: 'title', weight: 2 },
            { name: 'summary', weight: 1.5 },
            { name: 'tags', weight: 1.2 },
            { name: 'bodyText', weight: 1 },
          ],
          threshold: 0.3,
          includeScore: true,
        })
        setFuse(fuseInstance)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load search index:', error)
        setLoading(false)
      })
  }, [])

  const search = (query: string): SearchIndexItem[] => {
    if (!fuse || !query.trim()) {
      return []
    }
    return fuse.search(query).map((result) => result.item)
  }

  return { search, loading, index }
}
