import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { SidebarSkeleton } from '@/components/SidebarSkeleton';
import { HeroSection } from '@/components/sections/HeroSection';
import { LatestSection } from '@/components/sections/LatestSection';
import { LeagueSection } from '@/components/sections/LeagueSection';
import { type Locale, getDictionary, locales } from '@/lib/i18n';
import { getBestDate } from '@/lib/date-utils';
import { createTranslator } from '@/lib/dictionary-server';
import { type Transfer } from '@/lib/api';
import { API_CONFIG } from '@/lib/config';
import { AdSlot } from '@/components/ads';
import { SITE_URL, generateSlug } from '@/lib/constants';

export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = createTranslator(dict);

  const seoData = {
    en: {
      title: 'Transfer Daily - Latest Football Transfer News, Rumors & Updates',
      description:
        'Get the latest football transfer news, confirmed deals, and breaking rumors from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1. Updated daily with expert analysis.',
      keywords:
        'football transfers, soccer news, transfer rumors, Premier League transfers, La Liga transfers, Serie A transfers, Bundesliga transfers, Ligue 1 transfers, transfer window, football news today',
    },
    es: {
      title:
        'Transfer Daily - Ultimas Noticias de Fichajes de Futbol y Rumores',
      description:
        'Obten las ultimas noticias de fichajes de futbol, traspasos confirmados y rumores de ultima hora de Premier League, La Liga, Serie A, Bundesliga y Ligue 1.',
      keywords:
        'fichajes futbol, noticias futbol, rumores traspasos, fichajes Premier League, fichajes La Liga, fichajes Serie A, fichajes Bundesliga, fichajes Ligue 1, mercado fichajes',
    },
    it: {
      title: 'Transfer Daily - Ultime Notizie di Calciomercato e Rumors',
      description:
        'Scopri le ultime notizie di calciomercato, trasferimenti confermati e rumors da Premier League, La Liga, Serie A, Bundesliga e Ligue 1.',
      keywords:
        'calciomercato, notizie calcio, rumors trasferimenti, mercato Premier League, mercato La Liga, mercato Serie A, mercato Bundesliga, mercato Ligue 1',
    },
    fr: {
      title:
        'Transfer Daily - Dernieres Actualites Transferts Football et Rumeurs',
      description:
        'Decouvrez les dernieres actualites des transferts de football, accords confirmes et rumeurs de Premier League, La Liga, Serie A, Bundesliga et Ligue 1.',
      keywords:
        'transferts football, actualites football, rumeurs transferts, transferts Premier League, transferts La Liga, transferts Serie A, transferts Bundesliga, transferts Ligue 1',
    },
    de: {
      title:
        'Transfer Daily - Neueste Fussball-Transfer-Nachrichten und Geruchte',
      description:
        'Erhalten Sie die neuesten Fussball-Transfer-Nachrichten, bestatigte Deals und Geruchte aus Premier League, La Liga, Serie A, Bundesliga und Ligue 1.',
      keywords:
        'Fussball Transfers, Fussball Nachrichten, Transfer Geruchte, Premier League Transfers, La Liga Transfers, Serie A Transfers, Bundesliga Transfers, Ligue 1 Transfers',
    },
  };

  const currentSeo = seoData[locale];
  const fallbackDescription = t('footer.description') || currentSeo.description;

  return {
    title: currentSeo.title,
    description: fallbackDescription,
    keywords: currentSeo.keywords,
    authors: [{ name: 'Transfer Daily', url: SITE_URL }],
    creator: 'Transfer Daily',
    publisher: 'Transfer Daily',
    applicationName: 'Transfer Daily',
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: { en: '/', es: '/es', it: '/it', fr: '/fr', de: '/de', 'x-default': '/' },
    },
    openGraph: {
      title: currentSeo.title,
      description: fallbackDescription,
      url: locale === 'en' ? SITE_URL : `${SITE_URL}/${locale}`,
      siteName: 'Transfer Daily',
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Transfer Daily - Latest Football Transfer News' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@transferdaily',
      creator: '@transferdaily',
      title: currentSeo.title,
      description: fallbackDescription,
      images: { url: '/og-image.jpg', alt: 'Transfer Daily - Latest Football Transfer News' },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    verification: {
      google: 'CsP6O3h8IjLJMuHGZlqCA2LtBio3Bh8ov6rLYmPKXU8',
      yandex: '409c7b778268e192',
      other: { 'msvalidate.01': '151EC670865590C0F31CA873198F81E5' },
    },
    category: 'Sports',
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const t = createTranslator(dict);
  const initialData = await getInitialData(locale);

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Transfer Daily',
    url: locale === 'en' ? SITE_URL : `${SITE_URL}/${locale}`,
    description: t('footer.description') || 'Latest football transfer news',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/${locale}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main Content Column */}
          <div className="col-span-1 lg:col-span-7">
            <HeroSection
              featuredTransfer={initialData.featuredTransfer}
              latestTransfers={initialData.latestTransfers}
              locale={locale}
              t={t}
            />

            <LatestSection
              transfers={initialData.latestTransfers.slice(2, 8)}
              locale={locale}
              dict={dict}
              t={t}
            />

            <AdSlot placement="homepage.pre-latest" />

            {/* League Sections */}
            {initialData.leagues.map((league) => (
              <LeagueSection
                key={league.id}
                title={league.name}
                slug={league.slug}
                transfers={initialData.leagueTransfers[league.slug] || []}
                locale={locale}
                dict={dict}
                t={t}
              />
            ))}
          </div>

          {/* Sidebar Column — sticky, spans full height */}
          <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
            <div className="sticky top-20 space-y-6 pt-6">
              <AdSlot placement="homepage.sidebar-top" />
              <Suspense fallback={<SidebarSkeleton />}>
                <Sidebar locale={locale} dict={dict} />
              </Suspense>
              <AdSlot placement="homepage.sidebar-middle-1" />
            </div>
          </aside>
        </div>
      </div>

      <AdSlot placement="homepage.mobile-sticky" sticky />
    </main>
  );
}

// Server-side data fetching
async function getInitialData(language = 'en') {
  const staticLeagues = [
    { id: 'premier-league', name: 'Premier League', country: 'England', logoUrl: '/logos/leagues/premier-league.png', slug: 'premier-league' },
    { id: 'la-liga', name: 'La Liga', country: 'Spain', logoUrl: '/logos/leagues/la-liga.png', slug: 'la-liga' },
    { id: 'serie-a', name: 'Serie A', country: 'Italy', logoUrl: '/logos/leagues/serie-a.png', slug: 'serie-a' },
    { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', logoUrl: '/logos/leagues/bundesliga.png', slug: 'bundesliga' },
    { id: 'ligue-1', name: 'Ligue 1', country: 'France', logoUrl: '/logos/leagues/ligue-1.png', slug: 'ligue-1' },
  ];

  const emptyResult = {
    featuredTransfer: null as Transfer | null,
    latestTransfers: [] as Transfer[],
    leagues: staticLeagues,
    leagueTransfers: {} as Record<string, Transfer[]>,
  };

  try {
    let featuredTransfer: Transfer | null = null;
    let latestTransfers: Transfer[] = [];

    // Fetch latest articles
    try {
      const apiUrl = `${API_CONFIG.baseUrl}/public/articles`;
      const params = new URLSearchParams({
        limit: '20',
        page: '1',
        status: 'published',
        language: language,
      });

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.articles?.length > 0) {
          const transformedArticles = data.data.articles.map((article: any) => {
            const bestDate = getBestDate(article.published_at, article.updated_at, article.created_at, true);
            return {
              id: article.id,
              title: article.title,
              excerpt: article.content ? article.content.substring(0, 200) + '...' : article.meta_description || '',
              content: article.content,
              league: article.league || '',
              transferValue: article.transfer_fee,
              playerName: article.player_name,
              fromClub: article.from_club,
              toClub: article.to_club,
              status: article.transfer_status || 'rumor',
              publishedAt: bestDate,
              imageUrl: article.image_url,
              slug: article.slug || generateSlug(article.title || ''),
            };
          });

          featuredTransfer = transformedArticles[0];
          latestTransfers = transformedArticles.slice(1, 9);
        }
      }
    } catch (apiError: any) {
      console.error('Error fetching articles from API:', apiError.message);
    }

    // Fetch per-league articles in parallel
    const leagueTransfers: Record<string, Transfer[]> = {};
    const leagueFetches = staticLeagues.map(async (league) => {
      try {
        const apiUrl = `${API_CONFIG.baseUrl}/public/articles`;
        const params = new URLSearchParams({
          limit: '6',
          page: '1',
          status: 'published',
          language: language,
          league: league.name,
        });

        const response = await fetch(`${apiUrl}?${params}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: AbortSignal.timeout(8000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.articles?.length > 0) {
            leagueTransfers[league.slug] = data.data.articles.map((article: any) => {
              const bestDate = getBestDate(article.published_at, article.updated_at, article.created_at, true);
              return {
                id: article.id,
                title: article.title,
                excerpt: article.content ? article.content.substring(0, 200) + '...' : article.meta_description || '',
                league: article.league || league.name,
                status: article.transfer_status || 'rumor',
                publishedAt: bestDate,
                imageUrl: article.image_url,
                slug: article.slug || generateSlug(article.title || ''),
              };
            });
          }
        }
      } catch {
        // Silently fail per-league fetch
      }
    });

    await Promise.allSettled(leagueFetches);

    return {
      featuredTransfer,
      latestTransfers,
      leagues: staticLeagues,
      leagueTransfers,
    };
  } catch (error) {
    console.error('Error in getInitialData:', error);
    return emptyResult;
  }
}

// generateSlug imported from @/lib/constants
