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
}

const zones: Zone[] = [
  { id: 'reception', x: 50, y: 300, width: 150, height: 100, color: '#3b82f6', hoverColor: '#2563eb', labelKey: 'reception' },
  { id: 'processing', x: 250, y: 200, width: 200, height: 180, color: '#06b6d4', hoverColor: '#0891b2', labelKey: 'processing' },
  { id: 'packing', x: 500, y: 200, width: 160, height: 140, color: '#8b5cf6', hoverColor: '#7c3aed', labelKey: 'packing' },
  { id: 'storage', x: 500, y: 370, width: 160, height: 100, color: '#64748b', hoverColor: '#475569', labelKey: 'storage' },
  { id: 'shipping', x: 710, y: 300, width: 140, height: 100, color: '#f59e0b', hoverColor: '#d97706', labelKey: 'shipping' },
  { id: 'cleaning', x: 250, y: 420, width: 200, height: 80, color: '#10b981', hoverColor: '#059669', labelKey: 'cleaning' },
  { id: 'staff', x: 50, y: 100, width: 150, height: 150, color: '#ec4899', hoverColor: '#db2777', labelKey: 'staff' },
  { id: 'office', x: 710, y: 100, width: 140, height: 150, color: '#6366f1', hoverColor: '#4f46e5', labelKey: 'office' },
]

export default function MapsPage() {
  const t = useTranslations('maps')
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--vikenco-blue)] mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>

      {/* Interactive SVG Map */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 overflow-hidden">
        <svg viewBox="0 0 900 550" className="w-full h-auto" style={{ maxHeight: '500px' }}>
          {/* Background */}
          <rect x="20" y="70" width="860" height="460" rx="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />

          {/* Title */}
          <text x="450" y="45" textAnchor="middle" className="text-lg font-bold" fill="#003366" fontSize="20">
            Vikenco - Aukra
          </text>

          {/* Factory outline */}
          <rect x="40" y="85" width="820" height="430" rx="12" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="8 4" />

          {/* Flow arrows */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          <line x1="200" y1="350" x2="240" y2="310" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="450" y1="290" x2="490" y2="280" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="660" y1="290" x2="700" y2="340" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Zones */}
          {zones.map((zone) => (
            <Link key={zone.id} href={`/maps/${zone.id}`}>
              <g
                onMouseEnter={() => setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                style={{ transition: 'all 0.2s' }}
              >
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="12"
                  fill={hovered === zone.id ? zone.hoverColor : zone.color}
                  opacity={hovered && hovered !== zone.id ? 0.4 : 0.85}
                  className="transition-all duration-200"
                />
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {t(zone.labelKey)}
                </text>
              </g>
            </Link>
          ))}
        </svg>
      </div>

      {/* Zone list for mobile */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 md:hidden">
        {zones.map((zone) => (
          <Link
            key={zone.id}
            href={`/maps/${zone.id}`}
            className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="w-4 h-4 rounded" style={{ backgroundColor: zone.color }} />
            <span className="text-sm font-medium text-gray-700">{t(zone.labelKey)}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
