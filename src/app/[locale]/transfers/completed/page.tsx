import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { type Transfer } from "@/lib/api"
import { TransferStatusPageClient } from '@/components/TransferStatusPageClient'

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
      title: selectedLeague === 'all' ? `Completed Football Transfers${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily` : `Completed ${selectedLeague} Transfers${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`,
      description: selectedLeague === 'all' ? `Browse completed football transfers and finalized deals from all major leagues. Track finished transfer windows, closed deals, and completed signings.` : `Get completed ${selectedLeague} transfers and finalized deals. Track finished ${selectedLeague} transfer windows and closed signings.`,
      keywords: selectedLeague === 'all' ? 'completed football transfers, finished transfers, closed deals, completed signings, finalized transfers, transfer window completed' : `completed ${selectedLeague} transfers, finished ${selectedLeague} deals, ${selectedLeague} completed signings, ${selectedLeague} closed transfers`
    },
    es: { title: selectedLeague === 'all' ? `Fichajes Completados${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily` : `Fichajes Completados ${selectedLeague}${currentPage > 1 ? ` - Página ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Explora los fichajes de fútbol completados y traspasos finalizados de todas las ligas principales. Rastrea ventanas de fichajes terminadas.' : `Obtén los fichajes completados de ${selectedLeague} y traspasos finalizados. Rastrea ventanas de fichajes terminadas de ${selectedLeague}.`, keywords: selectedLeague === 'all' ? 'fichajes completados fútbol, traspasos finalizados, fichajes terminados, ventana fichajes completada' : `fichajes completados ${selectedLeague}, traspasos finalizados ${selectedLeague}, ${selectedLeague} fichajes terminados` },
    it: { title: selectedLeague === 'all' ? `Trasferimenti Completati${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily` : `Trasferimenti Completati ${selectedLeague}${currentPage > 1 ? ` - Pagina ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Scopri i trasferimenti di calcio completati e gli accordi finalizzati da tutte le principali leghe. Traccia le finestre di trasferimento terminate.' : `Scopri i trasferimenti completati ${selectedLeague} e gli accordi finalizzati. Traccia le finestre di trasferimento terminate di ${selectedLeague}.`, keywords: selectedLeague === 'all' ? 'trasferimenti completati calcio, trasferimenti finalizzati, accordi chiusi, finestra trasferimenti completata' : `trasferimenti completati ${selectedLeague}, accordi finalizzati ${selectedLeague}, ${selectedLeague} trasferimenti chiusi` },
    fr: { title: selectedLeague === 'all' ? `Transferts Terminés${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily` : `Transferts Terminés ${selectedLeague}${currentPage > 1 ? ` - Page ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Découvrez les transferts de football terminés et les accords finalisés de toutes les ligues principales. Suivez les fenêtres de transfert fermées.' : `Découvrez les transferts terminés ${selectedLeague} et les accords finalisés. Suivez les fenêtres de transfert fermées de ${selectedLeague}.`, keywords: selectedLeague === 'all' ? 'transferts terminés football, transferts finalisés, accords fermés, fenêtre transferts terminée' : `transferts terminés ${selectedLeague}, accords finalisés ${selectedLeague}, ${selectedLeague} transferts fermés` },
    de: { title: selectedLeague === 'all' ? `Abgeschlossene Transfers${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily` : `Abgeschlossene ${selectedLeague} Transfers${currentPage > 1 ? ` - Seite ${currentPage}` : ''} | Transfer Daily`, description: selectedLeague === 'all' ? 'Entdecken Sie abgeschlossene Fußball-Transfers und finalisierte Deals aus allen großen Ligen. Verfolgen Sie beendete Transferfenster.' : `Erhalten Sie abgeschlossene ${selectedLeague} Transfers und finalisierte Deals. Verfolgen Sie beendete ${selectedLeague} Transferfenster.`, keywords: selectedLeague === 'all' ? 'abgeschlossene Fußball Transfers, finalisierte Transfers, geschlossene Deals, Transferfenster abgeschlossen' : `abgeschlossene ${selectedLeague} Transfers, finalisierte ${selectedLeague} Deals, ${selectedLeague} geschlossene Transfers` }
  }
  
  const currentSeo = seoData[locale]
  return {
    title: currentSeo.title, description: currentSeo.description, keywords: currentSeo.keywords,
    authors: [{ name: 'Transfer Daily', url: 'https://transferdaily.com' }], creator: 'Transfer Daily', publisher: 'Transfer Daily',
    formatDetection: { email: false, address: false, telephone: false }, metadataBase: new URL('https://transferdaily.com'),
    alternates: { canonical: locale === 'en' ? '/transfers/completed' : `/${locale}/transfers/completed`, languages: { 'en': '/transfers/completed', 'es': '/es/transfers/completed', 'it': '/it/transfers/completed', 'fr': '/fr/transfers/completed', 'de': '/de/transfers/completed', 'x-default': '/transfers/completed' } },
    openGraph: { title: currentSeo.title, description: currentSeo.description, url: locale === 'en' ? 'https://transferdaily.com/transfers/completed' : `https://transferdaily.com/${locale}/transfers/completed`, siteName: 'Transfer Daily', locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : locale === 'fr' ? 'fr_FR' : 'de_DE', type: 'website', images: [{ url: '/og-completed-transfers.jpg', width: 1200, height: 630, alt: 'Completed Football Transfers - Transfer Daily' }] },
    twitter: { card: 'summary_large_image', site: '@transferdaily', creator: '@transferdaily', title: currentSeo.title, description: currentSeo.description, images: { url: '/og-completed-transfers.jpg', alt: 'Completed Football Transfers - Transfer Daily' } },
    robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, noimageindex: false, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    category: 'Sports', classification: 'Completed Football Transfers'
  }
}

async function getCompletedTransfersData(language = 'en', page = 1, league = 'all') {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod'}/public/articles`
    const params = new URLSearchParams({ limit: '15', page: page.toString(), status: 'published', language: language, sortBy: 'published_at', sortOrder: 'desc', category: 'completed' })
    if (league !== 'all') {
      const leagueNames: Record<string, string> = { 'premier-league': 'Premier League', 'la-liga': 'La Liga', 'serie-a': 'Serie A', 'bundesliga': 'Bundesliga', 'ligue-1': 'Ligue 1' }
      params.append('league', leagueNames[league] || league)
    }
    const response = await fetch(`${apiUrl}?${params}`, { next: { revalidate: 300 }, headers: { 'Content-Type': 'application/json' } })
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)
    const data = await response.json()
    if (!data.success || !data.data?.articles) return { transfers: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }
    const transfers: Transfer[] = data.data.articles.map((article: any) => ({ id: article.id || article.uuid, title: article.title || 'Untitled Article', excerpt: article.meta_description || article.content?.substring(0, 150) + '...' || '', league: article.league || 'Unknown League', publishedAt: article.published_at || article.created_at, imageUrl: article.image_url, slug: article.slug || article.title?.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-') || '', category: article.category, transferStatus: 'completed', playerName: article.player_name, fromClub: article.from_club, toClub: article.to_club, transferFee: article.transfer_fee, author: 'TransfersDaily', tags: [] }))
    return { transfers, pagination: data.data.pagination || { page: 1, limit: 15, total: transfers.length, totalPages: 1, hasNext: false, hasPrev: false } }
  } catch (error) {
    console.error('Error fetching completed transfers:', error)
    return { transfers: [], pagination: { page: 1, limit: 15, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }
  }
}

export async function generateStaticParams() { return locales.map((locale) => ({ locale })) }

export default async function CompletedTransfersPage({ params, searchParams }: { params: Promise<{ locale: Locale }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  if (!locales.includes(locale)) notFound()
  const currentPage = parseInt(resolvedSearchParams.page as string) || 1
  const selectedLeague = resolvedSearchParams.league as string || 'all'
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  const initialData = await getCompletedTransfersData(locale, currentPage, selectedLeague)
  const webPageStructuredData = { "@context": "https://schema.org", "@type": "WebPage", "name": "Completed Football Transfers", "description": "Browse completed football transfers and finalized deals from all major leagues", "url": locale === 'en' ? 'https://transferdaily.com/transfers/completed' : `https://transferdaily.com/${locale}/transfers/completed`, "inLanguage": locale, "isPartOf": { "@type": "WebSite", "name": "Transfer Daily", "url": "https://transferdaily.com" }, "breadcrumb": { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": t('navigation.home') || "Home", "item": locale === 'en' ? 'https://transferdaily.com' : `https://transferdaily.com/${locale}` }, { "@type": "ListItem", "position": 2, "name": t('navigation.transfers') || "Transfers", "item": locale === 'en' ? 'https://transferdaily.com/transfers' : `https://transferdaily.com/${locale}/transfers` }, { "@type": "ListItem", "position": 3, "name": t('transfers.completed') || "Completed", "item": locale === 'en' ? 'https://transferdaily.com/transfers/completed' : `https://transferdaily.com/${locale}/transfers/completed` }] } }
  return (<main className="min-h-screen bg-background"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }} /><TransferStatusPageClient locale={locale} dict={dict} initialData={initialData} initialPage={currentPage} initialLeague={selectedLeague} transferType="completed" pageTitle={t('transfers.completed') || 'Completed Transfers'} pageDescription={t('transfers.completedDescription') || 'Browse completed football transfers and finalized deals'} icon="CheckCircle2" /></main>)
}
