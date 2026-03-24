import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { adminApi } from '@/lib/api'

// Generate real stats from articles data
function generateStatsFromArticles(articles: any[], status: string = 'draft') {
  console.log('Generating stats for articles:', articles.length, 'status:', status)
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  console.log('Date ranges:', { today, weekAgo, monthAgo })
  
  // Use published_at for published articles, created_at for others
  const dateField = status === 'published' ? 'published_at' : 'created_at'
  console.log('Using date field:', dateField)
  
  // Count articles by time periods with better date parsing
  const createdToday = articles.filter(a => {
    const dateValue = a[dateField]
    if (!dateValue) return false
    const created = new Date(dateValue)
    const isToday = created >= today && created < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    if (isToday) console.log(`Article ${dateField} today:`, a.title, created)
    return isToday
  }).length
  
  const createdThisWeek = articles.filter(a => {
    const dateValue = a[dateField]
    if (!dateValue) return false
    const created = new Date(dateValue)
    const isThisWeek = created >= weekAgo
    return isThisWeek
  }).length
  
  const createdThisMonth = articles.filter(a => {
    const dateValue = a[dateField]
    if (!dateValue) return false
    const created = new Date(dateValue)
    const isThisMonth = created >= monthAgo
    return isThisMonth
  }).length
  
  console.log('Stats calculated:', { createdToday, createdThisWeek, createdThisMonth })
  
  // Count by category
  const categoryCount: Record<string, number> = {}
  articles.forEach(a => {
    const category = a.category || 'Other'
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })
  
  const byCategory = Object.entries(categoryCount).map(([name, value], index) => ({
    name,
    value,
    color: ['hsl(330 81% 60%)', 'hsl(346 77% 49%)', 'hsl(351 83% 74%)'][index % 3]
  }))
  
  // Count by league
  const leagueCount: Record<string, number> = {}
  articles.forEach(a => {
    if (a.league) {
      leagueCount[a.league] = (leagueCount[a.league] || 0) + 1
    }
  })
  
  const byLeague = Object.entries(leagueCount).map(([name, value]) => ({ name, value }))
  
  // Count by transfer status
  const statusCount: Record<string, number> = {}
  articles.forEach(a => {
    const status = a.transfer_status || 'Unknown'
    statusCount[status] = (statusCount[status] || 0) + 1
  })
  
  const byStatus = Object.entries(statusCount).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: ['hsl(330 81% 60%)', 'hsl(346 77% 49%)', 'hsl(351 83% 74%)', 'hsl(338 71% 37%)'][index % 4]
  }))
  
  // Generate daily creation data for last 7 days
  const dailyCreation = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
    const dayArticles = articles.filter(a => {
      const created = new Date(a.created_at)
      return created.toDateString() === date.toDateString()
    })
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayArticles.length
    }
  })
  
  return {
    totalArticles: articles.length,
    createdToday,
    createdThisWeek,
    createdThisMonth,
    byCategory,
    byLeague,
    dailyCreation,
    byStatus
  }
}

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
      const response = await adminApi.getArticles({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        league: leagueFilter !== 'all' ? leagueFilter : undefined,
        status: status, // This will be 'draft', 'published', or 'scheduled'
        transfer_status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: sortBy,
        sortOrder: sortOrder
      })
      
      console.log('API Response:', response)
      console.log('Articles received:', response.articles?.length || 0)
      if (response.articles?.length > 0) {
        console.log('Sample article:', response.articles[0])
        console.log('Sample article date fields:', {
          created_at: response.articles[0].created_at,
          published_at: response.articles[0].published_at,
          published_date: response.articles[0].published_date,
          createdAt: response.articles[0].createdAt,
          publishedAt: response.articles[0].publishedAt
        })
      }
      
      setArticles(response.articles)
      setTotalArticles(response.pagination.total)
      
      // Use stats from API response if available, otherwise generate from articles
      if (response.stats) {
        console.log('Using API stats:', response.stats)
        // Map API stats to expected format
        const mappedStats = {
          totalArticles: response.stats.totalArticles || response.articles.length,
          createdToday: response.stats.createdToday || 0,
          createdThisWeek: response.stats.createdThisWeek || 0,
          createdThisMonth: response.stats.createdThisMonth || 0,
          byCategory: response.stats.byCategory || [],
          byLeague: response.stats.byLeague || [],
          dailyCreation: response.stats.dailyCreation || [],
          byStatus: response.stats.byStatus || []
        }
        console.log('Mapped stats:', mappedStats)
        setStatsData(mappedStats)
      } else {
        console.log('Generating stats from articles')
        const realStats = generateStatsFromArticles(response.articles, status)
        console.log('Generated stats:', realStats)
        setStatsData(realStats)
      }
    } catch (error) {
      console.error('Error loading articles:', error)
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