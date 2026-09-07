import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Project } from '@/types/post'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }
  return fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getProjectBySlug(slug: string): Project | null {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    image: data.image,
    link: data.link,
    github: data.github,
    tags: data.tags || [],
    detailed: data.detailed || '',
  }
}

export function getAllProjects(): Project[] {
  const slugs = getProjectSlugs()
  return slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => project !== null)
}
