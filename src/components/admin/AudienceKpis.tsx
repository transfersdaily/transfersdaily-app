'use client'

import { GlassCard } from '@/components/ui/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
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
  invertChange?: boolean
  accentColor: string
}

const KPI_DEFINITIONS: KpiDef[] = [
  { key: 'totalUsers', label: 'Users', icon: Users, format: formatNumber, accentColor: '#3b82f6' },
  { key: 'sessions', label: 'Sessions', icon: MousePointerClick, format: formatNumber, accentColor: '#8b5cf6' },
  { key: 'pageViews', label: 'Page Views', icon: Eye, format: formatNumber, accentColor: '#22c55e' },
  { key: 'avgSessionDuration', label: 'Avg. Duration', icon: Clock, format: formatDuration, accentColor: '#eab308' },
  { key: 'bounceRate', label: 'Bounce Rate', icon: ArrowDownUp, format: (v: number) => `${v.toFixed(1)}%`, invertChange: true, accentColor: '#ef4444' },
]

function ChangeIndicator({ change, invertChange }: { change: number; invertChange?: boolean }) {
  const absChange = Math.abs(change)
  if (absChange < 1) return <span className="text-xs text-white/20">--</span>

  const isPositive = change > 0
  const isGood = invertChange ? !isPositive : isPositive
  const colorClass = isGood ? 'text-emerald-400' : 'text-red-400'
  const Icon = isPositive ? TrendingUp : TrendingDown
  const sign = isPositive ? '+' : ''

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${colorClass}`}>
      <Icon className="h-3 w-3" />
      {sign}{change.toFixed(1)}%
    </span>
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
          <GlassCard key={i}>
              <Skeleton className="h-3 w-20 bg-white/[0.06]" />
              <Skeleton className="h-7 w-24 mt-3 bg-white/[0.06]" />
              <Skeleton className="h-3 w-16 mt-2 bg-white/[0.06]" />
          </GlassCard>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4">
      {KPI_DEFINITIONS.map((def, i) => {
        const metric = kpis[def.key]
        const Icon = def.icon

        return (
          <motion.div
            key={def.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <GlassCard
              title={def.label}
              accentColor={def.accentColor}
              hoverable
              icon={
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]">
                  <Icon className="h-3.5 w-3.5 text-white/30" />
                </div>
              }
            >
                <div className="text-2xl font-bold tracking-tight mt-2 text-white">
                  {def.format(metric.value)}
                </div>
                <div className="mt-1.5">
                  <ChangeIndicator change={metric.change} invertChange={def.invertChange} />
                </div>
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
