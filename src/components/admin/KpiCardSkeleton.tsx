import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KpiCardSkeleton() {
  return (
    <Card className="h-[140px] bg-card border border-border shadow-sm">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-8 w-20 mt-1" />
        <Skeleton className="h-3 w-32 mt-1" />
        <div className="mt-auto">
          <Skeleton className="h-6 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
