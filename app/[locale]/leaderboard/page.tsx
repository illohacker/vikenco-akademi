'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

interface Score {
  id: string
  name: string
  language: string
  quiz_id: string
  score: number
  total: number
  percentage: number
  created_at: string
}

const langFlags: Record<string, string> = {
  no: '🇳🇴', en: '🇬🇧', lt: '🇱🇹', uk: '🇺🇦', ro: '🇷🇴', ar: '🇸🇾', es: '🇪🇸',
}

export default function LeaderboardPage() {
  const t = useTranslations('leaderboard')
  const [scores, setScores] = useState<Score[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/quiz/scores')
      .then(r => r.json())
      .then(data => { setScores(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? scores : scores.filter(s => s.quiz_id === filter)
  const quizIds = [...new Set(scores.map(s => s.quiz_id))]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--vikenco-blue)] mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-6">{t('subtitle')}</p>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[var(--vikenco-blue)] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          {t('all')}
        </button>
        {quizIds.map(id => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filter === id ? 'bg-[var(--vikenco-blue)] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {id}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <span className="text-4xl block mb-4">🏆</span>
            {t('noResults')}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">{t('rank')}</th>
                <th className="px-4 py-3 font-medium">{t('name')}</th>
                <th className="px-4 py-3 font-medium">{t('quizName')}</th>
                <th className="px-4 py-3 font-medium text-right">{t('score')}</th>
                <th className="px-4 py-3 font-medium text-right hidden sm:table-cell">{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-gray-200 text-gray-600' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'text-gray-400'
                    }`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <span className="mr-1.5">{langFlags[s.language] || ''}</span>
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{s.quiz_id}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-gray-900">{s.score}/{s.total}</span>
                    <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                      s.percentage >= 80 ? 'bg-emerald-100 text-emerald-700' :
                      s.percentage >= 60 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {Math.round(s.percentage)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400 hidden sm:table-cell">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
