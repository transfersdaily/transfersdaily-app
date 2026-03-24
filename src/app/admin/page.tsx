"use client"

import { useDashboardStats } from "@/hooks/use-dashboard"
import { KpiCard } from "@/components/admin/KpiCard"
import { KpiCardSkeleton } from "@/components/admin/KpiCardSkeleton"
import { DashboardGrid } from "@/components/admin/DashboardGrid"
import { FileText, TrendingUp, Calendar, Inbox } from "lucide-react"

export default function AdminDashboard() {
  const { data, isLoading, isError } = useDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
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

      {data?.cachedAt && (
        <p className="text-xs text-gray-400">
          Last updated: {new Date(data.cachedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
