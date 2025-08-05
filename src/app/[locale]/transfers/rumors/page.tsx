import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { type Transfer } from "@/lib/api"
import { TransferStatusPageClient } from '@/components/TransferStatusPageClient'
// Ad components
import { LeaderboardAd } from '@/components/ads';

export async function generateMetadata({ params, searchParams }: { 
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  
  const seoData = {
    en: {
      title: selectedLeague === 'all' ? `Football Transfer Rumors${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily` : `${selectedLeague} Transfer Rumors${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all' ? `Latest football transfer rumors, breaking news, and speculation from all major leagues. Get insider information, transfer gossip, and potential deals before they happen.` : `Latest ${selectedLeague} transfer rumors, breaking news, and speculation. Get insider ${selectedLeague} transfer gossip and potential deals.`,
      keywords: selectedLeague === 'all' ? 'football transfer rumors, soccer transfer gossip, transfer speculation, breaking transfer news, transfer rumors today, football rumors latest, transfer window rumors' : `${selectedLeague} transfer rumors, ${selectedLeague} transfer gossip, ${selectedLeague} speculation, ${selectedLeague} rumors today, ${selectedLeague} breaking news`
    },
    es: { title: selectedLeague === 'all' ? `Rumores de Fichajes${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily` : `Rumores Fichajes ${selectedLeague}${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Últimos rumores de fichajes de fútbol, noticias de última hora y especulaciones de todas las ligas principales. Información privilegiada y rumores de fichajes.' : `Últimos rumores de fichajes de ${selectedLeague}, noticias de última hora y especulaciones. Información privilegiada de ${selectedLeague}.`, keywords: selectedLeague === 'all' ? 'rumores fichajes fútbol, rumores traspasos, especulaciones fichajes, noticias fichajes última hora, rumores fichajes hoy' : `rumores fichajes ${selectedLeague}, ${selectedLeague} rumores traspasos, especulaciones ${selectedLeague}, rumores ${selectedLeague} hoy` },
    it: { title: selectedLeague === 'all' ? `Rumors Calciomercato${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily` : `Rumors Calciomercato ${selectedLeague}${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Ultimi rumors di calciomercato, notizie dell\'ultima ora e speculazioni da tutte le principali leghe. Informazioni privilegiate e voci di mercato.' : `Ultimi rumors di calciomercato ${selectedLeague}, notizie dell\'ultima ora e speculazioni. Informazioni privilegiate ${selectedLeague}.`, keywords: selectedLeague === 'all' ? 'rumors calciomercato, voci mercato calcio, speculazioni trasferimenti, notizie mercato ultima ora, rumors calciomercato oggi' : `rumors calciomercato ${selectedLeague}, ${selectedLeague} voci mercato, speculazioni ${selectedLeague}, rumors ${selectedLeague} oggi` },
    fr: { title: selectedLeague === 'all' ? `Rumeurs Transferts${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily` : `Rumeurs Transferts ${selectedLeague}${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Dernières rumeurs de transferts de football, actualités de dernière minute et spéculations de toutes les ligues principales. Informations privilégiées.' : `Dernières rumeurs de transferts ${selectedLeague}, actualités de dernière minute et spéculations. Informations privilégiées ${selectedLeague}.`, keywords: selectedLeague === 'all' ? 'rumeurs transferts football, rumeurs mercato, spéculations transferts, actualités transferts dernière minute, rumeurs transferts aujourd\'hui' : `rumeurs transferts ${selectedLeague}, ${selectedLeague} rumeurs mercato, spéculations ${selectedLeague}, rumeurs ${selectedLeague} aujourd\'hui` },
    de: { title: selectedLeague === 'all' ? `Transfer Gerüchte${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily` : `${selectedLeague} Transfer Gerüchte${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Neueste Fußball-Transfer-Gerüchte, aktuelle Nachrichten und Spekulationen aus allen großen Ligen. Insider-Informationen und Transfer-Gerüchte.' : `Neueste ${selectedLeague} Transfer-Gerüchte, aktuelle Nachrichten und Spekulationen. Insider-Informationen ${selectedLeague}.`, keywords: selectedLeague === 'all' ? 'Fußball Transfer Gerüchte, Transfer Spekulationen, Transfer Nachrichten aktuell, Transfer Gerüchte heute, Fußball Gerüchte neueste' : `${selectedLeague} Transfer Gerüchte, ${selectedLeague} Transfer Spekulationen, ${selectedLeague} Gerüchte heute, ${selectedLeague} aktuelle Nachrichten` }
  }
  
  const currentSeo = seoData[locale]
  return {
    title: currentSeo.title, description: currentSeo.description, keywords: currentSeo.keywords,
    authors: [{ name: 'Transfer Daily', url: 'https://transferdaily.com' }], creator: 'Transfer Daily', publisher: 'Transfer Daily',
    formatDetection: { email: false, address: false, telephone: false }, metadataBase: new URL('https://transferdaily.com'),
    alternates: { canonical: locale === 'en' ? '/transfers/rumors' : `/${locale}/transfers/rumors`, languages: { 'en': '/transfers/rumors', 'es': '/es/transfers/rumors', 'it': '/it/transfers/rumors', 'fr': '/fr/transfers/rumors', 'de': '/de/transfers/rumors', 'x-default': '/transfers/rumors' } },
    openGraph: { title: currentSeo.title, description: currentSeo.description, url: locale === 'en' ? 'https://transferdaily.com/transfers/rumors' : `https://transferdaily.com/${locale}/transfers/rumors`, siteName: 'Transfer Daily', locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE', type: 'website', images: [{ url: '/og-transfer-rumors.jpg', width: 1200, height: 630, alt: 'Football Transfer Rumors - Transfer Daily' }] },
    twitter: { card: 'summary_large_image', site: '@transferdaily', creator: '@transferdaily', title: currentSeo.title, description: currentSeo.description, images: { url: '/og-transfer-rumors.jpg', alt: 'Football Transfer Rumors - Transfer Daily' } },
    robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, noimageindex: false, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    category: 'Sports', classification: 'Football Transfer Rumors'
  }
}

async function getTransferRumorsData(language = 'en', page = 1, league = 'all') {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod'}/public/articles`
    const params = new URLSearchParams({ limit: '15', page: page.toString(), status: 'published', language: language, sortBy: 'published_at', sortOrder: 'desc', category: 'rumor' })
    if (league !== 'all') {
      const leagueNames: Record<string, string> = { 'premier-league': 'Premier League', 'la-liga': 'La Liga', 'serie-a': 'Serie A', 'bundesliga': 'Bundesliga', 'ligue-1': 'Ligue 1' }
      params.append('league', leagueNames[league] || league)
    }
    const response = await fetch(`${apiUrl}?${params}`, { next: { revalidate: 180 }, headers: { 'Content-Type': 'application/json' } })
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)
    const data = await response.json()
    if (!data.success || !data.data?.articles) return { transfers: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }
    const transfers: Transfer[] = data.data.articles.map((article: any) => ({ id: article.id || article.uuid, title: article.title || 'Untitled Article', excerpt: article.meta_description || article.content?.substring(0, 150) + '...' || '', league: article.league || 'Unknown League', publishedAt: article.published_at || article.created_at, imageUrl: article.image_url, slug: article.slug || article.title?.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-') || '', category: article.category, transferStatus: 'rumor', playerName: article.player_name, fromClub: article.from_club, toClub: article.to_club, transferFee: article.transfer_fee, author: 'TransfersDaily', tags: [] }))
    return { transfers, pagination: data.data.pagination || { page: 1, limit: 15, total: transfers.length, totalPages: 1, hasNext: false, hasPrev: false } }
  } catch (error) {
    console.error('Error fetching transfer rumors:', error)
    return { transfers: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }
  }
}

export async function generateStaticParams() { return locales.map((locale) => ({ locale })) }

export default async function TransferRumorsPage({ params, searchParams }: { params: Promise<{ locale: Locale }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  if (!locales.includes(locale)) notFound()
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  const initialData = await getTransferRumorsData(locale, currentPage, selectedLeague)
  const webPageStructuredData = { "@context": "https://schema.org", "@type": "WebPage", "name": "Football Transfer Rumors", "description": "Latest football transfer rumors, breaking news, and speculation from all major leagues", "url": locale === 'en' ? 'https://transferdaily.com/transfers/rumors' : `https://transferdaily.com/${locale}/transfers/rumors`, "inLanguage": locale, "isPartOf": { "@type": "WebSite", "name": "Transfer Daily", "url": "https://transferdaily.com" }, "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": t('navigation.home') || "Home", "item": locale === 'en' ? 'https://transferdaily.com' : `https://transferdaily.com/${locale}` }, { "@type": "ListItem", "position": 2, "name": t('navigation.transfers') || "Transfers", "item": locale === 'en' ? 'https://transferdaily.com/transfers' : `https://transferdaily.com/${locale}/transfers` }, { "@type": "ListItem", "position": 3, "name": t('transfers.rumors') || "Rumors", "item": locale === 'en' ? 'https://transferdaily.com/transfers/rumors' : `https://transferdaily.com/${locale}/transfers/rumors` }] } }
  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }} />
      
      {/* Ad: Leaderboard at top */}
      <LeaderboardAd position="top" />
      
      <TransferStatusPageClient 
        locale={locale} 
        dict={dict} 
        initialData={initialData} 
        initialPage={currentPage} 
        initialLeague={selectedLeague} 
        transferType="rumors" 
        pageTitle={t('transfers.rumors') || 'Transfer Rumors'} 
        pageDescription={t('transfers.rumorsDescription') || 'Latest football transfer rumors, breaking news, and speculation'} 
        icon="MessageCircle" 
      />
    </main>
  )
}
