'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, BookmarkPlus, Languages } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales, localeNames, type Locale } from "@/lib/i18n"

interface Article {
  id: string
  title: string
  content: string
  slug: string
  // ... other article properties
}

interface ArticleClientComponentsProps {
  article: Article
  locale: Locale
  dict: any
}

export function ArticleClientComponents({ article, locale, dict }: ArticleClientComponentsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLanguageChange = (newLocale: Locale) => {
    // Extract the slug from the current pathname
    const pathSegments = pathname.split('/')
    const currentSlug = pathSegments[pathSegments.length - 1]
    
    // Navigate to the same article in the new language with full page refresh
    const newPath = `/${newLocale}/article/${currentSlug}`
    window.location.href = newPath
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this article: ${article.title}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you would typically save to localStorage or send to your API
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_articles') || '[]')
    if (!isBookmarked) {
      bookmarks.push(article.id)
    } else {
      const index = bookmarks.indexOf(article.id)
      if (index > -1) {
        bookmarks.splice(index, 1)
      }
    }
    localStorage.setItem('bookmarked_articles', JSON.stringify(bookmarks))
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Language Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{localeNames[locale].nativeName}</span>
            <span className="sm:hidden">{localeNames[locale].flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={`flex items-center gap-2 ${loc === locale ? 'bg-accent' : ''}`}
            >
              <span>{localeNames[loc].flag}</span>
              <span>{localeNames[loc].nativeName}</span>
              {loc === locale && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Button */}
      <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      {/* Bookmark Button */}
      <Button 
        variant={isBookmarked ? "default" : "outline"} 
        size="sm" 
        onClick={handleBookmark}
        className="flex items-center gap-2"
      >
        <BookmarkPlus className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      </Button>
    </div>
  )
}