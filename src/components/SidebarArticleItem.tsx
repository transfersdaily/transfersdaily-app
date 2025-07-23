"use client"

import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"
import { type Transfer } from "@/lib/api"
import { type Locale } from "@/lib/i18n"

interface SidebarArticleItemProps {
  article: Transfer
  locale: Locale
  formatTimeAgo: (dateString: string) => string
}

export function SidebarArticleItem({ article, locale, formatTimeAgo }: SidebarArticleItemProps) {
  return (
    <Link 
      href={`/${locale}/article/${article.slug}`}
      className="block group hover:bg-muted/50 dark:hover:bg-muted/30 rounded-lg p-3 -m-3 transition-colors"
    >
      <div className="flex gap-3">
        {/* Article Image - Larger and more prominent */}
        <div className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-muted">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-sm text-muted-foreground font-medium">
                {article.league?.charAt(0) || 'T'}
              </span>
            </div>
          )}
        </div>
        
        {/* Article Content - Better spacing and readability */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Article title - More readable size */}
          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug text-foreground">
            {article.title}
          </h4>
          
          {/* Meta information - Better organized */}
          <div className="flex items-center gap-2">
            {article.league && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 border-border bg-background text-muted-foreground flex-shrink-0">
                {article.league}
              </Badge>
            )}
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="truncate">{formatTimeAgo(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
