'use client'

import { useState } from 'react'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeString = String(children).replace(/\n$/, '')
  const language = className?.replace('language-', '') || 'text'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      {/* Language label */}
      <div className="absolute top-0 right-0 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-bl-lg">
        {language}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-20 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="复制代码"
      >
        {copied ? '已复制' : '复制'}
      </button>

      <pre className="!mt-8">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}
