import { describe, it, expect } from 'vitest'

// Test the getTrend function logic (extracted from KpiCard)
function getTrend(data: number[]): "up" | "down" | "flat" {
  if (data.length < 4) return "flat"
  const midpoint = Math.floor(data.length / 2)
  const recent = data.slice(midpoint)
  const older = data.slice(0, midpoint)
  const recentAvg = recent.reduce((s, v) => s + v, 0) / recent.length
  const olderAvg = older.reduce((s, v) => s + v, 0) / older.length
  if (olderAvg === 0 && recentAvg === 0) return "flat"
  if (olderAvg === 0) return "up"
  if (recentAvg > olderAvg * 1.1) return "up"
  if (recentAvg < olderAvg * 0.9) return "down"
  return "flat"
}

describe('KpiCard getTrend', () => {
  it('should return "flat" for empty arrays', () => {
    expect(getTrend([])).toBe("flat")
  })

  it('should return "flat" for arrays with less than 4 elements', () => {
    expect(getTrend([1, 2, 3])).toBe("flat")
  })

  it('should return "up" when recent values are higher', () => {
    expect(getTrend([1, 1, 1, 1, 5, 5, 5])).toBe("up")
  })

  it('should return "down" when recent values are lower', () => {
    expect(getTrend([5, 5, 5, 5, 1, 1, 1])).toBe("down")
  })

  it('should return "flat" when values are similar', () => {
    expect(getTrend([3, 3, 3, 3, 3, 3, 3])).toBe("flat")
  })

  it('should return "flat" for all zeros', () => {
    expect(getTrend([0, 0, 0, 0, 0, 0, 0])).toBe("flat")
  })

  it('should return "up" when older is zero and recent is positive', () => {
    expect(getTrend([0, 0, 0, 0, 1, 2, 3])).toBe("up")
  })

  it('should handle exactly 4 elements', () => {
    expect(getTrend([1, 1, 5, 5])).toBe("up")
    expect(getTrend([5, 5, 1, 1])).toBe("down")
  })

  it('should handle large datasets', () => {
    const data = Array.from({ length: 30 }, (_, i) => i)
    expect(getTrend(data)).toBe("up")
  })

  it('should not crash with single element', () => {
    expect(getTrend([5])).toBe("flat")
  })

  it('should consider 10% threshold', () => {
    // Within 10% threshold should be flat
    expect(getTrend([10, 10, 10, 10, 10, 10, 11])).toBe("flat")
    // Beyond 10% should be up
    expect(getTrend([10, 10, 10, 10, 12, 12, 12])).toBe("up")
  })
})
