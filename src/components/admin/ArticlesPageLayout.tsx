"use client"

import { Button } from "@/components/ui/button"
import { ArticlesTableMobile } from "@/components/ArticlesTableMobile"
import { ArticleStatsOverview } from "@/components/ArticleStatsOverview"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { useArticles, UseArticlesParams } from "@/hooks/useArticles"
import { useIsMobile, adminMobileGrid } from "@/lib/mobile-utils"

interface ArticlesPageLayoutProps extends UseArticlesParams {
  title: string
  pageType: "draft" | "published" | "scheduled"
  showAddButton?: boolean
  onAddClick?: () => void
  bulkActions?: React.ReactNode
  selectedArticles?: string[]
  onSelectArticles?: (articles: string[]) => void
}

export function ArticlesPageLayout({ 
  title, 
  pageType, 
  status,
  initialSortBy,
  initialSortOrder,
  showAddButton = true,
  onAddClick,
  bulkActions,
  selectedArticles: externalSelectedArticles,
  onSelectArticles: externalOnSelectArticles
}: ArticlesPageLayoutProps) {
  const isMobile = useIsMobile()
  
  const {
    articles,
    selectedArticles: internalSelectedArticles,
    currentPage,
    totalArticles,
    searchInput,
    categoryFilter,
    leagueFilter,
    statusFilter,
    sortBy,
    sortOrder,
    itemsPerPage,
    isLoading,
    statsData,
    setSelectedArticles: setInternalSelectedArticles,
    setCurrentPage,
    setSearchInput,
    setCategoryFilter,
    setLeagueFilter,
    setStatusFilter,
    handleSelectAll,
    handleDeleteArticle,
    handlePublishArticle,
    handleSort,
    handleSearch,
    handleSearchKeyPress,
    handleItemsPerPageChange,
    handleResetFilters
  } = useArticles({ status, initialSortBy, initialSortOrder })

  // Use external selected articles if provided, otherwise use internal
  const selectedArticles = externalSelectedArticles ?? internalSelectedArticles
  const setSelectedArticles = externalOnSelectArticles ?? setInternalSelectedArticles

  if (isLoading) {
    return (
      <AdminPageLayout title={title}>
        <div className="space-y-6">
          {/* Stats Cards Skeleton */}
          <div className={adminMobileGrid.statsCards}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
          
          {/* Charts Skeleton - Mobile responsive */}
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {Array.from({ length: isMobile ? 2 : 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card">
                <div className="p-6 pb-2">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="p-6 pt-0">
                  <Skeleton className={`w-full rounded ${isMobile ? 'h-[200px]' : 'h-[300px]'}`} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Table Skeleton */}
          <div className="rounded-xl border bg-card">
            <div className="p-6 pb-2">
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-6 pt-4">
              <div className={`flex items-center space-x-2 mb-4 ${isMobile ? 'flex-col space-x-0 space-y-3' : ''}`}>
                <Skeleton className={`h-10 ${isMobile ? 'w-full' : 'flex-1'}`} />
                <Skeleton className={`h-10 ${isMobile ? 'w-full' : 'w-32'}`} />
                <Skeleton className={`h-10 ${isMobile ? 'w-full' : 'w-32'}`} />
                <Skeleton className={`h-10 ${isMobile ? 'w-full' : 'w-32'}`} />
              </div>
              <div className="rounded-md border">
                <div className="p-4">
                  {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
                    <div key={i} className={`flex items-center space-x-4 py-3 ${isMobile ? 'flex-col space-x-0 space-y-2' : ''}`}>
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className={`h-4 ${isMobile ? 'w-full' : 'flex-1'}`} />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout 
      title={title}
      actions={
        <div className="flex items-center gap-2">
          {bulkActions && selectedArticles.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions}
            </div>
          )}
          {showAddButton && (
            <Button size="sm" onClick={onAddClick} className="min-h-[44px]">
              <Plus className="mr-2 h-4 w-4" />
              {isMobile ? "Add" : "Add Article"}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {statsData && (
          <ArticleStatsOverview data={statsData} pageType={pageType} />
        )}

        <ArticlesTableMobile
          articles={articles}
          totalArticles={totalArticles}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          selectedArticles={selectedArticles}
          onSelectArticles={setSelectedArticles}
          onSelectAll={handleSelectAll}
          searchTerm={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          onSearchKeyPress={handleSearchKeyPress}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          leagueFilter={leagueFilter}
          onLeagueChange={setLeagueFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          pageType={pageType}
          onDeleteArticle={handleDeleteArticle}
          onPublishArticle={handlePublishArticle}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onResetFilters={handleResetFilters}
        />
      </div>
    </AdminPageLayout>
  )
}