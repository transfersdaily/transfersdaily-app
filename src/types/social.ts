// --- Per-platform posting result (stored in articles.social_media_data JSONB) ---

export interface SocialPlatformResult {
  success: boolean
  error?: string
  uri?: string          // Bluesky post URI
  results?: unknown[]   // Facebook multi-page results
  skipped?: boolean
  reason?: string       // e.g. 'monthly_limit'
}

export type SocialPlatform = 'twitter' | 'bluesky' | 'facebook' | 'threads'

export const SOCIAL_PLATFORMS: { key: SocialPlatform; label: string }[] = [
  { key: 'twitter', label: 'X / Twitter' },
  { key: 'bluesky', label: 'Bluesky' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'threads', label: 'Threads' },
]

// social_media_data JSONB structure on the articles table
export interface SocialMediaData {
  sourceName?: string
  excerpt?: string
  socialResults?: Record<SocialPlatform, SocialPlatformResult>
}

// Per-article social post status (for article editor sidebar)
export interface ArticleSocialStatus {
  articleId: string
  postedAt: string | null
  platforms: Record<SocialPlatform, SocialPlatformResult | null>
}

// --- Aggregate stats (SOCL-02) ---

export interface PlatformAggregateStats {
  platform: SocialPlatform
  label: string
  attempted: number
  succeeded: number
  failed: number
  skipped: number
}

export interface SocialAggregateStats {
  period: '7d' | '30d'
  platforms: PlatformAggregateStats[]
  totals: {
    attempted: number
    succeeded: number
    failed: number
  }
  cachedAt: string
}
