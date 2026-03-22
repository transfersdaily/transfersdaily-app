import { Skeleton } from "@/components/ui/skeleton"
import { ArticleCardSkeleton } from "@/components/ArticleCard"

export default function ArticleLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Hero image skeleton -- full-width rectangle */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Skeleton className="w-full aspect-[21/9] rounded-lg" />
      </div>

      {/* Content grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-8">
          {/* Main content area */}
          <div className="lg:col-span-7">
            {/* Meta skeleton: date + reading time + badge */}
            <div className="flex items-center gap-4 flex-wrap">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24 rounded-sm" />
            </div>

            {/* Body paragraph skeletons -- 6 blocks */}
            <div className="mt-6 md:mt-8 max-w-[65ch] space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </aside>
        </div>

        {/* Related articles skeleton */}
        <div className="mt-12 md:mt-16 pb-12">
          <Skeleton className="h-6 w-40 mb-4 md:mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardSkeleton key={i} variant="standard" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
