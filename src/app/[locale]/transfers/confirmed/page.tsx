import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { type Transfer } from "@/lib/api"
import { TransferStatusPageClient } from '@/components/TransferStatusPageClient'
// Ad components
import { LeaderboardAd } from '@/components/ads';
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
  
  // Language-specific SEO data with confirmed transfer keywords
  const seoData = {
    en: {
      title: selectedLeague === 'all' 
        ? `Confirmed Football Transfers${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`
        : `Confirmed ${selectedLeague} Transfers${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? `Browse confirmed football transfers and completed deals from all major leagues. Stay updated with official signings, contract confirmations, and transfer announcements.`
        : `Get confirmed ${selectedLeague} transfers and completed deals. Official signings, contract confirmations, and transfer announcements from ${selectedLeague}.`,
      keywords: selectedLeague === 'all'
        ? 'confirmed football transfers, completed transfers today, official signings, confirmed deals, transfer confirmations, football signings confirmed'
        : `confirmed ${selectedLeague} transfers, ${selectedLeague} signings confirmed, ${selectedLeague} completed deals, official ${selectedLeague} transfers`
    },
    es: {
      title: selectedLeague === 'all'
        ? `Fichajes Confirmados${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily`
        : `Fichajes Confirmados ${selectedLeague}${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Explora los fichajes de fútbol confirmados y traspasos completados de todas las ligas principales. Mantente actualizado con fichajes oficiales.'
        : `Obtén los fichajes confirmados de ${selectedLeague} y traspasos completados. Fichajes oficiales y confirmaciones de contratos.`,
      keywords: selectedLeague === 'all'
        ? 'fichajes confirmados fútbol, traspasos completados hoy, fichajes oficiales, confirmaciones fichajes'
        : `fichajes confirmados ${selectedLeague}, ${selectedLeague} fichajes oficiales, traspasos confirmados ${selectedLeague}`
    },
    it: {
      title: selectedLeague === 'all'
        ? `Trasferimenti Confermati${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily`
        : `Trasferimenti Confermati ${selectedLeague}${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Scopri i trasferimenti di calcio confermati e gli accordi completati da tutte le principali leghe. Rimani aggiornato con i trasferimenti ufficiali.'
        : `Scopri i trasferimenti confermati ${selectedLeague} e gli accordi completati. Trasferimenti ufficiali e conferme contrattuali.`,
      keywords: selectedLeague === 'all'
        ? 'trasferimenti confermati calcio, trasferimenti completati oggi, trasferimenti ufficiali, conferme trasferimenti'
        : `trasferimenti confermati ${selectedLeague}, ${selectedLeague} trasferimenti ufficiali, accordi confermati ${selectedLeague}`
    },
    fr: {
      title: selectedLeague === 'all'
        ? `Transferts Confirmés${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`
        : `Transferts Confirmés ${selectedLeague}${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Découvrez les transferts de football confirmés et les accords conclus de toutes les ligues principales. Restez informé des transferts officiels.'
        : `Découvrez les transferts confirmés ${selectedLeague} et les accords conclus. Transferts officiels et confirmations de contrats.`,
      keywords: selectedLeague === 'all'
        ? 'transferts confirmés football, transferts conclus aujourd\'hui, transferts officiels, confirmations transferts'
        : `transferts confirmés ${selectedLeague}, ${selectedLeague} transferts officiels, accords confirmés ${selectedLeague}`
    },
    de: {
      title: selectedLeague === 'all'
        ? `Bestätigte Transfers${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily`
        : `Bestätigte ${selectedLeague} Transfers${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all'
        ? 'Entdecken Sie bestätigte Fußball-Transfers und abgeschlossene Deals aus allen großen Ligen. Bleiben Sie über offizielle Transfers informiert.'
        : `Erhalten Sie bestätigte ${selectedLeague} Transfers und abgeschlossene Deals. Offizielle Transfers und Vertragsbestätigungen.`,
      keywords: selectedLeague === 'all'
        ? 'bestätigte Fußball Transfers, abgeschlossene Transfers heute, offizielle Transfers, Transfer Bestätigungen'
        : `bestätigte ${selectedLeague} Transfers, ${selectedLeague} offizielle Transfers, bestätigte ${selectedLeague} Deals`
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
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL('https://transferdaily.com'),
    alternates: {
      canonical: locale === 'en' ? '/transfers/confirmed' : `/${locale}/transfers/confirmed`,
      languages: {
        'en': '/transfers/confirmed', 'es': '/es/transfers/confirmed', 'it': '/it/transfers/confirmed',
        'fr': '/fr/transfers/confirmed', 'de': '/de/transfers/confirmed', 'x-default': '/transfers/confirmed'
      },
    },
    openGraph: {
      title: currentSeo.title, description: currentSeo.description,
      url: locale === 'en' ? 'https://transferdaily.com/transfers/confirmed' : `https://transferdaily.com/${locale}/transfers/confirmed`,
      siteName: 'Transfer Daily', locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE',
      type: 'website', images: [{ url: '/og-confirmed-transfers.jpg', width: 1200, height: 630, alt: 'Confirmed Football Transfers - Transfer Daily' }],
    },
    twitter: {
      card: 'summary_large_image', site: '@transferdaily', creator: '@transferdaily',
      title: currentSeo.title, description: currentSeo.description,
      images: { url: '/og-confirmed-transfers.jpg', alt: 'Confirmed Football Transfers - Transfer Daily' },
    },
    robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, noimageindex: false, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    category: 'Sports', classification: 'Confirmed Football Transfers',
  }
}

// Server-side data fetching for confirmed transfers
async function getConfirmedTransfersData(language = 'en', page = 1, league = 'all') {
  try {
    const apiUrl = `${API_CONFIG.baseUrl}/public/articles`
    const params = new URLSearchParams({
      limit: '15', page: page.toString(), status: 'published', language: language,
      sortBy: 'published_at', sortOrder: 'desc', category: 'confirmed'
    })
    
    if (league !== 'all') {
      const leagueNames: Record<string, string> = {
        'premier-league': 'Premier League', 'la-liga': 'La Liga', 'serie-a': 'Serie A',
        'bundesliga': 'Bundesliga', 'ligue-1': 'Ligue 1'
      }
      params.append('league', leagueNames[league] || league)
    }
    
    const response = await fetch(`${apiUrl}?${params}`, {
      next: { revalidate: 300 }, headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)
    const data = await response.json()
    if (!data.success || !data.data?.articles) {
      return { transfers: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }
    }
    
    const transfers: Transfer[] = data.data.articles.map((article: any) => ({
      id: article.id || article.uuid, title: article.title || 'Untitled Article',
      excerpt: article.meta_description || article.content?.substring(0, 150) + '...' || '',
      league: article.league || 'Unknown League', publishedAt: article.published_at || article.created_at,
      imageUrl: article.image_url, slug: article.slug || article.title?.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-') || '',
      category: article.category, transferStatus: 'confirmed', playerName: article.player_name,
      fromClub: article.from_club, toClub: article.to_club, transferFee: article.transfer_fee,
      author: 'TransfersDaily', tags: [],
    }))
    
    return { transfers, pagination: data.data.pagination || { page: 1, limit: 15, total: transfers.length, totalPages: 1, hasNext: false, hasPrev: false } }
  } catch (error) {
    console.error('Error fetching confirmed transfers:', error)
    return { transfers: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ConfirmedTransfersPage({ params, searchParams }: { 
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  
  if (!locales.includes(locale)) notFound()
  
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  const initialData = await getConfirmedTransfersData(locale, currentPage, selectedLeague)
  
  const webPageStructuredData = {
    "@context": "https://schema.org", "@type": "WebPage", "name": "Confirmed Football Transfers",
    "description": "Browse confirmed football transfers and completed deals from all major leagues",
    "url": locale === 'en' ? 'https://transferdaily.com/transfers/confirmed' : `https://transferdaily.com/${locale}/transfers/confirmed`,
    "inLanguage": locale, "isPartOf": { "@type": "WebSite", "name": "Transfer Daily", "url": "https://transferdaily.com" },
    "breadcrumb": {
      "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t('navigation.home') || "Home", "item": locale === 'en' ? 'https://transferdaily.com' : `https://transferdaily.com/${locale}` },
        { "@type": "ListItem", "position": 2, "name": t('navigation.transfers') || "Transfers", "item": locale === 'en' ? 'https://transferdaily.com/transfers' : `https://transferdaily.com/${locale}/transfers` },
        { "@type": "ListItem", "position": 3, "name": t('transfers.confirmed') || "Confirmed", "item": locale === 'en' ? 'https://transferdaily.com/transfers/confirmed' : `https://transferdaily.com/${locale}/transfers/confirmed` }
      ]
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }} />
      
      {/* Ad: Leaderboard at top */}
      <LeaderboardAd position="top" />
      
      <TransferStatusPageClient 
        locale={locale} dict={dict} initialData={initialData} initialPage={currentPage} initialLeague={selectedLeague}
        transferType="confirmed" pageTitle={t('transfers.confirmed') || 'Confirmed Transfers'}
        pageDescription={t('transfers.confirmedDescription') || 'Browse confirmed football transfers and completed deals'}
        icon="CheckCircle"
      />
    </main>
  )
}
