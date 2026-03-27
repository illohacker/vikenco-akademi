import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { rtlLocales, type Locale } from '@/i18n/routing'
import { Navbar } from '@/components/Navbar'
import '@/app/globals.css'

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale() as Locale
  const messages = await getMessages()
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen bg-[var(--vikenco-ice)]">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
