import { API_CONFIG, STORAGE_KEYS } from './config'
import { processImageUrl } from './image-utils'

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

// Helper function to decode JWT token (basic decode, no verification)
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Helper function to refresh access token using refresh token
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

    console.log('🔄 Attempting to refresh access token...');
    
    const response = await fetch('https://cognito-idp.us-east-1.amazonaws.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
      },
      body: JSON.stringify({
        ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '7tap3rig4oim99d0btf24l0rih',
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken
        }
      })
    });

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      return null;
    }

    const result = await response.json();
    
    if (result.AuthenticationResult?.AccessToken) {
      const newAccessToken = result.AuthenticationResult.AccessToken;
      const newIdToken = result.AuthenticationResult.IdToken;
      
      localStorage.setItem(STORAGE_KEYS.accessToken, newAccessToken);
      if (newIdToken) localStorage.setItem(STORAGE_KEYS.idToken, newIdToken);
      
      console.log('✅ Tokens refreshed successfully');
      return newIdToken || newAccessToken; // Return ID token for auth headers
    }

    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Helper function to get auth headers with automatic token refresh
export async function getAuthHeaders(): Promise<HeadersInit> {
  // Use ID token for Cognito User Pool Authorizer (not access token)
  let token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.idToken) : null;
  
  // Debug logging
  console.log('🔐 getAuthHeaders called');
  console.log('  - Window available:', typeof window !== 'undefined');
  console.log('  - ID Token present:', !!token);
  
  if (token) {
    console.log('  - Token length:', token.length);
    console.log('  - Token preview:', `${token.substring(0, 50)}...`);
    
    // Check token expiration
    const decoded = decodeJWT(token);
    if (decoded && decoded.exp) {
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const isExpired = currentTime >= expirationTime;
      const timeUntilExpiry = expirationTime - currentTime;
      
      console.log('  - Token expiration:', new Date(expirationTime).toISOString());
      console.log('  - Current time:', new Date(currentTime).toISOString());
      console.log('  - Token expired:', isExpired);
      console.log('  - Time until expiry:', Math.round(timeUntilExpiry / 1000 / 60), 'minutes');
      console.log('  - Token claims:', decoded);
      console.log('  - Token type (typ):', decoded.typ);
      console.log('  - Token audience (aud):', decoded.aud);
      console.log('  - Token issuer (iss):', decoded.iss);
      console.log('  - Token use (token_use):', decoded.token_use);
      
      // If token is expired or expires in less than 5 minutes, try to refresh
      if (isExpired || timeUntilExpiry < 5 * 60 * 1000) {
        console.log('🔄 Token expired or expiring soon, attempting refresh...');
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
          console.log('✅ Using refreshed token');
        } else {
          console.warn('⚠️ Token refresh failed, clearing auth data');
          localStorage.removeItem(STORAGE_KEYS.accessToken);
          localStorage.removeItem(STORAGE_KEYS.idToken);
          localStorage.removeItem(STORAGE_KEYS.refreshToken);
          localStorage.removeItem(STORAGE_KEYS.user);
          token = null;
        }
      }
    } else {
      console.warn('⚠️ Could not decode token or missing expiration');
    }
  } else {
    console.log('  - No token found in localStorage');
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log('  - Authorization header set with Bearer token');
  } else {
    console.log('  - No token, Authorization header not set');
  }
  
  return headers
}

// Generic fetch wrapper - no fallback data
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      ...(await getAuthHeaders()),
      ...options.headers
    }
  }

  // Try primary API Gateway URL, then fallback if available
  const urls = [API_CONFIG.baseUrl, API_CONFIG.fallbackUrl].filter(Boolean);
  
  for (let i = 0; i < urls.length; i++) {
    const baseUrl = urls[i];
    const url = `${baseUrl}${endpoint}`;
    const isLastAttempt = i === urls.length - 1;
    const urlType = i === 0 ? 'API Gateway primary' : 'fallback URL';
    
    console.log(`🌐 Making API request to ${urlType} (attempt ${i + 1}/${urls.length}):`);
    console.log('  - URL:', url);
    console.log('  - Method:', config.method || 'GET');

    try {
      const response = await fetch(url, {
        ...config,
        // Add timeout to prevent hanging on DNS resolution
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      console.log(`📡 API response received from ${urlType}:`);
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      
      if (!response.ok) {
        console.error(`API request failed on ${urlType}: ${response.status} ${response.statusText}`);
        if (isLastAttempt) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('🔄 Trying next URL...');
        continue; // Try next URL
      }
      
      const data = await response.json();
      console.log(`✅ API request successful via ${urlType}`);
      return data;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API request failed for ${urlType} (${url}):`, errorMessage);
      
      // Check if it's a DNS resolution error or network error
      if (errorMessage.includes('ERR_NAME_NOT_RESOLVED') || 
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('TimeoutError')) {
        console.log(`🔄 ${urlType} not available, trying fallback...`);
      }
      
      if (isLastAttempt) {
        console.error('❌ All API endpoints failed');
        throw error;
      }
      
      continue; // Try next URL
    }
  }
  
  throw new Error('All API endpoints failed');
}

// Helper function to get current language
function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    // Check URL for language prefix
    const path = window.location.pathname
    const langMatch = path.match(/^\/([a-z]{2})(\/|$)/)
    if (langMatch) {
      return langMatch[1]
    }
  }
  return 'en' // Default to English
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Helper function to transform article data to transfer format
function transformArticleToTransfer(article: any): Transfer {
  const slug = article.slug || generateSlug(article.title || '')
  
  // Process image URL with proper handling
  const rawImageData = article.image_url || article.images || article.imageUrl
  const imageUrl = processImageUrl(rawImageData)
  
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
    publishedAt: article.publishedDate || article.published_date || article.published_at || article.createdAt || article.created_at,
    imageUrl: imageUrl,
    source: article.originalLink || article.original_link,
    tags: article.tags || [],
    slug: slug
  }
}

// Helper function to transform article data to article format
function transformArticleToArticle(article: any): Article {
  const slug = article.slug || generateSlug(article.title || '')
  
  return {
    id: article.uuid || article.id,
    title: article.title,
    excerpt: article.content ? article.content.substring(0, 200) + '...' : '',
    content: article.content,
    publishedAt: article.publishedDate || article.published_date || article.published_at || article.createdAt || article.created_at,
    imageUrl: article.image_url,
    author: 'TransfersDaily',
    tags: article.tags || [],
    league: article.league,
    slug: slug
  }
}

// Transfer API functions
export const transfersApi = {
  // Get latest transfers with pagination info
  async getLatestWithPagination(limit = 10, offset = 0, language = 'en'): Promise<{
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
        language: language,
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
      throw error
    }
  },

  // Get latest transfers
  async getLatest(limit = 10, offset = 0, language?: string): Promise<Transfer[]> {
    try {
      const currentLang = language || getCurrentLanguage()
      console.log('🌐 transfersApi.getLatest: Using language:', currentLang)
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: Math.floor(offset / limit + 1).toString(),
        status: 'published',
        language: currentLang  // Changed from 'lang' to 'language' to match backend
      })
      
      console.log('📡 transfersApi.getLatest: API params:', Object.fromEntries(params))
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.transfers.latest}?${params}`
      )
      
      const articles = response.data?.articles || (response as any).articles || []
      console.log('✅ transfersApi.getLatest: Received', articles.length, 'articles for language:', currentLang)
      
      return articles.map(transformArticleToTransfer)
    } catch (error) {
      console.error('❌ transfersApi.getLatest: Error fetching latest transfers for language:', language, error)
      throw error
    }
  },

  // Get transfers by league with pagination info
  async getByLeagueWithPagination(leagueSlug: string, limit = 10, offset = 0, language = 'en'): Promise<{
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
        league: leagueName,
        language: language
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
      throw error
    }
  },

  // Get transfers by league
  async getByLeague(leagueSlug: string, limit = 10, offset = 0, language?: string): Promise<Transfer[]> {
    try {
      const currentLang = language || getCurrentLanguage()
      
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
        league: leagueName,
        language: currentLang  // Added language parameter
      })
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.transfers.byLeague}?${params}`
      )
      
      const articles = response.data?.articles || (response as any).articles || []
      return articles.map(transformArticleToTransfer)
    } catch (error) {
      console.error('Error fetching transfers by league:', error)
      throw error
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
      throw error
    }
  },

  // Get transfer by ID
  async getById(id: string): Promise<Transfer | null> {
    try {
      const response = await apiRequest<{ success: boolean; data: { article: any } }>(
        `${API_CONFIG.endpoints.transfers.byId}/${id}`
      )
      
      const article = response.data?.article || (response as any).article
      return article ? transformArticleToTransfer(article) : null
    } catch (error) {
      console.error('Error fetching transfer by ID:', error)
      return null
    }
  },

  // Search transfers
  async search(query: string, filters?: {
    league?: string
    status?: string
    dateFrom?: string
    dateTo?: string
    language?: string
  }): Promise<Transfer[]> {
    try {
      const currentLang = filters?.language || getCurrentLanguage()
      
      const params = new URLSearchParams({ 
        search: query,
        status: 'published',
        language: currentLang  // Added language parameter
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

      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.transfers.search}?${params}`
      )
      
      const articles = response.data?.articles || (response as any).articles || []
      return articles.map(transformArticleToTransfer)
    } catch (error) {
      console.error('Error searching transfers:', error)
      throw error
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
        language: language  // Changed from 'lang' to 'language' to match backend
      })
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.articles.latest}?${params}`
      )
      
      const articles = response.data?.articles || (response as any).articles || []
      return articles.map(transformArticleToArticle)
    } catch (error) {
      console.error('Error fetching latest articles:', error)
      throw error
    }
  },

  // Get article by ID
  async getById(id: string): Promise<Article | null> {
    try {
      const response = await apiRequest<{ success: boolean; data: { article: any } }>(
        `${API_CONFIG.endpoints.articles.byId}/${id}`
      )
      
      const article = response.data?.article || (response as any).article
      return article ? transformArticleToArticle(article) : null
    } catch (error) {
      console.error('Error fetching article by ID:', error)
      return null
    }
  },

  // Get article by slug
  async getBySlug(slug: string, locale: string = 'en'): Promise<Article | null> {
    try {
      // Call backend API directly with language parameter
      const response = await apiRequest<any>(`/public/articles/${slug}?language=${locale}`)
      
      if (response && response.article) {
        return response.article
      }
      
      const article = response.data?.article || response.article || response
      return article ? transformArticleToArticle(article) : null
    } catch (error) {
      console.error('Error fetching article by slug:', error)
      
      // Fallback: try to find the article by searching through latest articles
      try {
        console.log('API error, attempting fallback: searching articles for slug match')
        const articles = await this.getLatest(100, 0, locale) // Get more articles to search through
        
        // Try to find an article that matches the slug exactly
        let matchingArticle = articles.find(article => {
          const articleSlug = generateSlug(article.title)
          return articleSlug === slug
        })
        
        // If no exact match, try partial matching
        if (!matchingArticle) {
          matchingArticle = articles.find(article => {
            const articleSlug = generateSlug(article.title)
            const slugWords = slug.split('-')
            const articleWords = articleSlug.split('-')
            
            // Check if most words match
            const matchingWords = slugWords.filter(word => 
              articleWords.some(articleWord => 
                articleWord.includes(word) || word.includes(articleWord)
              )
            )
            
            return matchingWords.length >= Math.min(3, slugWords.length * 0.6)
          })
        }
        
        if (matchingArticle) {
          console.log('Found matching article via fallback search:', matchingArticle.title)
          return matchingArticle
        }
        
        return null
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError)
        return null
      }
    }
  },

  // Get recommended articles (random selection from latest articles)
  async getRecommended(limit = 5, language = 'en'): Promise<Article[]> {
    try {
      const params = new URLSearchParams({
        limit: (limit * 3).toString(), // Get more articles to randomize from
        status: 'published',
        language: language // Add language parameter
      })
      
      console.log('Fetching recommended articles for language:', language)
      
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.articles.latest}?${params}`
      )
      
      const articles = response.data?.articles || (response as any).articles || []
      
      // Randomize the articles client-side and return the requested limit
      const shuffled = [...articles].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, limit).map(transformArticleToArticle)
    } catch (error) {
      console.error('Error fetching recommended articles:', error)
      throw error
    }
  },

  // Get trending articles (redirects to latest for now)
  async getTrending(limit = 5, language = 'en'): Promise<Article[]> {
    try {
      console.log('Trending articles redirecting to latest articles for language:', language)
      
      // Redirect trending to latest articles for now
      return await this.getLatest(limit, 0, language)
    } catch (error) {
      console.error('Error fetching trending articles (redirected to latest):', error)
      throw error
    }
  }
}

// Leagues API functions
export const leaguesApi = {
  // Get all leagues (extracted from articles)
  async getAll(): Promise<League[]> {
    try {
      const response = await apiRequest<{ success: boolean; data: { articles: any[] } }>(
        `${API_CONFIG.endpoints.leagues.all}?limit=100&status=published`
      )
      
      // Extract unique leagues from articles
      const leaguesSet = new Set<string>()
      const leagues: League[] = []
      const articles = response.data?.articles || (response as any).articles || []
      
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
      
      return leagues
    } catch (error) {
      console.error('Error fetching leagues:', error)
      throw error
    }
  },

  // Get league by slug
  async getBySlug(slug: string): Promise<League | null> {
    try {
      const leagues = await this.getAll()
      return leagues.find(league => league.slug === slug) || null
    } catch (error) {
      console.error('Error fetching league by slug:', error)
      throw error
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
    createdToday: number
    createdThisWeek: number
    createdThisMonth: number
    byCategory: Array<{
      name: string
      value: number
      color: string
    }>
    byLeague: Array<{
      name: string
      value: number
    }>
    dailyActivity: Array<{
      date: string
      count: number
    }>
  }> {
    try {
      const response = await apiRequest<any>(API_CONFIG.endpoints.admin.stats)
      return response.data || {
        totalArticles: 0,
        draftArticles: 0,
        publishedArticles: 0,
        totalClubs: 0,
        totalPlayers: 0,
        totalLeagues: 0,
        createdToday: 0,
        createdThisWeek: 0,
        createdThisMonth: 0,
        byCategory: [],
        byLeague: [],
        dailyActivity: []
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalArticles: 0,
        draftArticles: 0,
        publishedArticles: 0,
        totalClubs: 0,
        totalPlayers: 0,
        totalLeagues: 0,
        createdToday: 0,
        createdThisWeek: 0,
        createdThisMonth: 0,
        byCategory: [],
        byLeague: [],
        dailyActivity: []
      }
    }
  },

  // Get articles (generic method for any status)
  async getArticles(params?: {
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

      console.log('🔍 Fetching articles with params:', Object.fromEntries(queryParams))
      
      const response = await apiRequest<any>(`${API_CONFIG.endpoints.admin.articles}?${queryParams}`)
      console.log('📊 Articles API response:', response)

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch articles')
      }

      return {
        articles: response.data?.articles || [],
        pagination: response.data?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 },
        stats: response.data?.stats || null
      }
    } catch (error) {
      console.error('💥 Error fetching articles:', error)
      throw error
    }
  },

  // Get draft articles (legacy method - now uses getArticles)
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
      
      console.log('Calling admin articles API:', `${API_CONFIG.endpoints.admin.articles}?${queryParams}`)
      
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

  // Clubs API functions
  async getClubs(params?: {
    page?: number
    limit?: number
    search?: string
    league?: string
  }): Promise<{
    clubs: Array<{
      id: number
      name: string
      league_id?: number
      league_name?: string
      country?: string
      player_count?: number
      article_count?: number
      created_at: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: (params?.page || 1).toString(),
        limit: (params?.limit || 50).toString()
      })
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.league) queryParams.append('league', params.league)

      console.log('🏢 Fetching clubs with params:', Object.fromEntries(queryParams))
      
      const response = await apiRequest<any>(`${API_CONFIG.endpoints.admin.clubs.all}?${queryParams}`)
      console.log('📊 Clubs API response:', response)

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch clubs')
      }

      return {
        clubs: response.clubs || [],  // Backend now returns clubs in 'clubs' field
        pagination: response.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 }
      }
    } catch (error) {
      console.error('💥 Error fetching clubs:', error)
      throw error
    }
  },

  // Players API functions
  async getPlayers(params?: {
    page?: number
    limit?: number
    search?: string
    club?: string
  }): Promise<{
    players: Array<{
      id: number
      full_name: string
      current_club_id?: number
      current_club_name?: string
      league_name?: string
      country?: string
      article_count?: number
      created_at: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: (params?.page || 1).toString(),
        limit: (params?.limit || 50).toString()
      })
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.club) queryParams.append('club', params.club)

      console.log('👤 Fetching players with params:', Object.fromEntries(queryParams))
      
      const response = await apiRequest<any>(`${API_CONFIG.endpoints.admin.players.all}?${queryParams}`)
      console.log('📊 Players API response:', response)

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch players')
      }

      return {
        players: response.players || [],
        pagination: response.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 }
      }
    } catch (error) {
      console.error('💥 Error fetching players:', error)
      throw error
    }
  },

  async getPlayerById(id: number): Promise<{
    id: number
    full_name: string
    current_club_id?: number
    current_club_name?: string
    league_name?: string
    country?: string
    article_count?: number
    created_at: string
  } | null> {
    try {
      const response = await apiRequest<any>(`${API_CONFIG.endpoints.admin.players.byId}/${id}`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch player')
      }

      return response.data || null
    } catch (error) {
      console.error('💥 Error fetching player:', error)
      throw error
    }
  },

  // Leagues API functions
  async getLeagues(params?: {
    page?: number
    limit?: number
    search?: string
    country?: string
  }): Promise<{
    leagues: Array<{
      id: number
      name: string
      country: string
      club_count?: number
      player_count?: number
      article_count?: number
      created_at: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: (params?.page || 1).toString(),
        limit: (params?.limit || 50).toString()
      })
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.country) queryParams.append('country', params.country)

      console.log('🏆 Fetching leagues with params:', Object.fromEntries(queryParams))
      
      const response = await apiRequest<any>(`${API_CONFIG.endpoints.admin.leagues.all}?${queryParams}`)
      console.log('📊 Leagues API response:', response)

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch leagues')
      }

      return {
        leagues: response.leagues || [],
        pagination: response.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 }
      }
    } catch (error) {
      console.error('💥 Error fetching leagues:', error)
      throw error
    }
  },

  async getLeagueById(id: number): Promise<{
    id: number
    name: string
    country: string
    club_count?: number
    player_count?: number
    article_count?: number
    created_at: string
  } | null> {
    try {
      const response = await apiRequest<any>(`${API_CONFIG.endpoints.admin.leagues.byId}/${id}`)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch league')
      }

      return response.data || null
    } catch (error) {
      console.error('💥 Error fetching league:', error)
      throw error
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
      return (response as any).success || true
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
      return (response as any).success || true
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
      return (response as any).success || true
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
      return (response as any).success || true
    } catch (error) {
      console.error('Error tracking search:', error)
      return false // Don't let tracking failures affect search functionality
    }
  },

  // Get most searched terms for sidebar
  async getMostSearchedTerms(params?: {
    limit?: number
    days?: number
  }): Promise<Array<{
    term: string
    query: string
    count: number
    displayCount: string
    lastSearched: string
  }>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.days) queryParams.append('days', params.days.toString())

      const response = await apiRequest<{
        success: boolean
        data: {
          mostSearched: Array<{
            term: string
            query: string
            count: number
            displayCount: string
            lastSearched: string
          }>
          total: number
        }
      }>(
        `${API_CONFIG.endpoints.mostSearched}?${queryParams}`
      )
      
      return response.data?.mostSearched || []
    } catch (error) {
      console.error('Error getting most searched terms:', error)
      throw error
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
      // Return empty stats instead of throwing to prevent UI crashes
      return {
        totalSearches: 0,
        uniqueQueries: 0,
        topSearches: [],
        recentActivity: { recent_searches: 0, unique_recent: 0 }
      }
    }
  }
}

// Newsletter API functions
export const newsletterApi = {
  // Subscribe to newsletter (public)
  async subscribe(email: string, preferences?: {
    firstName?: string
    lastName?: string
    preferences?: Record<string, unknown>
  }): Promise<{ success: boolean; subscriptionId?: string }> {
    try {
      const response = await apiRequest<{ 
        success: boolean
        data: { subscriptionId: string; status: string }
      }>(
        API_CONFIG.endpoints.newsletter.subscribe,
        {
          method: 'POST',
          body: JSON.stringify({ email, ...preferences })
        }
      )
      return {
        success: response.success || true,
        subscriptionId: response.data?.subscriptionId
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      return { success: false }
    }
  },

  // Get all subscriptions (admin only)
  async getSubscriptions(): Promise<Array<{
    id: string
    email: string
    firstName?: string
    lastName?: string
    status: 'active' | 'unsubscribed' | 'bounced'
    subscribed_at: string
    unsubscribed_at?: string
    preferences?: Record<string, unknown>
    source?: string
  }>> {
    try {
      const response = await apiRequest<any>(API_CONFIG.endpoints.newsletter.list)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch newsletter subscribers')
      }

      return response.data?.subscribers || []
    } catch (error) {
      console.error('💥 Error fetching newsletter subscribers:', error)
      throw error
    }
  },

  // Unsubscribe user (admin only)
  async unsubscribe(subscriberId: string): Promise<void> {
    try {
      const response = await apiRequest<any>(`${API_CONFIG.endpoints.newsletter.unsubscribe}/${subscriberId}`, {
        method: 'POST'
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to unsubscribe user')
      }
    } catch (error) {
      console.error('💥 Error unsubscribing user:', error)
      throw error
    }
  },

  // Send newsletter email (admin only)
  async sendNewsletter(data: {
    subject: string
    articleId?: string
    articleTitle?: string
    articleUrl?: string
    customContent?: string
    recipientType?: 'all' | 'active' | 'test'
    testEmail?: string
  }): Promise<{ success: boolean; message?: string; sentCount?: number }> {
    try {
      console.log('📧 Sending newsletter:', data)
      
      const response = await apiRequest<{
        success: boolean
        message?: string
        data?: { sentCount: number }
      }>(API_CONFIG.endpoints.newsletter.send, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send newsletter')
      }
      
      return {
        success: true,
        message: response.message,
        sentCount: response.data?.sentCount
      }
    } catch (error) {
      console.error('💥 Error sending newsletter:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
