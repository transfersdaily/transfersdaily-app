import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sidebar } from "@/components/Sidebar"
import { TransferCard } from "@/components/TransferCard"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { 
  Clock, 
  ArrowLeft,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { transfersApi, type Transfer } from "@/lib/api"
import { type Locale, getDictionary, locales } from "@/lib/i18n"
import { ArticleClientComponents } from './ArticleClientComponents'
import { typography, responsive } from "@/lib/typography"

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
  created_at: string
  image_url?: string
  slug: string
  tags?: string[]
}

interface ArticlePageProps {
  params: Promise<{ locale: Locale; slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Server-side function to fetch article data directly from API
async function getArticleBySlug(slug: string, locale: string): Promise<Article | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod'
    const response = await fetch(`${apiUrl}/public/articles/${slug}?language=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000)
    })
    
    if (!response.ok) {
      console.warn(`Article API error: ${response.status} ${response.statusText} for slug: ${slug}`)
      return null
    }
    
    const data = await response.json()
    
    if (data.success && data.data?.article) {
      return data.data.article
    }
    
    return null
  } catch (error) {
    console.warn(`Error fetching article by slug ${slug}:`, error)
    return null
  }
}

// Server-side function to get related articles
async function getRelatedArticles(limit: number = 3): Promise<Transfer[]> {
  try {
    const articles = await transfersApi.getLatest(limit)
    return articles
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

// Generate comprehensive metadata for article pages
export async function generateMetadata({ 
  params,
  searchParams 
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const searchParamsResolved = await searchParams
  const isPreview = searchParamsResolved.preview === 'true'
  
  // Get translations
  const dict = await getDictionary(locale)
  
  try {
    // Fetch article data for metadata
    const article = await getArticleBySlug(slug, locale)
    
    if (!article) {
      // Return default metadata when article is not found or API fails
      return {
        title: `Transfer Daily - Football Transfer News`,
        description: 'Latest football transfer news, rumors, and confirmed deals from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.',
        robots: { index: false, follow: false }
      }
    }

    // Helper function to generate dynamic meta tags based on article content
    const getDynamicMetaTags = (article: Article) => {
      // Dynamic news keywords based on article content
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
      
      // Dynamic geo region based on league
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
    const publishedTime = article.published_at
    const modifiedTime = article.published_at // Backend doesn't have updated_at in this response
    
    return {
      title,
      description,
      keywords: `${article.player_name || ''}, ${article.from_club || ''}, ${article.to_club || ''}, ${article.league || ''}, football transfer, soccer news, transfer news`,
      authors: [{ name: 'Transfer Daily', url: 'https://transferdaily.com' }],
      creator: 'Transfer Daily',
      publisher: 'Transfer Daily',
      
      // Prevent indexing of preview pages
      robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
      
      // Canonical URL
      alternates: {
        canonical: `/${locale}/article/${slug}`,
        languages: Object.fromEntries(
          locales.map(lang => [lang, `/${lang}/article/${slug}`])
        ),
      },
      
      // Enhanced with dynamic meta tags
      other: {
        'news_keywords': dynamicMeta.newsKeywords || '',
        'article:tag': dynamicMeta.articleTag || '',
        'article:section': dynamicMeta.articleSection || '',
        'article:author': 'Transfer Daily',
        'article:published_time': publishedTime,
        ...(dynamicMeta.geoRegion && { 'geo.region': dynamicMeta.geoRegion }),
        'sport': 'Football',
        'category': 'Sports'
      },
      
      // Open Graph metadata
      openGraph: {
        title,
        description,
        url: `https://transferdaily.com/${locale}/article/${slug}`,
        siteName: 'Transfer Daily',
        locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
        type: 'article',
        publishedTime,
        modifiedTime,
        authors: ['Transfer Daily'],
        section: article.league || 'Football Transfer News',
        tags: article.tags || [article.league, 'Football Transfer', 'Soccer News'].filter(Boolean),
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
      
      // Twitter metadata
      twitter: {
        card: 'summary_large_image',
        site: '@transferdaily',
        creator: '@transferdaily',
        title,
        description,
        images: article.image_url ? [article.image_url] : ['/og-image.jpg'],
      },
      
      // Additional metadata
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
  // You can implement this to pre-generate popular articles
  // For now, we'll let them be generated on-demand
  return []
}

// Server-side rendered article page
export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { locale, slug } = await params
  const searchParamsResolved = await searchParams
  const isPreview = searchParamsResolved.preview === 'true'
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }
  
  // Get translations server-side
  const dict = await getDictionary(locale)
  
  // Get article and related data server-side
  const [article, relatedArticles] = await Promise.all([
    getArticleBySlug(slug, locale),
    getRelatedArticles(3)
  ])
  
  // If article not found, show 404
  if (!article) {
    notFound()
  }
  
  // Generate structured data for the article
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.meta_description || article.content?.substring(0, 160),
    "image": article.image_url ? [article.image_url] : ["https://transferdaily.com/og-image.jpg"],
    "datePublished": article.published_at,
    "dateModified": article.published_at,
    "author": {
      "@type": "Organization",
      "name": "Transfer Daily",
      "url": "https://transferdaily.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Transfer Daily",
      "logo": {
        "@type": "ImageObject",
        "url": "https://transferdaily.com/logo.png",
        "width": 200,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://transferdaily.com/${locale}/article/${slug}`
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
        "item": `https://transferdaily.com/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.league || "Transfer News",
        "item": `https://transferdaily.com/${locale}/league/${(article.league || '').toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://transferdaily.com/${locale}/article/${slug}`
      }
    ]
  }

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return getTranslation(dict, 'common.justNow', 'Just now')
    if (diffInHours < 24) return `${diffInHours} ${getTranslation(dict, 'common.hoursAgo', 'hours ago')}`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ${getTranslation(dict, 'common.daysAgo', 'days ago')}`
  }

  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Article Content - 70% */}
          <article className="lg:col-span-7 bg-card">
            <div className="py-8">
              {/* Back Button */}
              {isPreview ? (
                <div className="flex items-center justify-between mb-6">
                  <Link href={`/${locale}/admin/articles/edit/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>{getTranslation(dict, 'article.backToEdit', 'Back to Edit')}</span>
                  </Link>
                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                    {getTranslation(dict, 'article.draftPreview', 'Draft Preview')}
                  </Badge>
                </div>
              ) : (
                <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{getTranslation(dict, 'common.backToHome', 'Back to Home')}</span>
                </Link>
              )}

              {/* Article Header */}
              <header className="mb-8">
                <Badge variant="outline" className={`mb-4 bg-muted text-muted-foreground border-border ${typography.badge}`}>
                  {article.league || 'Transfer News'}
                </Badge>
                
                <h1 className={`${typography.article.title} mb-6 text-foreground`}>
                  {article.title}
                </h1>

                {/* Article Meta */}
                <div className={`flex flex-wrap items-center gap-6 ${typography.article.meta} mb-6`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={article.published_at}>
                      {new Date(article.published_at).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>5 {getTranslation(dict, 'article.minRead', 'min read')}</span>
                  </div>
                </div>

                {/* Client-side interactive components */}
                <ArticleClientComponents 
                  article={article}
                  locale={locale}
                  dict={dict}
                />

                <Separator />
              </header>

              {/* Featured Image */}
              <div className="mb-8">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={`${article.title} - ${article.league || 'Transfer News'}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-muted-foreground">Article Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4">
                {article.content?.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index} className={`mb-4 ${typography.article.body} text-foreground`}>{paragraph}</p>
                )) || <p className={`${typography.body.base} text-muted-foreground`}>Content not available.</p>}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h3 className={`${typography.heading.h4} mb-4 text-foreground`}>{getTranslation(dict, 'article.tags', 'Tags')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className={`hover:bg-secondary/80 cursor-pointer ${typography.badge}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Articles */}
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{getTranslation(dict, 'article.relatedArticles', 'Related Articles')}</h2>
                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted aspect-video rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  ))}
                </div>}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedArticles.map((transfer) => (
                      <TransferCard
                        key={transfer.id}
                        title={transfer.title}
                        excerpt={transfer.excerpt}
                        primaryBadge={transfer.league}
                        timeAgo={formatTimeAgo(transfer.publishedAt)}
                        href={`/${locale}/article/${transfer.slug || transfer.id}`}
                        imageUrl={transfer.imageUrl}
                        imageAlt={`${transfer.title} - ${transfer.league}`}
                      />
                    ))}
                  </div>
                </Suspense>
              </section>
            </div>
          </article>

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
