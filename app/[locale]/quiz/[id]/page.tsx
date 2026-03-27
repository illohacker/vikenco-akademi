'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useState, useEffect, use } from 'react'

interface Question {
  question: string
  options: string[]
  correct: number
}

interface QuizData {
  title: string
  questions: Question[]
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations('quiz')
  const tc = useTranslations('common')
  const locale = useLocale()

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load quiz for current locale, fallback to English, then Norwegian
    async function loadQuiz() {
      for (const loc of [locale, 'en', 'no']) {
        try {
          const data = await import(`@/content/${loc}/quiz.json`)
          if (data.default[id]) {
            setQuiz(data.default[id])
            return
          }
        } catch { /* try next */ }
      }
    }
    loadQuiz()
  }, [id, locale])

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">
        {tc('loading')}
      </div>
    )
  }

  const question = quiz.questions[current]
  const score = answers.filter((a, i) => a === quiz.questions[i].correct).length
  const total = quiz.questions.length

  function handleSelect(optionIndex: number) {
    if (selected !== null) return
    setSelected(optionIndex)

    setTimeout(() => {
      const newAnswers = [...answers, optionIndex]
      setAnswers(newAnswers)
      setSelected(null)

      if (current + 1 < quiz!.questions.length) {
        setCurrent(current + 1)
      } else {
        setShowResult(true)
      }
    }, 1200)
  }

  async function handleSave() {
    if (!name.trim()) return
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          language: locale,
          quizId: id,
          score,
          total,
        }),
      })
      setSaved(true)
    } catch (e) {
      console.error('Failed to save score', e)
    }
  }

  if (showResult) {
    const percentage = Math.round((score / total) * 100)
    const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className={`p-8 text-center ${percentage >= 80 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : percentage >= 60 ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white`}>
            <span className="text-6xl block mb-4">{emoji}</span>
            <h2 className="text-2xl font-bold mb-2">{t('result')}</h2>
            <p className="text-4xl font-black">{score}/{total}</p>
            <p className="text-white/80 mt-2">{percentage}%</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Save score */}
            {!saved ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('saveName')}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--vikenco-light)]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="px-6 py-3 bg-[var(--vikenco-blue)] text-white font-bold rounded-xl hover:bg-[var(--vikenco-light)] transition-colors disabled:opacity-50"
                >
                  {t('saveScore')}
                </button>
              </div>
            ) : (
              <p className="text-center text-emerald-600 font-bold">{t('saved')}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setCurrent(0); setAnswers([]); setShowResult(false); setSaved(false); setName('') }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {t('tryAgain')}
              </button>
              <Link
                href="/leaderboard"
                className="flex-1 px-4 py-3 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-colors text-center"
              >
                🏆 {tc('leaderboard')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Link href="/quiz" className="text-sm text-gray-400 hover:text-gray-600">
            ← {tc('back')}
          </Link>
          <span className="text-sm font-medium text-gray-500">
            {t('question')} {current + 1}/{total}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--vikenco-light)] rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            let style = 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            if (selected !== null) {
              if (i === question.correct) {
                style = 'bg-emerald-50 border-emerald-500 text-emerald-700'
              } else if (i === selected && selected !== question.correct) {
                style = 'bg-red-50 border-red-500 text-red-700'
              } else {
                style = 'bg-gray-50 border-gray-200 opacity-50'
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-sm font-bold text-gray-500">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-medium">{option}</span>
                  {selected !== null && i === question.correct && (
                    <span className="ml-auto text-lg">✓</span>
                  )}
                  {selected !== null && i === selected && selected !== question.correct && (
                    <span className="ml-auto text-lg">✗</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className={`mt-4 p-3 rounded-xl text-center font-bold ${selected === question.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {selected === question.correct ? t('correct') : t('wrong')}
          </div>
        )}
      </div>
    </div>
  )
}
