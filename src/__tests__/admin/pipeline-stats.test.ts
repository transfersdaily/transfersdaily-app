import { describe, it, expect } from 'vitest'
import type { PipelineSourceStats } from '@/types/pipeline'

// Test pipeline stats aggregation logic (extracted from pipeline/stats/route.ts)
describe('Pipeline Stats Aggregation', () => {
  const KNOWN_SOURCES = [
    'teamtalk', 'footballtransfers', 'football-espana', 'laliganews',
    'kicker', 'sportschau', 'gazzetta', 'tuttosport', 'sofoot', 'lequipe'
  ]

  function aggregatePipelineStats(articles: Array<{
    uuid: string
    status: string
    published_at: string | null
    created_at: string
    social_media_data: { sourceName?: string } | null
  }>, now24h: string) {
    const sourceStatsMap = new Map<string, PipelineSourceStats>()

    for (const name of KNOWN_SOURCES) {
      sourceStatsMap.set(name, {
        sourceName: name,
        articlesTotal: 0, articles24h: 0, articles7d: 0,
        published24h: 0, published7d: 0, drafts24h: 0, lastArticleAt: null,
      })
    }

    for (const article of articles) {
      const sourceName = article.social_media_data?.sourceName
      if (!sourceName) continue

      let stats = sourceStatsMap.get(sourceName)
      if (!stats) {
        stats = {
          sourceName, articlesTotal: 0, articles24h: 0, articles7d: 0,
          published24h: 0, published7d: 0, drafts24h: 0, lastArticleAt: null,
        }
        sourceStatsMap.set(sourceName, stats)
      }

      stats.articles7d++
      stats.articlesTotal++

      if (!stats.lastArticleAt || article.created_at > stats.lastArticleAt) {
        stats.lastArticleAt = article.created_at
      }

      const is24h = article.created_at >= now24h
      if (is24h) {
        stats.articles24h++
        if (article.status === 'draft') stats.drafts24h++
      }

      if (article.status === 'published') {
        stats.published7d++
        if (article.published_at && article.published_at >= now24h) {
          stats.published24h++
        }
      }
    }

    return Array.from(sourceStatsMap.values())
  }

  it('should initialize all known sources with zero counts', () => {
    const result = aggregatePipelineStats([], new Date().toISOString())
    expect(result).toHaveLength(KNOWN_SOURCES.length)
    for (const source of result) {
      expect(source.articlesTotal).toBe(0)
      expect(source.articles24h).toBe(0)
      expect(source.published24h).toBe(0)
    }
  })

  it('should correctly count articles per source', () => {
    const now = new Date()
    const articles = [
      { uuid: '1', status: 'published', published_at: now.toISOString(), created_at: now.toISOString(), social_media_data: { sourceName: 'teamtalk' } },
      { uuid: '2', status: 'draft', published_at: null, created_at: now.toISOString(), social_media_data: { sourceName: 'teamtalk' } },
      { uuid: '3', status: 'published', published_at: now.toISOString(), created_at: now.toISOString(), social_media_data: { sourceName: 'gazzetta' } },
    ]

    const result = aggregatePipelineStats(articles, new Date(Date.now() - 86400000).toISOString())
    const teamtalk = result.find(s => s.sourceName === 'teamtalk')!
    const gazzetta = result.find(s => s.sourceName === 'gazzetta')!

    expect(teamtalk.articlesTotal).toBe(2)
    expect(teamtalk.articles24h).toBe(2)
    expect(teamtalk.published24h).toBe(1)
    expect(teamtalk.drafts24h).toBe(1)

    expect(gazzetta.articlesTotal).toBe(1)
    expect(gazzetta.published24h).toBe(1)
  })

  it('should skip articles without sourceName', () => {
    const now = new Date()
    const articles = [
      { uuid: '1', status: 'published', published_at: now.toISOString(), created_at: now.toISOString(), social_media_data: null },
      { uuid: '2', status: 'published', published_at: now.toISOString(), created_at: now.toISOString(), social_media_data: { sourceName: undefined } },
    ]

    const result = aggregatePipelineStats(articles, new Date(Date.now() - 86400000).toISOString())
    const total = result.reduce((s, r) => s + r.articlesTotal, 0)
    expect(total).toBe(0)
  })

  it('should add unknown sources dynamically', () => {
    const now = new Date()
    const articles = [
      { uuid: '1', status: 'published', published_at: now.toISOString(), created_at: now.toISOString(), social_media_data: { sourceName: 'new-source' } },
    ]

    const result = aggregatePipelineStats(articles, new Date(Date.now() - 86400000).toISOString())
    const newSource = result.find(s => s.sourceName === 'new-source')

    expect(newSource).toBeDefined()
    expect(newSource!.articlesTotal).toBe(1)
  })

  it('should track lastArticleAt correctly', () => {
    const older = new Date(Date.now() - 3600000).toISOString()
    const newer = new Date().toISOString()
    const articles = [
      { uuid: '1', status: 'draft', published_at: null, created_at: older, social_media_data: { sourceName: 'teamtalk' } },
      { uuid: '2', status: 'draft', published_at: null, created_at: newer, social_media_data: { sourceName: 'teamtalk' } },
    ]

    const result = aggregatePipelineStats(articles, new Date(Date.now() - 86400000).toISOString())
    const teamtalk = result.find(s => s.sourceName === 'teamtalk')!

    expect(teamtalk.lastArticleAt).toBe(newer)
  })
})
