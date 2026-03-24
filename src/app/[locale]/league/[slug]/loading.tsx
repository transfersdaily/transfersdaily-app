import { Skeleton } from "@/components/ui/skeleton"
import { ArticleCardSkeleton } from "@/components/ArticleCard"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"

export default function Loading() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
        <div className="lg:col-span-7">
          {/* Page header skeleton */}
          <div className="py-4 md:py-6">
            <Skeleton className="h-7 w-48" />
          </div>
          {/* Card grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <ArticleCardSkeleton key={i} variant="standard" />
            ))}
          </div>
        </div>
        <aside className="hidden lg:block lg:col-span-3">
          <div className="space-y-6 pt-6">
            <SidebarSkeleton />
          </div>
        </aside>
      </div>
    </div>
  )
}
