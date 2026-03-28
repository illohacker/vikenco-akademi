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

const initialItems: DragItem[] = [
  // Conveyor belt
  { id: 'belt', x: 50, y: 240, label: 'CINTA TRANSPORTADORA', color: '#475569', type: 'belt', width: 850, height: 30 },

  // CORTE (rightmost - entry point)
  { id: 'zone-corte', x: 770, y: 100, label: 'CORTE', color: '#ef4444', type: 'zone', width: 120, height: 310 },
  { id: 'corte-a1', x: 810, y: 190, label: '○', color: '#ef4444', type: 'person' },

  // ESPINAS
  { id: 'zone-espinas', x: 530, y: 100, label: 'ESPINAS', color: '#eab308', type: 'zone', width: 230, height: 310 },
  { id: 'espinas-a1', x: 560, y: 170, label: '○', color: '#eab308', type: 'person' },
  { id: 'espinas-a2', x: 620, y: 170, label: '○', color: '#eab308', type: 'person' },
  { id: 'espinas-a3', x: 680, y: 170, label: '○', color: '#eab308', type: 'person' },
  { id: 'espinas-b1', x: 560, y: 310, label: '○', color: '#eab308', type: 'person' },
  { id: 'espinas-b2', x: 620, y: 310, label: '○', color: '#eab308', type: 'person' },
  { id: 'espinas-b3', x: 680, y: 310, label: '○', color: '#eab308', type: 'person' },

  // ACABADO - CORTE
  { id: 'zone-acabado-corte', x: 400, y: 100, label: 'ACABADO\nCORTE', color: '#3b82f6', type: 'zone', width: 120, height: 310 },
  { id: 'acabado-corte-a', x: 445, y: 190, label: '○', color: '#3b82f6', type: 'person' },
  { id: 'acabado-corte-b', x: 445, y: 310, label: '○', color: '#3b82f6', type: 'person' },

  // ACABADO - TRIM
  { id: 'zone-acabado-trim', x: 280, y: 100, label: 'TRIM', color: '#6366f1', type: 'zone', width: 110, height: 310 },
  { id: 'trim-a', x: 320, y: 190, label: '○', color: '#6366f1', type: 'person' },
  { id: 'trim-b', x: 320, y: 310, label: '○', color: '#6366f1', type: 'person' },

  // ACABADO - CAJAS
  { id: 'zone-cajas', x: 180, y: 100, label: 'CAJAS', color: '#06b6d4', type: 'zone', width: 90, height: 310 },
  { id: 'cajas-1', x: 210, y: 250, label: '○', color: '#06b6d4', type: 'person' },

  // ETIQUETADOR
  { id: 'zone-etiq', x: 60, y: 100, label: 'ETIQ.', color: '#8b5cf6', type: 'zone', width: 110, height: 310 },
  { id: 'etiq-1', x: 100, y: 250, label: '○', color: '#8b5cf6', type: 'person' },
]

export default function Line1Editor() {
  const [items, setItems] = useState<DragItem[]>(initialItems)
  const [dragging, setDragging] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showExport, setShowExport] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

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
    const data = items.map(({ id, x, y, width, height }) => ({ id, x, y, ...(width && { width }), ...(height && { height }) }))
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setShowExport(true)
    setTimeout(() => setShowExport(false), 3000)
  }

  const addPerson = (color: string, label: string) => {
    const id = `person-${Date.now()}`
    setItems(prev => [...prev, { id, x: 450, y: 250, label, color, type: 'person' }])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--vikenco-blue)]">Line 1 Editor</h1>
          <p className="text-gray-500 text-sm">Arrastra los elementos para posicionarlos. Doble clic para eliminar.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPositions}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
          >
            {showExport ? '✅ Copiado!' : '📋 Exportar posiciones'}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-xl border">
        <span className="text-sm font-semibold text-gray-600 self-center mr-2">Añadir persona:</span>
        <button onClick={() => addPerson('#ef4444', '○')} className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">+ Corte</button>
        <button onClick={() => addPerson('#eab308', '○')} className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">+ Espinas</button>
        <button onClick={() => addPerson('#3b82f6', '○')} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">+ Acabado Corte</button>
        <button onClick={() => addPerson('#6366f1', '○')} className="px-3 py-1 bg-indigo-500 text-white rounded-full text-sm font-bold">+ Trim</button>
        <button onClick={() => addPerson('#06b6d4', '○')} className="px-3 py-1 bg-cyan-500 text-white rounded-full text-sm font-bold">+ Cajas</button>
        <button onClick={() => addPerson('#8b5cf6', '○')} className="px-3 py-1 bg-violet-500 text-white rounded-full text-sm font-bold">+ Etiquetador</button>
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
              <text
                x={item.x + (item.width || 100) / 2}
                y={item.y + 20}
                textAnchor="middle"
                fill={item.color}
                fontSize="13"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {item.label.split('\n').map((line, i) => (
                  <tspan key={i} x={item.x + (item.width || 100) / 2} dy={i === 0 ? 0 : 14}>{line}</tspan>
                ))}
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
              {/* Belt arrows */}
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
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500"></span> Corte (1p)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500"></span> Espinas (6p)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> Acabado Corte (2p)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500"></span> Trim (2p)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-cyan-500"></span> Cajas (1p)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-500"></span> Etiquetador (1p)</span>
        <span className="text-gray-400">│ Doble clic = eliminar │ Botones = añadir │</span>
      </div>
    </div>
  )
}
