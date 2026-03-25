"use client"

import { useDashboardStats } from "@/hooks/use-dashboard"
import { KpiCard } from "@/components/admin/KpiCard"
import { KpiCardSkeleton } from "@/components/admin/KpiCardSkeleton"
import { DashboardGrid } from "@/components/admin/DashboardGrid"
import { PipelineHealthCard } from "@/components/admin/PipelineHealthCard"
import { SocialStatsCard, SocialStatsCardSkeleton } from "@/components/admin/SocialStatsCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, TrendingUp, Calendar, Inbox } from "lucide-react"

export default function AdminDashboard() {
  const { data, isLoading, isError } = useDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Content overview and key metrics</p>
      </div>

      <DashboardGrid>
        {isLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : isError ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Failed to load dashboard data. Please refresh.
          </div>
        ) : data ? (
          <>
            <KpiCard
              label="Published Today"
              value={data.publishedToday}
              sparklineData={data.trends.publishedDaily}
              icon={FileText}
            />
            <KpiCard
              label="Published This Week"
              value={data.publishedThisWeek}
              sparklineData={data.trends.publishedDaily}
              icon={TrendingUp}
            />
            <KpiCard
              label="Published This Month"
              value={data.publishedThisMonth}
              sparklineData={data.trends.publishedDaily}
              icon={Calendar}
            />
            <KpiCard
              label="Draft Backlog"
              value={data.draftBacklog}
              sparklineData={data.trends.draftsDaily}
              icon={Inbox}
              subtitle={`${data.processingRate.toFixed(1)}/day processing rate`}
            />
          </>
        ) : null}
      </DashboardGrid>

      {/* Pipeline Health & Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Card className="h-[140px] bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
              <CardContent className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-8 w-16 mt-1" />
                <div className="mt-auto flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
            <SocialStatsCardSkeleton />
          </>
        ) : data ? (
          <>
            <PipelineHealthCard health={data.pipelineHealth ?? null} />
            <SocialStatsCard />
          </>
        ) : null}
      </div>

      {data?.cachedAt && (
        <p className="text-xs text-gray-400">
          Last updated: {new Date(data.cachedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
