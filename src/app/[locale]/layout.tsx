import { ConditionalLayout } from '@/components/ConditionalLayout'
import { locales, type Locale, getDictionary } from '@/lib/i18n'
import { DictionaryProvider } from '@/lib/dictionary-provider'
import { ServerNavbar } from '@/components/ServerNavbar'
import { AdBanner } from '@/components/ads'
import { notFound } from 'next/navigation'
import '../globals.css'

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
    <DictionaryProvider dictionary={dictionary}>
      <ConditionalLayout>
        <ServerNavbar locale={locale} dictionary={dictionary} />
        
        {/* Site-wide Header Banner */}
        <AdBanner />
        
        {children}
      </ConditionalLayout>
    </DictionaryProvider>
  )
}
