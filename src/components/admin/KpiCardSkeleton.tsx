"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KpiCardSkeleton() {
  return (
    <Card className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
      <CardContent className="p-5 h-[150px] flex flex-col">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24 bg-white/[0.06]" />
          <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
        </div>
        <Skeleton className="h-8 w-20 mt-2 bg-white/[0.06]" />
        <Skeleton className="h-3 w-32 mt-2 bg-white/[0.06]" />
        <div className="mt-auto">
          <Skeleton className="h-8 w-full bg-white/[0.06]" />
        </div>
      </CardContent>
    </Card>
  )
}
