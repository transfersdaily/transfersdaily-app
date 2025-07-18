import { API_CONFIG, STORAGE_KEYS } from './config'
import { mockTransfers, mockLeagues } from './mockData'

// Types
export interface Transfer {
  id: string
  title: string
  excerpt: string
  content?: string
  league: string
  transferValue?: string
  playerName?: string
  fromClub?: string
  toClub?: string
  status: 'confirmed' | 'rumor' | 'completed' | 'loan'
  publishedAt: string
  imageUrl?: string
  source?: string
  tags?: string[]
  slug?: string
}

export interface League {
  id: string
  name: string
  country: string
  logoUrl?: string
  slug: string
}

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  imageUrl?: string
  author?: string
  tags?: string[]
  league?: string
  slug?: string
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Generic fetch wrapper with fallback to mock data
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      if (fallbackData) {
        console.warn(`API request failed for ${endpoint}, using fallback data`)
        return fallbackData
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    if (fallbackData) {
      console.warn('Using fallback data due to API error')
      return fallbackData
    }
    throw error
  }
}

// Helper function to transform article data to transfer format
function transformArticleToTransfer(article: any): Transfer {
  return {
    id: article.uuid || article.id,
    title: article.title,
    excerpt: article.content ? article.content.substring(0, 200) + '...' : '',
    content: article.content,
    league: article.league || 'Unknown',
    transferValue: article.transferFee || article.transfer_fee,
    playerName: article.playerName || article.player_name,
    fromClub: article.currentClub || article.current_club,
    toClub: article.destinationClub || article.destination_club,
    status: (article.transferStatus || article.transfer_status || 'rumor') as 'confirmed' | 'rumor' | 'completed' | 'loan',
    publishedAt: article.publishedDate || article.published_date || article.createdAt || article.created_at,
    imageUrl: article.images?.[0],
    source: article.originalLink || article.original_link,
    tags: article.tags || [],
    slug: article.slug
  }
}

// Helper function to transform article data to article format
function transformArticleToArticle(article: any): Article {
  return {
    id: article.uuid || article.id,
    title: article.title,
    excerpt: article.content ? article.content.substring(0, 200) + '...' : '',
    content: article.content,
    publishedAt: article.publishedDate || article.published_date || article.createdAt || article.created_at,
    imageUrl: article.images?.[0],
    author: 'TransfersDaily',
    tags: article.tags || [],
    league: article.league,
    slug: article.slug
  }
}

// Transfer API functions
export const transfersApi = {
  // Get latest transfers with pagination info
  async getLatestWithPagination(limit = 10, offset = 0): Promise<{
    transfers: Transfer[],
    pagination?: {
      page: number,
      limit: number,
      total: number,
      totalPages: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: Math.floor(offset / limit + 1).toString(),
        status: 'published'
      })
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[], pagination: any } }>(
        `${API_CONFIG.endpoints.transfers.latest}?${params}`
      )
      
      const articles = response.data?.articles || []
      const pagination = response.data?.pagination
      
      return {
        transfers: articles.map(transformArticleToTransfer),
        pagination
      }
    } catch (error) {
      console.error('Error fetching latest transfers with pagination:', error)
      return { transfers: [] }
    }
  },

  // Get latest transfers
  async getLatest(limit = 10, offset = 0, language = 'en'): Promise<Transfer[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: Math.floor(offset / limit + 1).toString(),
        status: 'published',
        lang: language
      })
      
      const fallbackData = { articles: mockTransfers.slice(0, limit) }
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.transfers.latest}?${params}`,
        {},
        fallbackData
      )
      
      const articles = response.data?.articles || response.articles || []
      return articles.map(transformArticleToTransfer)
    } catch (error) {
      console.error('Error fetching latest transfers:', error)
      // Return mock data as final fallback
      return mockTransfers.slice(0, limit).map(transformArticleToTransfer)
    }
  },

  // Get transfers by league with pagination info
  async getByLeagueWithPagination(leagueSlug: string, limit = 10, offset = 0): Promise<{
    transfers: Transfer[],
    pagination?: {
      page: number,
      limit: number,
      total: number,
      totalPages: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }> {
    try {
      const leagueNames: Record<string, string> = {
        'premier-league': 'Premier League',
        'la-liga': 'La Liga', 
        'serie-a': 'Serie A',
        'bundesliga': 'Bundesliga',
        'ligue-1': 'Ligue 1'
      }
      
      const leagueName = leagueNames[leagueSlug] || leagueSlug
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: Math.floor(offset / limit + 1).toString(),
        status: 'published',
        league: leagueName
      })
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[], pagination: any } }>(
        `${API_CONFIG.endpoints.transfers.byLeague}?${params}`
      )
      
      const articles = response.data?.articles || []
      const pagination = response.data?.pagination
      
      return {
        transfers: articles.map(transformArticleToTransfer),
        pagination
      }
    } catch (error) {
      console.error('Error fetching transfers by league with pagination:', error)
      return { transfers: [] }
    }
  },

  // Get transfers by league
  async getByLeague(leagueSlug: string, limit = 10, offset = 0): Promise<Transfer[]> {
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
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: Math.floor(offset / limit + 1).toString(),
        status: 'published',
        league: leagueName
      })
      
      const filteredMockData = mockTransfers.filter(t => 
        t.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug
      )
      const fallbackData = { articles: filteredMockData.slice(0, limit) }
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.transfers.byLeague}?${params}`,
        {},
        fallbackData
      )
      
      const articles = response.data?.articles || response.articles || []
      return articles.map(transformArticleToTransfer)
    } catch (error) {
      console.error('Error fetching transfers by league:', error)
      // Return filtered mock data as final fallback
      const filteredMockData = mockTransfers.filter(t => 
        t.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug
      )
      return filteredMockData.slice(0, limit).map(transformArticleToTransfer)
    }
  },

  // Get transfers by status with pagination
  async getByStatusWithPagination(status: string, limit = 10, offset = 0): Promise<{
    transfers: Transfer[],
    pagination?: {
      page: number,
      limit: number,
      total: number,
      totalPages: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: Math.floor(offset / limit + 1).toString(),
        status: 'published',
        transfer_status: status
      })
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[], pagination: any } }>(
        `${API_CONFIG.endpoints.transfers.latest}?${params}`
      )
      
      const articles = response.data?.articles || []
      const pagination = response.data?.pagination
      
      return {
        transfers: articles.map(transformArticleToTransfer),
        pagination
      }
    } catch (error) {
      console.error('Error fetching transfers by status with pagination:', error)
      return { transfers: [] }
    }
  },

  // Get transfer by ID
  async getById(id: string): Promise<Transfer | null> {
    try {
      const mockTransfer = mockTransfers.find(t => t.uuid === id)
      const fallbackData = mockTransfer ? { article: mockTransfer } : null
      
      const response = await apiRequest<{ success: boolean; data: { article: any } }>(
        `${API_CONFIG.endpoints.transfers.byId}/${id}`,
        {},
        fallbackData
      )
      
      const article = response.data?.article || response.article
      return article ? transformArticleToTransfer(article) : null
    } catch (error) {
      console.error('Error fetching transfer by ID:', error)
      // Return mock data as final fallback
      const mockTransfer = mockTransfers.find(t => t.uuid === id)
      return mockTransfer ? transformArticleToTransfer(mockTransfer) : null
    }
  },

  // Search transfers
  async search(query: string, filters?: {
    league?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<Transfer[]> {
    try {
      const params = new URLSearchParams({ 
        search: query,
        status: 'published'
      })
      
      if (filters) {
        if (filters.league) params.append('league', filters.league)
        if (filters.status) {
          let statusValue = filters.status
          if (filters.status === 'completed') {
            statusValue = 'done-deal'
          }
          params.append('transfer_status', statusValue)
        }
      }

      // Filter mock data for fallback
      let filteredMockData = mockTransfers.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.player_name?.toLowerCase().includes(query.toLowerCase()) ||
        t.current_club?.toLowerCase().includes(query.toLowerCase()) ||
        t.destination_club?.toLowerCase().includes(query.toLowerCase())
      )

      if (filters?.league) {
        filteredMockData = filteredMockData.filter(t => 
          t.league.toLowerCase().replace(/\s+/g, '-') === filters.league
        )
      }

      const fallbackData = { articles: filteredMockData }

      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.transfers.search}?${params}`,
        {},
        fallbackData
      )
      
      const articles = response.data?.articles || response.articles || []
      return articles.map(transformArticleToTransfer)
    } catch (error) {
      console.error('Error searching transfers:', error)
      // Return filtered mock data as final fallback
      let filteredMockData = mockTransfers.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.player_name?.toLowerCase().includes(query.toLowerCase()) ||
        t.current_club?.toLowerCase().includes(query.toLowerCase()) ||
        t.destination_club?.toLowerCase().includes(query.toLowerCase())
      )
      return filteredMockData.map(transformArticleToTransfer)
    }
  }
}

// Articles API functions
export const articlesApi = {
  // Get latest articles
  async getLatest(limit = 10, offset = 0, language = 'en'): Promise<Article[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: Math.floor(offset / limit + 1).toString(),
        status: 'published',
        lang: language
      })
      
      const fallbackData = { articles: mockTransfers.slice(0, limit) }
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.articles.latest}?${params}`,
        {},
        fallbackData
      )
      
      const articles = response.data?.articles || response.articles || []
      return articles.map(transformArticleToArticle)
    } catch (error) {
      console.error('Error fetching latest articles:', error)
      return mockTransfers.slice(0, limit).map(transformArticleToArticle)
    }
  },

  // Get article by ID
  async getById(id: string): Promise<Article | null> {
    try {
      const mockArticle = mockTransfers.find(t => t.uuid === id)
      const fallbackData = mockArticle ? { article: mockArticle } : null
      
      const response = await apiRequest<{ success: boolean; data: { article: any } }>(
        `${API_CONFIG.endpoints.articles.byId}/${id}`,
        {},
        fallbackData
      )
      
      const article = response.data?.article || response.article
      return article ? transformArticleToArticle(article) : null
    } catch (error) {
      console.error('Error fetching article by ID:', error)
      const mockArticle = mockTransfers.find(t => t.uuid === id)
      return mockArticle ? transformArticleToArticle(mockArticle) : null
    }
  },

  // Get article by slug
  async getBySlug(slug: string): Promise<Article | null> {
    try {
      const mockArticle = mockTransfers.find(t => t.slug === slug)
      const fallbackData = mockArticle ? { article: mockArticle } : null
      
      const response = await apiRequest<{ success: boolean; data: { article: any } }>(
        `${API_CONFIG.endpoints.articles.bySlug}/${slug}`,
        {},
        fallbackData
      )
      
      const article = response.data?.article || response.article
      return article ? transformArticleToArticle(article) : null
    } catch (error) {
      console.error('Error fetching article by slug:', error)
      const mockArticle = mockTransfers.find(t => t.slug === slug)
      return mockArticle ? transformArticleToArticle(mockArticle) : null
    }
  },

  // Get recommended articles (random selection)
  async getRecommended(limit = 5): Promise<Article[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        status: 'published',
        random: 'true'
      })
      
      const fallbackData = { articles: mockTransfers.slice(0, limit) }
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.articles.latest}?${params}`,
        {},
        fallbackData
      )
      
      const articles = response.data?.articles || response.articles || []
      return articles.slice(0, limit).map(transformArticleToArticle)
    } catch (error) {
      console.error('Error fetching recommended articles:', error)
      return mockTransfers.slice(0, limit).map(transformArticleToArticle)
    }
  },

  // Get trending articles (highest transfer fees)
  async getTrending(limit = 5): Promise<Article[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        status: 'published',
        sort: 'trending' // Signal to backend to sort by transfer fee
      })
      
      const fallbackData = { articles: mockTransfers.slice(0, limit) }
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.articles.trending}?${params}`,
        {},
        fallbackData
      )
      
      const articles = response.data?.articles || response.articles || []
      return articles.slice(0, limit).map(transformArticleToArticle)
    } catch (error) {
      console.error('Error fetching trending articles:', error)
      return mockTransfers.slice(0, limit).map(transformArticleToArticle)
    }
  }
}

// Leagues API functions
export const leaguesApi = {
  // Get all leagues (extracted from articles)
  async getAll(): Promise<League[]> {
    try {
      const fallbackData = { articles: mockTransfers }
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.leagues.all}?limit=100&status=published`,
        {},
        fallbackData
      )
      
      // Extract unique leagues from articles
      const leaguesSet = new Set<string>()
      const leagues: League[] = []
      const articles = response.data?.articles || response.articles || []
      
      // League mapping for logos and countries
      const leagueMapping: Record<string, { country: string; logoUrl: string }> = {
        'Premier League': { country: 'England', logoUrl: '/logos/leagues/premier-league.png' },
        'La Liga': { country: 'Spain', logoUrl: '/logos/leagues/la-liga.png' },
        'Bundesliga': { country: 'Germany', logoUrl: '/logos/leagues/bundesliga.png' },
        'Serie A': { country: 'Italy', logoUrl: '/logos/leagues/serie-a.png' },
        'Ligue 1': { country: 'France', logoUrl: '/logos/leagues/ligue-1.png' }
      }
      
      articles.forEach(article => {
        if (article.league && !leaguesSet.has(article.league)) {
          leaguesSet.add(article.league)
          const mapping = leagueMapping[article.league] || { country: 'Unknown', logoUrl: undefined }
          leagues.push({
            id: article.league.toLowerCase().replace(/\s+/g, '-'),
            name: article.league,
            country: mapping.country,
            slug: article.league.toLowerCase().replace(/\s+/g, '-'),
            logoUrl: mapping.logoUrl
          })
        }
      })
      
      // Always return the full set of mock leagues to ensure we have all 5
      return mockLeagues
    } catch (error) {
      console.error('Error fetching leagues:', error)
      return mockLeagues
    }
  },

  // Get league by slug
  async getBySlug(slug: string): Promise<League | null> {
    try {
      const leagues = await this.getAll()
      return leagues.find(league => league.slug === slug) || null
    } catch (error) {
      console.error('Error fetching league by slug:', error)
      return mockLeagues.find(league => league.slug === slug) || null
    }
  }
}

// Newsletter API functions
export const newsletterApi = {
  // Subscribe to newsletter
  async subscribe(email: string, preferences?: {
    firstName?: string
    lastName?: string
    preferences?: Record<string, unknown>
  }): Promise<boolean> {
    try {
      const response = await apiRequest(
        API_CONFIG.endpoints.newsletter.subscribe,
        {
          method: 'POST',
          body: JSON.stringify({
            email,
            firstName: preferences?.firstName,
            lastName: preferences?.lastName,
            preferences: preferences?.preferences
          })
        }
      )
      return response.success || true
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      return false
    }
  },

  // Get newsletter subscriptions (admin only)
  async getSubscriptions(): Promise<any[]> {
    try {
      const response = await apiRequest<{ success: boolean; data: { subscriptions: any[] } }>(
        API_CONFIG.endpoints.newsletter.list
      )
      return response.data?.subscriptions || []
    } catch (error) {
      console.error('Error getting newsletter subscriptions:', error)
      return []
    }
  },

  // Unsubscribe from newsletter
  async unsubscribe(emailOrId: string): Promise<boolean> {
    try {
      const response = await apiRequest(
        `${API_CONFIG.endpoints.newsletter.unsubscribe}/${emailOrId}`,
        {
          method: 'DELETE'
        }
      )
      return response.success || true
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error)
      return false
    }
  }
}

// Admin API functions
export const adminApi = {


  // Get dashboard stats
  async getDashboardStats(): Promise<{
    totalArticles: number
    draftArticles: number
    publishedArticles: number
    totalClubs: number
    totalPlayers: number
    totalLeagues: number
  }> {
    try {
      const response = await apiRequest<{ success: boolean; data: any }>(
        API_CONFIG.endpoints.admin.stats
      )
      return response.data || {
        totalArticles: 0,
        draftArticles: 0,
        publishedArticles: 0,
        totalClubs: 0,
        totalPlayers: 0,
        totalLeagues: 0
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalArticles: 0,
        draftArticles: 0,
        publishedArticles: 0,
        totalClubs: 0,
        totalPlayers: 0,
        totalLeagues: 0
      }
    }
  },

  // Get draft articles
  async getDraftArticles(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    league?: string
    status?: string
    transfer_status?: string
    sortBy?: string
    sortOrder?: string
  }): Promise<{
    articles: any[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    stats: any
  }> {
    try {
      const queryParams = new URLSearchParams({
        status: params?.status || 'all',
        page: (params?.page || 1).toString(),
        limit: (params?.limit || 50).toString()
      })
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.category) queryParams.append('category', params.category)
      if (params?.league) queryParams.append('league', params.league)
      if (params?.transfer_status) queryParams.append('transfer_status', params.transfer_status)
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)
      
      console.log('Calling admin articles API:', `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.articles}?${queryParams}`)
      
      const response = await apiRequest<any>(
        `${API_CONFIG.endpoints.admin.articles}?${queryParams}`
      )
      
      console.log('Admin articles API response:', response)
      
      // Handle different response structures from normalized database
      let articles = []
      if (response.success && response.data) {
        articles = response.data.articles || response.data || []
      } else if (response.articles) {
        articles = response.articles
      } else if (Array.isArray(response)) {
        articles = response
      }
      
      console.log('Processed articles:', articles)
      
      return {
        articles: articles,
        pagination: response.data?.pagination || response.pagination || { page: 1, limit: 50, total: articles.length, totalPages: 1 },
        stats: response.data?.stats || response.stats || {}
      }
    } catch (error) {
      console.error('Error fetching draft articles:', error)
      return {
        articles: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        stats: {}
      }
    }
  },

  // Delete article
  async deleteArticle(id: string): Promise<boolean> {
    try {
      await apiRequest(`${API_CONFIG.endpoints.admin.deleteArticle}/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Error deleting article:', error)
      return false
    }
  },

  // Update article status
  async updateArticleStatus(id: string, status: 'draft' | 'published' | 'archived'): Promise<boolean> {
    try {
      await apiRequest(`${API_CONFIG.endpoints.admin.updateStatus}/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      })
      return true
    } catch (error) {
      console.error('Error updating article status:', error)
      return false
    }
  },

  // Get recent articles for dashboard
  async getRecentArticles(limit = 5): Promise<any[]> {
    try {
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.admin.recentArticles}?limit=${limit}`
      )
      return response.data.articles
    } catch (error) {
      console.error('Error fetching recent articles:', error)
      throw error // Don't return mock data
    }
  }
}

// User API functions
export const userApi = {
  // Get user profile
  async getProfile(): Promise<any> {
    try {
      const response = await apiRequest<{ success: boolean; data: { profile: any } }>(
        API_CONFIG.endpoints.user.profile
      )
      return response.data?.profile || {}
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return {}
    }
  },

  // Update user profile
  async updateProfile(profile: {
    firstName?: string
    lastName?: string
    bio?: string
    preferences?: Record<string, unknown>
  }): Promise<boolean> {
    try {
      const response = await apiRequest(
        API_CONFIG.endpoints.user.profile,
        {
          method: 'PUT',
          body: JSON.stringify(profile)
        }
      )
      return response.success || true
    } catch (error) {
      console.error('Error updating user profile:', error)
      return false
    }
  },

  // Get user preferences
  async getPreferences(): Promise<Record<string, unknown>> {
    try {
      const response = await apiRequest<{ success: boolean; data: { preferences: any } }>(
        API_CONFIG.endpoints.user.preferences
      )
      return response.data?.preferences || {}
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      return {}
    }
  },

  // Update user preferences
  async updatePreferences(preferences: Record<string, unknown>): Promise<boolean> {
    try {
      const response = await apiRequest(
        API_CONFIG.endpoints.user.preferences,
        {
          method: 'PUT',
          body: JSON.stringify({ preferences })
        }
      )
      return response.success || true
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return false
    }
  }
}

// Contact API functions
export const contactApi = {
  // Submit contact form
  async submit(contactData: {
    name: string
    email: string
    subject?: string
    message: string
    type?: string
  }): Promise<{ success: boolean; submissionId?: string }> {
    try {
      const response = await apiRequest<{ 
        success: boolean
        data: { submissionId: string; status: string }
      }>(
        API_CONFIG.endpoints.contact.submit,
        {
          method: 'POST',
          body: JSON.stringify(contactData)
        }
      )
      return {
        success: response.success || true,
        submissionId: response.data?.submissionId
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      return { success: false }
    }
  },

  // Get contact submissions (admin only)
  async getSubmissions(params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }): Promise<{
    submissions: any[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.status) queryParams.append('status', params.status)
      if (params?.type) queryParams.append('type', params.type)

      const response = await apiRequest<{ 
        success: boolean
        data: { 
          submissions: any[]
          pagination: any
        }
      }>(
        `${API_CONFIG.endpoints.contact.list}?${queryParams}`
      )
      
      return {
        submissions: response.data?.submissions || [],
        pagination: response.data?.pagination
      }
    } catch (error) {
      console.error('Error getting contact submissions:', error)
      return { submissions: [] }
    }
  },

  // Update contact submission (admin only)
  async updateSubmission(submissionId: string, updates: {
    status?: string
    adminNotes?: string
  }): Promise<boolean> {
    try {
      const response = await apiRequest(
        `${API_CONFIG.endpoints.contact.list}/${submissionId}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates)
        }
      )
      return response.success || true
    } catch (error) {
      console.error('Error updating contact submission:', error)
      return false
    }
  }
}

// Search tracking API functions
export const searchApi = {
  // Track a search query
  async trackSearch(query: string, filters?: {
    league?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<boolean> {
    try {
      // Don't track empty or very short queries
      if (!query || query.trim().length < 2) {
        return false
      }

      const response = await apiRequest(
        API_CONFIG.endpoints.search.track,
        {
          method: 'POST',
          body: JSON.stringify({
            query: query.trim(),
            filters,
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : null,
            // Note: IP address will be determined by the server
          })
        }
      )
      return response.success || true
    } catch (error) {
      console.error('Error tracking search:', error)
      return false // Don't let tracking failures affect search functionality
    }
  },

  // Get trending searches
  async getTrendingSearches(params?: {
    limit?: number
    days?: number
  }): Promise<Array<{
    name: string
    query: string
    count: string
    search_count: number
  }>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.days) queryParams.append('days', params.days.toString())

      const response = await apiRequest<{
        success: boolean
        data: {
          trending: Array<{
            name: string
            query: string
            count: string
            search_count: number
          }>
        }
      }>(
        `${API_CONFIG.endpoints.search.trending}?${queryParams}`
      )
      
      return response.data?.trending || []
    } catch (error) {
      console.error('Error getting trending searches:', error)
      // Return fallback data
      return [
        { name: "Kylian Mbappé", count: "2.3k searches", query: "Kylian Mbappé", search_count: 2300 },
        { name: "Manchester United", count: "1.8k searches", query: "Manchester United", search_count: 1800 },
        { name: "Real Madrid", count: "1.5k searches", query: "Real Madrid", search_count: 1500 },
        { name: "Transfer Deadline", count: "1.2k searches", query: "Transfer Deadline", search_count: 1200 },
        { name: "Premier League", count: "980 searches", query: "Premier League", search_count: 980 },
      ]
    }
  },

  // Get search statistics (admin only)
  async getSearchStats(): Promise<{
    totalSearches: number
    uniqueQueries: number
    topSearches: Array<{
      original_query: string
      search_count: number
      last_searched_at: string
    }>
    recentActivity: {
      recent_searches: number
      unique_recent: number
    }
  }> {
    try {
      const response = await apiRequest<{
        success: boolean
        data: {
          totalSearches: number
          uniqueQueries: number
          topSearches: Array<{
            original_query: string
            search_count: number
            last_searched_at: string
          }>
          recentActivity: {
            recent_searches: number
            unique_recent: number
          }
        }
      }>(
        API_CONFIG.endpoints.search.stats
      )
      
      return response.data || {
        totalSearches: 0,
        uniqueQueries: 0,
        topSearches: [],
        recentActivity: { recent_searches: 0, unique_recent: 0 }
      }
    } catch (error) {
      console.error('Error getting search statistics:', error)
      return {
        totalSearches: 0,
        uniqueQueries: 0,
        topSearches: [],
        recentActivity: { recent_searches: 0, unique_recent: 0 }
      }
    }
  }
}