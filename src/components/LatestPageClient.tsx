"use client"

import { useState } from "react"
import { Pagination } from "@/components/ui/pagination"
import { TransferGrid } from "@/components/TransferGrid"
import { Sidebar } from "@/components/Sidebar"
import { ArticleCardSkeleton } from "@/components/ArticleCard"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { transfersApi, type Transfer } from "@/lib/api"
import { ResultsInfo } from "@/components/ResultsInfo"
import { type Locale } from "@/lib/i18n"
import { createTranslator } from "@/lib/dictionary-server"
import { PageHeader } from "@/components/PageHeader"

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
}

export function LatestPageClient({ 
  locale, 
  dict, 
  initialData, 
  initialPage
}: LatestPageClientProps) {
  const t = createTranslator(dict)

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [transfers, setTransfers] = useState<Transfer[]>(initialData.transfers)
  const [pagination, setPagination] = useState(initialData.pagination)

  const itemsPerPage = 15

  // Update URL without triggering server navigation
  const updateURL = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())

    const newURL = `/${locale}/latest${params.toString() ? `?${params.toString()}` : ''}`
    window.history.pushState(null, '', newURL)
  }

  // Load transfers when page changes
  const loadTransfers = async (page: number) => {
    try {
      setIsLoading(true)
      const offset = (page - 1) * itemsPerPage
      
      const response = await transfersApi.getLatestWithPagination(itemsPerPage, offset, locale)
      
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
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL(page)
    loadTransfers(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
        <div className="lg:col-span-7">
          {/* Header Section - Using PageHeader component */}
          <PageHeader
            title={t('navigation.latest')}
          />

          
          {/* Results Info */}
          <ResultsInfo
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={pagination.total}
            isLoading={isLoading}
            dict={dict}
          />

          {/* Content Section */}
          <section aria-labelledby="transfers-list">
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
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-2">{t('common.notFound')}</h3>
                <p className="text-muted-foreground">
                  {t('common.checkBackLater') || 'Check back later for new transfers'}
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
          <div className="space-y-6 pt-6">
            {isLoading ? (
              <SidebarSkeleton />
            ) : (
              <Sidebar locale={locale} dict={dict} />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
