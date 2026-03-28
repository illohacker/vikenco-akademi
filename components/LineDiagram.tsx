'use client'

import { useState } from 'react'

type ZoneData = {
  id: string
  x: number
  y: number
  width: number
  height: number
  labelKey: string
  color: string
  lessonId: string
  people: { x: number; y: number }[]
}

const zones: ZoneData[] = [
  {
    id: 'corte', x: 770, y: 100, width: 120, height: 310,
    labelKey: 'corte', color: '#ef4444', lessonId: 'infeed-line-1',
    people: [{ x: 810, y: 190 }, { x: 863, y: 191 }, { x: 812, y: 314 }, { x: 869, y: 314 }]
  },
  {
    id: 'espinas', x: 530, y: 100, width: 230, height: 310,
    labelKey: 'espinas', color: '#eab308', lessonId: 'infeed-line-2',
    people: [
      { x: 560, y: 170 }, { x: 620, y: 170 }, { x: 680, y: 170 },
      { x: 560, y: 310 }, { x: 620, y: 310 }, { x: 680, y: 310 }
    ]
  },
  {
    id: 'supervision', x: 475, y: 101, width: 50, height: 310,
    labelKey: 'supervision', color: '#22c55e', lessonId: '',
    people: [{ x: 499, y: 320 }]
  },
  {
    id: 'acabado-corte', x: 365, y: 98, width: 110, height: 310,
    labelKey: 'acabadoCorte', color: '#3b82f6', lessonId: 'filet-line-1',
    people: [{ x: 420, y: 190 }, { x: 420, y: 310 }]
  },
  {
    id: 'trim', x: 261, y: 99, width: 110, height: 310,
    labelKey: 'trim', color: '#6366f1', lessonId: 'filet-line-2',
    people: [{ x: 316, y: 190 }, { x: 316, y: 310 }]
  },
  {
    id: 'cajas', x: 170, y: 100, width: 90, height: 310,
    labelKey: 'cajas', color: '#06b6d4', lessonId: 'porsjoner',
    people: [{ x: 215, y: 255 }]
  },
  {
    id: 'etiq', x: 60, y: 100, width: 110, height: 310,
    labelKey: 'etiq', color: '#8b5cf6', lessonId: 'head-backbone-dryice-belly',
    people: [{ x: 115, y: 255 }]
  },
]

type Labels = {
  corte: string
  espinas: string
  supervision: string
  acabadoCorte: string
  trim: string
  cajas: string
  etiq: string
  entry: string
  exit: string
  sideA: string
  sideB: string
  belt: string
  clickHint: string
}

export default function LineDiagram({ title, labels }: { title: string; labels: Labels }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const scrollToLesson = (lessonId: string) => {
    if (!lessonId) return
    const el = document.getElementById(`lesson-${lessonId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.classList.add('ring-4', 'ring-amber-400', 'ring-offset-2')
      setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400', 'ring-offset-2'), 2000)
    }
  }

  const getLabel = (key: string) => (labels as Record<string, string>)[key] || key

  return (
    <div>
      {title && <h3 className="font-bold text-gray-900 mb-4 text-lg">{title}</h3>}
      <div className="bg-slate-900 rounded-2xl p-3 overflow-hidden">
        <svg viewBox="0 0 950 450" className="w-full h-auto">
          {/* Flow labels */}
          <text x="890" y="25" textAnchor="end" fill="#64748b" fontSize="11" fontWeight="bold">{labels.entry} →</text>
          <text x="60" y="25" fill="#64748b" fontSize="11" fontWeight="bold">← {labels.exit}</text>

          {/* Side labels */}
          <text x="20" y={170} fill="#475569" fontSize="10" transform="rotate(-90, 20, 170)">{labels.sideA}</text>
          <text x="20" y={320} fill="#475569" fontSize="10" transform="rotate(-90, 20, 320)">{labels.sideB}</text>

          {/* Zones */}
          {zones.map((zone) => {
            const isHovered = hovered === zone.id
            const hasLink = !!zone.lessonId
            return (
              <g
                key={zone.id}
                onClick={() => scrollToLesson(zone.lessonId)}
                onMouseEnter={() => setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                className={hasLink ? 'cursor-pointer' : 'cursor-default'}
              >
                <rect
                  x={zone.x} y={zone.y - 60}
                  width={zone.width} height={zone.height - 20}
                  rx="8"
                  fill={zone.color}
                  opacity={isHovered ? 0.3 : 0.15}
                  stroke={zone.color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  strokeDasharray={isHovered ? 'none' : '6 3'}
                  className="transition-all duration-200"
                />
                <text
                  x={zone.x + zone.width / 2} y={zone.y - 42}
                  textAnchor="middle" fill={zone.color}
                  fontSize={zone.width < 80 ? "9" : "12"} fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {getLabel(zone.labelKey)}
                </text>
                <text
                  x={zone.x + zone.width / 2} y={zone.y - 28}
                  textAnchor="middle" fill={zone.color}
                  fontSize="9" opacity="0.7"
                  className="pointer-events-none select-none"
                >
                  {zone.people.length}p
                </text>
                {zone.people.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x} cy={p.y - 60} r="16"
                      fill={zone.color}
                      opacity={isHovered ? 1 : 0.8}
                      className="transition-all duration-200"
                    />
                    <text
                      x={p.x} y={p.y - 59}
                      textAnchor="middle" dominantBaseline="central"
                      fill="white" fontSize="14"
                      className="pointer-events-none select-none"
                    >👤</text>
                  </g>
                ))}
              </g>
            )
          })}

          {/* Conveyor belt */}
          <rect x="50" y="190" width="850" height="24" rx="4" fill="#64748b" />
          {Array.from({ length: 16 }).map((_, i) => (
            <text key={i} x={870 - i * 55} y="207" fill="#94a3b8" fontSize="12" className="pointer-events-none select-none">◄</text>
          ))}
          <text x="475" y="206" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" className="pointer-events-none select-none">
            {labels.belt}
          </text>

          {/* Hint */}
          <text x="475" y="420" textAnchor="middle" fill="#475569" fontSize="10">
            {labels.clickHint}
          </text>
        </svg>
      </div>

      {/* Mobile legend */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {zones.map(z => (
          <button
            key={z.id}
            onClick={() => scrollToLesson(z.lessonId)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: z.color }}
          >
            {getLabel(z.labelKey)} ({z.people.length})
          </button>
        ))}
      </div>
    </div>
  )
}
