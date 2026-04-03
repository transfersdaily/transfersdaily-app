"use client"

import { Button } from "@/components/ui/button"
import { ArticlesTableMobile } from "@/components/ArticlesTableMobile"
import { ArticleStatsOverview } from "@/components/ArticleStatsOverview"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { useArticles, UseArticlesParams } from "@/hooks/useArticles"

interface ArticlesPageLayoutProps extends UseArticlesParams {
  title: string
  pageType: "draft" | "published" | "scheduled"
  showAddButton?: boolean
  onAddClick?: () => void
  onBulkTranslate?: (articleIds: string[]) => void
  onBulkPublish?: (articleIds: string[]) => void
}

export function ArticlesPageLayout({
  title,
  pageType,
  status,
  initialSortBy,
  initialSortOrder,
  showAddButton = true,
  onAddClick,
  onBulkTranslate,
  onBulkPublish
}: ArticlesPageLayoutProps) {
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
    articleViews,
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

  const selectedArticles = internalSelectedArticles
  const setSelectedArticles = setInternalSelectedArticles

  if (isLoading) {
    return (
      <AdminPageLayout title={title}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
                <Skeleton className="h-3 w-24 bg-white/[0.06]" />
                <Skeleton className="h-7 w-16 mt-2 bg-white/[0.06]" />
                <Skeleton className="h-3 w-32 mt-2 bg-white/[0.06]" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-9 flex-1 bg-white/[0.06]" />
              <Skeleton className="h-9 w-32 bg-white/[0.06]" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-4 w-4 bg-white/[0.06]" />
                <Skeleton className="h-4 flex-1 bg-white/[0.06]" />
                <Skeleton className="h-5 w-16 bg-white/[0.06]" />
                <Skeleton className="h-4 w-24 bg-white/[0.06]" />
              </div>
            ))}
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
          {showAddButton && (
            <Button size="sm" onClick={onAddClick} className="min-h-[44px]">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Add Article</span>
              <span className="md:hidden">Add</span>
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
          onBulkTranslate={onBulkTranslate}
          onBulkPublish={onBulkPublish}
          articleViews={articleViews}
        />
      </div>
    </AdminPageLayout>
  )
}
