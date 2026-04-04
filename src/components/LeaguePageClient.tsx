"use client"

import { useState } from "react"
import {
  Pagination
} from "@/components/ui/pagination"
import { TransferGrid } from "@/components/TransferGrid"
import { Sidebar } from "@/components/Sidebar"
import { ArticleCardSkeleton } from "@/components/ArticleCard"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { transfersApi, type Transfer } from "@/lib/api"
import { ResultsInfo } from "@/components/ResultsInfo"
import { type Locale } from "@/lib/i18n"
import { createTranslator } from "@/lib/dictionary-server"
import { typography, responsive } from "@/lib/typography"
import { AdSlot } from "@/components/ads"
import { PageHeader } from "@/components/PageHeader"

// Helper function to get league logo
function getLeagueLogo(leagueSlug: string): { src: string; alt: string } {
  const logoMap: Record<string, { src: string; alt: string }> = {
    'premier-league': {
      src: '/logos/leagues/premier-league.png',
      alt: 'Premier League Logo'
    },
    'la-liga': {
      src: '/logos/leagues/la-liga.png', 
      alt: 'La Liga Logo'
    },
    'serie-a': {
      src: '/logos/leagues/serie-a.png',
      alt: 'Serie A Logo'
    },
    'bundesliga': {
      src: '/logos/leagues/bundesliga.png',
      alt: 'Bundesliga Logo'
    },
    'ligue-1': {
      src: '/logos/leagues/ligue-1.png',
      alt: 'Ligue 1 Logo'
    }
  }
  
  return logoMap[leagueSlug] || {
    src: '/logos/leagues/premier-league.png', // fallback
    alt: 'League Logo'
  }
}

interface LeaguePageClientProps {
  locale: Locale
  dict: any
  initialData: {
    transfers: Transfer[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  initialPage: number
  leagueName: string
  leagueSlug: string
}

export function LeaguePageClient({ 
  locale, 
  dict, 
  initialData, 
  initialPage, 
  leagueName,
  leagueSlug
}: LeaguePageClientProps) {
  const t = createTranslator(dict)
  
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [transfers, setTransfers] = useState<Transfer[]>(initialData.transfers)
  const [pagination, setPagination] = useState(initialData.pagination)
  
  const itemsPerPage = 15

  // Update URL when page changes
  const updateURL = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    
    const newURL = `/${locale}/league/${leagueSlug}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.pushState(null, '', newURL)
  }

  // Load transfers when page changes
  const loadTransfers = async (page: number) => {
    try {
      setIsLoading(true)
      const offset = (page - 1) * itemsPerPage
      
      const response = await transfersApi.getByLeagueWithPagination(leagueSlug, itemsPerPage, offset, locale)
      
      setTransfers(response.transfers)
      setPagination(response.pagination || {
        page,
        limit: itemsPerPage,
        total: response.transfers.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      })
    } catch (error) {
      console.error('Error loading transfers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return t('common.justNow') || 'Just now'
    if (diffInHours < 24) return `${diffInHours} ${t('common.hoursAgo') || 'hours ago'}`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ${t('common.daysAgo') || 'days ago'}`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} ${t('common.weeksAgo') || 'weeks ago'}`
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL(page)
    loadTransfers(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get league logo
  const leagueLogo = getLeagueLogo(leagueSlug)

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
        <div className="lg:col-span-7">
          {/* Header Section - Using PageHeader component */}
          <PageHeader title={leagueName} />

          {/* Ad: Rectangle after header */}

          {/* Results Info - Match Latest Page */}
          <ResultsInfo
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={pagination.total}
            isLoading={isLoading}
            dict={dict}
          />

          {/* Content Section - Match Latest Page Style */}
          <section aria-labelledby="transfers-list">
            <h2 id="transfers-list" className="sr-only">Latest {leagueName} Transfer News</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 15 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} variant="standard" />
                ))}
              </div>
            ) : transfers.length > 0 ? (
              <>
                <TransferGrid
                  transfers={transfers}
                  locale={locale}
                  dict={dict}
                />
                
                <div className="my-8">
                  <AdSlot placement="league.in-transfers" />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className={`${typography.heading.h4} mb-2`}>{t('common.noTransfersFound')}</h3>
                <p className={`${typography.body.base} text-muted-foreground`}>
                  {t('common.checkBackLater')}
                </p>
              </div>
            )}
          </section>

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <>
              <div className="pb-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName="transfers"
              />
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
          <div className="sticky top-20 space-y-6 pt-6">
            <AdSlot placement="league.sidebar-top" />
            {isLoading ? (
              <SidebarSkeleton />
            ) : (
              <Sidebar locale={locale} dict={dict} />
            )}
          </div>
        </aside>
      </div>

      <AdSlot placement="league.mobile-sticky" sticky />
    </div>
  )
}
