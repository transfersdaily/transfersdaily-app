import { Suspense } from 'react';
import { mobileTypography, mobileSpacing } from '@/lib/mobile-utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { TransferCard } from '@/components/TransferCard';
import { TransferGridWithAds } from '@/components/TransferGridWithAds';
import { Sidebar } from '@/components/Sidebar';
import { TransferGridSkeleton } from '@/components/TransferCardSkeleton';
import { SidebarSkeleton } from '@/components/SidebarSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ViewAllButton } from '@/components/ViewAllButton';
import { NewsletterSection } from '@/components/NewsletterSection';
import { type Locale, getDictionary, locales } from '@/lib/i18n';
import { getBestDate, formatTimeAgo } from '@/lib/date-utils';
import { createTranslator } from '@/lib/dictionary-server';
import { Clock } from 'lucide-react';
// Ad components
import { LeaderboardAd, RectangleAd } from '@/components/ads';
// API configuration
import { API_CONFIG } from '@/lib/config';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate comprehensive metadata for SEO optimization
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = createTranslator(dict);

  // Language-specific SEO titles and descriptions
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
        'Transfer Daily - Últimas Noticias de Fichajes de Fútbol y Rumores',
      description:
        'Obtén las últimas noticias de fichajes de fútbol, traspasos confirmados y rumores de última hora de Premier League, La Liga, Serie A, Bundesliga y Ligue 1.',
      keywords:
        'fichajes fútbol, noticias fútbol, rumores traspasos, fichajes Premier League, fichajes La Liga, fichajes Serie A, fichajes Bundesliga, fichajes Ligue 1, mercado fichajes',
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
        'Transfer Daily - Dernières Actualités Transferts Football et Rumeurs',
      description:
        'Découvrez les dernières actualités des transferts de football, accords confirmés et rumeurs de Premier League, La Liga, Serie A, Bundesliga et Ligue 1.',
      keywords:
        'transferts football, actualités football, rumeurs transferts, transferts Premier League, transferts La Liga, transferts Serie A, transferts Bundesliga, transferts Ligue 1',
    },
    de: {
      title:
        'Transfer Daily - Neueste Fußball-Transfer-Nachrichten und Gerüchte',
      description:
        'Erhalten Sie die neuesten Fußball-Transfer-Nachrichten, bestätigte Deals und Gerüchte aus Premier League, La Liga, Serie A, Bundesliga und Ligue 1.',
      keywords:
        'Fußball Transfers, Fußball Nachrichten, Transfer Gerüchte, Premier League Transfers, La Liga Transfers, Serie A Transfers, Bundesliga Transfers, Ligue 1 Transfers',
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

    // Enhanced format detection
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    // Metadata base for relative URLs
    metadataBase: new URL('https://transferdaily.com'),

    // Canonical and alternate language URLs
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        en: '/',
        es: '/es',
        it: '/it',
        fr: '/fr',
        de: '/de',
        'x-default': '/',
      },
    },

    // Enhanced Open Graph metadata
    openGraph: {
      title: currentSeo.title,
      description: fallbackDescription,
      url:
        locale === 'en'
          ? 'https://transferdaily.com'
          : `https://transferdaily.com/${locale}`,
      siteName: 'Transfer Daily',
      locale:
        locale === 'en'
          ? 'en_US'
          : locale === 'es'
          ? 'es_ES'
          : locale === 'it'
          ? 'it_IT'
          : locale === 'fr'
          ? 'fr_FR'
          : 'de_DE',
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) =>
          l === 'en'
            ? 'en_US'
            : l === 'es'
            ? 'es_ES'
            : l === 'it'
            ? 'it_IT'
            : l === 'fr'
            ? 'fr_FR'
            : 'de_DE'
        ),
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Transfer Daily - Latest Football Transfer News',
          type: 'image/jpeg',
        },
        {
          url: '/og-image-square.jpg',
          width: 1200,
          height: 1200,
          alt: 'Transfer Daily - Football Transfer News',
          type: 'image/jpeg',
        },
      ],
    },

    // Enhanced Twitter metadata
    twitter: {
      card: 'summary_large_image',
      site: '@transferdaily',
      creator: '@transferdaily',
      title: currentSeo.title,
      description: fallbackDescription,
      images: {
        url: '/og-image.jpg',
        alt: 'Transfer Daily - Latest Football Transfer News',
      },
    },

    // Enhanced robots configuration
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification tags - Real verification codes for search engines
    verification: {
      google: 'CsP6O3h8IjLJMuHGZlqCA2LtBio3Bh8ov6rLYmPKXU8',
      yandex: '409c7b778268e192',
      other: {
        'msvalidate.01': '151EC670865590C0F31CA873198F81E5',
      },
    },

    // Additional metadata
    category: 'Sports',
    classification: 'Football Transfer News',
    referrer: 'origin-when-cross-origin',
  };
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Server-side rendered page component
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Get translations server-side
  const dict = await getDictionary(locale);
  const t = createTranslator(dict);

  // Get initial data server-side (real API data) with language parameter
  const initialData = await getInitialData(locale);

  // Generate comprehensive structured data
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Transfer Daily',
    alternateName: 'Transfer Daily - Football Transfer News',
    url:
      locale === 'en'
        ? 'https://transferdaily.com'
        : `https://transferdaily.com/${locale}`,
    description:
      t('footer.description') ||
      'Latest football transfer news, rumors, and updates from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1',
    inLanguage: locale,
    isAccessibleForFree: true,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://transferdaily.com/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Transfer Daily',
      url: 'https://transferdaily.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://transferdaily.com/logo.png',
        width: 200,
        height: 60,
      },
      sameAs: [
        'https://x.com/TransfersDly',
        'https://bsky.app/profile/transfers-daily.bsky.social',
      ],
    },
  };

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Transfer Daily',
    url: 'https://transferdaily.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://transferdaily.com/logo.png',
      width: 200,
      height: 60,
    },
    description:
      'Leading source for football transfer news, rumors, and analysis covering Premier League, La Liga, Serie A, Bundesliga, and Ligue 1',
    foundingDate: '2024',
    sameAs: [
      'https://x.com/TransfersDly',
      'https://bsky.app/profile/transfers-daily.bsky.social',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `https://transferdaily.com/${locale}/contact`,
    },
    areaServed: 'Worldwide',
    knowsAbout: [
      'Football Transfers',
      'Soccer News',
      'Premier League',
      'La Liga',
      'Serie A',
      'Bundesliga',
      'Ligue 1',
      'Transfer Window',
      'Football Rumors',
    ],
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('navigation.home') || 'Home',
        item:
          locale === 'en'
            ? 'https://transferdaily.com'
            : `https://transferdaily.com/${locale}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Enhanced JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* PREMIUM AD: Below navbar, before content - HIGHEST VALUE POSITION */}
      <div className="container mx-auto pt-4">
        <LeaderboardAd position="below-navbar" className="mb-4" />
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Content - 70% */}
          <div className="col-span-1 lg:col-span-7">
            {/* Hero Section - Featured */}
            <section className="py-8" aria-labelledby="featured-transfer">
              <div className="mb-3 md:mb-6">
                <h2
                  id="featured-transfer"
                  className="text-base md:text-xl font-bold mb-3 text-foreground"
                >
                  {t('homepage.featuredArticle')}
                </h2>
                <div className="w-24 h-1 bg-primary rounded-full"></div>
              </div>

              <Suspense
                fallback={
                  <Card className="overflow-hidden h-[500px] relative">
                    <Skeleton className="w-full h-full" />
                  </Card>
                }
              >
                {initialData.featuredTransfer ? (
                  <article>
                    <Link
                      href={`/${locale}/article/${initialData.featuredTransfer.slug}?language=${locale}`}
                      className="focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg"
                      aria-label={`${t('common.readFullArticle')}: ${
                        initialData.featuredTransfer.title
                      }`}
                    >
                      <Card className="overflow-hidden h-[500px] relative cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group bg-card border border-border shadow-md rounded-xl">
                        <div className="h-full bg-card relative">
                          {initialData.featuredTransfer.imageUrl && (
                            <Image
                              src={initialData.featuredTransfer.imageUrl}
                              alt={`Featured: ${initialData.featuredTransfer.title} - ${initialData.featuredTransfer.league}`}
                              width={600}
                              height={500}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              priority
                            />
                          )}
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                          {/* Content overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                            <Badge className="mb-4 bg-primary/10 text-primary border-none">
                              {initialData.featuredTransfer.league?.toUpperCase()}
                            </Badge>
                            <h3 className="text-sm md:text-base lg:text-xl font-bold mb-3 md:mb-4 leading-tight text-white drop-shadow-lg">
                              {initialData.featuredTransfer.title}
                            </h3>
                            <p className="text-white text-sm md:text-base leading-relaxed line-clamp-2 mb-4 md:mb-6 drop-shadow-md">
                              {initialData.featuredTransfer.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-white drop-shadow-md">
                              <Clock className="h-4 w-4" />
                              <time
                                dateTime={
                                  initialData.featuredTransfer.publishedAt
                                }
                              >
                                {formatTimeAgo(
                                  initialData.featuredTransfer.publishedAt,
                                  t
                                )}
                              </time>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </article>
                ) : (
                  <Card className="overflow-hidden h-[500px] relative">
                    <div className="h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">
                        {t('common.noFeaturedTransfer')}
                      </p>
                    </div>
                  </Card>
                )}
              </Suspense>
            </section>

            {/* Latest Transfer News Section */}
            <section className="py-4 md:py-8" aria-labelledby="latest-transfers">
              <div className="flex justify-between items-start mb-3 md:mb-6">
                <div>
                  <h2
                    id="latest-transfers"
                    className="text-base md:text-xl font-bold mb-3 text-foreground"
                  >
                    {t('homepage.latestTransfers')}
                  </h2>
                  <div className="w-24 h-1 bg-primary rounded-full"></div>
                </div>
                <ViewAllButton
                  href={`/${locale}/latest`}
                >
                  {t('common.viewAll')}
                </ViewAllButton>
              </div>

              <Suspense fallback={<TransferGridSkeleton count={6} />}>
                <TransferGridWithAds
                  transfers={initialData.latestTransfers}
                  locale={locale}
                  dict={dict}
                  adPosition="in-latest"
                />
              </Suspense>
            </section>

            {/* Ad: Rectangle after latest transfers */}
            <RectangleAd position="after-latest" />

            {/* Browse by League Section */}
            <section className="py-4 md:py-8" aria-labelledby="browse-leagues">
              <div className="mb-3 md:mb-6">
                <h2
                  id="browse-leagues"
                  className="text-base md:text-xl font-bold mb-3 text-foreground"
                >
                  {t('homepage.browseByLeague')}
                </h2>
                <div className="w-24 h-1 bg-primary rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {initialData.leagues.map((league: any) => (
                  <Link
                    key={league.id}
                    href={`/${locale}/league/${league.slug}`}
                    className="group p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all duration-200 bg-card shadow-md"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={league.logoUrl || '/placeholder-image.svg'}
                          alt={`${league.name} logo`}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors text-foreground">
                          {league.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Ad: Rectangle after browse by league */}
            <RectangleAd position="after-leagues" />

            {/* Trending Transfer News Section */}
            <section className="py-4 md:py-8" aria-labelledby="trending-transfers">
              <div className="flex justify-between items-start mb-3 md:mb-6">
                <div>
                  <h2
                    id="trending-transfers"
                    className="text-base md:text-lg lg:text-xl font-bold mb-3 text-foreground"
                  >
                    {t('homepage.trendingArticles')}
                  </h2>
                  <div className="w-24 h-1 bg-primary rounded-full"></div>
                </div>
                <ViewAllButton
                  href={`/${locale}/latest`}
                >
                  {t('common.viewAll')}
                </ViewAllButton>
              </div>

              <Suspense fallback={<TransferGridSkeleton count={6} />}>
                <TransferGridWithAds
                  transfers={initialData.trendingTransfers}
                  locale={locale}
                  dict={dict}
                  adPosition="in-trending"
                />
              </Suspense>
            </section>

            {/* Ad: Leaderboard before newsletter */}
            <LeaderboardAd position="before-newsletter" />

            {/* Newsletter Section */}
            <NewsletterSection locale={locale} dict={dict} />

            {/* Ad: Rectangle after newsletter */}
            <RectangleAd position="after-newsletter" />
          </div>

          {/* Sidebar - 30% */}
          <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar locale={locale} dict={dict} />
            </Suspense>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Server-side data fetching - fetch real articles from API
async function getInitialData(language = 'en') {
  // Static leagues for navigation - these have images and should not be touched
  const staticLeagues = [
    {
      id: 'premier-league',
      name: 'Premier League',
      country: 'England',
      logoUrl: '/logos/leagues/premier-league.png',
      slug: 'premier-league'
    },
    {
      id: 'la-liga',
      name: 'La Liga',
      country: 'Spain',
      logoUrl: '/logos/leagues/la-liga.png',
      slug: 'la-liga'
    },
    {
      id: 'serie-a',
      name: 'Serie A',
      country: 'Italy',
      logoUrl: '/logos/leagues/serie-a.png',
      slug: 'serie-a'
    },
    {
      id: 'bundesliga',
      name: 'Bundesliga',
      country: 'Germany',
      logoUrl: '/logos/leagues/bundesliga.png',
      slug: 'bundesliga'
    },
    {
      id: 'ligue-1',
      name: 'Ligue 1',
      country: 'France',
      logoUrl: '/logos/leagues/ligue-1.png',
      slug: 'ligue-1'
    }
  ];

  try {
    // Fetch real articles from the backend API
    let featuredTransfer = null;
    let latestTransfers = [];
    let trendingTransfers = [];

    try {
      // Direct API call to backend with proper error handling
      const apiUrl = `${API_CONFIG.baseUrl}/public/articles`;
      const params = new URLSearchParams({
        limit: '15',
        page: '1',
        status: 'published',
        language: language,
      });

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.articles?.length > 0) {
          const articles = data.data.articles;

          // Transform articles to the expected format
          const transformedArticles = articles.map((article: any) => {
            // Since we're fetching with status=published, these are all published articles
            const bestDate = getBestDate(article.published_at, article.updated_at, article.created_at, true);

            return {
              id: article.id,
              title: article.title,
              excerpt: article.content
                ? article.content.substring(0, 200) + '...'
                : article.meta_description || '',
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

          // Set featured transfer (first article)
          featuredTransfer = transformedArticles[0];

          // Set latest transfers (next 6 articles)
          latestTransfers = transformedArticles.slice(1, 7);

          // Set trending transfers with better logic
          if (transformedArticles.length >= 13) {
            // If we have enough articles, use articles 7-12
            trendingTransfers = transformedArticles.slice(7, 13);
          } else if (transformedArticles.length >= 7) {
            // If we have 7-12 articles, use the remaining ones and fill with earlier ones
            const remaining = transformedArticles.slice(7);
            const needed = 6 - remaining.length;
            const filler = transformedArticles.slice(1, 1 + needed);
            trendingTransfers = [...remaining, ...filler];
          } else {
            // If we have fewer than 7 articles, duplicate some of the latest
            trendingTransfers = transformedArticles.slice(1).concat(transformedArticles.slice(1)).slice(0, 6);
          }
        }
      } else {
        console.error(
          '❌ API request failed:',
          response.status,
          response.statusText
        );
      }
    } catch (apiError: any) {
      console.error('❌ Error fetching articles from API:', apiError.message);
      console.error(
        '❌ This is likely a CORS issue. The API is not accessible from localhost:3000'
      );
    }

    const finalData = {
      featuredTransfer,
      latestTransfers,
      trendingTransfers,
      leagues: staticLeagues,
    };

    return finalData;
  } catch (error) {
    console.error('💥 Error in getInitialData:', error);
    return {
      featuredTransfer: null,
      latestTransfers: [],
      trendingTransfers: [],
      leagues: staticLeagues,
    };
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

function TransferGrid({ transfers, locale, dict }: any) {
  const t = createTranslator(dict);

  if (!transfers || transfers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('common.noLatestTransfers')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {transfers.map((transfer: any) => (
        <TransferCard
          key={transfer.id}
          title={transfer.title}
          excerpt={transfer.excerpt}
          primaryBadge={transfer.league}
          timeAgo={formatTimeAgo(transfer.publishedAt, t)}
          href={`/${locale}/article/${transfer.slug}`}
          imageUrl={transfer.imageUrl}
        />
      ))}
    </div>
  );
}
