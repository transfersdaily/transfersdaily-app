import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { SearchPageClient } from '@/components/SearchPageClient'

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
  const dict = await getDictionary(locale)
  
  // Get current search query for dynamic metadata
  const searchQuery = resolvedSearchParams.q as string || ''
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  
  // Language-specific SEO data with search-specific keywords
  const seoData = {
    en: {
      title: searchQuery 
        ? `Search Results for "${searchQuery}" - Football Transfer News | Transfer Daily`
        : 'Search Football Transfer News - Latest Transfers & Rumors | Transfer Daily',
      description: searchQuery
        ? `Find the latest transfer news and rumors for "${searchQuery}". Search through thousands of football transfer articles from all major leagues.`
        : 'Search the latest football transfer news, confirmed deals, and breaking rumors from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.',
      keywords: searchQuery
        ? `${searchQuery} transfers, ${searchQuery} news, ${searchQuery} rumors, football transfer search`
        : 'football transfer search, soccer news search, transfer rumors search, player transfer news, football search engine'
    },
    es: {
      title: searchQuery
        ? `Resultados de Búsqueda para "${searchQuery}" - Noticias Fichajes | Transfer Daily`
        : 'Buscar Noticias de Fichajes - Últimos Traspasos y Rumores | Transfer Daily',
      description: searchQuery
        ? `Encuentra las últimas noticias de fichajes y rumores sobre "${searchQuery}". Busca entre miles de artículos de fichajes de fútbol.`
        : 'Busca las últimas noticias de fichajes de fútbol, traspasos confirmados y rumores de todas las ligas principales.',
      keywords: searchQuery
        ? `${searchQuery} fichajes, ${searchQuery} noticias, ${searchQuery} rumores, búsqueda fichajes fútbol`
        : 'búsqueda fichajes fútbol, buscar noticias fútbol, búsqueda rumores traspasos'
    },
    it: {
      title: searchQuery
        ? `Risultati di Ricerca per "${searchQuery}" - Notizie Calciomercato | Transfer Daily`
        : 'Cerca Notizie Calciomercato - Ultimi Trasferimenti | Transfer Daily',
      description: searchQuery
        ? `Trova le ultime notizie di calciomercato e rumors su "${searchQuery}". Cerca tra migliaia di articoli di trasferimenti calcistici.`
        : 'Cerca le ultime notizie di calciomercato, trasferimenti confermati e rumors dalle principali leghe.',
      keywords: searchQuery
        ? `${searchQuery} calciomercato, ${searchQuery} notizie, ${searchQuery} rumors, ricerca calciomercato`
        : 'ricerca calciomercato, cerca notizie calcio, ricerca rumors trasferimenti'
    },
    fr: {
      title: searchQuery
        ? `Résultats de Recherche pour "${searchQuery}" - Actualités Transferts | Transfer Daily`
        : 'Rechercher Actualités Transferts - Derniers Transferts | Transfer Daily',
      description: searchQuery
        ? `Trouvez les dernières actualités de transferts et rumeurs sur "${searchQuery}". Recherchez parmi des milliers d'articles de transferts.`
        : 'Recherchez les dernières actualités des transferts de football, accords confirmés et rumeurs des principales ligues.',
      keywords: searchQuery
        ? `${searchQuery} transferts, ${searchQuery} actualités, ${searchQuery} rumeurs, recherche transferts football`
        : 'recherche transferts football, chercher actualités football, recherche rumeurs transferts'
    },
    de: {
      title: searchQuery
        ? `Suchergebnisse für "${searchQuery}" - Fußball Transfer News | Transfer Daily`
        : 'Fußball Transfer News Suchen - Neueste Transfers | Transfer Daily',
      description: searchQuery
        ? `Finden Sie die neuesten Transfer-Nachrichten und Gerüchte zu "${searchQuery}". Durchsuchen Sie Tausende von Fußball-Transfer-Artikeln.`
        : 'Suchen Sie die neuesten Fußball-Transfer-Nachrichten, bestätigte Deals und Gerüchte aus den wichtigsten Ligen.',
      keywords: searchQuery
        ? `${searchQuery} Transfers, ${searchQuery} Nachrichten, ${searchQuery} Gerüchte, Fußball Transfer Suche`
        : 'Fußball Transfer Suche, Fußball Nachrichten suchen, Transfer Gerüchte Suche'
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
      canonical: locale === 'en' ? '/search' : `/${locale}/search`,
      languages: {
        'en': '/search',
        'es': '/es/search',
        'it': '/it/search',
        'fr': '/fr/search',
        'de': '/de/search',
        'x-default': '/search'
      },
    },
    
    // Enhanced Open Graph metadata
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.description,
      url: locale === 'en' ? 'https://transferdaily.com/search' : `https://transferdaily.com/${locale}/search`,
      siteName: 'Transfer Daily',
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
      type: 'website',
      images: [
        {
          url: '/og-search.jpg',
          width: 1200,
          height: 630,
          alt: 'Search Football Transfer News - Transfer Daily',
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
        url: '/og-search.jpg',
        alt: 'Search Football Transfer News - Transfer Daily',
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
    classification: 'Football Transfer Search',
  }
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Server-side rendered search page component
export default async function SearchPage({ 
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
  
  // Get search parameters
  const searchQuery = resolvedSearchParams.q as string || ''
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  const selectedStatus = resolvedSearchParams.status as string || 'all'
  const sortBy = resolvedSearchParams.sort as string || 'relevance'
  
  // Get translations server-side
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  
  // Generate comprehensive structured data
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": searchQuery ? `Search Results for "${searchQuery}"` : "Football Transfer Search",
    "description": "Search the latest football transfer news, confirmed deals, and breaking rumors",
    "url": locale === 'en' ? 'https://transferdaily.com/search' : `https://transferdaily.com/${locale}/search`,
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
          "name": t('navigation.search') || "Search",
          "item": locale === 'en' ? 'https://transferdaily.com/search' : `https://transferdaily.com/${locale}/search`
        }
      ]
    }
  }

  const searchActionStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://transferdaily.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://transferdaily.com/${locale}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Enhanced JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchActionStructuredData)
        }}
      />
      
      {/* Client-side component with server-side data */}
      <SearchPageClient 
        locale={locale}
        dict={dict}
        initialSearchQuery={searchQuery}
        initialLeague={selectedLeague}
        initialStatus={selectedStatus}
        initialSortBy={sortBy}
      />
    </main>
  )
}
