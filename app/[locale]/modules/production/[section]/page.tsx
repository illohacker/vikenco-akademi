import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import AnimatedSteps from '@/components/AnimatedSteps'
import LineDiagram from '@/components/LineDiagram'
import LineDiagram2 from '@/components/LineDiagram2'
import LineDiagramPorsjoner from '@/components/LineDiagramPorsjoner'

type Section = {
  type: 'alert' | 'icon-row' | 'rules' | 'info' | 'steps' | 'mandatory' | 'prohibited' | 'animated-steps' | 'line-map' | 'line-map-2' | 'line-map-porsjoner'
  style?: 'warning' | 'danger' | 'success'
  text?: string
  title?: string
  items?: string[]
  icons?: { src: string; alt: string }[]
  steps?: { icon: string; label: string }[]
  gridItems?: { emoji: string; label: string }[]
  animatedSteps?: { emoji: string; title: string; description: string }[]
}

type Lesson = {
  id: string
  title: string
  icon: string
  sections: Section[]
}

type SectionData = {
  id: string
  title: string
  description: string
  icon: string
  color: string
  inactive?: boolean
  lessons: Lesson[]
}

type ProductionContent = {
  title: string
  description: string
  sections: SectionData[]
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

export default async function SectionPage({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale, section: sectionId } = await params
  const content = await loadProductionContent(locale)
  const section = content?.sections.find(s => s.id === sectionId)

  if (!section) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Section not found</div>
  }

  return <SectionDetail section={section} />
}

function SectionDetail({ section }: { section: SectionData }) {
  const tc = useTranslations('common')

  return (
    <div>
      {/* Header */}
      <div className={`bg-gradient-to-br ${section.color} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/modules/production" className="inline-flex items-center gap-1 text-white/70 hover:text-white mb-4 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tc('back')}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{section.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{section.title}</h1>
              {section.description && (
                <p className="text-white/80 mt-1">{section.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {section.lessons.length > 0 ? (
          section.lessons.map((lesson, i) => (
            <div key={lesson.id || i} id={`lesson-${lesson.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lesson.icon}</span>
                  <h2 className="text-xl font-bold text-gray-900">{lesson.title}</h2>
                </div>
              </div>
              <div className="px-6 py-6 space-y-6">
                {lesson.sections.map((sec, secIndex) => (
                  <SectionRenderer key={secIndex} section={sec} />
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
      </div>
    </div>
  )
}

function Linkify({ children }: { children: string }) {
  const parts = children.split(/(https?:\/\/[^\s,)}\]]+)/g)
  if (parts.length === 1) return <>{children}</>
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all hover:opacity-80">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'alert': {
      const alertStyles = {
        danger: { bg: 'bg-red-50 border-l-4 border-red-500', text: 'text-red-800', icon: '🚨' },
        warning: { bg: 'bg-amber-50 border-l-4 border-amber-500', text: 'text-amber-800', icon: '⚠️' },
        success: { bg: 'bg-green-50 border-l-4 border-green-500', text: 'text-green-800', icon: '✅' },
      }
      const s = alertStyles[section.style || 'warning']
      return (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${s.bg}`}>
          <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
          <p className={`font-semibold ${s.text}`}>{section.text ? <Linkify>{section.text}</Linkify> : null}</p>
        </div>
      )
    }

    case 'icon-row':
      return (
        <div className="flex items-center justify-center gap-8 py-4">
          {section.icons?.map((icon, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 sm:w-36 sm:h-36 relative drop-shadow-lg">
                <Image src={icon.src} alt={icon.alt} fill className="object-contain" />
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
                <span className="font-medium"><Linkify>{item}</Linkify></span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'info':
      return (
        <div className="bg-blue-50 rounded-xl p-5">
          {section.title && <h3 className="font-bold text-blue-900 mb-3">{section.title}</h3>}
          <ul className="space-y-2">
            {section.items?.map((item, i) => (
              <li key={i} className="text-blue-800 font-medium text-base"><Linkify>{item}</Linkify></li>
            ))}
          </ul>
        </div>
      )

    case 'line-map':
      return (
        <LineDiagram
          title={section.title || ''}
          labels={{
            corte: section.items?.[0] || 'Cutting',
            espinas: section.items?.[1] || 'Bones',
            supervision: section.items?.[2] || 'Sup.',
            acabadoCorte: section.items?.[3] || 'Fin. Cut',
            trim: section.items?.[4] || 'Trim',
            cajas: section.items?.[5] || 'Boxes',
            etiq: section.items?.[6] || 'Label',
            entry: section.items?.[7] || 'ENTRY',
            exit: section.items?.[8] || 'EXIT',
            sideA: section.items?.[9] || 'SIDE A',
            sideB: section.items?.[10] || 'SIDE B',
            belt: section.items?.[11] || 'CONVEYOR BELT',
            clickHint: section.items?.[12] || 'Click a zone to see instructions',
          }}
        />
      )

    case 'line-map-2':
      return (
        <LineDiagram2
          title={section.title || ''}
          labels={{
            corte: section.items?.[0] || 'Corte',
            espinas: section.items?.[1] || 'Espinas',
            perfeccion: section.items?.[2] || 'Perfección',
            caja: section.items?.[3] || 'Caja',
            peso: section.items?.[4] || 'Peso',
            noapto: section.items?.[5] || 'No apto',
            entry: section.items?.[6] || 'ENTRY',
            exit: section.items?.[7] || 'EXIT',
            sideA: section.items?.[8] || 'SIDE A',
            sideB: section.items?.[9] || 'SIDE B',
            belt: section.items?.[10] || 'CONVEYOR BELT',
            clickHint: section.items?.[11] || 'Click a zone to see instructions',
          }}
        />
      )

    case 'line-map-porsjoner':
      return (
        <LineDiagramPorsjoner
          title={section.title || ''}
          labels={{
            vacio1: section.items?.[0] || 'Vacío 1',
            vacio2: section.items?.[1] || 'Vacío 2',
            porcionado1: section.items?.[2] || 'Porcionado 1',
            envasado: section.items?.[3] || 'Envasado',
            porcionado2: section.items?.[4] || 'Porcionado 2',
            pieles: section.items?.[5] || 'Pieles',
            clickHint: section.items?.[6] || 'Click a zone to see instructions',
          }}
        />
      )

    case 'steps':
      return (
        <div>
          {section.title && (
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">👣</span> {section.title}
            </h3>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {section.steps?.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-2">
                <div className="w-24 h-24 sm:w-28 sm:h-28 relative drop-shadow-md">
                  <Image src={step.icon} alt={step.label} fill className="object-contain" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'animated-steps':
      return (
        <div>
          {section.title && <h3 className="font-bold text-gray-900 mb-4 text-lg">{section.title}</h3>}
          {section.animatedSteps && <AnimatedSteps steps={section.animatedSteps} />}
        </div>
      )

    case 'mandatory':
      return (
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          {section.title && (
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {section.title}
            </h3>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {section.gridItems?.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-white rounded-xl p-3 shadow-sm border border-blue-100">
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-900 text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'prohibited':
      return (
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          {section.title && (
            <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2 text-lg">
              <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              {section.title}
            </h3>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {section.gridItems?.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-white rounded-xl p-3 shadow-sm border border-red-100">
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs sm:text-sm font-semibold text-red-900 text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}
