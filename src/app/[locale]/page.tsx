import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TransferCard } from "@/components/TransferCard"
import { Sidebar } from "@/components/Sidebar"
import { TransferGridSkeleton } from "@/components/TransferCardSkeleton"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ViewAllButton } from "@/components/ViewAllButton"
import { NewsletterSection } from "@/components/NewsletterSection"
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { articlesApi, type Article } from "@/lib/api"
import { 
  Trophy, 
  TrendingUp, 
  Clock
} from "lucide-react"

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: Locale }> 
}): Promise<Metadata> {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  
  const title = locale === 'en' 
    ? 'Transfer Daily - Latest Football Transfer News & Rumors'
    : `${t('navigation.home')} - Transfer Daily`
    
  const description = t('footer.description')
  
  return {
    title,
    description,
    keywords: 'football transfers, soccer news, transfer rumors, Premier League, La Liga, Serie A, Bundesliga, Ligue 1',
    authors: [{ name: 'Transfer Daily' }],
    creator: 'Transfer Daily',
    publisher: 'Transfer Daily',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://transferdaily.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'es': '/es',
        'it': '/it',
        'fr': '/fr',
        'de': '/de',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://transferdaily.com/${locale}`,
      siteName: 'Transfer Daily',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Transfer Daily - Football Transfer News',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  }
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Server-side rendered page component
export default async function HomePage({ 
  params 
}: { 
  params: Promise<{ locale: Locale }> 
}) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }
  
  // Get translations server-side
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  
  // Get initial data server-side (real API data) with language parameter
  const initialData = await getInitialData(locale)
  
  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Transfer Daily",
            "url": `https://transferdaily.com/${locale}`,
            "description": t('footer.description'),
            "inLanguage": locale,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `https://transferdaily.com/${locale}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Content - 70% */}
          <div className="col-span-1 lg:col-span-7">
            {/* Hero Section - Featured Transfer */}
            <section className="py-8" aria-labelledby="featured-transfer">
              <h1 id="featured-transfer" className="sr-only">
                {t('common.featuredTransferNews')}
              </h1>
              
              <Suspense fallback={
                <Card className="overflow-hidden h-[500px] relative">
                  <Skeleton className="w-full h-full" />
                </Card>
              }>
                {initialData.featuredTransfer ? (
                  <Link 
                    href={`/${locale}/article/${initialData.featuredTransfer.slug}?language=${locale}`}
                    className="focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg"
                    aria-label={`${t('common.readFullArticle')}: ${initialData.featuredTransfer.title}`}
                  >
                    <Card className="overflow-hidden h-[500px] relative cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                      <div className="h-full bg-muted relative">
                        {initialData.featuredTransfer.imageUrl && (
                          <img 
                            src={initialData.featuredTransfer.imageUrl} 
                            alt={`${t('common.featuredTransferNews')}: ${initialData.featuredTransfer.title} - ${initialData.featuredTransfer.league}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                        
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                          <Badge variant="outline" className="mb-4 bg-black/60 text-white border-white/50">
                            {initialData.featuredTransfer.league?.toUpperCase()}
                          </Badge>
                          <h1 className="text-2xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
                            {initialData.featuredTransfer.title}
                          </h1>
                          <p className="text-white text-base leading-relaxed line-clamp-2 mb-6 drop-shadow-md">
                            {initialData.featuredTransfer.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-white drop-shadow-md">
                            <Clock className="h-4 w-4" />
                            <span>{formatTimeAgo(initialData.featuredTransfer.publishedAt, t)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ) : (
                  <Card className="overflow-hidden h-[500px] relative">
                    <div className="h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">{t('common.noFeaturedTransfer')}</p>
                    </div>
                  </Card>
                )}
              </Suspense>
            </section>

            {/* Latest Transfer News Section */}
            <section className="py-8" aria-labelledby="latest-transfers">
              <div className="flex justify-between items-center mb-6">
                <h2 id="latest-transfers" className="text-2xl font-bold">
                  {t('navigation.latest')} {t('navigation.transfers')}
                </h2>
                <ViewAllButton href={`/${locale}/latest`}>
                  {t('common.viewAll')}
                </ViewAllButton>
              </div>
              
              <Suspense fallback={<TransferGridSkeleton count={6} />}>
                <TransferGrid 
                  transfers={initialData.latestTransfers}
                  locale={locale}
                  dict={dict}
                />
              </Suspense>
            </section>

            {/* Browse by League Section */}
            <section className="py-8" aria-labelledby="browse-leagues">
              <div className="flex justify-between items-center mb-6">
                <h2 id="browse-leagues" className="text-2xl font-bold">
                  {t('navigation.browseByLeague')}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {initialData.leagues.map((league) => (
                  <Link
                    key={league.id}
                    href={`/${locale}/league/${league.slug}`}
                    className="group p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-200 bg-card"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 relative">
                        <img
                          src={league.logoUrl || '/placeholder-image.svg'}
                          alt={`${league.name} logo`}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm group-hover:text-red-600 transition-colors">
                          {league.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Trending Transfer News Section */}
            <section className="py-8" aria-labelledby="trending-transfers">
              <div className="flex justify-between items-center mb-6">
                <h2 id="trending-transfers" className="text-2xl font-bold">
                  {t('navigation.trending')}
                </h2>
                <ViewAllButton href={`/${locale}/trending`}>
                  {t('common.viewAll')}
                </ViewAllButton>
              </div>
              
              <Suspense fallback={<TransferGridSkeleton count={6} />}>
                <TransferGrid 
                  transfers={initialData.trendingTransfers}
                  locale={locale}
                  dict={dict}
                />
              </Suspense>
            </section>

            {/* Newsletter Section */}
            <NewsletterSection locale={locale} dict={dict} />
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
  )
}

// Server-side data fetching - fetch real articles from API
async function getInitialData(language = 'en') {
  try {
    // Static leagues for navigation - these have images and should not be touched
    const staticLeagues = [
      { id: 'premier-league', name: 'Premier League', country: 'England', slug: 'premier-league', logoUrl: '/logos/leagues/premier-league.png' },
      { id: 'la-liga', name: 'La Liga', country: 'Spain', slug: 'la-liga', logoUrl: '/logos/leagues/la-liga.png' },
      { id: 'serie-a', name: 'Serie A', country: 'Italy', slug: 'serie-a', logoUrl: '/logos/leagues/serie-a.png' },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', slug: 'bundesliga', logoUrl: '/logos/leagues/bundesliga.png' },
      { id: 'ligue-1', name: 'Ligue 1', country: 'France', slug: 'ligue-1', logoUrl: '/logos/leagues/ligue-1.png' }
    ]
    
    // Fetch real articles from the backend API
    let featuredTransfer = null
    let latestTransfers = []
    let trendingTransfers = []
    
    try {
      console.log('🔍 Fetching articles from backend API for language:', language)
      
      // Direct API call to backend with proper error handling
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod'}/public/articles`
      const params = new URLSearchParams({
        limit: '15',
        page: '1',
        status: 'published',
        language: language
      })
      
      console.log('📡 Making API request to:', `${apiUrl}?${params}`)
      
      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      console.log('📊 API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API Response received:', {
          success: data.success,
          hasData: !!data.data,
          articlesCount: data.data?.articles?.length || 0
        })
        
        if (data.success && data.data?.articles?.length > 0) {
          const articles = data.data.articles
          
          // Transform articles to the expected format
          const transformedArticles = articles.map(article => ({
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
            publishedAt: article.published_at || article.created_at,
            imageUrl: article.image_url,
            slug: article.slug || generateSlug(article.title || '')
          }))
          
          console.log('🔄 Using real data from API:', transformedArticles.length, 'articles')
          
          // Set featured transfer (first article)
          featuredTransfer = transformedArticles[0]
          
          // Set latest transfers (next 6 articles)
          latestTransfers = transformedArticles.slice(1, 7)
          
          // Set trending transfers (articles 7-12 or repeat if not enough)
          trendingTransfers = transformedArticles.slice(7, 13).length > 0 
            ? transformedArticles.slice(7, 13)
            : transformedArticles.slice(1, 7) // Fallback to latest if not enough articles
        }
      } else {
        console.error('❌ API request failed:', response.status, response.statusText)
      }
    } catch (apiError) {
      console.error('❌ Error fetching articles from API:', apiError.message)
    }
    
    const finalData = {
      featuredTransfer,
      latestTransfers,
      trendingTransfers,
      leagues: staticLeagues,
    }
    
    console.log('🎯 Final data summary:', {
      featuredTransfer: featuredTransfer ? `"${featuredTransfer.title}"` : 'None',
      latestTransfersCount: latestTransfers.length,
      trendingTransfersCount: trendingTransfers.length,
      leaguesCount: staticLeagues.length
    })
    
    return finalData
  } catch (error) {
    console.error('💥 Error in getInitialData:', error)
    return {
      featuredTransfer: null,
      latestTransfers: [],
      trendingTransfers: [],
      leagues: staticLeagues,
    }
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Server-side rendered components
function FeaturedTransferCard({ transfer, locale, dict }: any) {
  const t = createTranslator(dict)
  
  if (!transfer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('common.noFeaturedTransfer')}</p>
      </div>
    )
  }

  return (
    <article className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
            {transfer.league}
          </span>
          <span className="text-white/80 text-sm">
            {formatTimeAgo(transfer.publishedAt, t)}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {transfer.title}
        </h1>
        
        <p className="text-white/90 text-lg mb-6 leading-relaxed">
          {transfer.excerpt}
        </p>
        
        <Link 
          href={`/${locale}/article/${transfer.slug}`}
          className="inline-flex items-center bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          {t('common.readFullArticle')}
        </Link>
      </div>
    </article>
  )
}

function TransferGrid({ transfers, locale, dict }: any) {
  const t = createTranslator(dict)
  
  if (!transfers || transfers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('common.noLatestTransfers')}</p>
      </div>
    )
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
  )
}

function formatTimeAgo(dateString: string, t: any) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return t('common.justNow')
  if (diffInHours < 24) return `${diffInHours} ${t('common.hoursAgo')}`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ${t('common.daysAgo')}`
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} ${t('common.weeksAgo')}`
}
