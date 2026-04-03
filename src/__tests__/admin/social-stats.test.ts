import { describe, it, expect } from 'vitest'
import type { SocialPlatform, PlatformAggregateStats, SocialPlatformResult } from '@/types/social'

// Test social stats aggregation logic (extracted from social/stats/route.ts)
const PLATFORMS: { key: SocialPlatform; label: string }[] = [
  { key: 'twitter', label: 'X / Twitter' },
  { key: 'bluesky', label: 'Bluesky' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'threads', label: 'Threads' },
]

function aggregateSocialStats(
  rows: Array<{ social_media_data: Record<string, unknown> | null }>
) {
  const stats: Record<SocialPlatform, PlatformAggregateStats> = {} as Record<SocialPlatform, PlatformAggregateStats>

  for (const p of PLATFORMS) {
    stats[p.key] = {
      platform: p.key, label: p.label,
      attempted: 0, succeeded: 0, failed: 0, skipped: 0,
    }
  }

  for (const row of rows) {
    const data = row.social_media_data
    if (!data || typeof data !== 'object') continue

    const socialResults =
      (data as Record<string, unknown>).socialResults ?? data

    if (!socialResults || typeof socialResults !== 'object') continue

    for (const p of PLATFORMS) {
      const result = (socialResults as Record<string, SocialPlatformResult>)[p.key]
      if (!result || typeof result !== 'object') continue

      stats[p.key].attempted++

      if (result.skipped) {
        stats[p.key].skipped++
      } else if (result.success) {
        stats[p.key].succeeded++
      } else {
        stats[p.key].failed++
      }
    }
  }

  return stats
}

describe('Social Stats Aggregation', () => {
  it('should count successful posts correctly', () => {
    const rows = [
      {
        social_media_data: {
          socialResults: {
            twitter: { success: true },
            bluesky: { success: true },
            facebook: { success: false, error: 'rate limited' },
            threads: { skipped: true, reason: 'monthly_limit' },
          },
        },
      },
    ]

    const stats = aggregateSocialStats(rows)

    expect(stats.twitter.attempted).toBe(1)
    expect(stats.twitter.succeeded).toBe(1)
    expect(stats.twitter.failed).toBe(0)

    expect(stats.bluesky.succeeded).toBe(1)
    expect(stats.facebook.failed).toBe(1)
    expect(stats.threads.skipped).toBe(1)
  })

  it('should handle top-level platform keys (no socialResults wrapper)', () => {
    const rows = [
      {
        social_media_data: {
          twitter: { success: true },
          bluesky: { success: true },
        },
      },
    ]

    const stats = aggregateSocialStats(rows)
    expect(stats.twitter.succeeded).toBe(1)
    expect(stats.bluesky.succeeded).toBe(1)
  })

  it('should handle null social_media_data', () => {
    const rows = [
      { social_media_data: null },
      { social_media_data: {} },
    ]

    const stats = aggregateSocialStats(rows)
    for (const p of PLATFORMS) {
      expect(stats[p.key].attempted).toBe(0)
    }
  })

  it('should handle multiple articles', () => {
    const rows = [
      { social_media_data: { socialResults: { twitter: { success: true } } } },
      { social_media_data: { socialResults: { twitter: { success: false } } } },
      { social_media_data: { socialResults: { twitter: { success: true } } } },
    ]

    const stats = aggregateSocialStats(rows)
    expect(stats.twitter.attempted).toBe(3)
    expect(stats.twitter.succeeded).toBe(2)
    expect(stats.twitter.failed).toBe(1)
  })

  it('should calculate totals across platforms', () => {
    const rows = [
      {
        social_media_data: {
          socialResults: {
            twitter: { success: true },
            bluesky: { success: true },
            facebook: { success: true },
            threads: { success: true },
          },
        },
      },
    ]

    const stats = aggregateSocialStats(rows)
    const totals = {
      attempted: 0,
      succeeded: 0,
      failed: 0,
    }
    for (const p of PLATFORMS) {
      totals.attempted += stats[p.key].attempted
      totals.succeeded += stats[p.key].succeeded
      totals.failed += stats[p.key].failed
    }

    expect(totals.attempted).toBe(4)
    expect(totals.succeeded).toBe(4)
    expect(totals.failed).toBe(0)
  })
})
