import { RecommendedArticles } from "@/components/RecommendedArticles"
import { TrendingTopics } from "@/components/TrendingTopics"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = "" }: SidebarProps) {

  return (
    <div className={`lg:col-span-4 bg-muted/10 border-l -mr-4 pr-4 min-w-[300px] ${className}`}>
      <div className="p-6 space-y-8">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        
        {/* Recommended Articles */}
        <RecommendedArticles />
        
        {/* Most Searched (Trending Topics) */}
        <TrendingTopics />
      </div>
    </div>
  )
}
