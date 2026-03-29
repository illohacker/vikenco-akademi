'use client'

import { useState, useRef, useCallback } from 'react'

type DragItem = {
  id: string
  x: number
  y: number
  label: string
  color: string
  type: 'person' | 'zone'
  width?: number
  height?: number
}

const defaultColors = [
  '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#06b6d4', '#8b5cf6',
  '#f97316', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16',
]

const initialItems: DragItem[] = []

export default function PorsjonerEditor() {
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
      id, x: zone.x + (zone.width || 150) / 2, y: zone.y + (zone.height || 150) / 2,
      label: '○', color: zone.color, type: 'person'
    }])
  }

  const addZone = () => {
    const nextNum = zones.length + 1
    const colorIdx = (nextNum - 1) % defaultColors.length
    const id = `zone-${nextNum}`
    setItems(prev => [...prev, {
      id, x: 100 + (nextNum - 1) * 160, y: 120, label: `Área ${nextNum}`, color: defaultColors[colorIdx],
      type: 'zone', width: 140, height: 200
    }])
  }

  const removeItem = (id: string) => {
    const isZone = items.find(i => i.id === id)?.type === 'zone'
    if (isZone) {
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

  const resizeZone = (zoneId: string, dw: number, dh: number) => {
    setItems(prev => prev.map(item =>
      item.id === zoneId
        ? { ...item, width: Math.max(80, (item.width || 140) + dw), height: Math.max(60, (item.height || 200) + dh) }
        : item
    ))
  }

  const cycleColor = (zoneId: string) => {
    const zone = items.find(i => i.id === zoneId)
    if (!zone) return
    const currentIdx = defaultColors.indexOf(zone.color)
    const nextColor = defaultColors[(currentIdx + 1) % defaultColors.length]
    setItems(prev => prev.map(item => {
      if (item.id === zoneId) return { ...item, color: nextColor }
      if (item.type === 'person' && item.id.startsWith(zoneId + '-')) return { ...item, color: nextColor }
      return item
    }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--vikenco-blue)]">Editor Porciones</h1>
          <p className="text-gray-500 text-sm">Crea áreas, arrastra para posicionar, asigna trabajadores.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addZone}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            + Nueva área
          </button>
          <button
            onClick={exportPositions}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
          >
            {showExport ? '✅ Copiado!' : '📋 Exportar'}
          </button>
        </div>
      </div>

      {/* Zone name editor modal */}
      {editingZone && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setEditingZone(null)}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-3">Renombrar área</h3>
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveZoneLabel()}
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-bold focus:border-[var(--vikenco-blue)] focus:outline-none"
              placeholder="Nombre del área"
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

      {/* Toolbar: zones with controls */}
      {zones.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-xl border">
          <span className="text-sm font-semibold text-gray-600 self-center mr-2">Áreas:</span>
          {zones.map(zone => (
            <div key={zone.id} className="flex items-center gap-0.5">
              <button
                onClick={() => startEditZone(zone.id)}
                className="px-2 py-1 rounded-l-full text-white text-xs font-bold hover:opacity-80"
                style={{ backgroundColor: zone.color }}
                title="Renombrar"
              >
                ✏️ {zone.label}
              </button>
              <button
                onClick={() => addPerson(zone.id)}
                className="px-2 py-1 text-white text-xs font-bold hover:opacity-80"
                style={{ backgroundColor: zone.color }}
                title="Añadir trabajador"
              >
                +👤
              </button>
              <button
                onClick={() => cycleColor(zone.id)}
                className="px-2 py-1 text-white text-xs font-bold hover:opacity-80"
                style={{ backgroundColor: zone.color }}
                title="Cambiar color"
              >
                🎨
              </button>
              <button
                onClick={() => resizeZone(zone.id, 20, 0)}
                className="px-1.5 py-1 text-white text-xs font-bold hover:opacity-80"
                style={{ backgroundColor: zone.color }}
                title="Más ancho"
              >
                ↔+
              </button>
              <button
                onClick={() => resizeZone(zone.id, 0, 20)}
                className="px-1.5 py-1 rounded-r-full text-white text-xs font-bold hover:opacity-80"
                style={{ backgroundColor: zone.color }}
                title="Más alto"
              >
                ↕+
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {zones.length === 0 && (
        <div className="mb-4 p-6 bg-blue-50 rounded-xl border border-blue-200 text-center">
          <p className="text-blue-700 font-semibold">Empieza creando un área con el botón "+ Nueva área"</p>
          <p className="text-blue-500 text-sm mt-1">Luego asigna trabajadores a cada área</p>
        </div>
      )}

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

          {/* Title */}
          <text x="475" y="30" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="bold">
            PORCIONES — Editor de áreas y trabajadores
          </text>

          {/* Render zones */}
          {items.filter(i => i.type === 'zone').map((item) => {
            const personCount = items.filter(p => p.type === 'person' && p.id.startsWith(item.id + '-')).length
            return (
              <g key={item.id}>
                <rect
                  x={item.x}
                  y={item.y}
                  width={item.width || 140}
                  height={item.height || 200}
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
                {/* Zone label */}
                <text
                  x={item.x + (item.width || 140) / 2}
                  y={item.y + 22}
                  textAnchor="middle"
                  fill={item.color}
                  fontSize="12"
                  fontWeight="bold"
                  className="cursor-pointer select-none"
                  onClick={() => startEditZone(item.id)}
                >
                  {item.label}
                </text>
                {/* Person count */}
                <text
                  x={item.x + (item.width || 140) / 2}
                  y={item.y + 38}
                  textAnchor="middle"
                  fill={item.color}
                  fontSize="10"
                  opacity="0.7"
                  className="pointer-events-none select-none"
                >
                  {personCount} trabajador{personCount !== 1 ? 'es' : ''}
                </text>
              </g>
            )
          })}

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
            <text x="475" y="510" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">
              Arrastrando: {items.find(i => i.id === dragging)?.label || items.find(i => i.id === dragging)?.id}
            </text>
          )}

          {/* Empty state hint */}
          {zones.length === 0 && (
            <text x="475" y="270" textAnchor="middle" fill="#475569" fontSize="16">
              Pulsa "+ Nueva área" para empezar
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      {zones.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {zones.map(z => (
            <span key={z.id} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: z.color }}></span>
              {z.label} ({items.filter(p => p.type === 'person' && p.id.startsWith(z.id + '-')).length}p)
            </span>
          ))}
          <span className="text-gray-400">│ Doble clic = eliminar │ Clic nombre = renombrar │</span>
        </div>
      )}
    </div>
  )
}
