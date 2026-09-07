import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      (await import('remark-gfm')).default,
      (await import('remark-frontmatter')).default,
    ],
    rehypePlugins: [
      [
        (await import('rehype-pretty-code')).default,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
