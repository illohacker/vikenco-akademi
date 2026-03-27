import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

const quizzes = [
  { id: 'welcome', icon: '👋', color: 'bg-blue-500' },
  { id: 'hms', icon: '🦺', color: 'bg-red-500' },
  { id: 'production', icon: '🐟', color: 'bg-cyan-500' },
]

export default function QuizListPage() {
  const t = useTranslations('quiz')
  const tm = useTranslations('modules')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--vikenco-blue)] mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/quiz/${quiz.id}`}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group hover:-translate-y-0.5"
          >
            <div className={`w-14 h-14 ${quiz.color} rounded-xl flex items-center justify-center text-2xl text-white shadow-sm`}>
              {quiz.icon}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 group-hover:text-[var(--vikenco-blue)] transition-colors">
                {tm(quiz.id === 'welcome' ? 'welcome' : quiz.id === 'hms' ? 'hms' : 'production')}
              </h2>
              <p className="text-sm text-gray-500">{t('subtitle')}</p>
            </div>
            <div className="px-4 py-2 bg-[var(--vikenco-blue)] text-white rounded-xl text-sm font-bold group-hover:bg-[var(--vikenco-light)] transition-colors">
              {t('start')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
