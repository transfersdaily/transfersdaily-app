import { describe, it, expect } from 'vitest'

// Test analytics helper functions (extracted from analytics/traffic/route.ts)
function parseMetricValue(
  row: { metricValues?: Array<{ value?: string | null }> } | undefined,
  index: number,
  asFloat = false
): number {
  const raw = row?.metricValues?.[index]?.value || '0'
  return asFloat ? parseFloat(raw) : parseInt(raw, 10)
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

function buildKpi(current: number, previous: number) {
  return { value: current, change: calculateChange(current, previous) }
}

function fillTimeSeries(
  rows: Array<{ key: string; pageViews: number; sessions: number }>,
  days: number
): Array<{ label: string; pageViews: number; sessions: number }> {
  const isHourly = days <= 1
  const map = new Map(rows.map(r => [r.key, r]))
  const result: Array<{ label: string; pageViews: number; sessions: number }> = []
  const now = new Date()
  const start = new Date(now)

  if (isHourly) {
    start.setHours(start.getHours() - 24)
    const current = new Date(start)
    while (current <= now) {
      const key = current.toISOString().slice(0, 10).replace(/-/g, '') +
        current.getHours().toString().padStart(2, '0')
      const existing = map.get(key)
      result.push({
        label: current.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        pageViews: existing?.pageViews ?? 0,
        sessions: existing?.sessions ?? 0,
      })
      current.setHours(current.getHours() + 1)
    }
  } else {
    start.setDate(start.getDate() - days)
    const current = new Date(start)
    while (current <= now) {
      const key = current.toISOString().slice(0, 10).replace(/-/g, '')
      const existing = map.get(key)
      result.push({
        label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pageViews: existing?.pageViews ?? 0,
        sessions: existing?.sessions ?? 0,
      })
      current.setDate(current.getDate() + 1)
    }
  }
  return result
}

describe('Analytics Traffic Helpers', () => {
  describe('parseMetricValue', () => {
    it('should parse integer values', () => {
      const row = { metricValues: [{ value: '1234' }, { value: '5678' }] }
      expect(parseMetricValue(row, 0)).toBe(1234)
      expect(parseMetricValue(row, 1)).toBe(5678)
    })

    it('should parse float values when asFloat is true', () => {
      const row = { metricValues: [{ value: '12.5' }] }
      expect(parseMetricValue(row, 0, true)).toBe(12.5)
    })

    it('should return 0 for undefined row', () => {
      expect(parseMetricValue(undefined, 0)).toBe(0)
    })

    it('should return 0 for null value', () => {
      const row = { metricValues: [{ value: null }] }
      expect(parseMetricValue(row, 0)).toBe(0)
    })

    it('should return 0 for out-of-bounds index', () => {
      const row = { metricValues: [{ value: '100' }] }
      expect(parseMetricValue(row, 5)).toBe(0)
    })
  })

  describe('calculateChange', () => {
    it('should calculate positive change', () => {
      expect(calculateChange(200, 100)).toBe(100)
    })

    it('should calculate negative change', () => {
      expect(calculateChange(50, 100)).toBe(-50)
    })

    it('should return 0 when previous is 0', () => {
      expect(calculateChange(100, 0)).toBe(0)
    })

    it('should handle no change', () => {
      expect(calculateChange(100, 100)).toBe(0)
    })

    it('should round to 1 decimal place', () => {
      expect(calculateChange(133, 100)).toBe(33)
    })
  })

  describe('buildKpi', () => {
    it('should build KPI with value and change', () => {
      const kpi = buildKpi(200, 100)
      expect(kpi.value).toBe(200)
      expect(kpi.change).toBe(100)
    })
  })

  describe('fillTimeSeries', () => {
    it('should create daily entries for 7-day range', () => {
      const result = fillTimeSeries([], 7)
      // Should have approximately 8 entries (7 days + today)
      expect(result.length).toBeGreaterThanOrEqual(7)
      expect(result.length).toBeLessThanOrEqual(9)
    })

    it('should create hourly entries for 1-day range', () => {
      const result = fillTimeSeries([], 1)
      // Should have approximately 25 entries (24 hours + current)
      expect(result.length).toBeGreaterThanOrEqual(24)
      expect(result.length).toBeLessThanOrEqual(26)
    })

    it('should fill in existing data', () => {
      const today = new Date()
      const key = today.toISOString().slice(0, 10).replace(/-/g, '')
      const rows = [{ key, pageViews: 500, sessions: 100 }]

      const result = fillTimeSeries(rows, 7)
      const todayEntry = result.find(r => r.pageViews === 500)
      expect(todayEntry).toBeDefined()
      expect(todayEntry!.sessions).toBe(100)
    })

    it('should fill gaps with zeros', () => {
      const result = fillTimeSeries([], 7)
      for (const entry of result) {
        expect(entry.pageViews).toBe(0)
        expect(entry.sessions).toBe(0)
      }
    })
  })
})
