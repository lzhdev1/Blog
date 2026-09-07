import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface AboutData {
  name: string
  signature: string
  phone: string
  email: string
  hometown: string
  location: string
  education: Array<{
    school: string
    major: string
    degree: string
    start: string
    end: string
  }>
  internships: Array<{
    company: string
    position: string
    location: string
    start: string
    end: string
  }>
  skills: string[]
  awards: string[]
}

export function getAboutData(): AboutData | null {
  const aboutPath = path.join(process.cwd(), 'content/about.mdx')

  if (!fs.existsSync(aboutPath)) {
    return null
  }

  const fileContents = fs.readFileSync(aboutPath, 'utf8')
  const { data } = matter(fileContents)

  return {
    name: data.name || 'Your Name',
    signature: data.signature || '',
    phone: data.phone || '',
    email: data.email || '',
    hometown: data.hometown || '',
    location: data.location || '',
    education: data.education || [],
    internships: data.internships || [],
    skills: data.skills || [],
    awards: data.awards || [],
  }
}
