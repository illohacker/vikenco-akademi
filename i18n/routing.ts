import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['no', 'en', 'lt', 'uk', 'ro', 'ar', 'es'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  no: 'Norsk',
  en: 'English',
  lt: 'Lietuvių',
  uk: 'Українська',
  ro: 'Română',
  ar: 'العربية',
  es: 'Español',
}

export const localeFlags: Record<Locale, string> = {
  no: '🇳🇴',
  en: '🇬🇧',
  lt: '🇱🇹',
  uk: '🇺🇦',
  ro: '🇷🇴',
  ar: '🇸🇾',
  es: '🇪🇸',
}

export const rtlLocales: Locale[] = ['ar']

export const routing = defineRouting({
  locales,
  defaultLocale: 'no',
  localePrefix: 'always',
})

export const { Link, usePathname, useRouter, redirect } = createNavigation(routing)
