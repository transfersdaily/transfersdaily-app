import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TransferGrid } from '@/components/TransferGrid';
import { Sidebar } from '@/components/Sidebar';
import { SidebarSkeleton } from '@/components/SidebarSkeleton';
import { ArticleCard, ArticleCardSkeleton } from '@/components/ArticleCard';
import { ViewAllButton } from '@/components/ViewAllButton';
import { type Locale, getDictionary, locales } from '@/lib/i18n';
import { getBestDate, formatTimeAgo } from '@/lib/date-utils';
import { createTranslator } from '@/lib/dictionary-server';
import { type Transfer } from '@/lib/api';
import { API_CONFIG } from '@/lib/config';
import { AdSlot } from '@/components/ads';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    authors: [{ name: 'Transfer Daily', url: 'https://transferdaily.com' }],
    creator: 'Transfer Daily',
    publisher: 'Transfer Daily',
    applicationName: 'Transfer Daily',
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL('https://transferdaily.com'),
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: { en: '/', es: '/es', it: '/it', fr: '/fr', de: '/de', 'x-default': '/' },
    },
    openGraph: {
      title: currentSeo.title,
      description: fallbackDescription,
      url: locale === 'en' ? 'https://transferdaily.com' : `https://transferdaily.com/${locale}`,
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

// League section component for per-league article grids
function LeagueSection({
  title,
  slug,
  transfers,
  locale,
  dict,
  t,
}: {
  title: string;
  slug: string;
  transfers: Transfer[];
  locale: Locale;
  dict: any;
  t: (key: string, fallback?: string) => string;
}) {
  return (
    <section className="py-4 md:py-6" aria-label={`${title} transfers`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground">
          {title}
        </h2>
        <ViewAllButton href={`/${locale}/league/${slug}`}>
          {t('common.viewAll', 'View All')}
        </ViewAllButton>
      </div>

      {transfers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {transfers.slice(0, 4).map((transfer) => (
            <ArticleCard
              key={transfer.id}
              variant="compact"
              title={transfer.title}
              href={`/${locale}/article/${transfer.slug}`}
              imageUrl={transfer.imageUrl}
              timeAgo={formatTimeAgo(transfer.publishedAt, t)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t('common.noTransfersFound', 'No transfers found')}</p>
      )}
    </section>
  );
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
    url: locale === 'en' ? 'https://transferdaily.com' : `https://transferdaily.com/${locale}`,
    description: t('footer.description') || 'Latest football transfer news',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `https://transferdaily.com/${locale}/search?q={search_term_string}` },
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
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 min-h-screen">
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-7">

            {/* Hero Section - Featured Article */}
            <section className="pt-6 pb-4" aria-labelledby="featured-transfer">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[420px]">
                    <div className="md:col-span-2 h-full">
                      <ArticleCardSkeleton variant="hero" />
                    </div>
                    <div className="hidden md:flex flex-col gap-3">
                      <ArticleCardSkeleton variant="hero" />
                      <ArticleCardSkeleton variant="hero" />
                    </div>
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[420px]">
                  {/* Main Featured Article */}
                  {initialData.featuredTransfer ? (
                    <div className="md:col-span-2 h-full">
                      <ArticleCard
                        variant="hero"
                        title={initialData.featuredTransfer.title}
                        href={`/${locale}/article/${initialData.featuredTransfer.slug}`}
                        imageUrl={initialData.featuredTransfer.imageUrl}
                        league={initialData.featuredTransfer.league}
                        timeAgo={formatTimeAgo(initialData.featuredTransfer.publishedAt, t)}
                        excerpt={initialData.featuredTransfer.excerpt}
                        priority
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-2 h-full rounded-lg bg-card flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">{t('common.noFeaturedTransfer')}</p>
                    </div>
                  )}

                  {/* Side Articles */}
                  <div className="hidden md:flex flex-col gap-3">
                    {initialData.latestTransfers?.slice(0, 2).map((transfer: any) => (
                      <div key={transfer.id} className="flex-1">
                        <ArticleCard
                          variant="hero"
                          title={transfer.title}
                          href={`/${locale}/article/${transfer.slug}`}
                          imageUrl={transfer.imageUrl}
                          league={transfer.league}
                        />
                      </div>
                    )) || (
                      <>
                        <div className="flex-1 rounded-lg bg-card" />
                        <div className="flex-1 rounded-lg bg-card" />
                      </>
                    )}
                  </div>
                </div>
              </Suspense>
            </section>

            {/* Latest News Grid */}
            <section className="py-4 md:py-6" aria-labelledby="latest-transfers">
              <div className="flex justify-between items-center mb-4">
                <h2
                  id="latest-transfers"
                  className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground"
                >
                  {t('homepage.latestTransfers')}
                </h2>
                <ViewAllButton href={`/${locale}/latest`}>
                  {t('common.viewAll')}
                </ViewAllButton>
              </div>

              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} variant="standard" />
                  ))}
                </div>
              }>
                <TransferGrid
                  transfers={initialData.latestTransfers.slice(2, 8)}
                  locale={locale}
                  dict={dict}
                  limit={6}
                />
              </Suspense>
            </section>

            <AdSlot placement="homepage.pre-latest" />

            {/* Per-League Sections */}
            {initialData.leagues.map((league, index) => (
              <div key={league.id}>
                <LeagueSection
                  title={league.name}
                  slug={league.slug}
                  transfers={initialData.leagueTransfers[league.slug] || []}
                  locale={locale}
                  dict={dict}
                  t={t}
                />
                {index === 1 && <AdSlot placement="homepage.post-hero" />}
                {index === 3 && <AdSlot placement="homepage.post-latest" />}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
            <div className="space-y-6 pt-6">
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
              league: article.league || 'Unknown',
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
          limit: '4',
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
