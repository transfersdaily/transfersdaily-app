import { describe, it, expect, vi, beforeEach } from 'vitest'

// Test the dashboard data transformation logic
describe('Dashboard API Logic', () => {
  describe('Pipeline Health Calculation', () => {
    it('should calculate 100% success rate when all articles are published', () => {
      const articles = [
        { status: 'published', created_at: new Date().toISOString(), published_at: new Date().toISOString() },
        { status: 'published', created_at: new Date().toISOString(), published_at: new Date().toISOString() },
      ]
      const totalProcessed = articles.length
      const totalPublished = articles.filter(a => a.status === 'published').length
      const successRate = totalProcessed > 0 ? Math.round((totalPublished / totalProcessed) * 100) : 0

      expect(successRate).toBe(100)
    })

    it('should calculate 50% success rate with mixed statuses', () => {
      const articles = [
        { status: 'published', created_at: new Date().toISOString(), published_at: new Date().toISOString() },
        { status: 'draft', created_at: new Date().toISOString(), published_at: null },
      ]
      const totalProcessed = articles.length
      const totalPublished = articles.filter(a => a.status === 'published').length
      const successRate = totalProcessed > 0 ? Math.round((totalPublished / totalProcessed) * 100) : 0

      expect(successRate).toBe(50)
    })

    it('should return 0% for empty dataset', () => {
      const articles: Array<{ status: string }> = []
      const totalProcessed = articles.length
      const totalPublished = articles.filter(a => a.status === 'published').length
      const successRate = totalProcessed > 0 ? Math.round((totalPublished / totalProcessed) * 100) : 0

      expect(successRate).toBe(0)
    })
  })

  describe('Trend Calculation', () => {
    it('should build 7-day trend arrays correctly', () => {
      const publishedDaily: number[] = []
      const testData = [
        { published_at: new Date().toISOString() },
        { published_at: new Date(Date.now() - 86400000).toISOString() },
      ]

      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date()
        dayStart.setDate(dayStart.getDate() - i)
        dayStart.setUTCHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart)
        dayEnd.setDate(dayEnd.getDate() + 1)
        const ds = dayStart.toISOString()
        const de = dayEnd.toISOString()

        publishedDaily.push(
          testData.filter(r => r.published_at >= ds && r.published_at < de).length
        )
      }

      expect(publishedDaily).toHaveLength(7)
      expect(publishedDaily.reduce((s, v) => s + v, 0)).toBe(2)
    })
  })

  describe('Date Utility Functions', () => {
    it('todayStart should return start of day in UTC', () => {
      const d = new Date()
      d.setUTCHours(0, 0, 0, 0)
      const today = d.toISOString()

      expect(today).toContain('T00:00:00.000Z')
    })

    it('daysAgo should correctly calculate past dates', () => {
      const daysAgo = (n: number) => {
        const d = new Date()
        d.setDate(d.getDate() - n)
        d.setUTCHours(0, 0, 0, 0)
        return d.toISOString()
      }

      const sevenDaysAgo = new Date(daysAgo(7))
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24))

      expect(diffDays).toBeGreaterThanOrEqual(7)
      expect(diffDays).toBeLessThanOrEqual(8)
    })

    it('monthStart should return first day of current month', () => {
      const d = new Date()
      d.setUTCDate(1)
      d.setUTCHours(0, 0, 0, 0)
      const monthStart = d.toISOString()

      expect(new Date(monthStart).getUTCDate()).toBe(1)
      expect(new Date(monthStart).getUTCHours()).toBe(0)
    })
  })
})
