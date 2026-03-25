'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Eye, MousePointerClick, Users, Clock, ArrowDownUp, TrendingUp, TrendingDown } from 'lucide-react'
import type { TrafficResponse } from '@/types/analytics'
import type { LucideIcon } from 'lucide-react'

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0m 0s'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs}s`
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

interface KpiDef {
  key: keyof TrafficResponse['kpis']
  label: string
  icon: LucideIcon
  format: (value: number) => string
  invertChange?: boolean // for bounce rate, lower is better
}

const KPI_DEFINITIONS: KpiDef[] = [
  { key: 'totalUsers', label: 'Users', icon: Users, format: formatNumber },
  { key: 'sessions', label: 'Sessions', icon: MousePointerClick, format: formatNumber },
  { key: 'pageViews', label: 'Page Views', icon: Eye, format: formatNumber },
  { key: 'avgSessionDuration', label: 'Avg. Duration', icon: Clock, format: formatDuration },
  {
    key: 'bounceRate',
    label: 'Bounce Rate',
    icon: ArrowDownUp,
    format: (v: number) => `${v.toFixed(1)}%`,
    invertChange: true,
  },
]

function bounceRateColor(rate: number): string {
  if (rate < 40) return 'text-green-400'
  if (rate < 60) return 'text-yellow-400'
  return 'text-red-400'
}

function ChangeIndicator({ change, invertChange }: { change: number; invertChange?: boolean }) {
  const absChange = Math.abs(change)

  if (absChange < 1) {
    return <span className="text-sm text-muted-foreground">--</span>
  }

  const isPositive = change > 0
  // For bounce rate, negative change (decrease) is good (green)
  const isGood = invertChange ? !isPositive : isPositive

  const colorClass = isGood ? 'text-green-400' : 'text-red-400'
  const Icon = isPositive ? TrendingUp : TrendingDown
  const sign = isPositive ? '+' : ''

  return (
    <span className={`inline-flex items-center gap-1 text-sm ${colorClass}`}>
      <Icon className="h-3.5 w-3.5" />
      {sign}{change.toFixed(1)}%
    </span>
  )
}

function AudienceKpiSkeleton() {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-8 w-24 mt-3" />
        <Skeleton className="h-4 w-16 mt-2" />
      </CardContent>
    </Card>
  )
}

interface AudienceKpisProps {
  kpis: TrafficResponse['kpis'] | undefined
  isLoading: boolean
}

export function AudienceKpis({ kpis, isLoading }: AudienceKpisProps) {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <AudienceKpiSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4">
      {KPI_DEFINITIONS.map((def) => {
        const metric = kpis[def.key]
        const Icon = def.icon
        const isBounceRate = def.key === 'bounceRate'

        return (
          <Card key={def.key} className="bg-card border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{def.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className={`text-2xl font-bold tracking-tight mt-2 ${isBounceRate ? bounceRateColor(metric.value) : ''}`}>
                {def.format(metric.value)}
              </div>
              <div className="mt-1">
                <ChangeIndicator change={metric.change} invertChange={def.invertChange} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
