import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/Sidebar"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { transfersApi, type Transfer } from "@/lib/api"
import { type Locale, getDictionary, locales } from "@/lib/i18n"
import { typography } from "@/lib/typography"
import { API_CONFIG } from '@/lib/config'
import { getBestDate, formatDisplayDate, getValidDateForMeta, formatTimeAgo } from '@/lib/date-utils'
import { AdSlot } from "@/components/ads"
import { ArticleBreadcrumb, ArticleHero, ArticleMeta, ArticleBody, ShareButtons, ReadingProgressBar } from '@/components/article'
import { ArticleCard } from '@/components/ArticleCard'
import { calculateReadingTime } from '@/lib/reading-time'
import { SITE_URL } from '@/lib/constants'

// Helper function to get translation
function getTranslation(dict: any, key: string, fallback?: string): string {
  const keys = key.split('.')
  let result: any = dict

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      return fallback || key
    }
  }

  return typeof result === 'string' ? result : (fallback || key)
}

// Article interface matching the backend API response
interface Article {
  id: string
  title: string
  content: string
  meta_description?: string
  category?: string
  transfer_status?: string
  transfer_fee?: string
  player_name?: string
  league?: string
  from_club?: string
  to_club?: string
  published_at: string
  updated_at?: string
  created_at: string
  image_url?: string
  slug: string
  tags?: string[]
}

interface ArticlePageProps {
  params: Promise<{ locale: Locale; slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

// Server-side function to fetch article data with fallback
async function getArticleBySlug(slug: string, locale: string): Promise<Article | null> {

  try {

    // Try direct API call first with language parameter
    if (API_CONFIG.baseUrl && API_CONFIG.baseUrl !== '') {
      try {
        const apiUrl = `${API_CONFIG.baseUrl}/public/articles/${slug}?language=${locale}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const data = await response.json();

          if (data.success && data.data?.article) {
            return data.data.article;
          }
        }

        // If specific language fails, try English as fallback
        if (locale !== 'en') {
          const fallbackUrl = `${API_CONFIG.baseUrl}/public/articles/${slug}?language=en`;
          const fallbackResponse = await fetch(fallbackUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(10000)
          });

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.success && fallbackData.data?.article) {
              return fallbackData.data.article;
            }
          }
        }
      } catch (directApiError) {
        console.error('Direct API call failed:', directApiError);
      }
    }

    // Fallback to local API route
    const localApiUrl = `/api/article/${slug}?language=${locale}`;

    const localResponse = await fetch(localApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!localResponse.ok) {
      // Try English fallback for local API too
      if (locale !== 'en') {
        const fallbackLocalUrl = `/api/article/${slug}?language=en`;
        const fallbackLocalResponse = await fetch(fallbackLocalUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(10000)
        });

        if (fallbackLocalResponse.ok) {
          const fallbackLocalData = await fallbackLocalResponse.json();
          if (fallbackLocalData.success && fallbackLocalData.data?.article) {
            return fallbackLocalData.data.article;
          }
        }
      }

      console.error(`Local API error: ${localResponse.status} ${localResponse.statusText} for slug: ${slug}`);
      return null;
    }

    const localData = await localResponse.json();

    if (localData.success && localData.data?.article) {
      return localData.data.article;
    }

    console.error(`Invalid API response structure:`, localData);
    return null;

  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);

    if (error instanceof Error) {
      console.error(`Error details:`, {
        name: error.name,
        message: error.message
      });
    }

    throw error;
  }
}

// Server-side function to get related articles, filtered by league when available
async function getRelatedArticles(league: string | undefined, currentSlug: string, limit: number = 3, locale: string = 'en'): Promise<Transfer[]> {

  try {
    // Fetch more than needed so we can filter by league and exclude current article
    const articles = await transfersApi.getLatest(limit + 5, 0, locale)

    // Exclude current article
    const withoutCurrent = articles.filter(a => (a.slug || a.id) !== currentSlug)

    if (league) {
      const byLeague = withoutCurrent.filter(a => a.league === league)
      if (byLeague.length >= limit) {
        return byLeague.slice(0, limit)
      }
      // Fall back to unfiltered if not enough league matches
      if (byLeague.length > 0) {
        // Pad with non-league articles to reach limit
        const rest = withoutCurrent.filter(a => a.league !== league)
        return [...byLeague, ...rest].slice(0, limit)
      }
    }

    return withoutCurrent.slice(0, limit)
  } catch (error) {
    console.error('[getRelatedArticles] Error fetching related articles:', error)
    return []
  }
}

// Generate comprehensive metadata for article pages
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isPreview = false

  try {
    const article = await getArticleBySlug(slug, locale)

    if (!article) {
      return {
        title: `Transfer Daily - Football Transfer News`,
        description: 'Latest football transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.',
        robots: { index: false, follow: false }
      }
    }

    const getDynamicMetaTags = (article: Article) => {
      const newsKeywords = [
        'transfer',
        'football',
        'soccer',
        article.league?.toLowerCase(),
        article.player_name?.toLowerCase(),
        article.from_club?.toLowerCase(),
        article.to_club?.toLowerCase(),
        article.transfer_status?.toLowerCase()
      ].filter(Boolean).join(', ')

      const leagueToRegion: Record<string, string> = {
        'Premier League': 'GB',
        'Championship': 'GB',
        'La Liga': 'ES',
        'Serie A': 'IT',
        'Bundesliga': 'DE',
        'Ligue 1': 'FR',
        'Eredivisie': 'NL',
        'Primeira Liga': 'PT',
        'Scottish Premiership': 'GB',
        'MLS': 'US',
        'Saudi Pro League': 'SA',
        'Chinese Super League': 'CN',
        'J-League': 'JP',
        'A-League': 'AU'
      }

      return {
        newsKeywords,
        geoRegion: article.league && leagueToRegion[article.league] ? leagueToRegion[article.league] : undefined,
        articleTag: article.league,
        articleSection: article.league || 'Football Transfer News'
      }
    }

    const dynamicMeta = getDynamicMetaTags(article)
    const title = `${article.title} | Transfer Daily`
    const description = article.meta_description || article.content?.substring(0, 160) + '...' || 'Latest football transfer news and updates'

    const publishedTime = getValidDateForMeta(article.published_at) || getValidDateForMeta(article.updated_at) || getValidDateForMeta(article.created_at)
    const modifiedTime = getValidDateForMeta(article.updated_at) || publishedTime

    return {
      title,
      description,
      keywords: `${article.player_name || ''}, ${article.from_club || ''}, ${article.to_club || ''}, ${article.league || ''}, football transfer, soccer news, transfer news`,
      authors: [{ name: 'Transfer Daily', url: SITE_URL }],
      creator: 'Transfer Daily',
      publisher: 'Transfer Daily',
      robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
      alternates: {
        canonical: `/${locale}/article/${slug}`,
        languages: Object.fromEntries(
          locales.map(lang => [lang, `/${lang}/article/${slug}`])
        ),
      },
      other: {
        'news_keywords': dynamicMeta.newsKeywords || '',
        'article:tag': dynamicMeta.articleTag || '',
        'article:section': dynamicMeta.articleSection || '',
        'article:author': 'Transfer Daily',
        'article:published_time': publishedTime || '',
        ...(dynamicMeta.geoRegion && { 'geo.region': dynamicMeta.geoRegion }),
        'sport': 'Football',
        'category': 'Sports'
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/${locale}/article/${slug}`,
        siteName: 'Transfer Daily',
        locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
        type: 'article',
        publishedTime: publishedTime || undefined,
        modifiedTime: modifiedTime || undefined,
        authors: ['Transfer Daily'],
        section: article.league || 'Football Transfer News',
        tags: article.tags || [article.league, 'Football Transfer', 'Soccer News'].filter((tag): tag is string => Boolean(tag)),
        images: article.image_url ? [
          {
            url: article.image_url,
            width: 1200,
            height: 630,
            alt: `${article.title} - ${article.league || 'Transfer News'}`,
            type: 'image/jpeg',
          }
        ] : [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Transfer Daily - Latest Football Transfer News',
            type: 'image/jpeg',
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@transferdaily',
        creator: '@transferdaily',
        title,
        description,
        images: article.image_url ? [article.image_url] : ['/og-image.jpg'],
      },
      category: 'Sports',
      classification: 'Football Transfer News',
    }
  } catch (error) {
    console.warn('Error generating metadata for article:', error)
    return {
      title: `Transfer Daily - Football Transfer News`,
      description: 'Latest football transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.',
      robots: { index: false, follow: false }
    }
  }
}

// Generate static params for popular articles (optional)
export async function generateStaticParams() {
  return []
}

// Server-side rendered article page
export default async function ArticlePage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params

  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  // Get translations server-side
  const dict = await getDictionary(locale)

  let article: Article | null = null;
  let relatedArticles: Transfer[] = [];

  // Fetch article first so we can use its league for related articles
  try {
    article = await getArticleBySlug(slug, locale);
  } catch (error) {
    console.error('[ArticlePage] Failed to fetch article:', error);
  }

  if (!article) {
    notFound()
  }

  // Then fetch related articles with league context
  try {
    relatedArticles = await getRelatedArticles(article.league, slug, 3, locale);
  } catch (error) {
    console.error('[ArticlePage] Failed to fetch related articles:', error);
  }

  const readingTime = calculateReadingTime(article.content || '')

  // Generate structured data for the article
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.meta_description || article.content?.substring(0, 160),
    "image": article.image_url ? [article.image_url] : [`${SITE_URL}/og-image.jpg`],
    "datePublished": article.published_at,
    "dateModified": article.published_at,
    "author": {
      "@type": "Organization",
      "name": "Transfer Daily",
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Transfer Daily",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
        "width": 200,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${locale}/article/${slug}`
    },
    "articleSection": article.league || "Football Transfer News",
    "keywords": [article.league, "Football Transfer", "Soccer News", article.player_name, article.from_club, article.to_club].filter(Boolean).join(", "),
    "inLanguage": locale,
    "isAccessibleForFree": true
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": getTranslation(dict, 'navigation.home', 'Home'),
        "item": `${SITE_URL}/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.league || "Transfer News",
        "item": `${SITE_URL}/${locale}/league/${(article.league || '').toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${SITE_URL}/${locale}/article/${slug}`
      }
    ]
  }

  try {
    return (
      <main className="min-h-screen bg-background">
        <ReadingProgressBar />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />

        {/* Content Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6 lg:gap-8 pt-4">
            {/* Main Article Content */}
            <article className="lg:col-span-7">
              {/* Breadcrumbs */}
              <ArticleBreadcrumb locale={locale} league={article.league} articleTitle={article.title} />

              {/* Hero Image */}
              <div className="mt-4">
                <ArticleHero title={article.title} imageUrl={article.image_url} league={article.league} />
              </div>
              {/* Meta: date + reading time + transfer details */}
              <ArticleMeta
                publishedAt={article.published_at}
                updatedAt={article.updated_at}
                createdAt={article.created_at}
                readingTime={readingTime}
                locale={locale}
                league={article.league}
                playerName={article.player_name}
                fromClub={article.from_club}
                toClub={article.to_club}
                transferStatus={article.transfer_status}
                transferFee={article.transfer_fee}
                dict={dict}
              />

              <ShareButtons url={`${SITE_URL}/${locale}/article/${slug}`} title={article.title} />

              {/* Article Body */}
              <div className="mt-6 md:mt-8">
                <ArticleBody content={article.content || ''} />
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className={`${typography.heading.h4} mb-4 text-foreground`}>
                    {getTranslation(dict, 'article.tags', 'Tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className={`hover:bg-secondary/80 cursor-pointer ${typography.badge}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* After-article ad */}
              <div className="mt-8">
                <AdSlot placement="article.after-article" />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
              <div className="space-y-6 pt-6">
                <Suspense fallback={<SidebarSkeleton />}>
                  <Sidebar locale={locale} dict={dict} />
                </Suspense>
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12 md:mt-16 pb-12">
              <h2 className="font-display text-lg md:text-xl uppercase tracking-tight font-bold mb-4 md:mb-6 text-foreground">
                {getTranslation(dict, 'article.relatedArticles', 'Related Articles')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 3).map((transfer) => (
                  <ArticleCard
                    key={transfer.id}
                    variant="standard"
                    title={transfer.title}
                    href={`/${locale}/article/${transfer.slug || transfer.id}`}
                    imageUrl={transfer.imageUrl}
                    league={transfer.league}
                    timeAgo={formatTimeAgo(transfer.publishedAt, (key: string) => getTranslation(dict, key))}
                    excerpt={transfer.excerpt}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    )
  } catch (renderError) {
    console.error('[ArticlePage] Error during JSX rendering:', renderError);

    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Loading Error</h1>
          <p className="text-muted-foreground">There was an error loading this article.</p>
          <p className="text-sm text-muted-foreground mt-2">Slug: {slug}</p>
        </div>
      </main>
    );
  }
}
