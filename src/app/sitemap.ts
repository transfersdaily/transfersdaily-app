import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://transferdaily.com'
  
  // Generate sitemap entries for all locales
  const routes = [
    '',
    '/latest',
    '/about',
    '/contact',
    '/search',
    '/transfers/confirmed',
    '/transfers/completed',
    '/transfers/rumors',
    '/league/premier-league',
    '/league/la-liga',
    '/league/serie-a',
    '/league/bundesliga',
    '/league/ligue-1',
  ]
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Add entries for each locale and route combination
  locales.forEach(locale => {
    routes.forEach(route => {
      // Determine priority and change frequency based on page type
      let priority = 0.8
      let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'daily'
      
      if (route === '') {
        // Homepage - highest priority, changes hourly
        priority = 1.0
        changeFrequency = 'hourly'
      } else if (route === '/latest' || route.startsWith('/transfers/')) {
        // Latest and transfer pages - high priority, changes frequently
        priority = 0.9
        changeFrequency = 'hourly'
      } else if (route.startsWith('/league/')) {
        // League pages - high priority, changes daily
        priority = 0.8
        changeFrequency = 'daily'
      } else if (route === '/search') {
        // Search page - medium priority, changes daily
        priority = 0.7
        changeFrequency = 'daily'
      } else if (route === '/about' || route === '/contact') {
        // Static pages - lower priority, changes rarely
        priority = 0.6
        changeFrequency = 'monthly'
      }
      
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(lang => [lang, `${baseUrl}/${lang}${route}`])
          )
        }
      })
    })
  })
  
  return sitemapEntries
}
