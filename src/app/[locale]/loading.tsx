import { Skeleton } from "@/components/ui/skeleton"
import { ArticleCardSkeleton } from "@/components/ArticleCard"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-7">

            {/* Hero Skeleton */}
            <section className="pt-6 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[420px]">
                <div className="md:col-span-2 h-full">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <div className="hidden md:flex flex-col gap-3">
                  <Skeleton className="flex-1 w-full rounded-lg" />
                  <Skeleton className="flex-1 w-full rounded-lg" />
                </div>
              </div>
            </section>

            {/* Latest Transfers Skeleton */}
            <section className="py-4 md:py-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} variant="standard" />
                ))}
              </div>
            </section>

            {/* League Sections Skeleton */}
            {Array.from({ length: 3 }).map((_, i) => (
              <section key={i} className="py-4 md:py-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <ArticleCardSkeleton key={j} variant="compact" />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="space-y-6 pt-6">
              <SidebarSkeleton />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
