export interface Post {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  categories: string[]
  image?: string
  draft?: boolean
  readingTime: string
  content: string
}

export interface Project {
  slug: string
  title: string
  description: string
  image?: string
  link?: string
  github?: string
  tags: string[]
  detailed: string
}

export interface Tag {
  name: string
  count: number
  slug: string
}

export interface Category {
  name: string
  count: number
  slug: string
}
