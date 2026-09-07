import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/components/mdx/MDXComponents'

interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  const components = useMDXComponents({})

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <MDXRemote source={source} components={components} />
    </div>
  )
}
