import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { LeaguePageClient } from '@/components/LeaguePageClient'
// Ad components
import { LeaderboardAd } from '@/components/ads';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Server-side data fetching for league articles
async function getLeagueData(leagueSlug: string, language = 'en') {
  // Convert slug to proper league name
  const leagueNames: Record<string, string> = {
    'premier-league': 'Premier League',
    'la-liga': 'La Liga', 
    'serie-a': 'Serie A',
    'bundesliga': 'Bundesliga',
    'ligue-1': 'Ligue 1'
  }
  
  const leagueName = leagueNames[leagueSlug] || leagueSlug
  
  try {
    // Direct API call to backend (same as homepage)
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod'}/public/articles`
    const params = new URLSearchParams({
      limit: '12',
      page: '1',
      status: 'published',
      league: leagueName,
      language: language
    })
    
    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(15000)
    })
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.success && data.data?.articles?.length > 0) {
        const articles = data.data.articles
        
        // Transform articles to the expected format (same as homepage)
        const transformedArticles = articles.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.content ? article.content.substring(0, 200) + '...' : article.meta_description || '',
          content: article.content,
          league: article.league || leagueName,
          transferValue: article.transfer_fee,
          playerName: article.player_name,
          fromClub: article.from_club,
          toClub: article.to_club,
          status: article.transfer_status || 'rumor',
          publishedAt: article.published_at || article.created_at,
          imageUrl: article.image_url,
          slug: article.slug || generateSlug(article.title || '')
        }))
        
        return {
          transfers: transformedArticles,
          leagueName
        }
      }
    } else {
      console.error('❌ SERVER: API request failed:', response.status, response.statusText)
    }
    
    return {
      transfers: [],
      leagueName
    }
  } catch (error) {
    console.error('❌ SERVER: Error loading league transfers:', error)
    return {
      transfers: [],
      leagueName: leagueNames[leagueSlug] || leagueSlug
    }
  }
}

// Generate comprehensive metadata for SEO optimization
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: Locale; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params
  
  const leagueNames: { [key: string]: string } = {
    'premier-league': 'Premier League',
    'la-liga': 'La Liga',
    'serie-a': 'Serie A',
    'bundesliga': 'Bundesliga',
    'ligue-1': 'Ligue 1'
  }
  
  const leagueName = leagueNames[slug] || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  // Language-specific SEO data with league-specific keywords
  const seoData = {
    en: {
      'premier-league': {
        title: 'Premier League Transfer News - Latest EPL Signings & Rumors | Transfer Daily',
        description: 'Get the latest Premier League transfer news, confirmed EPL signings, and breaking rumors from Manchester United, Liverpool, Arsenal, Chelsea, Manchester City, and all 20 clubs.',
        keywords: 'Premier League transfers, EPL signings, English football transfers, Manchester United transfers, Liverpool signings, Arsenal deals, Chelsea transfers, Manchester City signings, Premier League rumors'
      },
      'la-liga': {
        title: 'La Liga Transfer News - Latest Spanish Football Signings | Transfer Daily',
        description: 'Discover the latest La Liga transfer news, confirmed Spanish football signings, and breaking rumors from Real Madrid, Barcelona, Atletico Madrid, and all La Liga clubs.',
        keywords: 'La Liga transfers, Spanish football signings, Real Madrid transfers, Barcelona signings, Atletico Madrid deals, La Liga rumors, Spanish league transfers'
      },
      'serie-a': {
        title: 'Serie A Transfer News - Latest Italian Football Signings | Transfer Daily',
        description: 'Follow the latest Serie A transfer news, confirmed Italian football signings, and breaking rumors from Juventus, AC Milan, Inter Milan, and all Serie A clubs.',
        keywords: 'Serie A transfers, Italian football signings, Juventus transfers, AC Milan signings, Inter Milan deals, Serie A rumors, Italian league transfers'
      },
      'bundesliga': {
        title: 'Bundesliga Transfer News - Latest German Football Signings | Transfer Daily',
        description: 'Track the latest Bundesliga transfer news, confirmed German football signings, and breaking rumors from Bayern Munich, Borussia Dortmund, and all Bundesliga clubs.',
        keywords: 'Bundesliga transfers, German football signings, Bayern Munich transfers, Borussia Dortmund signings, Bundesliga rumors, German league transfers'
      },
      'ligue-1': {
        title: 'Ligue 1 Transfer News - Latest French Football Signings | Transfer Daily',
        description: 'Stay updated with the latest Ligue 1 transfer news, confirmed French football signings, and breaking rumors from PSG, Marseille, and all Ligue 1 clubs.',
        keywords: 'Ligue 1 transfers, French football signings, PSG transfers, Marseille signings, Ligue 1 rumors, French league transfers'
      }
    },
    es: {
      'premier-league': {
        title: 'Noticias Fichajes Premier League - Últimos Traspasos EPL | Transfer Daily',
        description: 'Obtén las últimas noticias de fichajes de la Premier League, traspasos confirmados y rumores de Manchester United, Liverpool, Arsenal, Chelsea y todos los clubes.',
        keywords: 'fichajes Premier League, traspasos EPL, fichajes fútbol inglés, Manchester United fichajes, Liverpool traspasos'
      },
      'la-liga': {
        title: 'Noticias Fichajes La Liga - Últimos Traspasos Fútbol Español | Transfer Daily',
        description: 'Descubre las últimas noticias de fichajes de La Liga, traspasos confirmados y rumores del Real Madrid, Barcelona, Atlético Madrid y todos los clubes.',
        keywords: 'fichajes La Liga, traspasos fútbol español, Real Madrid fichajes, Barcelona traspasos, Atlético Madrid fichajes'
      },
      'serie-a': {
        title: 'Noticias Fichajes Serie A - Últimos Traspasos Fútbol Italiano | Transfer Daily',
        description: 'Sigue las últimas noticias de fichajes de la Serie A, traspasos confirmados y rumores de Juventus, AC Milan, Inter Milan y todos los clubes.',
        keywords: 'fichajes Serie A, traspasos fútbol italiano, Juventus fichajes, AC Milan traspasos, Inter Milan fichajes'
      },
      'bundesliga': {
        title: 'Noticias Fichajes Bundesliga - Últimos Traspasos Fútbol Alemán | Transfer Daily',
        description: 'Rastrea las últimas noticias de fichajes de la Bundesliga, traspasos confirmados y rumores del Bayern Munich, Borussia Dortmund y todos los clubes.',
        keywords: 'fichajes Bundesliga, traspasos fútbol alemán, Bayern Munich fichajes, Borussia Dortmund traspasos'
      },
      'ligue-1': {
        title: 'Noticias Fichajes Ligue 1 - Últimos Traspasos Fútbol Francés | Transfer Daily',
        description: 'Mantente actualizado con las últimas noticias de fichajes de la Ligue 1, traspasos confirmados y rumores del PSG, Marseille y todos los clubes.',
        keywords: 'fichajes Ligue 1, traspasos fútbol francés, PSG fichajes, Marseille traspasos'
      }
    },
    it: {
      'premier-league': {
        title: 'Notizie Calciomercato Premier League - Ultimi Trasferimenti EPL | Transfer Daily',
        description: 'Scopri le ultime notizie di calciomercato della Premier League, trasferimenti confermati e rumors da Manchester United, Liverpool, Arsenal, Chelsea e tutti i club.',
        keywords: 'calciomercato Premier League, trasferimenti EPL, calcio inglese, Manchester United mercato, Liverpool trasferimenti'
      },
      'la-liga': {
        title: 'Notizie Calciomercato La Liga - Ultimi Trasferimenti Spagnoli | Transfer Daily',
        description: 'Segui le ultime notizie di calciomercato della La Liga, trasferimenti confermati e rumors da Real Madrid, Barcelona, Atletico Madrid e tutti i club.',
        keywords: 'calciomercato La Liga, trasferimenti spagnoli, Real Madrid mercato, Barcelona trasferimenti, Atletico Madrid mercato'
      },
      'serie-a': {
        title: 'Notizie Calciomercato Serie A - Ultimi Trasferimenti Italiani | Transfer Daily',
        description: 'Rimani aggiornato sulle ultime notizie di calciomercato della Serie A, trasferimenti confermati e rumors da Juventus, AC Milan, Inter Milan e tutti i club.',
        keywords: 'calciomercato Serie A, trasferimenti italiani, Juventus mercato, AC Milan trasferimenti, Inter Milan mercato'
      },
      'bundesliga': {
        title: 'Notizie Calciomercato Bundesliga - Ultimi Trasferimenti Tedeschi | Transfer Daily',
        description: 'Traccia le ultime notizie di calciomercato della Bundesliga, trasferimenti confermati e rumors da Bayern Munich, Borussia Dortmund e tutti i club.',
        keywords: 'calciomercato Bundesliga, trasferimenti tedeschi, Bayern Munich mercato, Borussia Dortmund trasferimenti'
      },
      'ligue-1': {
        title: 'Notizie Calciomercato Ligue 1 - Ultimi Trasferimenti Francesi | Transfer Daily',
        description: 'Resta aggiornato sulle ultime notizie di calciomercato della Ligue 1, trasferimenti confermati e rumors da PSG, Marseille e tutti i club.',
        keywords: 'calciomercato Ligue 1, trasferimenti francesi, PSG mercato, Marseille trasferimenti'
      }
    },
    fr: {
      'premier-league': {
        title: 'Actualités Transferts Premier League - Derniers Transferts EPL | Transfer Daily',
        description: 'Découvrez les dernières actualités des transferts de Premier League, transferts confirmés et rumeurs de Manchester United, Liverpool, Arsenal, Chelsea et tous les clubs.',
        keywords: 'transferts Premier League, transferts EPL, football anglais, Manchester United transferts, Liverpool transferts'
      },
      'la-liga': {
        title: 'Actualités Transferts La Liga - Derniers Transferts Espagnols | Transfer Daily',
        description: 'Suivez les dernières actualités des transferts de La Liga, transferts confirmés et rumeurs du Real Madrid, Barcelona, Atletico Madrid et tous les clubs.',
        keywords: 'transferts La Liga, transferts espagnols, Real Madrid transferts, Barcelona transferts, Atletico Madrid transferts'
      },
      'serie-a': {
        title: 'Actualités Transferts Serie A - Derniers Transferts Italiens | Transfer Daily',
        description: 'Restez informé des dernières actualités des transferts de Serie A, transferts confirmés et rumeurs de Juventus, AC Milan, Inter Milan et tous les clubs.',
        keywords: 'transferts Serie A, transferts italiens, Juventus transferts, AC Milan transferts, Inter Milan transferts'
      },
      'bundesliga': {
        title: 'Actualités Transferts Bundesliga - Derniers Transferts Allemands | Transfer Daily',
        description: 'Suivez les dernières actualités des transferts de Bundesliga, transferts confirmés et rumeurs du Bayern Munich, Borussia Dortmund et tous les clubs.',
        keywords: 'transferts Bundesliga, transferts allemands, Bayern Munich transferts, Borussia Dortmund transferts'
      },
      'ligue-1': {
        title: 'Actualités Transferts Ligue 1 - Derniers Transferts Français | Transfer Daily',
        description: 'Restez à jour avec les dernières actualités des transferts de Ligue 1, transferts confirmés et rumeurs du PSG, Marseille et tous les clubs.',
        keywords: 'transferts Ligue 1, transferts français, PSG transferts, Marseille transferts'
      }
    },
    de: {
      'premier-league': {
        title: 'Premier League Transfer News - Neueste EPL Transfers | Transfer Daily',
        description: 'Erhalten Sie die neuesten Premier League Transfer-Nachrichten, bestätigte EPL-Transfers und Gerüchte von Manchester United, Liverpool, Arsenal, Chelsea und allen Vereinen.',
        keywords: 'Premier League Transfers, EPL Transfers, englischer Fußball, Manchester United Transfers, Liverpool Transfers'
      },
      'la-liga': {
        title: 'La Liga Transfer News - Neueste Spanische Fußball Transfers | Transfer Daily',
        description: 'Entdecken Sie die neuesten La Liga Transfer-Nachrichten, bestätigte spanische Fußball-Transfers und Gerüchte von Real Madrid, Barcelona, Atletico Madrid und allen Vereinen.',
        keywords: 'La Liga Transfers, spanische Fußball Transfers, Real Madrid Transfers, Barcelona Transfers, Atletico Madrid Transfers'
      },
      'serie-a': {
        title: 'Serie A Transfer News - Neueste Italienische Fußball Transfers | Transfer Daily',
        description: 'Verfolgen Sie die neuesten Serie A Transfer-Nachrichten, bestätigte italienische Fußball-Transfers und Gerüchte von Juventus, AC Milan, Inter Milan und allen Vereinen.',
        keywords: 'Serie A Transfers, italienische Fußball Transfers, Juventus Transfers, AC Milan Transfers, Inter Milan Transfers'
      },
      'bundesliga': {
        title: 'Bundesliga Transfer News - Neueste Deutsche Fußball Transfers | Transfer Daily',
        description: 'Verfolgen Sie die neuesten Bundesliga Transfer-Nachrichten, bestätigte deutsche Fußball-Transfers und Gerüchte von Bayern München, Borussia Dortmund und allen Vereinen.',
        keywords: 'Bundesliga Transfers, deutsche Fußball Transfers, Bayern München Transfers, Borussia Dortmund Transfers'
      },
      'ligue-1': {
        title: 'Ligue 1 Transfer News - Neueste Französische Fußball Transfers | Transfer Daily',
        description: 'Bleiben Sie auf dem Laufenden mit den neuesten Ligue 1 Transfer-Nachrichten, bestätigten französischen Fußball-Transfers und Gerüchten von PSG, Marseille und allen Vereinen.',
        keywords: 'Ligue 1 Transfers, französische Fußball Transfers, PSG Transfers, Marseille Transfers'
      }
    }
  }
  
  const currentSeo = (seoData as any)[locale]?.[slug] || {
    title: `${leagueName} Transfer News | Transfer Daily`,
    description: `Latest ${leagueName} transfer news, confirmed signings, and breaking rumors.`,
    keywords: `${leagueName} transfers, ${leagueName} signings, ${leagueName} news`
  }
  
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
      canonical: locale === 'en' ? `/league/${slug}` : `/${locale}/league/${slug}`,
      languages: {
        'en': `/league/${slug}`,
        'es': `/es/league/${slug}`,
        'it': `/it/league/${slug}`,
        'fr': `/fr/league/${slug}`,
        'de': `/de/league/${slug}`,
        'x-default': `/league/${slug}`
      },
    },
    
    // Enhanced Open Graph metadata
    openGraph: {
      title: currentSeo.title,
      description: currentSeo.description,
      url: locale === 'en' ? `https://transferdaily.com/league/${slug}` : `https://transferdaily.com/${locale}/league/${slug}`,
      siteName: 'Transfer Daily',
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
      type: 'website',
      images: [
        {
          url: `/og-${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${leagueName} Transfer News - Transfer Daily`,
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
        url: `/og-${slug}.jpg`,
        alt: `${leagueName} Transfer News - Transfer Daily`,
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
    classification: `${leagueName} Transfer News`,
  }
}

// Main component - Server-side rendered like homepage
export default async function LeaguePage({ 
  params 
}: { 
  params: Promise<{ locale: Locale; slug: string }> 
}) {
  const { locale, slug } = await params
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }
  
  // Get translations server-side
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  
  // Get league data server-side (same pattern as homepage)
  const { transfers, leagueName } = await getLeagueData(slug, locale)
  
  // Generate comprehensive structured data
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${leagueName} Transfer News`,
    "description": `Latest ${leagueName} transfer news, confirmed signings, and breaking rumors`,
    "url": locale === 'en' ? `https://transferdaily.com/league/${slug}` : `https://transferdaily.com/${locale}/league/${slug}`,
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
          "name": t('navigation.leagues') || "Leagues",
          "item": locale === 'en' ? 'https://transferdaily.com/leagues' : `https://transferdaily.com/${locale}/leagues`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": leagueName,
          "item": locale === 'en' ? `https://transferdaily.com/league/${slug}` : `https://transferdaily.com/${locale}/league/${slug}`
        }
      ]
    }
  }

  const sportsOrganizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": leagueName,
    "sport": "Football",
    "url": locale === 'en' ? `https://transferdaily.com/league/${slug}` : `https://transferdaily.com/${locale}/league/${slug}`,
    "description": `${leagueName} is one of the world's premier football leagues, featuring top clubs and players from around the globe.`,
    "sameAs": [
      // Add official league social media URLs based on league
      ...(slug === 'premier-league' ? [
        "https://twitter.com/premierleague",
        "https://www.facebook.com/PremierLeague",
        "https://www.instagram.com/premierleague"
      ] : []),
      ...(slug === 'la-liga' ? [
        "https://twitter.com/LaLiga",
        "https://www.facebook.com/LaLiga",
        "https://www.instagram.com/laliga"
      ] : []),
      ...(slug === 'serie-a' ? [
        "https://twitter.com/SerieA",
        "https://www.facebook.com/SerieA",
        "https://www.instagram.com/seriea"
      ] : []),
      ...(slug === 'bundesliga' ? [
        "https://twitter.com/Bundesliga_EN",
        "https://www.facebook.com/Bundesliga",
        "https://www.instagram.com/bundesliga"
      ] : []),
      ...(slug === 'ligue-1' ? [
        "https://twitter.com/Ligue1",
        "https://www.facebook.com/Ligue1",
        "https://www.instagram.com/ligue1"
      ] : [])
    ]
  }

  const itemListStructuredData = transfers.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${leagueName} Transfer News`,
    "description": `Latest transfer news and updates from ${leagueName}`,
    "numberOfItems": transfers.length,
    "itemListElement": transfers.slice(0, 10).map((transfer: any, index: number) => ({
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
        },
        "about": {
          "@type": "SportsOrganization",
          "name": leagueName
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sportsOrganizationStructuredData)
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
      <LeaderboardAd position="top" />
      
      {/* Client-side component with server-side data */}
      <LeaguePageClient 
        locale={locale}
        dict={dict}
        initialData={{
          transfers,
          pagination: {
            page: 1,
            limit: 12,
            total: transfers.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        }}
        initialPage={1}
        leagueName={leagueName}
        leagueSlug={slug}
      />
    </main>
  )
}
