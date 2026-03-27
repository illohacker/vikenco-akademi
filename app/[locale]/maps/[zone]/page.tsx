import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

const zoneColors: Record<string, string> = {
  reception: 'from-blue-500 to-blue-600',
  processing: 'from-cyan-500 to-cyan-600',
  packing: 'from-violet-500 to-violet-600',
  storage: 'from-slate-500 to-slate-600',
  shipping: 'from-amber-500 to-amber-600',
  cleaning: 'from-emerald-500 to-emerald-600',
  staff: 'from-pink-500 to-pink-600',
  office: 'from-indigo-500 to-indigo-600',
}

const zoneIcons: Record<string, string> = {
  reception: '📦', processing: '🔪', packing: '📋', storage: '🧊',
  shipping: '🚛', cleaning: '🧹', staff: '👔', office: '💼',
}

export default async function ZonePage({ params }: { params: Promise<{ zone: string }> }) {
  const { zone } = await params
  const gradient = zoneColors[zone] || 'from-gray-500 to-gray-600'
  const icon = zoneIcons[zone] || '🏭'

  return <ZoneContent zone={zone} gradient={gradient} icon={icon} />
}

function ZoneContent({ zone, gradient, icon }: { zone: string; gradient: string; icon: string }) {
  const t = useTranslations('maps')
  const tc = useTranslations('common')

  return (
    <div>
      <div className={`bg-gradient-to-br ${gradient} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/maps" className="inline-flex items-center gap-1 text-white/70 hover:text-white mb-4 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tc('back')}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{icon}</span>
            <h1 className="text-3xl font-bold">{t(zone as 'reception')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center py-12 text-gray-400">
            <span className="text-6xl block mb-4">🏗️</span>
            <p className="text-lg">Innhold for denne sonen kommer snart</p>
            <p className="text-sm mt-2">Her vil det komme bilder, video og detaljert informasjon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
