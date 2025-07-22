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
      className="block group hover:bg-muted/50 rounded-lg p-3 -m-3 transition-colors"
    >
      <div className="space-y-2">
        {/* Article title */}
        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {article.title}
        </h4>
        
        {/* League badge and timestamp */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {article.league && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                {article.league}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
