import { API_CONFIG } from './config'

export interface Club {
  id: number
  name: string
  short_name?: string
  founded_date?: string
  country?: string
  stadium?: string
  league_id?: number
  league_name?: string
  player_count?: number
  article_count?: number
}

export async function getClubs(language = 'en'): Promise<Club[]> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.clubs.all}?lang=${language}`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch clubs')
    }
    
    return data.data || []
  } catch (error) {
    console.error('Error fetching clubs:', error)
    throw error
  }
}

export async function getClubById(id: number, language = 'en'): Promise<Club | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.clubs.byId}/${id}?lang=${language}`
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch club')
    }
    
    return data.data || null
  } catch (error) {
    console.error('Error fetching club:', error)
    throw error
  }
}