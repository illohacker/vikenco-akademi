import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'

type SectionMeta = {
  id: string
  title: string
  description: string
  icon: string
  color: string
  inactive?: boolean
  lessons: unknown[]
}

type ProductionContent = {
  title: string
  description: string
  sections: SectionMeta[]
}

async function loadProductionContent(locale: string): Promise<ProductionContent | null> {
  try {
    const content = await import(`@/content/${locale}/modules/production.json`)
    return (content.default || content) as ProductionContent
  } catch {
    try {
      const content = await import(`@/content/no/modules/production.json`)
      return (content.default || content) as ProductionContent
    } catch {
      return null
    }
  }
}

export default async function ProductionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const content = await loadProductionContent(locale)

  return <ProductionCards content={content} />
}

function ProductionCards({ content }: { content: ProductionContent | null }) {
  const t = useTranslations('modules')
  const tc = useTranslations('common')

  if (!content) return null

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/modules" className="inline-flex items-center gap-1 text-white/70 hover:text-white mb-4 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tc('back')}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🐟</span>
            <div>
              <h1 className="text-3xl font-bold">{content.title}</h1>
              <p className="text-white/80 mt-1">{content.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SectionCard({ section }: { section: SectionMeta }) {
  const lessonCount = section.lessons?.length || 0

  if (section.inactive) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 opacity-60 cursor-not-allowed">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-3xl">
            {section.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-400">{section.title}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{section.description}</p>
          </div>
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-gray-300 text-gray-600 text-xs font-bold rounded-full">
          Inactive
        </div>
      </div>
    )
  }

  return (
    <Link
      href={`/modules/production/${section.id}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-6"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className="relative flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-3xl shadow-md`}>
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--vikenco-blue)] transition-colors">{section.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{section.description}</p>
          {lessonCount > 0 && (
            <p className="text-xs text-gray-400 mt-1">{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</p>
          )}
        </div>
        <svg className="w-5 h-5 text-gray-300 group-hover:text-[var(--vikenco-light)] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
