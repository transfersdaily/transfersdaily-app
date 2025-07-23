"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { TransferCard } from "@/components/TransferCard"
import { Sidebar } from "@/components/Sidebar"
import { TransferGridSkeleton } from "@/components/TransferCardSkeleton"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { Filter, Clock } from "lucide-react"
import { transfersApi, type Transfer } from "@/lib/api"
import { ResultsInfo } from "@/components/ResultsInfo"
import { type Locale } from "@/lib/i18n"
import { createTranslator } from "@/lib/dictionary-server"

interface LatestPageClientProps {
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
  initialLeague: string
}

export function LatestPageClient({ 
  locale, 
  dict, 
  initialData, 
  initialPage, 
  initialLeague 
}: LatestPageClientProps) {
  const router = useRouter()
  const t = createTranslator(dict)
  
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedLeague, setSelectedLeague] = useState(initialLeague)
  const [isLoading, setIsLoading] = useState(false)
  const [transfers, setTransfers] = useState<Transfer[]>(initialData.transfers)
  const [pagination, setPagination] = useState(initialData.pagination)
  
  const itemsPerPage = 15

  // Update URL when filters change
  const updateURL = (page: number, league: string) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (league !== 'all') params.set('league', league)
    
    const newURL = `/${locale}/latest${params.toString() ? `?${params.toString()}` : ''}`
    router.push(newURL, { scroll: false })
  }

  // Load transfers when filters change (but not on initial load)
  const loadTransfers = async (page: number, league: string) => {
    try {
      setIsLoading(true)
      const offset = (page - 1) * itemsPerPage
      
      let response: { transfers: Transfer[], pagination?: any }
      if (league === "all") {
        response = await transfersApi.getLatestWithPagination(itemsPerPage, offset, locale)
      } else {
        response = await transfersApi.getByLeagueWithPagination(league.toLowerCase().replace(/\s+/g, '-'), itemsPerPage, offset, locale)
      }
      
      setTransfers(response.transfers)
      setPagination(response.pagination || {
        page,
        limit: itemsPerPage,
        total: response.transfers.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      })
    } catch (loadError) {
      console.error('Error loading transfers:', loadError)
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
  
  const handleFilterChange = (league: string) => {
    setSelectedLeague(league)
    setCurrentPage(1)
    updateURL(1, league)
    loadTransfers(1, league)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL(page, selectedLeague)
    loadTransfers(page, selectedLeague)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearFilters = () => {
    setSelectedLeague("all")
    setCurrentPage(1)
    updateURL(1, "all")
    loadTransfers(1, "all")
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
        <div className="lg:col-span-7">
          {/* Header Section */}
          <section className="py-3 border-b bg-muted/30 -mx-4 px-4 mb-6" aria-labelledby="latest-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-500" />
                <h1 id="latest-header" className="text-xl font-bold">{t('navigation.latest')}</h1>
              </div>
              
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('common.filter')}:</span>
                </div>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Select value={selectedLeague} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-40" aria-label="Filter by league">
                    <SelectValue placeholder={t('navigation.leagues')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')} {t('navigation.leagues')}</SelectItem>
                    <SelectItem value="Premier League">Premier League</SelectItem>
                    <SelectItem value="La Liga">La Liga</SelectItem>
                    <SelectItem value="Serie A">Serie A</SelectItem>
                    <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                    <SelectItem value="Ligue 1">Ligue 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Results Info */}
          <ResultsInfo 
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={pagination.total}
            isLoading={isLoading}
          />

          {/* Content Section */}
          <section aria-labelledby="transfers-list">
            {isLoading ? (
              <TransferGridSkeleton count={15} />
            ) : transfers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {transfers.map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    title={transfer.title}
                    excerpt={transfer.excerpt}
                    primaryBadge={transfer.league}
                    timeAgo={formatTimeAgo(transfer.publishedAt)}
                    href={`/${locale}/article/${transfer.slug}`}
                    imageUrl={transfer.imageUrl}
                    imageAlt={transfer.title}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">{t('common.notFound')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('common.tryAdjustingFilters') || 'Try adjusting your filters'}
                </p>
                <button 
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {t('common.clearFilters') || 'Clear all filters'}
                </button>
              </div>
            )}
          </section>

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <nav className="pb-6" aria-label="Pagination Navigation">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1)
                        }
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(pageNum)
                          }}
                          isActive={currentPage === pageNum}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < pagination.totalPages) {
                          handlePageChange(currentPage + 1)
                        }
                      }}
                      className={currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                      aria-disabled={currentPage === pagination.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </nav>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
          {isLoading ? (
            <div className="bg-muted/10 border-l -mr-4 pr-4">
              <div className="p-4">
                <SidebarSkeleton />
              </div>
            </div>
          ) : (
            <Sidebar locale={locale} dict={dict} />
          )}
        </aside>
      </div>
    </div>
  )
}
