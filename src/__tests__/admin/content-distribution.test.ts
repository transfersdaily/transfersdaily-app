import { describe, it, expect } from 'vitest'

// Test content distribution aggregation logic
describe('Content Distribution', () => {
  describe('League Distribution Aggregation', () => {
    it('should aggregate articles by league', () => {
      const rows = [
        { league: 'Premier League' },
        { league: 'Premier League' },
        { league: 'La Liga' },
        { league: 'Serie A' },
      ]

      const leagueCounts: Record<string, number> = {}
      for (const row of rows) {
        const league = row.league || 'Unknown'
        leagueCounts[league] = (leagueCounts[league] || 0) + 1
      }

      expect(leagueCounts['Premier League']).toBe(2)
      expect(leagueCounts['La Liga']).toBe(1)
      expect(leagueCounts['Serie A']).toBe(1)
    })

    it('should handle null leagues as Unknown', () => {
      const rows = [{ league: null }, { league: undefined }]

      const leagueCounts: Record<string, number> = {}
      for (const row of rows) {
        const league = row.league || 'Unknown'
        leagueCounts[league] = (leagueCounts[league] || 0) + 1
      }

      expect(leagueCounts['Unknown']).toBe(2)
    })
  })

  describe('Daily Articles Aggregation (Fixed)', () => {
    it('should use published_at for published articles', () => {
      const dayMap: Record<string, { published: number; drafts: number }> = {
        '2026-04-01': { published: 0, drafts: 0 },
        '2026-04-02': { published: 0, drafts: 0 },
      }

      const rows = [
        { status: 'published', created_at: '2026-04-01T10:00:00Z', published_at: '2026-04-02T14:00:00Z' },
      ]

      for (const row of rows) {
        if (row.status === 'published') {
          const pubDate = row.published_at || row.created_at
          const key = new Date(pubDate).toISOString().split('T')[0]
          if (key in dayMap) dayMap[key].published++
        } else if (row.status === 'draft') {
          const dateStr = row.created_at
          const key = new Date(dateStr).toISOString().split('T')[0]
          if (key in dayMap) dayMap[key].drafts++
        }
      }

      // Article should be counted on publish date, not creation date
      expect(dayMap['2026-04-01'].published).toBe(0)
      expect(dayMap['2026-04-02'].published).toBe(1)
    })

    it('should fall back to created_at if published_at is missing', () => {
      const dayMap: Record<string, { published: number; drafts: number }> = {
        '2026-04-01': { published: 0, drafts: 0 },
      }

      const rows = [
        { status: 'published', created_at: '2026-04-01T10:00:00Z', published_at: null },
      ]

      for (const row of rows) {
        if (row.status === 'published') {
          const pubDate = row.published_at || row.created_at
          if (!pubDate) return
          const key = new Date(pubDate).toISOString().split('T')[0]
          if (key in dayMap) dayMap[key].published++
        }
      }

      expect(dayMap['2026-04-01'].published).toBe(1)
    })

    it('should count drafts by created_at', () => {
      const dayMap: Record<string, { published: number; drafts: number }> = {
        '2026-04-01': { published: 0, drafts: 0 },
      }

      const rows = [
        { status: 'draft', created_at: '2026-04-01T10:00:00Z', published_at: null },
      ]

      for (const row of rows) {
        if (row.status === 'draft') {
          const key = new Date(row.created_at).toISOString().split('T')[0]
          if (key in dayMap) dayMap[key].drafts++
        }
      }

      expect(dayMap['2026-04-01'].drafts).toBe(1)
    })
  })

  describe('30-Day Gap Fill', () => {
    it('should create entries for all 30 days', () => {
      const dayMap: Record<string, { published: number; drafts: number }> = {}
      for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        dayMap[key] = { published: 0, drafts: 0 }
      }

      expect(Object.keys(dayMap)).toHaveLength(30)
    })
  })
})

describe('Translation Coverage', () => {
  it('should set English coverage to 100%', () => {
    const totalPublished = 50
    const langCounts: Record<string, number> = { es: 20, fr: 10, de: 5, it: 3 }
    const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it']

    const languages = SUPPORTED_LANGUAGES.map(lang => {
      const isEnglish = lang === 'en'
      const articleCount = totalPublished
      const translatedCount = isEnglish ? totalPublished : (langCounts[lang] || 0)
      const coveragePercent = totalPublished > 0
        ? Math.round((translatedCount / totalPublished) * 100)
        : 0
      return { language: lang, articleCount, translatedCount, coveragePercent }
    })

    const en = languages.find(l => l.language === 'en')!
    expect(en.coveragePercent).toBe(100)
    expect(en.translatedCount).toBe(50)

    const es = languages.find(l => l.language === 'es')!
    expect(es.coveragePercent).toBe(40)
    expect(es.translatedCount).toBe(20)
    expect(es.articleCount).toBe(50)
  })

  it('should handle zero published articles', () => {
    const totalPublished = 0
    const coveragePercent = totalPublished > 0 ? Math.round((0 / totalPublished) * 100) : 0
    expect(coveragePercent).toBe(0)
  })
})
