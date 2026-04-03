"use client"

import { useDashboardStats } from "@/hooks/use-dashboard"
import { useContentDistribution } from "@/hooks/use-content-analytics"
import { usePipelineStats } from "@/hooks/use-pipeline"
import { KpiCard } from "@/components/admin/KpiCard"
import { KpiCardSkeleton } from "@/components/admin/KpiCardSkeleton"
import { DashboardGrid } from "@/components/admin/DashboardGrid"
import { PipelineHealthCard } from "@/components/admin/PipelineHealthCard"
import { SocialStatsCard } from "@/components/admin/SocialStatsCard"
import { DashboardActivityChart } from "@/components/admin/DashboardActivityChart"
import { DashboardSourcesOverview } from "@/components/admin/DashboardSourcesOverview"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  FileText,
  TrendingUp,
  Calendar,
  Inbox,
  Layers,
  Clock,
} from "lucide-react"

export default function AdminDashboard() {
  const { data, isLoading, isError } = useDashboardStats()
  const { data: contentData } = useContentDistribution()
  const { data: pipelineData } = usePipelineStats()

  return (
    <div className="space-y-8">
      {/* KPI Cards Row */}
      {isLoading ? (
        <DashboardGrid cols={5}>
          {Array.from({ length: 5 }).map((_, i) => (
            <KpiCardSkeleton key={i} />
          ))}
        </DashboardGrid>
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center"
        >
          <p className="text-sm text-red-400/70">Failed to load dashboard data. Please refresh.</p>
        </motion.div>
      ) : data ? (
        <DashboardGrid cols={5}>
          <KpiCard
            label="Published Today"
            value={data.publishedToday}
            sparklineData={data.trends.publishedDaily}
            icon={FileText}
            accentColor="#22c55e"
            delay={0}
          />
          <KpiCard
            label="This Week"
            value={data.publishedThisWeek}
            sparklineData={data.trends.publishedDaily}
            icon={TrendingUp}
            accentColor="#3b82f6"
            delay={0.05}
          />
          <KpiCard
            label="This Month"
            value={data.publishedThisMonth}
            sparklineData={data.trends.publishedDaily}
            icon={Calendar}
            accentColor="#8b5cf6"
            delay={0.1}
          />
          <KpiCard
            label="Draft Backlog"
            value={data.draftBacklog}
            sparklineData={data.trends.draftsDaily}
            icon={Inbox}
            subtitle={`${data.processingRate.toFixed(1)}/day avg`}
            accentColor="#eab308"
            delay={0.15}
          />
          <KpiCard
            label="Total Articles"
            value={data.totalArticles}
            icon={Layers}
            accentColor="#64748b"
            delay={0.2}
          />
        </DashboardGrid>
      ) : null}

      {/* Pipeline Health + Social Media + Processing Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Card className="bg-white/[0.03] border border-white/[0.06]">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-28 bg-white/[0.06]" />
                <Skeleton className="h-10 w-20 mt-4 bg-white/[0.06]" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 rounded-lg bg-white/[0.06]" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/[0.03] border border-white/[0.06]">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-28 bg-white/[0.06]" />
                <div className="space-y-4 mt-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-6 bg-white/[0.06]" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/[0.03] border border-white/[0.06]">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-28 bg-white/[0.06]" />
                <Skeleton className="h-10 w-16 mt-4 bg-white/[0.06]" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <PipelineHealthCard health={data?.pipelineHealth ?? null} delay={0.25} />
            <SocialStatsCard delay={0.3} />
            {/* Processing Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
            >
              <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:bg-white/[0.05] transition-colors duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Processing Rate</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                      <Clock className="h-4 w-4 text-white/30" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      {data?.processingRate.toFixed(1) ?? "0"}
                    </span>
                    <span className="text-xs text-white/30">/day</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Sources Active (24h)</span>
                      <span className="text-white/70 font-medium">
                        {pipelineData?.summary.activeSources24h ?? 0} / {pipelineData?.summary.totalSources ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Articles (24h)</span>
                      <span className="text-white/70 font-medium">
                        {pipelineData?.summary.totalArticles24h ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Published (24h)</span>
                      <span className="text-emerald-400/70 font-medium">
                        {pipelineData?.summary.totalPublished24h ?? 0}
                      </span>
                    </div>
                    {data?.unreadMessages !== undefined && data.unreadMessages > 0 && (
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                        <span className="text-white/40">Unread Messages</span>
                        <span className="text-red-400/70 font-medium">{data.unreadMessages}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
                  style={{ background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)" }}
                />
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Activity Chart + Sources Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardActivityChart data={contentData?.articlesPerDay} isLoading={!contentData} />
        </div>
        <div>
          <DashboardSourcesOverview
            sources={pipelineData?.sources}
            isLoading={!pipelineData}
          />
        </div>
      </div>

      {/* Footer timestamp */}
      {data?.cachedAt && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[11px] text-white/20"
        >
          Last updated: {new Date(data.cachedAt).toLocaleTimeString()}
        </motion.p>
      )}
    </div>
  )
}
