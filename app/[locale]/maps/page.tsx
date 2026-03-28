'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useState } from 'react'

interface Zone {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  hoverColor: string
  labelKey: string
  moduleLink: string
  emoji: string
  inactive?: boolean
}

const zones: Zone[] = [
  // INFEED - bottom
  { id: 'infeed', x: 30, y: 430, width: 840, height: 90, color: '#3b82f6', hoverColor: '#2563eb', labelKey: 'infeed', moduleLink: '/modules/production#infeed-line-1', emoji: '📥' },
  // FILET LINE 1 - left column (wide)
  { id: 'filet1', x: 30, y: 150, width: 220, height: 270, color: '#06b6d4', hoverColor: '#0891b2', labelKey: 'filet1', moduleLink: '/modules/production#filet-line-1', emoji: '🔪' },
  // FILET LINE 2 - second column (wide)
  { id: 'filet2', x: 260, y: 150, width: 220, height: 270, color: '#0891b2', hoverColor: '#0e7490', labelKey: 'filet2', moduleLink: '/modules/production#filet-line-2', emoji: '🔪' },
  // BACKBONE / HEAD / DRYICE / BELLY
  { id: 'backbone', x: 490, y: 150, width: 110, height: 270, color: '#8b5cf6', hoverColor: '#7c3aed', labelKey: 'backbone', moduleLink: '/modules/production#head-backbone-dryice-belly', emoji: '🦴' },
  // L3 - inactive
  { id: 'l3', x: 610, y: 150, width: 80, height: 270, color: '#94a3b8', hoverColor: '#94a3b8', labelKey: 'l3', moduleLink: '', emoji: '', inactive: true },
  // PORSJONER - top full width above production + terminal
  { id: 'porsjoner', x: 30, y: 30, width: 580, height: 110, color: '#f59e0b', hoverColor: '#d97706', labelKey: 'porsjoner', moduleLink: '/modules/production#porsjoner', emoji: '📦' },
  // TERMINAL - right side
  { id: 'terminal', x: 700, y: 30, width: 170, height: 390, color: '#10b981', hoverColor: '#059669', labelKey: 'terminal', moduleLink: '/modules/production', emoji: '🚛' },
]

export default function MapsPage() {
  const t = useTranslations('maps')
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--vikenco-blue)] mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>

      {/* Interactive SVG Map */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 900 550" className="w-full h-auto" style={{ maxHeight: '520px' }}>
          {/* Background */}
          <rect x="15" y="15" width="870" height="520" rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

          {/* Title */}
          <text x="450" y="555" textAnchor="middle" fill="#94a3b8" fontSize="11" fontStyle="italic">
            Vikenco Production Floor — Rindarøya, Aukra
          </text>

          {/* Door between production and terminal */}
          <rect x="688" y={260} width="24" height="50" rx="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
          <text x="700" y="290" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="bold">🚪</text>

          {/* Flow arrows */}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#cbd5e1" />
            </marker>
          </defs>
          {/* Infeed -> Lines */}
          <line x1="240" y1="425" x2="240" y2="425" stroke="none" />
          <path d="M 240 425 L 240 390" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="6 3" />
          <path d="M 450 425 L 450 390" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="6 3" />
          {/* Lines -> Porsjoner */}
          <path d="M 240 145 L 240 115" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="6 3" />
          <path d="M 370 145 L 370 115" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="6 3" />
          {/* Porsjoner -> Terminal */}
          <path d="M 615 85 L 695 85" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="6 3" />

          {/* Zones */}
          {zones.map((zone) => {
            const isInactive = zone.inactive
            const isHovered = hovered === zone.id
            const opacity = isInactive ? 0.3 : (hovered && !isHovered ? 0.5 : 0.9)

            const content = (
              <g
                key={zone.id}
                onMouseEnter={() => !isInactive && setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                className={isInactive ? 'cursor-not-allowed' : 'cursor-pointer'}
              >
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="10"
                  fill={isHovered ? zone.hoverColor : zone.color}
                  opacity={opacity}
                  className="transition-all duration-200"
                />
                {/* Emoji */}
                {zone.emoji && (
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 - (zone.height > 150 ? 15 : 8)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={zone.height > 150 ? "28" : "20"}
                    className="pointer-events-none select-none"
                  >
                    {zone.emoji}
                  </text>
                )}
                {/* Label */}
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2 + (zone.height > 150 ? 18 : 10)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={zone.width < 120 ? "10" : "13"}
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {t(zone.labelKey)}
                </text>
                {/* Inactive label */}
                {isInactive && (
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 25}
                    textAnchor="middle"
                    fill="white"
                    fontSize="9"
                    opacity="0.7"
                    className="pointer-events-none select-none"
                  >
                    ({t('inactive')})
                  </text>
                )}
              </g>
            )

            if (isInactive || !zone.moduleLink) return content
            return (
              <Link key={zone.id} href={zone.moduleLink}>
                {content}
              </Link>
            )
          })}
        </svg>
      </div>

      {/* Zone list for mobile */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {zones.filter(z => !z.inactive).map((zone) => (
          <Link
            key={zone.id}
            href={zone.moduleLink}
            className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="w-4 h-4 rounded" style={{ backgroundColor: zone.color }} />
            <span className="text-sm font-medium text-gray-700">{zone.emoji} {t(zone.labelKey)}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
