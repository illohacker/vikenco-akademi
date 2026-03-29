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
    id: 'vacio1', x: 4, y: 30, width: 230, height: 420,
    labelKey: 'vacio1', color: '#ef4444', lessonId: 'vacio-1',
    people: [
      { x: 71, y: 385 }, { x: 164, y: 385 }, { x: 160, y: 310 },
      { x: 165, y: 195 }, { x: 166, y: 125 }, { x: 167, y: 60 }
    ]
  },
  {
    id: 'vacio2', x: 246, y: 30, width: 150, height: 420,
    labelKey: 'vacio2', color: '#22c55e', lessonId: 'vacio-2',
    people: [
      { x: 330, y: 370 }, { x: 328, y: 140 }, { x: 325, y: 70 }
    ]
  },
  {
    id: 'porcionado1', x: 407, y: 180, width: 150, height: 270,
    labelKey: 'porcionado1', color: '#3b82f6', lessonId: 'porcionado-1',
    people: [
      { x: 483, y: 370 }, { x: 451, y: 270 }, { x: 512, y: 270 }
    ]
  },
  {
    id: 'envasado', x: 403, y: 30, width: 150, height: 130,
    labelKey: 'envasado', color: '#6366f1', lessonId: 'envasado',
    people: [{ x: 478, y: 95 }]
  },
  {
    id: 'porcionado2', x: 615, y: 180, width: 150, height: 270,
    labelKey: 'porcionado2', color: '#06b6d4', lessonId: 'porcionado-2',
    people: [
      { x: 672, y: 390 }, { x: 670, y: 310 }, { x: 670, y: 245 }, { x: 728, y: 245 }
    ]
  },
  {
    id: 'pieles', x: 615, y: 30, width: 150, height: 130,
    labelKey: 'pieles', color: '#8b5cf6', lessonId: 'pieles',
    people: [{ x: 690, y: 95 }]
  },
]

export type PorsjonerLabels = {
  vacio1: string
  vacio2: string
  porcionado1: string
  envasado: string
  porcionado2: string
  pieles: string
  clickHint: string
}

export default function LineDiagramPorsjoner({ title, labels }: { title: string; labels: PorsjonerLabels }) {
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
        <svg viewBox="0 0 800 480" className="w-full h-auto">
          {/* Zones */}
          {zones.map((zone) => {
            const isHovered = hovered === zone.id
            return (
              <g
                key={zone.id}
                onClick={() => scrollToLesson(zone.lessonId)}
                onMouseEnter={() => setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <rect
                  x={zone.x} y={zone.y}
                  width={zone.width} height={zone.height}
                  rx="8"
                  fill={zone.color}
                  opacity={isHovered ? 0.3 : 0.15}
                  stroke={zone.color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  strokeDasharray={isHovered ? 'none' : '6 3'}
                  className="transition-all duration-200"
                />
                <text
                  x={zone.x + zone.width / 2} y={zone.y + 18}
                  textAnchor="middle" fill={zone.color}
                  fontSize={zone.width < 120 ? "9" : "11"} fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {getLabel(zone.labelKey)}
                </text>
                <text
                  x={zone.x + zone.width / 2} y={zone.y + 32}
                  textAnchor="middle" fill={zone.color}
                  fontSize="9" opacity="0.7"
                  className="pointer-events-none select-none"
                >
                  {zone.people.length}p
                </text>
                {zone.people.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x} cy={p.y} r="16"
                      fill={zone.color}
                      opacity={isHovered ? 1 : 0.8}
                      className="transition-all duration-200"
                    />
                    <text
                      x={p.x} y={p.y + 1}
                      textAnchor="middle" dominantBaseline="central"
                      fill="white" fontSize="14"
                      className="pointer-events-none select-none"
                    >👤</text>
                  </g>
                ))}
              </g>
            )
          })}

          {/* Hint */}
          <text x="400" y="470" textAnchor="middle" fill="#475569" fontSize="10">
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
