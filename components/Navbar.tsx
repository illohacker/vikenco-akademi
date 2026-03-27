'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, localeNames, localeFlags, type Locale } from '@/i18n/routing'
import { useState } from 'react'

export function Navbar() {
  const t = useTranslations('common')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: t('home'), icon: '🏠' },
    { href: '/modules', label: t('modules'), icon: '📚' },
    { href: '/quiz', label: t('quiz'), icon: '❓' },
    { href: '/maps', label: t('maps'), icon: '🗺️' },
    { href: '/leaderboard', label: t('leaderboard'), icon: '🏆' },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[var(--vikenco-blue)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🐟</span>
            <span className="hidden sm:inline">{t('appName')}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language switcher */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
              >
                <span>{localeFlags[locale]}</span>
                <span className="hidden sm:inline">{localeNames[locale]}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border overflow-hidden z-50 min-w-[180px]">
                    {(Object.keys(localeNames) as Locale[]).map((loc) => (
                      <a
                        key={loc}
                        href={`/${loc}${pathname}`}
                        onClick={() => setLangOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          loc === locale
                            ? 'bg-blue-50 text-[var(--vikenco-blue)] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{localeFlags[loc]}</span>
                        <span>{localeNames[loc]}</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-white/20'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
