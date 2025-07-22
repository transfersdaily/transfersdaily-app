import { Inter } from 'next/font/google'
import { ConditionalLayout } from '@/components/ConditionalLayout'
import { AuthProvider } from '@/lib/auth'
import { locales, type Locale, getDictionary } from '@/lib/i18n'
import { DictionaryProvider } from '@/lib/dictionary-provider'
import { ServerNavbar } from '@/components/ServerNavbar'
import { notFound } from 'next/navigation'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  // Await params before accessing properties
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  // Load dictionary server-side
  const dictionary = await getDictionary(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <DictionaryProvider dictionary={dictionary}>
            <ConditionalLayout>
              <ServerNavbar locale={locale} dictionary={dictionary} />
              {children}
            </ConditionalLayout>
          </DictionaryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
