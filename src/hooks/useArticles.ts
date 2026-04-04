import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { adminApi } from '@/lib/api'
import { useArticleViews } from '@/hooks/use-content-analytics'

export interface UseArticlesParams {
  status: 'draft' | 'published' | 'scheduled'
  initialSortBy?: string
  initialSortOrder?: string
}

export function useArticles({ status, initialSortBy = 'created_at', initialSortOrder = 'asc' }: UseArticlesParams) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [articles, setArticles] = useState<any[]>([])
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [totalArticles, setTotalArticles] = useState(0)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "")
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || "")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || "all")
  const [leagueFilter, setLeagueFilter] = useState(searchParams.get('league') || "all")
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all")
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || initialSortBy)
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || initialSortOrder)
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('limit') || '20'))
  const [isLoading, setIsLoading] = useState(true)
  const [statsData, setStatsData] = useState<any>(null)

  // Fetch GA4 article views for loaded articles
  const slugs = useMemo(
    () => articles.filter((a: any) => a.slug).map((a: any) => a.slug as string),
    [articles]
  )
  const { data: articleViewsData } = useArticleViews(slugs)
  const articleViews: Record<string, number> = articleViewsData?.views ?? {}

  // Update URL when state changes
  const updateURL = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        newParams.set(key, value.toString())
      } else {
        newParams.delete(key)
      }
    })
    router.replace(`?${newParams.toString()}`, { scroll: false })
  }

  useEffect(() => {
    loadArticles()
  }, [currentPage, searchTerm, categoryFilter, leagueFilter, statusFilter, sortBy, sortOrder, itemsPerPage])

  // Clear selections when articles change
  useEffect(() => {
    setSelectedArticles([])
  }, [articles.length, currentPage])

  const loadArticles = async () => {
    try {
      setIsLoading(true)

      // Fetch articles (paginated) and status-filtered stats in parallel
      const [response, fullStats] = await Promise.all([
        adminApi.getArticles({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          league: leagueFilter !== 'all' ? leagueFilter : undefined,
          status: status,
          transfer_status: statusFilter !== 'all' ? statusFilter : undefined,
          sortBy: sortBy,
          sortOrder: sortOrder
        }),
        adminApi.getDashboardStats(status).catch(() => null),
      ])

      setArticles(response.articles)
      setTotalArticles(response.pagination.total)

      // Use full stats from the dashboard endpoint (now filtered by status)
      if (fullStats) {
        const total = status === 'published'
          ? fullStats.publishedArticles
          : status === 'draft'
            ? fullStats.draftArticles
            : fullStats.totalArticles

        setStatsData({
          totalArticles: total || response.pagination.total,
          createdToday: fullStats.createdToday || 0,
          createdThisWeek: fullStats.createdThisWeek || 0,
          createdThisMonth: fullStats.createdThisMonth || 0,
          byCategory: fullStats.byCategory || [],
          byLeague: fullStats.byLeague || [],
          dailyCreation: fullStats.dailyActivity || [],
          byStatus: fullStats.byStatus || []
        })
      } else {
        // Fallback: use pagination total as the main stat
        setStatsData({
          totalArticles: response.pagination.total,
          createdToday: 0,
          createdThisWeek: 0,
          createdThisMonth: 0,
          byCategory: [],
          byLeague: [],
          dailyCreation: [],
          byStatus: []
        })
      }
    } catch (error) {
      setArticles([])
      setTotalArticles(0)
      setStatsData({
        totalArticles: 0,
        createdToday: 0,
        createdThisWeek: 0,
        createdThisMonth: 0,
        byCategory: [],
        byLeague: [],
        dailyCreation: [],
        byStatus: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(articles.map(article => article.id))
    } else {
      setSelectedArticles([])
    }
  }

  const handleDeleteArticle = async (id: string) => {
    try {
      const success = await adminApi.deleteArticle(id)
      if (success) {
        setArticles(articles.filter(article => article.id !== id))
        setSelectedArticles(selectedArticles.filter(articleId => articleId !== id))
        setTotalArticles(prev => prev - 1)
      }
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const handlePublishArticle = async (id: string) => {
    try {
      const success = await adminApi.updateArticleStatus(id, 'published')
      if (success) {
        setArticles(articles.filter(article => article.id !== id))
        setSelectedArticles(selectedArticles.filter(articleId => articleId !== id))
        setTotalArticles(prev => prev - 1)
      }
    } catch (error) {
      console.error('Error publishing article:', error)
    }
  }

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    setSortBy(column)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
    updateURL({ page: 1, sortBy: column, sortOrder: newSortOrder })
  }

  const handleSearch = () => {
    setSearchTerm(searchInput)
    setCurrentPage(1)
    updateURL({ page: 1, search: searchInput })
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
    updateURL({ page: 1, limit: items })
  }

  const handleResetFilters = () => {
    setSearchInput("")
    setSearchTerm("")
    setCategoryFilter("all")
    setLeagueFilter("all")
    setStatusFilter("all")
    setCurrentPage(1)
    router.replace(window.location.pathname, { scroll: false })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL({ page })
  }

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category)
    setCurrentPage(1)
    updateURL({ page: 1, category })
  }

  const handleLeagueChange = (league: string) => {
    setLeagueFilter(league)
    setCurrentPage(1)
    updateURL({ page: 1, league })
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
    updateURL({ page: 1, status })
  }

  return {
    // State
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
    articleViews,

    // Setters
    setSelectedArticles,
    setCurrentPage: handlePageChange,
    setSearchInput,
    setCategoryFilter: handleCategoryChange,
    setLeagueFilter: handleLeagueChange,
    setStatusFilter: handleStatusChange,
    
    // Handlers
    handleSelectAll,
    handleDeleteArticle,
    handlePublishArticle,
    handleSort,
    handleSearch,
    handleSearchKeyPress,
    handleItemsPerPageChange,
    handleResetFilters,
    
    // Actions
    loadArticles
  }
}