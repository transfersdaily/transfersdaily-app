import { API_CONFIG } from './config'

export interface League {
  id: number
  name: string
  country: string
  tier_level: number
  club_count: number
  player_count: number
  article_count: number
}

export async function getLeagues(language = 'en'): Promise<League[]> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.leagues.all}?lang=${language}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch leagues')
    }
    
    return data.data?.leagues || []
  } catch (error) {
    console.error('Error fetching leagues:', error)
    throw error
  }
}

export async function getLeagueById(id: number, language = 'en'): Promise<League | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.leagues.byId}/${id}?lang=${language}`
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch league')
    }
    
    return data.data || null
  } catch (error) {
    console.error('Error fetching league:', error)
    throw error
  }
}