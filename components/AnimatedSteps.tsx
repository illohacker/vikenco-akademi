'use client'

import { useState, useEffect, useCallback } from 'react'

type Step = {
  emoji: string
  title: string
  description: string
}

export default function AnimatedSteps({ steps, autoPlay = true }: { steps: Step[]; autoPlay?: boolean }) {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)

  const STEP_DURATION = 3500 // ms per step

  const next = useCallback(() => {
    setCurrent(prev => {
      if (prev >= steps.length - 1) {
        setIsPlaying(false)
        return prev
      }
      return prev + 1
    })
    setProgress(0)
  }, [steps.length])

  const goTo = (index: number) => {
    setCurrent(index)
    setIsPlaying(false)
    setProgress(0)
  }

  const restart = () => {
    setCurrent(0)
    setProgress(0)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          next()
          return 0
        }
        return prev + (100 / (STEP_DURATION / 50))
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isPlaying, next])

  const step = steps[current]

  return (
    <div className="space-y-4">
      {/* Main display */}
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 min-h-[200px] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Step number badge */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-[var(--vikenco-blue)] text-white rounded-full flex items-center justify-center font-bold text-sm">
          {current + 1}
        </div>

        {/* Animated emoji */}
        <div
          key={current}
          className="text-7xl sm:text-8xl mb-4 animate-bounce-in"
          style={{ animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
        >
          {step.emoji}
        </div>

        {/* Title */}
        <h4
          key={`t-${current}`}
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
          style={{ animation: 'fadeSlideUp 0.4s ease-out' }}
        >
          {step.title}
        </h4>

        {/* Description */}
        <p
          key={`d-${current}`}
          className="text-gray-600 text-sm sm:text-base max-w-md"
          style={{ animation: 'fadeSlideUp 0.5s ease-out 0.1s both' }}
        >
          {step.description}
        </p>

        {/* Progress bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-[var(--vikenco-light)] transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Step indicators / dots */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              i === current
                ? 'bg-[var(--vikenco-blue)] text-white shadow-md scale-105'
                : i < current
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <span>{s.emoji}</span>
            <span className="hidden sm:inline">{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setCurrent(prev => Math.max(0, prev - 1))}
          disabled={current === 0}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={current >= steps.length - 1 ? restart : () => setIsPlaying(!isPlaying)}
          className="px-5 py-2 rounded-full bg-[var(--vikenco-blue)] text-white font-semibold text-sm hover:bg-[var(--vikenco-light)] transition-colors flex items-center gap-2"
        >
          {current >= steps.length - 1 && !isPlaying ? (
            <>🔄 <span>Restart</span></>
          ) : isPlaying ? (
            <>⏸️ <span>Pause</span></>
          ) : (
            <>▶️ <span>Play</span></>
          )}
        </button>

        <button
          onClick={next}
          disabled={current >= steps.length - 1}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3) translateY(20px); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes fadeSlideUp {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
