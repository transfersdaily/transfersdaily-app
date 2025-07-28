"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { type Locale, getDictionary, type Dictionary } from '@/lib/i18n'

export function ClientFooter() {
  const params = useParams()
  const locale = params.locale as Locale
  const [dict, setDict] = useState<Dictionary>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadDictionary()
  }, [locale])

  const loadDictionary = async () => {
    try {
      setIsLoaded(false)
      const dictionary = await getDictionary(locale)
      setDict(dictionary)
      setIsLoaded(true)
    } catch (error) {
      console.error('Error loading footer dictionary:', error)
      setIsLoaded(true)
    }
  }

  if (!isLoaded) {
    // Return a skeleton footer while loading
    return (
      <footer className="bg-card text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="h-20 bg-muted rounded animate-pulse"></div>
            <div className="h-20 bg-muted rounded animate-pulse"></div>
            <div className="h-20 bg-muted rounded animate-pulse"></div>
            <div className="h-20 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </footer>
    )
  }

  return <Footer />
}
