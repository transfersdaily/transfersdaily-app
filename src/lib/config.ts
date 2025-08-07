// API Configuration - Uses environment variable only (no hardcoded fallbacks)
export const API_CONFIG = {
  // Primary API URL from environment variable (required)
  baseUrl: process.env.NEXT_PUBLIC_API_URL || (() => {
    console.error('❌ NEXT_PUBLIC_API_URL environment variable is required but not set');
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
  })(),
  // Fallback URL (only if provided in environment)
  fallbackUrl: process.env.NEXT_PUBLIC_API_URL_FALLBACK || null,
  // Use local API routes for client-side requests during development
  localApiUrl: typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api',
  // Determine if we're in development mode
  isDevelopment: typeof window !== 'undefined' && window.location.hostname === 'localhost',
  endpoints: {
    transfers: {
      latest: '/public/articles', // Transfers are handled by articles API
      byLeague: '/public/articles', // Filter by league parameter
      byId: '/public/articles',
      search: '/public/articles'
    },
    articles: {
      latest: '/public/articles',
      byId: '/public/articles',
      bySlug: '/article', // This will use the local API route
      trending: '/public/articles'
    },
    leagues: {
      all: '/public/articles' // Extract leagues from articles
    },

    newsletter: {
      subscribe: '/newsletter',
      list: '/newsletter',
      unsubscribe: '/newsletter',
      send: '/newsletter/send'
    },
    user: {
      profile: '/user/profile',
      preferences: '/user/preferences'
    },
    contact: {
      submit: '/contact',
      list: '/contact'
    },
    search: {
      track: '/search/track',
      stats: '/search/stats'
    },
    mostSearched: '/most-searched',
    admin: {
      stats: '/admin/stats',
      articles: '/admin/articles',
      recentArticles: '/admin/articles/recent',
      deleteArticle: '/admin/articles',
      updateStatus: '/admin/articles',
      media: {
        upload: '/admin/media/upload'
      },
      clubs: {
        all: '/admin/clubs',
        byId: '/admin/clubs'
      },
      leagues: {
        all: '/admin/leagues',
        byId: '/admin/leagues'
      },
      players: {
        all: '/admin/players',
        byId: '/admin/players'
      }
    }
  }
}

// Helper function to get the correct API URL
export function getApiUrl(endpoint: string): string {
  if (API_CONFIG.isDevelopment && endpoint.startsWith('/admin')) {
    return `${API_CONFIG.localApiUrl}${endpoint}`;
  }
  return `${API_CONFIG.baseUrl}${endpoint}`;
}

// Auth Configuration - Updated with new backend deployment
export const AUTH_CONFIG = {
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-east-1_l7nRMdlIM',
  userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 'lgi51cc7dt8jlrovcpilom0r0',
  region: 'us-east-1',
  // Cognito endpoints
  cognitoUrl: `https://cognito-idp.us-east-1.amazonaws.com/`,
  endpoints: {
    signUp: 'https://cognito-idp.us-east-1.amazonaws.com/',
    signIn: 'https://cognito-idp.us-east-1.amazonaws.com/',
    confirmSignUp: 'https://cognito-idp.us-east-1.amazonaws.com/',
    resendConfirmationCode: 'https://cognito-idp.us-east-1.amazonaws.com/'
  }
}

// Storage keys
export const STORAGE_KEYS = {
  accessToken: 'transfersdaily_access_token',
  idToken: 'transfersdaily_id_token',
  refreshToken: 'transfersdaily_refresh_token',
  user: 'transfersdaily_user',
  preferences: 'transfersdaily_preferences'
}