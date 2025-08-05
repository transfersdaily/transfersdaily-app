import { ConditionalLayout } from '@/components/ConditionalLayout'
import { locales, type Locale, getDictionary } from '@/lib/i18n'
import { DictionaryProvider } from '@/lib/dictionary-provider'
import { ServerNavbar } from '@/components/ServerNavbar'
import { StickyBottomAd } from '@/components/ads'
import { MobileTopFloatingAd, MobileBottomFloatingAd, MobileAutoAds } from '@/components/ads/MobileFloatingAds'
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
        
        {/* Mobile floating ads */}
        <MobileTopFloatingAd />
        <MobileAutoAds />
        
        {children}
        
        {/* Mobile sticky bottom ad (fallback if not using auto ads) */}
        <MobileBottomFloatingAd />
      </ConditionalLayout>
    </DictionaryProvider>
  )
}
