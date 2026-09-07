'use client'

import { useEffect, useState } from 'react'
import { siteConfig } from '@/constants/site'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Trigger enter animation on next frame
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.author.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore */
    }
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 180)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        visible ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent backdrop-blur-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-sm transition-all duration-200 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 p-1 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          aria-label="关闭"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Business Card */}
        <div
          className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl"
        >
          {/* Top accent gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />

          {/* Decorative soft glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)',
            }}
          />

          <div className="relative p-7">
            {/* Avatar / Monogram */}
            <div className="mb-5 flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold text-lg shadow-sm"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                }}
              >
                李
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)] leading-tight">
                  李宗翰
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                  Web Developer
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-[var(--color-border)]" />

            {/* Email row */}
            <div className="mt-5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                Email
              </p>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2.5">
                <span className="text-sm font-mono text-[var(--color-text)] truncate select-all">
                  {siteConfig.author.email}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-white transition-colors"
                  style={{
                    background: copied
                      ? 'var(--color-text-secondary)'
                      : 'var(--color-primary)',
                  }}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      复制
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer hint */}
            <p className="mt-5 text-center text-[11px] text-[var(--color-text-secondary)]">
              欢迎与我交流 ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
