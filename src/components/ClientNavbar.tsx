"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { type Locale, getDictionary, type Dictionary } from '@/lib/i18n'

export function ClientNavbar() {
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
      console.error('Error loading navbar dictionary:', error)
      setIsLoaded(true)
    }
  }

  if (!isLoaded) {
    // Return a skeleton navbar while loading - using theme-aware classes
    return (
      <div className="h-16 bg-background border-b border-border">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return <Navbar locale={locale} dict={dict} />
}
