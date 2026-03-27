import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

const moduleData: Record<string, { icon: string; color: string; titleKey: string }> = {
  welcome: { icon: '👋', color: 'from-blue-500 to-blue-600', titleKey: 'welcome' },
  hms: { icon: '🦺', color: 'from-red-500 to-red-600', titleKey: 'hms' },
  production: { icon: '🐟', color: 'from-cyan-500 to-cyan-600', titleKey: 'production' },
  factory: { icon: '🏭', color: 'from-gray-500 to-gray-600', titleKey: 'factory' },
  conduct: { icon: '📋', color: 'from-amber-500 to-amber-600', titleKey: 'conduct' },
  equipment: { icon: '🔧', color: 'from-emerald-500 to-emerald-600', titleKey: 'equipment' },
  emergency: { icon: '🚨', color: 'from-rose-500 to-rose-600', titleKey: 'emergency' },
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mod = moduleData[slug]

  if (!mod) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Module not found</div>
  }

  return <ModuleContent slug={slug} mod={mod} />
}

function ModuleContent({ slug, mod }: { slug: string; mod: { icon: string; color: string; titleKey: string } }) {
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
            <h1 className="text-3xl font-bold">{t(mod.titleKey)}</h1>
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center py-12 text-gray-400">
            <span className="text-6xl block mb-4">📝</span>
            <p className="text-lg">Innhold kommer snart / Content coming soon</p>
            <p className="text-sm mt-2">Dette modulet er under utvikling</p>
          </div>
        </div>

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
                <p className="text-sm text-gray-500">Test din kunnskap om dette temaet</p>
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
