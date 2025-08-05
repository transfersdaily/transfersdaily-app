import { Target, Zap, Award } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { type Locale, getDictionary, locales } from "@/lib/i18n"
import { createTranslator } from "@/lib/dictionary-server"
import { notFound } from "next/navigation"
import { Metadata } from "next"
// Ad components
import { LeaderboardAd, RectangleAd } from '@/components/ads';

interface AboutPageProps {
  params: Promise<{ locale: Locale }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  
  if (!locales.includes(locale)) {
    notFound()
  }

  const titles = {
    en: 'About Transfer Daily - Your Football Transfer News Source',
    es: 'Acerca de Transfer Daily - Tu Fuente de Noticias de Fichajes',
    it: 'Chi Siamo - Transfer Daily, Notizie di Calciomercato',
    fr: 'À Propos de Transfer Daily - Actualités Transferts Football',
    de: 'Über Transfer Daily - Fußball Transfer Nachrichten'
  }

  const descriptions = {
    en: 'Learn about Transfer Daily, your trusted source for the latest football transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.',
    es: 'Conoce Transfer Daily, tu fuente confiable de las últimas noticias de fichajes de fútbol, rumores y traspasos confirmados de las principales ligas europeas.',
    it: 'Scopri Transfer Daily, la tua fonte affidabile per le ultime notizie di calciomercato, rumors e trasferimenti confermati dalle principali leghe europee.',
    fr: 'Découvrez Transfer Daily, votre source fiable pour les dernières actualités des transferts de football, rumeurs et accords confirmés des principales ligues européennes.',
    de: 'Erfahren Sie mehr über Transfer Daily, Ihre vertrauenswürdige Quelle für die neuesten Fußball-Transfer-Nachrichten, Gerüchte und bestätigte Deals aus den europäischen Top-Ligen.'
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `https://transferdaily.com/${locale}/about`,
      siteName: 'Transfer Daily',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: titles[locale],
      description: descriptions[locale],
    },
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        'en': '/en/about',
        'es': '/es/about',
        'it': '/it/about',
        'fr': '/fr/about',
        'de': '/de/about',
      },
    },
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  // Load dictionary server-side
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto">
        {/* Ad: Leaderboard at top */}
        <LeaderboardAd position="top" />
        
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          <div className="lg:col-span-7">
            {/* Hero Section */}
            <section className="py-16">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">
                  {t('about.title', 'About Transfer Daily')}
                </h1>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8"></div>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('about.subtitle', 'Your trusted source for the latest football transfer news, rumors, and confirmed deals from around the world.')}
                </p>
              </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-gradient-to-r from-muted/30 to-muted/10 -mx-4 px-4 rounded-3xl">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-2xl font-bold mb-4">
                    {t('about.ourStory', 'Our Story')}
                  </h2>
                  <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">The Problem</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('about.storyParagraph1', 'Football fans were struggling to find reliable, up-to-date transfer information in one place. News was scattered across multiple sources, often unreliable, and difficult to verify.')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">The Solution</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('about.storyParagraph2', 'We created Transfer Daily to be the definitive source for transfer news. Our platform aggregates, verifies, and presents transfer information in a clean, easy-to-navigate format.')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Today</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('about.storyParagraph3', 'Today, Transfer Daily serves thousands of football fans worldwide with the latest transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Ad: Rectangle before mission */}
            <div className="py-8">
              <RectangleAd position="after-content" />
            </div>

            {/* Mission Section */}
            <section className="py-16">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-6">
                  {t('about.mission', 'Our Mission')}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.missionText', 'To provide football fans with accurate, timely, and comprehensive transfer information, helping them stay connected to the beautiful game they love.')}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar locale={locale} dict={dict} />
          </div>
        </div>
      </div>
    </main>
  )
}
