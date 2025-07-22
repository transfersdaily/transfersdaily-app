import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://transferdaily.com'
  
  // Generate sitemap entries for all locales
  const routes = [
    '',
    '/latest',
    '/trending',
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
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'hourly' : 'daily',
        priority: route === '' ? 1 : 0.8,
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
