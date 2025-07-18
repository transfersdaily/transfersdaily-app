// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod',
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
      bySlug: '/public/articles',
      trending: '/public/articles'
    },

    newsletter: {
      subscribe: '/user/newsletter',
      list: '/user/newsletter',
      unsubscribe: '/user/newsletter'
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
      trending: '/search/trending',
      stats: '/search/stats'
    },
    admin: {
      stats: '/admin/stats',
      articles: '/admin/articles',
      recentArticles: '/admin/articles/recent',
      deleteArticle: '/admin/articles',
      updateStatus: '/admin/articles',
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

// Auth Configuration - Using Admin User Pool
export const AUTH_CONFIG = {
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-east-1_l7nRMdlIM',
  userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '7tap3rig4oim99d0btf24l0rih',
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
  refreshToken: 'transfersdaily_refresh_token',
  user: 'transfersdaily_user',
  preferences: 'transfersdaily_preferences'
}