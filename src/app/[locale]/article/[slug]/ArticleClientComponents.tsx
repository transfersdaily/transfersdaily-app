"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Bookmark, 
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
  const [isBookmarked, setIsBookmarked] = useState(false)

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
    <div className="flex items-center gap-3 mb-8">
      <span className="text-sm font-medium text-muted-foreground">{getTranslation(dict, 'common.share', 'Share')}:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="gap-2"
      >
        <Twitter className="h-4 w-4" />
        {getTranslation(dict, 'article.twitter', 'Twitter')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="gap-2"
      >
        <Facebook className="h-4 w-4" />
        {getTranslation(dict, 'article.facebook', 'Facebook')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('copy')}
        className="gap-2"
      >
        <LinkIcon className="h-4 w-4" />
        {getTranslation(dict, 'common.copyLink', 'Copy Link')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsBookmarked(!isBookmarked)}
        className="gap-2"
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        {isBookmarked ? getTranslation(dict, 'common.saved', 'Saved') : getTranslation(dict, 'common.save', 'Save')}
      </Button>
    </div>
  )
}
