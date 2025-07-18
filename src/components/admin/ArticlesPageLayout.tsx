"use client"

import { Button } from "@/components/ui/button"
import { ArticlesTable } from "@/components/ArticlesTable"
import { ArticleStatsOverview } from "@/components/ArticleStatsOverview"
import { AdminPageHeader } from "@/components/AdminPageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Loader2 } from "lucide-react"
import { useArticles, UseArticlesParams } from "@/hooks/useArticles"

interface ArticlesPageLayoutProps extends UseArticlesParams {
  title: string
  pageType: "draft" | "published" | "scheduled"
  showAddButton?: boolean
  onAddClick?: () => void
}

export function ArticlesPageLayout({ 
  title, 
  pageType, 
  status,
  initialSortBy,
  initialSortOrder,
  showAddButton = true,
  onAddClick 
}: ArticlesPageLayoutProps) {
  const {
    articles,
    selectedArticles,
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
    setSelectedArticles,
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

  if (isLoading) {
    return (
      <>
        <AdminPageHeader title={title} />
        <div className="flex-1 space-y-6 p-4 md:p-8">
          {/* Stats Cards Skeleton */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
          
          {/* Charts Skeleton */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card">
                <div className="p-6 pb-2">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="p-6 pt-0">
                  <Skeleton className="h-[300px] w-full rounded" />
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
              <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="rounded-md border">
                <div className="p-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 py-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
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
      </>
    )
  }

  return (
    <>
      <AdminPageHeader 
        title={title}
        actions={
          showAddButton ? (
            <Button size="sm" onClick={onAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          ) : undefined
        }
      />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        {statsData && (
          <ArticleStatsOverview data={statsData} pageType={pageType} />
        )}

        <ArticlesTable
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
    </>
  )
}