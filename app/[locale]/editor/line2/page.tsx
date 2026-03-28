'use client'

import { useState, useRef, useCallback } from 'react'

type DragItem = {
  id: string
  x: number
  y: number
  label: string
  color: string
  type: 'person' | 'zone' | 'belt'
  width?: number
  height?: number
}

const defaultColors = [
  '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#06b6d4', '#8b5cf6',
  '#f97316', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16',
]

const initialItems: DragItem[] = [
  // Conveyor belt
  { id: 'belt', x: 50, y: 240, label: 'CINTA TRANSPORTADORA', color: '#475569', type: 'belt', width: 850, height: 30 },

  // CORTE (rightmost - entry point)
  { id: 'zone-1', x: 770, y: 100, label: 'Corte', color: '#ef4444', type: 'zone', width: 120, height: 310 },
  { id: 'zone-1-a1', x: 810, y: 190, label: '○', color: '#ef4444', type: 'person' },
  { id: 'zone-1-a2', x: 863, y: 191, label: '○', color: '#ef4444', type: 'person' },
  { id: 'zone-1-b1', x: 812, y: 314, label: '○', color: '#ef4444', type: 'person' },
  { id: 'zone-1-b2', x: 869, y: 314, label: '○', color: '#ef4444', type: 'person' },

  // ESPINAS
  { id: 'zone-2', x: 530, y: 100, label: 'Espinas', color: '#eab308', type: 'zone', width: 230, height: 310 },
  { id: 'zone-2-a1', x: 560, y: 170, label: '○', color: '#eab308', type: 'person' },
  { id: 'zone-2-a2', x: 620, y: 170, label: '○', color: '#eab308', type: 'person' },
  { id: 'zone-2-a3', x: 680, y: 170, label: '○', color: '#eab308', type: 'person' },
  { id: 'zone-2-b1', x: 560, y: 310, label: '○', color: '#eab308', type: 'person' },
  { id: 'zone-2-b2', x: 620, y: 310, label: '○', color: '#eab308', type: 'person' },
  { id: 'zone-2-b3', x: 680, y: 310, label: '○', color: '#eab308', type: 'person' },

  // PERFECCIÓN
  { id: 'zone-3', x: 475, y: 101, label: 'Perfección', color: '#22c55e', type: 'zone', width: 50, height: 310 },
  { id: 'zone-3-1', x: 499, y: 320, label: '○', color: '#22c55e', type: 'person' },

  // CAJA
  { id: 'zone-4', x: 365, y: 98, label: 'Caja', color: '#3b82f6', type: 'zone', width: 110, height: 310 },
  { id: 'zone-4-b', x: 420, y: 310, label: '○', color: '#3b82f6', type: 'person' },
  { id: 'zone-4-p1', x: 443, y: 360, label: '○', color: '#3b82f6', type: 'person' },

  // PESO
  { id: 'zone-5', x: 250, y: 100, label: 'Peso', color: '#6366f1', type: 'zone', width: 110, height: 310 },
  { id: 'zone-5-b', x: 304, y: 318, label: '○', color: '#6366f1', type: 'person' },

  // NO APTO
  { id: 'zone-7', x: 117, y: 98, label: 'No apto', color: '#8b5cf6', type: 'zone', width: 110, height: 310 },
  { id: 'zone-7-1', x: 196, y: 215, label: '○', color: '#8b5cf6', type: 'person' },
]

export default function Line2Editor() {
  const [items, setItems] = useState<DragItem[]>(initialItems)
  const [dragging, setDragging] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showExport, setShowExport] = useState(false)
  const [editingZone, setEditingZone] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const svgRef = useRef<SVGSVGElement>(null)

  const zones = items.filter(i => i.type === 'zone')

  const getSVGPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const pt = svgRef.current.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse())
    return { x: svgP.x, y: svgP.y }
  }, [])

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault()
    const item = items.find(i => i.id === id)
    if (!item) return
    const pt = getSVGPoint(e.clientX, e.clientY)
    setOffset({ x: pt.x - item.x, y: pt.y - item.y })
    setDragging(id)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const pt = getSVGPoint(e.clientX, e.clientY)
    setItems(prev => prev.map(item =>
      item.id === dragging
        ? { ...item, x: Math.round(pt.x - offset.x), y: Math.round(pt.y - offset.y) }
        : item
    ))
  }

  const handlePointerUp = () => {
    setDragging(null)
  }

  const exportPositions = () => {
    const data = items.map(({ id, x, y, width, height, label, color, type }) => ({
      id, x, y, label, color, type,
      ...(width && { width }), ...(height && { height })
    }))
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setShowExport(true)
    setTimeout(() => setShowExport(false), 3000)
  }

  const addPerson = (zoneId: string) => {
    const zone = items.find(i => i.id === zoneId)
    if (!zone) return
    const id = `${zoneId}-p${Date.now()}`
    setItems(prev => [...prev, {
      id, x: zone.x + (zone.width || 100) / 2, y: zone.y + (zone.height || 100) / 2,
      label: '○', color: zone.color, type: 'person'
    }])
  }

  const addZone = () => {
    const nextNum = zones.length + 1
    const colorIdx = (nextNum - 1) % defaultColors.length
    const id = `zone-${nextNum}`
    setItems(prev => [...prev, {
      id, x: 400, y: 150, label: `ESTACIÓN ${nextNum}`, color: defaultColors[colorIdx],
      type: 'zone', width: 110, height: 310
    }])
  }

  const removeItem = (id: string) => {
    if (id.startsWith('zone-') && !id.includes('-p') && !id.includes('-a') && !id.includes('-b') && !id.includes('-1')) {
      // Removing a zone: also remove its persons
      setItems(prev => prev.filter(i => i.id !== id && !i.id.startsWith(id + '-')))
    } else {
      setItems(prev => prev.filter(i => i.id !== id))
    }
  }

  const startEditZone = (zoneId: string) => {
    const zone = items.find(i => i.id === zoneId)
    if (!zone) return
    setEditingZone(zoneId)
    setEditValue(zone.label)
  }

  const saveZoneLabel = () => {
    if (!editingZone) return
    setItems(prev => prev.map(item =>
      item.id === editingZone ? { ...item, label: editValue || item.label } : item
    ))
    setEditingZone(null)
    setEditValue('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--vikenco-blue)]">Line 2 Editor</h1>
          <p className="text-gray-500 text-sm">Arrastra para posicionar. Clic en nombre para editar. Doble clic para eliminar.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addZone}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            + Nueva estación
          </button>
          <button
            onClick={exportPositions}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
          >
            {showExport ? '✅ Copiado!' : '📋 Exportar posiciones'}
          </button>
        </div>
      </div>

      {/* Zone name editor */}
      {editingZone && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setEditingZone(null)}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">Renombrar estación</h3>
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveZoneLabel()}
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-bold focus:border-[var(--vikenco-blue)] focus:outline-none"
              placeholder="Nombre de la estación"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditingZone(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={saveZoneLabel}
                className="flex-1 px-4 py-2 bg-[var(--vikenco-blue)] text-white rounded-lg font-semibold hover:opacity-90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: zones with add person + rename */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-xl border">
        <span className="text-sm font-semibold text-gray-600 self-center mr-2">Estaciones:</span>
        {zones.map(zone => (
          <div key={zone.id} className="flex items-center gap-1">
            <button
              onClick={() => startEditZone(zone.id)}
              className="px-2 py-1 rounded-l-full text-white text-xs font-bold hover:opacity-80"
              style={{ backgroundColor: zone.color }}
              title="Clic para renombrar"
            >
              ✏️ {zone.label}
            </button>
            <button
              onClick={() => addPerson(zone.id)}
              className="px-2 py-1 rounded-r-full text-white text-xs font-bold hover:opacity-80"
              style={{ backgroundColor: zone.color }}
              title="Añadir persona"
            >
              +👤
            </button>
          </div>
        ))}
      </div>

      {/* SVG Editor */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 950 520"
          className="w-full h-auto"
          style={{ maxHeight: '70vh', touchAction: 'none' }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Background */}
          <rect x="0" y="0" width="950" height="520" rx="12" fill="#1e293b" />

          {/* Grid lines */}
          {Array.from({ length: 19 }).map((_, i) => (
            <line key={`gv${i}`} x1={(i + 1) * 50} y1="0" x2={(i + 1) * 50} y2="520" stroke="#334155" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`gh${i}`} x1="0" y1={(i + 1) * 50} x2="950" y2={(i + 1) * 50} stroke="#334155" strokeWidth="0.5" />
          ))}

          {/* Flow direction */}
          <text x="900" y="30" textAnchor="end" fill="#64748b" fontSize="12">ENTRADA →</text>
          <text x="50" y="30" fill="#64748b" fontSize="12">← SALIDA</text>
          <text x="475" y="500" textAnchor="middle" fill="#64748b" fontSize="11">
            Lado A (arriba) │ CINTA │ Lado B (abajo)
          </text>

          {/* Render zones first (background) */}
          {items.filter(i => i.type === 'zone').map((item) => (
            <g key={item.id}>
              <rect
                x={item.x}
                y={item.y}
                width={item.width || 100}
                height={item.height || 100}
                rx="8"
                fill={item.color}
                opacity={0.15}
                stroke={item.color}
                strokeWidth="2"
                strokeDasharray="6 3"
                className="cursor-move"
                onPointerDown={(e) => handlePointerDown(e, item.id)}
                onDoubleClick={() => removeItem(item.id)}
              />
              {/* Clickable label area */}
              <text
                x={item.x + (item.width || 100) / 2}
                y={item.y + 20}
                textAnchor="middle"
                fill={item.color}
                fontSize="11"
                fontWeight="bold"
                className="cursor-pointer select-none"
                onClick={() => startEditZone(item.id)}
              >
                {item.label.split('\n').map((line, i) => (
                  <tspan key={i} x={item.x + (item.width || 100) / 2} dy={i === 0 ? 0 : 14}>{line}</tspan>
                ))}
              </text>
              {/* Person count */}
              <text
                x={item.x + (item.width || 100) / 2}
                y={item.y + 36}
                textAnchor="middle"
                fill={item.color}
                fontSize="9"
                opacity="0.7"
                className="pointer-events-none select-none"
              >
                {items.filter(p => p.type === 'person' && p.id.startsWith(item.id + '-')).length}p
              </text>
            </g>
          ))}

          {/* Belt */}
          {items.filter(i => i.type === 'belt').map((item) => (
            <g key={item.id}>
              <rect
                x={item.x}
                y={item.y}
                width={item.width || 800}
                height={item.height || 30}
                rx="4"
                fill="#64748b"
                className="cursor-move"
                onPointerDown={(e) => handlePointerDown(e, item.id)}
              />
              {Array.from({ length: 15 }).map((_, i) => (
                <text
                  key={i}
                  x={item.x + (item.width || 800) - 30 - i * 55}
                  y={item.y + (item.height || 30) / 2 + 5}
                  fill="#94a3b8"
                  fontSize="14"
                  className="pointer-events-none select-none"
                >
                  ◄
                </text>
              ))}
              <text
                x={item.x + (item.width || 800) / 2}
                y={item.y + (item.height || 30) / 2 + 4}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {item.label}
              </text>
            </g>
          ))}

          {/* Persons */}
          {items.filter(i => i.type === 'person').map((item) => (
            <g
              key={item.id}
              className="cursor-move"
              onPointerDown={(e) => handlePointerDown(e, item.id)}
              onDoubleClick={() => removeItem(item.id)}
            >
              <circle
                cx={item.x}
                cy={item.y}
                r="18"
                fill={item.color}
                opacity={dragging === item.id ? 1 : 0.85}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={item.x}
                y={item.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="16"
                className="pointer-events-none select-none"
              >
                👤
              </text>
            </g>
          ))}

          {/* Dragging indicator */}
          {dragging && (
            <text x="475" y="515" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">
              Arrastrando: {items.find(i => i.id === dragging)?.id}
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {zones.map(z => (
          <span key={z.id} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: z.color }}></span>
            {z.label} ({items.filter(p => p.type === 'person' && p.id.startsWith(z.id + '-')).length}p)
          </span>
        ))}
        <span className="text-gray-400">│ Doble clic = eliminar │ Clic nombre = renombrar │</span>
      </div>
    </div>
  )
}
