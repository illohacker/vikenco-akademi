import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

const modules = [
  { slug: 'welcome', href: '/modules/welcome', icon: '👋', color: 'from-blue-500 to-blue-600', titleKey: 'welcome', descKey: 'welcomeDesc' },
  { slug: 'hms', href: '/modules/hms', icon: '🦺', color: 'from-red-500 to-red-600', titleKey: 'hms', descKey: 'hmsDesc' },
  { slug: 'production', href: '/modules/production', icon: '🐟', color: 'from-cyan-500 to-cyan-600', titleKey: 'production', descKey: 'productionDesc' },
  { slug: 'factory', href: '/maps', icon: '🏭', color: 'from-gray-500 to-gray-600', titleKey: 'factory', descKey: 'factoryDesc' },
  { slug: 'conduct', href: '/modules/conduct', icon: '📋', color: 'from-amber-500 to-amber-600', titleKey: 'conduct', descKey: 'conductDesc' },
  { slug: 'equipment', href: '/modules/equipment', icon: '🔧', color: 'from-emerald-500 to-emerald-600', titleKey: 'equipment', descKey: 'equipmentDesc' },
  { slug: 'emergency', href: '/modules/emergency', icon: '🚨', color: 'from-rose-500 to-rose-600', titleKey: 'emergency', descKey: 'emergencyDesc' },
]

export default function HomePage() {
  const t = useTranslations('home')
  const tm = useTranslations('modules')

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[var(--vikenco-blue)] to-[var(--vikenco-ocean)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-[200px] rotate-12">🐟</div>
          <div className="absolute bottom-10 right-10 text-[150px] -rotate-12">🌊</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('welcome')}</h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">{t('description')}</p>
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[var(--vikenco-blue)] font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {t('startLearning')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Module grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[var(--vikenco-blue)] mb-2">{tm('title')}</h2>
        <p className="text-gray-500 mb-8">{tm('subtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.slug}
              href={mod.href}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
            >
              <div className={`h-2 bg-gradient-to-r ${mod.color}`} />
              <div className="p-5">
                <div className="text-3xl mb-3">{mod.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[var(--vikenco-blue)] transition-colors">
                  {tm(mod.titleKey)}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{tm(mod.descKey)}</p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-[var(--vikenco-light)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick access */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-[var(--vikenco-blue)] mb-6">{t('quickAccess')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/quiz"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">❓</div>
            <div>
              <h3 className="font-bold text-gray-900">Quiz</h3>
              <p className="text-sm text-gray-500">{tm('subtitle')}</p>
            </div>
          </Link>

          <Link
            href="/maps"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl">🗺️</div>
            <div>
              <h3 className="font-bold text-gray-900">{useTranslations('maps')('title')}</h3>
              <p className="text-sm text-gray-500">{useTranslations('maps')('subtitle')}</p>
            </div>
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">🏆</div>
            <div>
              <h3 className="font-bold text-gray-900">{useTranslations('leaderboard')('title')}</h3>
              <p className="text-sm text-gray-500">{useTranslations('leaderboard')('subtitle')}</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
