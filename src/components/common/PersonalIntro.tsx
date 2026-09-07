'use client'

import { useState } from 'react'
import type { AboutData } from '@/lib/about'
import { EmailModal } from '@/components/common/EmailModal'

interface PersonalIntroProps {
  about: AboutData
}

export function PersonalIntro({ about }: PersonalIntroProps) {
  const [isEmailOpen, setIsEmailOpen] = useState(false)

  return (
    <>
      <div className="px-6 pt-2 pb-6 space-y-4">
        {/* Header */}
        <div className="pb-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">个人简介</h2>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-semibold mb-1">{about.name}</h3>
            {about.signature && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {about.signature}
              </p>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            基本信息
          </h3>
          <div className="space-y-2">
            {about.phone && (
              <InfoItem icon="phone" label="电话" value={about.phone} />
            )}
            {about.email && (
              <InfoItem icon="email" label="邮箱" value={about.email} onClick={() => setIsEmailOpen(true)} clickable />
            )}
            {about.hometown && (
              <InfoItem icon="location" label="籍贯" value={about.hometown} />
            )}
            {about.location && (
              <InfoItem icon="home" label="现居地" value={about.location} />
            )}
          </div>
        </div>

        {/* Education */}
        {about.education.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              教育经历
            </h3>
            <div className="space-y-3">
              {about.education.map((edu, index) => (
                <TimelineCard
                  key={index}
                  title={edu.school}
                  subtitle={`${edu.degree} · ${edu.major}`}
                  dateRange={`${edu.start} - ${edu.end}`}
                  color="blue"
                />
              ))}
            </div>
          </div>
        )}

        {/* Internships */}
        {about.internships.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              实习经历
            </h3>
            <div className="space-y-3">
              {about.internships.map((intern, index) => (
                <TimelineCard
                  key={index}
                  title={intern.company}
                  subtitle={`${intern.position} · ${intern.location}`}
                  dateRange={`${intern.start} - ${intern.end}`}
                  color="purple"
                />
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {about.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              技能掌握
            </h3>
            <div className="space-y-2">
              {about.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500"></span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {about.awards.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              奖项荣誉
            </h3>
            <div className="space-y-2">
              {about.awards.map((award, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 text-yellow-500">🏆</span>
                  <span>{award}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EmailModal isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
    </>
  )
}

// Helper Components

function InfoItem({
  icon,
  label,
  value,
  onClick,
  clickable,
}: {
  icon: string
  label: string
  value: string
  onClick?: () => void
  clickable?: boolean
}) {
  const icons: Record<string, JSX.Element> = {
    phone: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    email: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    location: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    home: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  }

  return (
    <div
      className={`flex items-center gap-3 text-sm ${
        clickable ? 'cursor-pointer group' : ''
      }`}
      onClick={onClick}
    >
      <div className="text-gray-400 dark:text-gray-500 flex-shrink-0 w-5 flex justify-center">
        {icons[icon]}
      </div>
      <span className="text-gray-500 dark:text-gray-400 w-16 flex-shrink-0">
        {label}
      </span>
      <span className={`${clickable ? 'text-blue-600 dark:text-blue-400 group-hover:underline' : 'text-gray-900 dark:text-gray-100'}`}>
        {value}
      </span>
    </div>
  )
}

function TimelineCard({
  title,
  subtitle,
  dateRange,
  color,
}: {
  title: string
  subtitle: string
  dateRange: string
  color: 'blue' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  }

  return (
    <div className="relative pl-6 pb-4 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 last:hidden"></div>

      {/* Timeline dot */}
      <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${colorClasses[color]} border-4 border-white dark:border-gray-900`}></div>

      {/* Glass Card */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/30 dark:from-gray-800/60 dark:to-gray-800/20 border border-white/40 dark:border-gray-600/30 rounded-xl p-4 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 hover:shadow-xl hover:bg-gradient-to-br hover:from-white/80 hover:to-white/40 dark:hover:from-gray-800/70 dark:hover:to-gray-800/30 transition-all min-h-[80px]">
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 pointer-events-none"></div>

        {/* Main Content - Centered */}
        <div className="relative flex flex-col items-center justify-center text-center">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
            {title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Time - Bottom Right */}
        <div className="absolute bottom-2 right-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {dateRange}
          </span>
        </div>
      </div>
    </div>
  )
}
