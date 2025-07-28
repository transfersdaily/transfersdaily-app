import { API_CONFIG } from './config'
import { getAuthHeaders } from './api'

export interface Player {
  id: number
  full_name: string
  nationality?: string
  position?: string
  date_of_birth?: string
  market_value?: number
  current_club_id?: number
  club_name?: string
  league_name?: string
  articles_from_count?: number
  articles_to_count?: number
  total_articles?: number
}

export async function getPlayers(language = 'en'): Promise<Player[]> {
  try {
    const authHeaders = await getAuthHeaders()
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.players.all}?lang=${language}`,
      {
        headers: authHeaders
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch players')
    }
    
    return data.data?.players || []
  } catch (error) {
    console.error('Error fetching players:', error)
    throw error
  }
}

export async function getPlayerById(id: number, language = 'en'): Promise<Player | null> {
  try {
    const authHeaders = await getAuthHeaders()
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.players.byId}/${id}?lang=${language}`,
      {
        headers: authHeaders
      }
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch player')
    }
    
    return data.data || null
  } catch (error) {
    console.error('Error fetching player:', error)
    throw error
  }
}