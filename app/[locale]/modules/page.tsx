import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

const modules = [
  { slug: 'welcome', icon: '👋', color: 'from-blue-500 to-blue-600', titleKey: 'welcome', descKey: 'welcomeDesc', lessons: 4 },
  { slug: 'hms', icon: '🦺', color: 'from-red-500 to-red-600', titleKey: 'hms', descKey: 'hmsDesc', lessons: 8 },
  { slug: 'production', icon: '🐟', color: 'from-cyan-500 to-cyan-600', titleKey: 'production', descKey: 'productionDesc', lessons: 6 },
  { slug: 'factory', icon: '🏭', color: 'from-gray-500 to-gray-600', titleKey: 'factory', descKey: 'factoryDesc', lessons: 5 },
  { slug: 'conduct', icon: '📋', color: 'from-amber-500 to-amber-600', titleKey: 'conduct', descKey: 'conductDesc', lessons: 5 },
  { slug: 'equipment', icon: '🔧', color: 'from-emerald-500 to-emerald-600', titleKey: 'equipment', descKey: 'equipmentDesc', lessons: 7 },
  { slug: 'emergency', icon: '🚨', color: 'from-rose-500 to-rose-600', titleKey: 'emergency', descKey: 'emergencyDesc', lessons: 4 },
]

export default function ModulesPage() {
  const t = useTranslations('modules')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--vikenco-blue)] mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod, i) => (
          <Link
            key={mod.slug}
            href={`/modules/${mod.slug}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
          >
            <div className={`h-32 bg-gradient-to-br ${mod.color} flex items-center justify-center relative`}>
              <span className="text-6xl opacity-90">{mod.icon}</span>
              <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                {i + 1}/7
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[var(--vikenco-blue)] transition-colors">
                {t(mod.titleKey)}
              </h2>
              <p className="text-gray-500 mb-3">{t(mod.descKey)}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {mod.lessons} lessons
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
