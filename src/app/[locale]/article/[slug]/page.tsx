import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import { typography } from "@/lib/typography"
import { API_CONFIG } from '@/lib/config';
import { getBestDate, formatDisplayDate, getValidDateForMeta } from '@/lib/date-utils'

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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Server-side function to fetch article data with fallback
async function getArticleBySlug(slug: string, locale: string): Promise<Article | null> {
  console.log(`🚀 [getArticleBySlug] Starting fetch for slug: ${slug}, locale: ${locale}`);
  
  try {
    console.log(`🔍 [getArticleBySlug] Fetching article: ${slug} for locale: ${locale}`);
    console.log(`🔍 [getArticleBySlug] API_CONFIG.baseUrl: ${API_CONFIG.baseUrl}`);
    
    // Try direct API call first
    if (API_CONFIG.baseUrl && API_CONFIG.baseUrl !== '') {
      try {
        const apiUrl = `${API_CONFIG.baseUrl}/public/articles/${slug}`;
        console.log(`📡 [getArticleBySlug] API URL: ${apiUrl}`);
        
        console.log(`📡 [getArticleBySlug] Making fetch request...`);
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            // No Origin header for server-side requests - this prevents CORS issues
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000)
        });
        
        console.log(`📊 [getArticleBySlug] Fetch completed with status: ${response.status}`);
        
        console.log(`📊 API Response Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ API Response received:`, { 
            success: data.success, 
            hasArticle: !!data.data?.article,
            articleTitle: data.data?.article?.title 
          });
          
          if (data.success && data.data?.article) {
            return data.data.article;
          }
        }
      } catch (directApiError) {
        console.error('❌ Direct API call failed:', directApiError);
      }
    }
    
    // Fallback to local API route
    console.log('🔄 Trying local API route fallback...');
    const localApiUrl = `/api/article/${slug}`;
    console.log(`📡 Local API URL: ${localApiUrl}`);
    
    const localResponse = await fetch(localApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    console.log(`📊 Local API Response Status: ${localResponse.status} ${localResponse.statusText}`);
    
    if (!localResponse.ok) {
      console.error(`❌ Local API error: ${localResponse.status} ${localResponse.statusText} for slug: ${slug}`);
      return null;
    }
    
    const localData = await localResponse.json();
    console.log(`✅ Local API Response received:`, { 
      success: localData.success, 
      hasArticle: !!localData.data?.article,
      articleTitle: localData.data?.article?.title 
    });
    
    if (localData.success && localData.data?.article) {
      return localData.data.article;
    }
    
    console.error(`❌ Invalid API response structure:`, localData);
    return null;
    
  } catch (error) {
    console.error(`💥 Error fetching article by slug ${slug}:`, error);
    
    if (error instanceof Error) {
      console.error(`💥 Error details:`, {
        name: error.name,
        message: error.message
      });
    }
    
    // Re-throw the error for proper error handling
    throw error;
  }
}

// Server-side function to get related articles
async function getRelatedArticles(limit: number = 4, locale: string = 'en'): Promise<Transfer[]> {
  console.log(`🔄 [getRelatedArticles] Starting fetch with limit: ${limit}, locale: ${locale}`);
  
  try {
    console.log(`📡 [getRelatedArticles] Calling transfersApi.getLatest...`);
    const articles = await transfersApi.getLatest(limit, 0, locale)
    console.log(`✅ [getRelatedArticles] Successfully fetched ${articles.length} articles`);
    return articles
  } catch (error) {
    console.error('❌ [getRelatedArticles] Error fetching related articles:', error)
    console.error('❌ [getRelatedArticles] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
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
    
    // Use utility functions for date handling
    const publishedTime = getValidDateForMeta(article.published_at) || getValidDateForMeta(article.updated_at) || getValidDateForMeta(article.created_at)
    const modifiedTime = getValidDateForMeta(article.updated_at) || publishedTime
    
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
        'article:published_time': publishedTime || '',
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
  console.log(`🚀 [ArticlePage] Starting page render`);
  
  const { locale, slug } = await params
  console.log(`🚀 [ArticlePage] Params - locale: ${locale}, slug: ${slug}`);
  
  const searchParamsResolved = await searchParams
  const isPreview = searchParamsResolved.preview === 'true'
  console.log(`🚀 [ArticlePage] Preview mode: ${isPreview}`);
  
  // Validate locale
  if (!locales.includes(locale)) {
    console.error(`❌ [ArticlePage] Invalid locale: ${locale}`);
    notFound()
  }
  
  console.log(`📚 [ArticlePage] Loading dictionary for locale: ${locale}`);
  // Get translations server-side
  const dict = await getDictionary(locale)
  console.log(`✅ [ArticlePage] Dictionary loaded successfully`);
  
  let article: Article | null = null;
  let relatedArticles: Transfer[] = [];
  
  try {
    console.log(`🔄 [ArticlePage] Starting data fetching...`);
    
    // Get article and related data server-side
    const [articleResult, relatedArticlesResult] = await Promise.allSettled([
      getArticleBySlug(slug, locale),
      getRelatedArticles(4, locale)
    ]);
    
    console.log(`📊 [ArticlePage] Promise.allSettled completed`);
    console.log(`📊 [ArticlePage] Article result status: ${articleResult.status}`);
    console.log(`📊 [ArticlePage] Related articles result status: ${relatedArticlesResult.status}`);
    
    // Handle article result
    if (articleResult.status === 'fulfilled') {
      article = articleResult.value;
      console.log(`✅ [ArticlePage] Article fetched successfully: ${article?.title || 'null'}`);
    } else {
      console.error('❌ [ArticlePage] Failed to fetch article:', articleResult.reason);
      console.error('❌ [ArticlePage] Article error details:', {
        name: articleResult.reason instanceof Error ? articleResult.reason.name : 'Unknown',
        message: articleResult.reason instanceof Error ? articleResult.reason.message : String(articleResult.reason)
      });
    }
    
    // Handle related articles result
    if (relatedArticlesResult.status === 'fulfilled') {
      relatedArticles = relatedArticlesResult.value;
      console.log(`✅ [ArticlePage] Related articles fetched: ${relatedArticles.length} articles`);
    } else {
      console.error('❌ [ArticlePage] Failed to fetch related articles:', relatedArticlesResult.reason);
      console.error('❌ [ArticlePage] Related articles error details:', {
        name: relatedArticlesResult.reason instanceof Error ? relatedArticlesResult.reason.name : 'Unknown',
        message: relatedArticlesResult.reason instanceof Error ? relatedArticlesResult.reason.message : String(relatedArticlesResult.reason)
      });
      // Continue with empty array for related articles
    }
    
  } catch (error) {
    console.error('❌ [ArticlePage] Error in data fetching:', error);
    console.error('❌ [ArticlePage] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
  }
  
  console.log(`🔍 [ArticlePage] Checking if article exists: ${!!article}`);
  
  // If article not found, show 404
  if (!article) {
    console.error(`❌ [ArticlePage] Article not found for slug: ${slug}`);
    notFound()
  }
  
  console.log(`🎨 [ArticlePage] Starting render with article: ${article.title}`);
  console.log(`🎨 [ArticlePage] Article data summary:`, {
    id: article.id,
    title: article.title,
    hasContent: !!article.content,
    hasImageUrl: !!article.image_url,
    league: article.league,
    publishedAt: article.published_at
  });
  
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

  console.log(`🎨 [ArticlePage] About to render JSX...`);
  
  try {
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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Article Content - 70% */}
          <article className="lg:col-span-7 bg-card rounded-lg shadow-sm border border-border">
            <div className="p-8 sm:p-10 lg:p-12 max-w-4xl mx-auto">
              {/* Back Button */}
              {isPreview ? (
                <div className="flex items-center justify-between mb-8">
                  <Link href={`/${locale}/admin/articles/edit/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>{getTranslation(dict, 'article.backToEdit', 'Back to Edit')}</span>
                  </Link>
                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                    {getTranslation(dict, 'article.draftPreview', 'Draft Preview')}
                  </Badge>
                </div>
              ) : (
                <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{getTranslation(dict, 'common.backToHome', 'Back to Home')}</span>
                </Link>
              )}

              {/* Article Header */}
              <header className="mb-10">
                <Badge variant="outline" className={`mb-6 bg-muted text-muted-foreground border-border ${typography.badge}`}>
                  {article.league || 'Transfer News'}
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-foreground leading-tight tracking-tight">
                  {article.title}
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-8 text-base mb-8 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <time dateTime={getBestDate(article.published_at, article.updated_at, article.created_at)}>
                      {formatDisplayDate(
                        getBestDate(article.published_at, article.updated_at, article.created_at),
                        locale,
                        'Recently published'
                      )}
                    </time>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    <span>5 {getTranslation(dict, 'article.minRead', 'min read')}</span>
                  </div>
                </div>

                {/* Client-side interactive components */}
                <ArticleClientComponents 
                  article={article}
                  locale={locale}
                  dict={dict}
                />

                <Separator className="bg-border mt-8" />
              </header>

              {/* Featured Image */}
              <div className="mb-12">
                <div className="aspect-video bg-muted rounded-xl overflow-hidden border border-border shadow-sm">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={`${article.title} - ${article.league || 'Transfer News'}`}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-muted-foreground text-lg">Article Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-sm md:prose-lg lg:prose-xl max-w-none prose-headings:text-foreground prose-p:text-foreground prose-headings:font-bold prose-h1:text-2xl md:prose-h1:text-3xl lg:prose-h1:text-4xl prose-h1:mb-4 md:prose-h1:mb-6 prose-h1:mt-6 md:prose-h1:mt-8 prose-h2:text-xl md:prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:mt-8 md:prose-h2:mt-10 prose-h2:mb-4 md:prose-h2:mb-6 prose-h3:text-lg md:prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-3 md:prose-h3:mb-4 prose-h4:text-base md:prose-h4:text-lg lg:prose-h4:text-xl prose-h4:mt-4 md:prose-h4:mt-6 prose-h4:mb-2 md:prose-h4:mb-3 prose-p:text-sm md:prose-p:text-base lg:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-4 md:prose-p:mb-6 prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-foreground prose-blockquote:border-l-border prose-blockquote:border-l-4 prose-blockquote:pl-4 md:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-sm md:prose-blockquote:text-base lg:prose-blockquote:text-lg prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-ul:mb-4 md:prose-ul:mb-6 prose-ol:mb-4 md:prose-ol:mb-6 prose-li:mb-1 md:prose-li:mb-2 prose-li:text-sm md:prose-li:text-base lg:prose-li:text-lg prose-li:leading-relaxed">
                {article.content?.split('\n').map((paragraph, index) => {
                  const trimmedParagraph = paragraph.trim();
                  if (!trimmedParagraph) return null;
                  
                  // Check if it's a heading (starts with #)
                  if (trimmedParagraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-4xl font-bold text-foreground mt-8 mb-6 first:mt-0">
                        {trimmedParagraph.substring(2)}
                      </h1>
                    );
                  }
                  if (trimmedParagraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-3xl font-bold text-foreground mt-10 mb-6 first:mt-0">
                        {trimmedParagraph.substring(3)}
                      </h2>
                    );
                  }
                  if (trimmedParagraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mt-6 md:mt-8 mb-3 md:mb-4 first:mt-0">
                        {trimmedParagraph.substring(4)}
                      </h3>
                    );
                  }
                  
                  // Regular paragraph with enhanced readability
                  return (
                    <p 
                      key={index} 
                      className="text-lg leading-relaxed text-foreground mb-6 max-w-none tracking-wide"
                      style={{ 
                        lineHeight: '1.8',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {trimmedParagraph}
                    </p>
                  );
                }) || (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Content not available.
                  </p>
                )}
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

            </div>
          </article>

          {/* Sidebar - 30% */}
          <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar locale={locale} dict={dict} />
            </Suspense>
          </aside>
        </div>

        
        {/* Related Articles - Outside the main card, full width with background color */}
        <section className="mt-12 lg:col-span-7 lg:max-w-none">
          <Card className="bg-background border-none shadow-none">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 md:mb-6 text-foreground">{getTranslation(dict, 'article.relatedArticles', 'Related Articles')}</h2>
              <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted aspect-video rounded-lg mb-4 border border-border"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedArticles.slice(0, 4).map((transfer) => (
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
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
  } catch (renderError) {
    console.error('❌ [ArticlePage] Error during JSX rendering:', renderError);
    console.error('❌ [ArticlePage] Render error details:', {
      name: renderError instanceof Error ? renderError.name : 'Unknown',
      message: renderError instanceof Error ? renderError.message : String(renderError),
      stack: renderError instanceof Error ? renderError.stack : 'No stack trace'
    });
    
    // Return a simple error page instead of crashing
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
