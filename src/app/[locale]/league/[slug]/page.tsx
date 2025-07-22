import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TransferCard } from "@/components/TransferCard"
import { Sidebar } from "@/components/Sidebar"
import { TransferGridSkeleton } from "@/components/TransferCardSkeleton"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { type Locale, getDictionary, locales } from '@/lib/i18n'
import { createTranslator } from '@/lib/dictionary-server'
import { type Transfer } from "@/lib/api"

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
  try {
    // Convert slug to proper league name
    const leagueNames: Record<string, string> = {
      'premier-league': 'Premier League',
      'la-liga': 'La Liga', 
      'serie-a': 'Serie A',
      'bundesliga': 'Bundesliga',
      'ligue-1': 'Ligue 1'
    }
    
    const leagueName = leagueNames[leagueSlug] || leagueSlug
    
    console.log('🔍 SERVER: Fetching league articles for:', leagueName, 'in language:', language)
    
    // Direct API call to backend (same as homepage)
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod'}/public/articles`
    const params = new URLSearchParams({
      limit: '12',
      page: '1',
      status: 'published',
      league: leagueName,
      language: language
    })
    
    console.log('📡 SERVER: Making API request to:', `${apiUrl}?${params}`)
    
    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(15000)
    })
    
    console.log('📊 SERVER: API Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ SERVER: API Response received:', {
        success: data.success,
        hasData: !!data.data,
        articlesCount: data.data?.articles?.length || 0,
        language: language,
        league: leagueName
      })
      
      if (data.success && data.data?.articles?.length > 0) {
        const articles = data.data.articles
        
        // Transform articles to the expected format (same as homepage)
        const transformedArticles = articles.map(article => ({
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
        
        console.log('🔄 SERVER: Using real league data from API:', transformedArticles.length, 'articles')
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

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: Locale; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params
  const dict = await getDictionary(locale)
  const t = createTranslator(dict)
  
  const leagueNames: { [key: string]: string } = {
    'premier-league': 'Premier League',
    'la-liga': 'La Liga',
    'serie-a': 'Serie A',
    'bundesliga': 'Bundesliga',
    'ligue-1': 'Ligue 1'
  }
  
  const leagueName = leagueNames[slug] || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return {
    title: `${leagueName} - ${t('common.latestTransfersFrom')} ${leagueName} | Transfer Daily`,
    description: `${t('common.latestTransfersFrom')} ${leagueName}. ${t('footer.description')}`,
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
  
  const formatTimeAgo = (dateString: string) => {
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

  const getLeagueName = (slug: string) => {
    const leagueNames: { [key: string]: string } = {
      'premier-league': 'Premier League',
      'la-liga': 'La Liga',
      'serie-a': 'Serie A',
      'bundesliga': 'Bundesliga',
      'ligue-1': 'Ligue 1'
    }
    return leagueNames[slug] || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          <div className="lg:col-span-7">
            <section className="py-8">
              <h1 className="text-3xl font-bold mb-2">{getLeagueName(slug)}</h1>
              <p className="text-muted-foreground mb-8">
                {t('common.latestTransfersFrom')} {getLeagueName(slug)}
              </p>

              {transfers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transfers.map((transfer) => (
                    <TransferCard
                      key={transfer.id}
                      title={transfer.title}
                      excerpt={transfer.excerpt}
                      primaryBadge={transfer.league}
                      timeAgo={formatTimeAgo(transfer.publishedAt)}
                      href={`/${locale}/article/${transfer.slug}?language=${locale}`}
                      imageUrl={transfer.imageUrl}
                      imageAlt={transfer.title}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">{t('common.noTransfersFound')}</h3>
                  <p className="text-muted-foreground">
                    {t('common.checkBackLater')}
                  </p>
                </div>
              )}
            </section>
          </div>

          <div className="hidden lg:block lg:col-span-3">
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar locale={locale} dict={dict} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
