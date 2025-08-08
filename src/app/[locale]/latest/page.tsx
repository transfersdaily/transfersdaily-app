import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { type Transfer } from "@/lib/api"
import { LatestPageClient } from '@/components/LatestPageClient'
// Ad components
import { API_CONFIG } from '@/lib/config';

// Generate comprehensive metadata for SEO optimization
export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  
  // Get current page and league filter for dynamic metadata
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  
  // Language-specific SEO titles and descriptions
  const seoData = {
    en: {
      title: selectedLeague === 'all' 
        ? `Latest Football Transfer News${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`
        : `Latest ${selectedLeague} Transfer News${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? `Browse the latest football transfer news, confirmed deals, and breaking rumors from all major leagues. Updated daily with expert analysis and insider information.`
        : `Get the latest ${selectedLeague} transfer news, confirmed signings, and breaking rumors. Stay updated with all ${selectedLeague} transfer activity.`,
      keywords: selectedLeague === 'all'
        ? 'latest football transfers, transfer news today, football rumors, confirmed transfers, transfer updates, Premier League transfers, La Liga transfers, Serie A transfers'
        : `${selectedLeague} transfers, ${selectedLeague} news, ${selectedLeague} signings, ${selectedLeague} rumors, ${selectedLeague} transfer updates`
    },
    es: {
      title: selectedLeague === 'all'
        ? `Últimas Noticias de Fichajes${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily`
        : `Últimas Noticias de Fichajes ${selectedLeague}${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Explora las últimas noticias de fichajes de fútbol, traspasos confirmados y rumores de última hora de todas las ligas principales.'
        : `Obtén las últimas noticias de fichajes de ${selectedLeague}, traspasos confirmados y rumores de última hora.`,
      keywords: selectedLeague === 'all'
        ? 'últimos fichajes fútbol, noticias fichajes hoy, rumores fútbol, fichajes confirmados, actualizaciones fichajes'
        : `fichajes ${selectedLeague}, noticias ${selectedLeague}, traspasos ${selectedLeague}`
    },
    it: {
      title: selectedLeague === 'all'
        ? `Ultime Notizie Calciomercato${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily`
        : `Ultime Notizie Calciomercato ${selectedLeague}${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Scopri le ultime notizie di calciomercato, trasferimenti confermati e rumors da tutte le principali leghe.'
        : `Scopri le ultime notizie di calciomercato ${selectedLeague}, trasferimenti confermati e rumors.`,
      keywords: selectedLeague === 'all'
        ? 'ultime notizie calciomercato, mercato oggi, rumors calcio, trasferimenti confermati'
        : `calciomercato ${selectedLeague}, notizie ${selectedLeague}, trasferimenti ${selectedLeague}`
    },
    fr: {
      title: selectedLeague === 'all'
        ? `Dernières Actualités Transferts${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`
        : `Dernières Actualités Transferts ${selectedLeague}${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Découvrez les dernières actualités des transferts de football, accords confirmés et rumeurs de toutes les ligues principales.'
        : `Découvrez les dernières actualités des transferts ${selectedLeague}, accords confirmés et rumeurs.`,
      keywords: selectedLeague === 'all'
        ? 'derniers transferts football, actualités transferts aujourd\'hui, rumeurs football, transferts confirmés'
        : `transferts ${selectedLeague}, actualités ${selectedLeague}, rumeurs ${selectedLeague}`
    },
    de: {
      title: selectedLeague === 'all'
        ? `Neueste Transfer-Nachrichten${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily`
        : `Neueste ${selectedLeague} Transfer-Nachrichten${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Entdecken Sie die neuesten Fußball-Transfer-Nachrichten, bestätigte Deals und Gerüchte von allen großen Ligen.'
        : `Erhalten Sie die neuesten ${selectedLeague} Transfer-Nachrichten, bestätigte Deals und Gerüchte.`,
      keywords: selectedLeague === 'all'
        ? 'neueste Fußball Transfers, Transfer Nachrichten heute, Fußball Gerüchte, bestätigte Transfers'
        : `${selectedLeague} Transfers, ${selectedLeague} Nachrichten, ${selectedLeague} Gerüchte`
    }
  }
  
  const currentSeo = seoData[locale]
  
  return {
    title: currentSeo.title,
    description: currentSeo.description,
    keywords: currentSeo.keywords,
    authors: [{ name: 'Transfer Daily', url: 'https://transferdaily.com' }],
    creator: 'Transfer Daily',
    publisher: 'Transfer Daily',
    
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
      canonical: locale === 'en' ? '/latest' : `/${locale}/latest`,
      languages: {
        'en': '/latest',
        'es': '/es/latest',
        'it': '/it/latest',
        'fr': '/fr/latest',
        'de': '/de/latest',
        'x-default': '/latest'
      },
    },
    
    // Enhanced Open Graph metadata
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.description,
      url: locale === 'en' ? 'https://transferdaily.com/latest' : `https://transferdaily.com/${locale}/latest`,
      siteName: 'Transfer Daily',
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
      type: 'website',
      images: [
        {
          url: '/og-latest.jpg',
          width: 1200,
          height: 630,
          alt: 'Latest Football Transfer News - Transfer Daily',
          type: 'image/jpeg',
        }
      ],
    },
    
    // Enhanced Twitter metadata
    twitter: {
      card: 'summary_large_image',
      site: '@transferdaily',
      creator: '@transferdaily',
      title: currentSeo.title,
      description: currentSeo.description,
      images: {
        url: '/og-latest.jpg',
        alt: 'Latest Football Transfer News - Transfer Daily',
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
    
    // Additional metadata
    category: 'Sports',
    classification: 'Football Transfer News',
  }
}

// Server-side data fetching for latest articles
async function getLatestData(language = 'en', page = 1, league = 'all') {
  try {
    // Direct API call to backend (same pattern as homepage and league page)
    const apiUrl = `${API_CONFIG.baseUrl}/public/articles`
    const params = new URLSearchParams({
      limit: '15',
      page: page.toString(),
      status: 'published',
      language: language,
      sortBy: 'published_at',
      sortOrder: 'desc'
    })
    
    // Add league filter if not 'all'
    if (league !== 'all') {
      // Convert league slug to proper name
      const leagueNames: Record<string, string> = {
        'premier-league': 'Premier League',
        'la-liga': 'La Liga', 
        'serie-a': 'Serie A',
        'bundesliga': 'Bundesliga',
        'ligue-1': 'Ligue 1'
      }
      const leagueName = leagueNames[league] || league
      params.append('league', leagueName)
    }
    
    const response = await fetch(`${apiUrl}?${params}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.error('❌ SERVER: API request failed:', response.status, response.statusText)
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success || !data.data?.articles) {
      console.warn('⚠️ SERVER: Invalid API response structure')
      return {
        transfers: [],
        pagination: {
          page: 1,
          limit: 15,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    }
    
    // Transform articles to transfers (same as client-side)
    const transfers: Transfer[] = data.data.articles.map((article: any) => ({
      id: article.id || article.uuid,
      title: article.title || 'Untitled Article',
      excerpt: article.meta_description || article.content?.substring(0, 150) + '...' || '',
      league: article.league || 'Unknown League',
      publishedAt: article.published_at || article.created_at,
      imageUrl: article.image_url,
      slug: article.slug || generateSlug(article.title || ''),
      category: article.category,
      transferStatus: article.transfer_status,
      playerName: article.player_name,
      fromClub: article.from_club,
      toClub: article.to_club,
      transferFee: article.transfer_fee,
      author: 'TransfersDaily',
      tags: [],
    }))
    
    return {
      transfers,
      pagination: data.data.pagination || {
        page: 1,
        limit: 15,
        total: transfers.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    }
    
  } catch (error) {
    console.error('❌ SERVER: Error fetching latest data:', error)
    // Return empty data instead of throwing to prevent page crash
    return {
      transfers: [],
      pagination: {
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    }
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Server-side rendered page component
export default async function LatestPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }
  
  // Get search params for initial data
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  
  // Get translations server-side
  const dict = await getDictionary(locale)
  
  // Get initial data server-side
  const initialData = await getLatestData(locale, currentPage, selectedLeague)
  
  // Create translator for structured data
  const t = createTranslator(dict)
  
  // Generate comprehensive structured data
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": t('navigation.latest') || "Latest Transfer News",
    "description": "Browse the latest football transfer news, confirmed deals, and breaking rumors from all major leagues",
    "url": locale === 'en' ? 'https://transferdaily.com/latest' : `https://transferdaily.com/${locale}/latest`,
    "inLanguage": locale,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Transfer Daily",
      "url": "https://transferdaily.com"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": t('navigation.home') || "Home",
          "item": locale === 'en' ? 'https://transferdaily.com' : `https://transferdaily.com/${locale}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": t('navigation.latest') || "Latest",
          "item": locale === 'en' ? 'https://transferdaily.com/latest' : `https://transferdaily.com/${locale}/latest`
        }
      ]
    }
  }

  const itemListStructuredData = initialData.transfers.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Latest Football Transfer News",
    "description": "Latest football transfer news and updates",
    "numberOfItems": initialData.transfers.length,
    "itemListElement": initialData.transfers.slice(0, 10).map((transfer, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": transfer.title,
        "description": transfer.excerpt,
        "url": `https://transferdaily.com/${locale}/article/${transfer.slug}`,
        "datePublished": transfer.publishedAt,
        "author": {
          "@type": "Organization",
          "name": "Transfer Daily"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Transfer Daily",
          "logo": {
            "@type": "ImageObject",
            "url": "https://transferdaily.com/logo.png"
          }
        }
      }
    }))
  } : null

  return (
    <main className="min-h-screen bg-background">
      {/* Enhanced JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData)
        }}
      />
      {itemListStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListStructuredData)
          }}
        />
      )}
      
      {/* Ad: Leaderboard at top */}
      
      {/* Client-side component with server-side data */}
      <LatestPageClient 
        locale={locale}
        dict={dict}
        initialData={initialData}
        initialPage={currentPage}
      />
    </main>
  )
}
