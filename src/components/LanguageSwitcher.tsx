"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, ChevronDown } from "lucide-react"
import { type Locale } from "@/lib/i18n"

interface Language {
  code: Locale
  name: string
  shortCode: string
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', shortCode: 'EN' },
  { code: 'es', name: 'Español', shortCode: 'ES' },
  { code: 'fr', name: 'Français', shortCode: 'FR' },
  { code: 'de', name: 'Deutsch', shortCode: 'DE' },
  { code: 'it', name: 'Italiano', shortCode: 'IT' }
]

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact'
  currentLocale?: Locale
}

export function LanguageSwitcher({ variant = 'default', currentLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLanguage, setCurrentLanguage] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before showing
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Use the passed currentLocale or detect from pathname
    if (currentLocale) {
      setCurrentLanguage(currentLocale)
    } else {
      // Extract locale from pathname
      const pathSegments = pathname.split('/')
      const localeFromPath = pathSegments[1] as Locale
      if (SUPPORTED_LANGUAGES.find(lang => lang.code === localeFromPath)) {
        setCurrentLanguage(localeFromPath)
      } else {
        setCurrentLanguage('en')
        // Clear any existing locale cookie if we're defaulting to English
        if (typeof window !== 'undefined') {
          document.cookie = 'locale=en; path=/; max-age=' + (60 * 60 * 24 * 365) + '; SameSite=Lax'
        }
      }
    }
  }, [currentLocale, pathname, mounted])

  const handleLanguageChange = (languageCode: Locale) => {
    // Save to localStorage and cookie
    if (typeof window !== 'undefined') {
      localStorage.setItem('transfersdaily_language', languageCode)
      // Set cookie for middleware
      document.cookie = `locale=${languageCode}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    }
    
    // Navigate to the new locale
    const pathSegments = pathname.split('/')
    const currentLocale = pathSegments[1]
    
    let newPath: string
    if (SUPPORTED_LANGUAGES.find(lang => lang.code === currentLocale)) {
      // Replace existing locale
      if (languageCode === 'en') {
        // Remove locale for English (default)
        pathSegments.splice(1, 1)
        newPath = pathSegments.join('/') || '/'
      } else {
        // Replace with new locale
        pathSegments[1] = languageCode
        newPath = pathSegments.join('/')
      }
    } else {
      // Add new locale
      newPath = languageCode === 'en' ? pathname : `/${languageCode}${pathname}`
    }
    
    // Force a full page reload to ensure proper locale switching
    window.location.href = newPath
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-2 text-xs font-medium text-foreground"
        disabled
      >
        <Globe className="h-3 w-3 mr-1" />
        EN
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>
    )
  }

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0]

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs font-medium text-foreground hover:bg-secondary hover:text-primary"
          >
            <Globe className="h-3 w-3 mr-1" />
            {currentLang.shortCode}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`cursor-pointer ${
                currentLanguage === language.code ? 'bg-muted' : ''
              }`}
            >
              <span className="font-medium text-xs mr-2">{language.shortCode}</span>
              <span className="text-xs">{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-primary hover:bg-secondary"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">{currentLang.shortCode}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              currentLanguage === language.code ? 'bg-muted' : ''
            }`}
          >
            <span className="font-medium mr-3">{language.shortCode}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
