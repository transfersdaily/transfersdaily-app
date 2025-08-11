"use client"

import { Button } from "@/components/ui/button"
import { 
  Twitter, 
  Facebook, 
  Link as LinkIcon
} from "lucide-react"
import { type Dictionary } from "@/lib/i18n"

// Helper function to get translation
function getTranslation(dict: Dictionary, key: string, fallback?: string): string {
  const keys = key.split('.')
  let result: any = dict
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      return fallback || key
    }
  }
  
  return typeof result === 'string' ? result : (fallback || key)
}

// Article interface matching the backend API response
interface Article {
  id: string
  title: string
  content: string
  meta_description?: string
  category?: string
  transfer_status?: string
  transfer_fee?: string
  player_name?: string
  league?: string
  from_club?: string
  to_club?: string
  published_at: string
  created_at: string
  image_url?: string
  slug: string
  tags?: string[]
}

interface ArticleClientComponentsProps {
  article: Article
  locale: string
  dict: Dictionary
}

export function ArticleClientComponents({ article, locale, dict }: ArticleClientComponentsProps) {
  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = article?.title || ''
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        // You could add a toast notification here
        break
    }
  }

  return (
    <div className="mb-6 md:mb-8">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          {getTranslation(dict, 'common.share', 'Share')}:
        </span>
        
        {/* Mobile: 2x2 grid, Desktop: horizontal row */}
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="gap-2 min-h-[44px] justify-center"
          >
            <Twitter className="h-4 w-4" />
            <span className="hidden sm:inline">{getTranslation(dict, 'article.twitter', 'Twitter')}</span>
            <span className="sm:hidden">Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="gap-2 min-h-[44px] justify-center"
          >
            <Facebook className="h-4 w-4" />
            <span className="hidden sm:inline">{getTranslation(dict, 'article.facebook', 'Facebook')}</span>
            <span className="sm:hidden">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('copy')}
            className="gap-2 min-h-[44px] justify-center col-span-2 sm:col-span-1"
          >
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{getTranslation(dict, 'common.copyLink', 'Copy Link')}</span>
            <span className="sm:hidden">Copy Link</span>
          </Button>
          
          {/* Save button removed as requested - users cannot login */}
        </div>
      </div>
    </div>
  )
}
