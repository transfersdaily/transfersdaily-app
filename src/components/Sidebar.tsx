import { RecommendedArticles } from "@/components/RecommendedArticles"
import { TrendingTopics } from "@/components/TrendingTopics"
import { type Locale, type Dictionary } from "@/lib/i18n"

interface SidebarProps {
  className?: string
  locale: Locale
  dict: Dictionary
}

export function Sidebar({ className = "", locale, dict }: SidebarProps) {
  return (
    <div className={`bg-background border-l border-border -mr-4 pr-4 min-w-[300px] ${className}`}>
      <div className="p-6 space-y-8 bg-muted/30">
        {/* Recommended Articles */}
        <RecommendedArticles locale={locale} dict={dict} />
        
        {/* Most Searched (Trending Topics) */}
        <TrendingTopics locale={locale} dict={dict} />
      </div>
    </div>
  )
}
