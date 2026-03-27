import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

const moduleData: Record<string, { icon: string; color: string; titleKey: string }> = {
  welcome: { icon: '👋', color: 'from-blue-500 to-blue-600', titleKey: 'welcome' },
  hms: { icon: '🦺', color: 'from-red-500 to-red-600', titleKey: 'hms' },
  production: { icon: '🐟', color: 'from-cyan-500 to-cyan-600', titleKey: 'production' },
  factory: { icon: '🏭', color: 'from-gray-500 to-gray-600', titleKey: 'factory' },
  conduct: { icon: '📋', color: 'from-amber-500 to-amber-600', titleKey: 'conduct' },
  equipment: { icon: '🔧', color: 'from-emerald-500 to-emerald-600', titleKey: 'equipment' },
  emergency: { icon: '🚨', color: 'from-rose-500 to-rose-600', titleKey: 'emergency' },
}

type Section = {
  type: 'alert' | 'icon-row' | 'rules' | 'info'
  style?: 'warning' | 'danger'
  text?: string
  title?: string
  items?: string[]
  icons?: { src: string; alt: string }[]
}

type Lesson = {
  id: string
  title: string
  icon: string
  sections: Section[]
}

type ModuleContent = {
  title: string
  description: string
  lessons: Lesson[]
}

async function loadModuleContent(locale: string, slug: string): Promise<ModuleContent | null> {
  try {
    const content = await import(`@/content/${locale}/modules/${slug}.json`)
    return content.default || content
  } catch {
    // Fallback chain: locale -> en -> no -> null
    if (locale !== 'en') {
      try {
        const content = await import(`@/content/en/modules/${slug}.json`)
        return content.default || content
      } catch {
        // continue
      }
    }
    if (locale !== 'no') {
      try {
        const content = await import(`@/content/no/modules/${slug}.json`)
        return content.default || content
      } catch {
        // continue
      }
    }
    return null
  }
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const mod = moduleData[slug]

  if (!mod) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Module not found</div>
  }

  const content = await loadModuleContent(locale, slug)

  return <ModuleRenderer slug={slug} mod={mod} content={content} />
}

function ModuleRenderer({ slug, mod, content }: { slug: string; mod: { icon: string; color: string; titleKey: string }; content: ModuleContent | null }) {
  const t = useTranslations('modules')
  const tc = useTranslations('common')

  return (
    <div>
      {/* Header */}
      <div className={`bg-gradient-to-br ${mod.color} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/modules" className="inline-flex items-center gap-1 text-white/70 hover:text-white mb-4 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tc('back')}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{mod.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{content?.title || t(mod.titleKey)}</h1>
              {content?.description && (
                <p className="text-white/80 mt-1">{content.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {content && content.lessons.length > 0 ? (
          content.lessons.map((lesson, lessonIndex) => (
            <div key={lesson.id || lessonIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Lesson header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lesson.icon}</span>
                  <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
                </div>
              </div>

              {/* Lesson sections */}
              <div className="px-6 py-6 space-y-6">
                {lesson.sections.map((section, secIndex) => (
                  <SectionRenderer key={secIndex} section={section} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center py-12 text-gray-400">
              <span className="text-6xl block mb-4">📝</span>
              <p className="text-lg">Innhold kommer snart / Content coming soon</p>
              <p className="text-sm mt-2">Dette modulet er under utvikling</p>
            </div>
          </div>
        )}

        {/* Quiz link */}
        <div className="mt-6">
          <Link
            href={`/quiz/${slug}`}
            className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">❓</div>
              <div>
                <h3 className="font-bold text-gray-900">Quiz: {t(mod.titleKey)}</h3>
                <p className="text-sm text-gray-500">{t('subtitle')}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--vikenco-light)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'alert':
      return (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${
          section.style === 'danger'
            ? 'bg-red-50 border-l-4 border-red-500'
            : 'bg-amber-50 border-l-4 border-amber-500'
        }`}>
          <span className="text-xl flex-shrink-0 mt-0.5">
            {section.style === 'danger' ? '🚨' : '⚠️'}
          </span>
          <p className={`font-semibold ${
            section.style === 'danger' ? 'text-red-800' : 'text-amber-800'
          }`}>
            {section.text}
          </p>
        </div>
      )

    case 'icon-row':
      return (
        <div className="flex items-center justify-center gap-8 py-4">
          {section.icons?.map((icon, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 sm:w-36 sm:h-36 relative drop-shadow-lg">
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      )

    case 'rules':
      return (
        <div className="bg-gray-50 rounded-xl p-5">
          {section.title && (
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">⛔</span> {section.title}
            </h3>
          )}
          <ul className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'info':
      return (
        <div className="bg-blue-50 rounded-xl p-5">
          {section.title && (
            <h3 className="font-bold text-blue-900 mb-3">{section.title}</h3>
          )}
          <ul className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="text-blue-800 font-medium text-base">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )

    default:
      return null
  }
}
