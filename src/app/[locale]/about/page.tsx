import { type Locale, getDictionary, locales } from "@/lib/i18n"
import { createTranslator } from "@/lib/dictionary-server"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { AboutFAQ } from "./AboutFAQ"
import { SplineHero } from "./SplineHero"
import { FeatureCards } from "./FeatureCards"

interface AboutPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()

  const titles: Record<string, string> = {
    en: 'About Transfer Daily - Your Football Transfer News Source',
    es: 'Acerca de Transfer Daily - Tu Fuente de Noticias de Fichajes',
    it: 'Chi Siamo - Transfer Daily, Notizie di Calciomercato',
    fr: 'À Propos de Transfer Daily - Actualités Transferts Football',
    de: 'Über Transfer Daily - Fußball Transfer Nachrichten'
  }

  return {
    title: titles[locale],
    alternates: {
      canonical: `/${locale}/about`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/about`])),
    },
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()

  const dict = await getDictionary(locale)
  const t = createTranslator(dict)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6">

        {/* Hero — Spline animated background with title overlay */}
        <SplineHero
          title={t('about.title', 'About Transfer Daily')}
          subtitle={t('about.subtitle', 'Your trusted source for the latest football transfer news, rumors, and confirmed deals from around the world.')}
        />

        {/* Stats — Centered typographic social proof */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '5', label: t('about.stats.leagues', 'Major Leagues') },
              { value: '24/7', label: t('about.stats.coverage', 'News Coverage') },
              { value: '5', label: t('about.stats.languages', 'Languages') },
              { value: '1000+', label: t('about.stats.articles', 'Articles Published') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="font-sans text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Story — Narrative sections */}
        <section className="py-10 border-t border-border">
          <h2 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground mb-8">
            {t('about.ourStory', 'Our Story')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-primary">01</span>
                </div>
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                  {t('about.problem', 'The Problem')}
                </h3>
              </div>
              <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
                {t('about.storyParagraph1', 'Football fans were struggling to find reliable, up-to-date transfer information in one place. News was scattered across multiple sources, often unreliable, and difficult to verify.')}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-primary">02</span>
                </div>
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                  {t('about.solution', 'The Solution')}
                </h3>
              </div>
              <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
                {t('about.storyParagraph2', 'We created Transfer Daily to be the definitive source for transfer news. Our platform aggregates, verifies, and presents transfer information in a clean, easy-to-navigate format.')}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-primary">03</span>
                </div>
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                  {t('about.today', 'Today')}
                </h3>
              </div>
              <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
                {t('about.storyParagraph3', 'Today, Transfer Daily serves thousands of football fans worldwide with the latest transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.')}
              </p>
            </div>
          </div>
        </section>

        {/* What We Cover — animated feature cards with background icons */}
        <section className="py-10 border-t border-border">
          <h2 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground mb-8">
            {t('about.whatWeCover', 'What We Cover')}
          </h2>

          <FeatureCards features={[
            { iconName: 'Shield', title: t('about.feature1Title', 'Verified Transfers'), desc: t('about.feature1Desc', 'Every confirmed transfer is cross-referenced with official club announcements and trusted journalists before publication.') },
            { iconName: 'Clock', title: t('about.feature2Title', 'Breaking Rumors'), desc: t('about.feature2Desc', 'Stay ahead with the latest transfer rumors as they develop, clearly labeled to distinguish from confirmed deals.') },
            { iconName: 'Globe', title: t('about.feature3Title', '5 Major Leagues'), desc: t('about.feature3Desc', 'Comprehensive coverage of Premier League, La Liga, Serie A, Bundesliga, and Ligue 1 transfer activity.') },
            { iconName: 'Newspaper', title: t('about.feature4Title', 'In-Depth Analysis'), desc: t('about.feature4Desc', 'Beyond the headlines — player backgrounds, transfer history, and contextual analysis for every major deal.') },
            { iconName: 'Users', title: t('about.feature5Title', 'Multi-Language'), desc: t('about.feature5Desc', 'Available in English, Spanish, French, German, and Italian so fans worldwide can follow transfers in their language.') },
            { iconName: 'Zap', title: t('about.feature6Title', 'Real-Time Updates'), desc: t('about.feature6Desc', 'Our automated pipeline delivers transfer news as it happens, with articles published within minutes of breaking developments.') },
          ]} />
        </section>

        {/* Mission */}
        <section className="py-10 border-t border-border max-w-3xl">
          <h2 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground mb-4">
            {t('about.mission', 'Our Mission')}
          </h2>
          <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed">
            {t('about.missionText', 'To provide football fans with accurate, timely, and comprehensive transfer information, helping them stay connected to the beautiful game they love.')}
          </p>
        </section>

        {/* FAQ — moved from contact page (Trust & Authority: address concerns) */}
        <section className="py-10 border-t border-border">
          <h2 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground mb-8">
            {t('contact.faq.title', 'Frequently Asked Questions')}
          </h2>
          <AboutFAQ dict={dict} />
        </section>

      </div>
    </main>
  )
}
