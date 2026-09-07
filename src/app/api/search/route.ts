import { NextResponse } from 'next/server'
import { buildSearchIndex } from '@/lib/searchIndex'

export async function GET() {
  try {
    const index = buildSearchIndex()
    return NextResponse.json(index, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Failed to build search index', error)
    return NextResponse.json([], { status: 500 })
  }
}
