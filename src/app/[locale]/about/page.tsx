import { Sidebar } from "@/components/Sidebar"
import { type Locale, getDictionary, locales } from "@/lib/i18n"
import { createTranslator } from "@/lib/dictionary-server"
import { notFound } from "next/navigation"
import { Metadata } from "next"

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
    fr: 'A Propos de Transfer Daily - Actualites Transferts Football',
    de: 'Uber Transfer Daily - Fussball Transfer Nachrichten'
  }

  const descriptions = {
    en: 'Learn about Transfer Daily, your trusted source for the latest football transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.',
    es: 'Conoce Transfer Daily, tu fuente confiable de las ultimas noticias de fichajes de futbol, rumores y traspasos confirmados de las principales ligas europeas.',
    it: 'Scopri Transfer Daily, la tua fonte affidabile per le ultime notizie di calciomercato, rumors e trasferimenti confermati dalle principali leghe europee.',
    fr: 'Decouvrez Transfer Daily, votre source fiable pour les dernieres actualites des transferts de football, rumeurs et accords confirmes des principales ligues europeennes.',
    de: 'Erfahren Sie mehr uber Transfer Daily, Ihre vertrauenswurdige Quelle fur die neuesten Fussball-Transfer-Nachrichten, Geruchte und bestatigte Deals aus den europaischen Top-Ligen.'
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
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          <div className="lg:col-span-7">
            {/* Page Header */}
            <section className="py-4 md:py-6">
              <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-foreground">
                {t('about.title', 'About Transfer Daily')}
              </h1>
              <p className="font-sans text-base text-muted-foreground leading-relaxed mt-3 max-w-2xl">
                {t('about.subtitle', 'Your trusted source for the latest football transfer news, rumors, and confirmed deals from around the world.')}
              </p>
            </section>

            {/* Our Story Section */}
            <section className="py-8 border-t border-border">
              <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground mb-6">
                {t('about.ourStory', 'Our Story')}
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-3">The Problem</h3>
                  <p className="font-sans text-base text-muted-foreground leading-relaxed">
                    {t('about.storyParagraph1', 'Football fans were struggling to find reliable, up-to-date transfer information in one place. News was scattered across multiple sources, often unreliable, and difficult to verify.')}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-3">The Solution</h3>
                  <p className="font-sans text-base text-muted-foreground leading-relaxed">
                    {t('about.storyParagraph2', 'We created Transfer Daily to be the definitive source for transfer news. Our platform aggregates, verifies, and presents transfer information in a clean, easy-to-navigate format.')}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-3">Today</h3>
                  <p className="font-sans text-base text-muted-foreground leading-relaxed">
                    {t('about.storyParagraph3', 'Today, Transfer Daily serves thousands of football fans worldwide with the latest transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.')}
                  </p>
                </div>
              </div>
            </section>

            {/* Mission Section */}
            <section className="py-8 border-t border-border">
              <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground mb-4">
                {t('about.mission', 'Our Mission')}
              </h2>
              <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-2xl">
                {t('about.missionText', 'To provide football fans with accurate, timely, and comprehensive transfer information, helping them stay connected to the beautiful game they love.')}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="space-y-6 pt-6">
              <Sidebar locale={locale} dict={dict} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
