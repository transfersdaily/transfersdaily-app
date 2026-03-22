import { ConditionalLayout } from '@/components/ConditionalLayout'
import { locales, type Locale, getDictionary } from '@/lib/i18n'
import { DictionaryProvider } from '@/lib/dictionary-provider'
import { ServerNavbar } from '@/components/ServerNavbar'
import { PageTransition } from '@/components/PageTransition'
import { AdSlot } from '@/components/ads'
import { notFound } from 'next/navigation'

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
      >
        Skip to main content
      </a>
      <ConditionalLayout>
        <ServerNavbar locale={locale} dictionary={dictionary} />
        
        {/* Site-wide Header Banner */}
        <AdSlot placement="homepage.header" />
        
        <PageTransition>{children}</PageTransition>
      </ConditionalLayout>
    </DictionaryProvider>
  )
}
