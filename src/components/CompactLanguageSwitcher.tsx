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
import { ChevronDown } from "lucide-react"
import { locales, localeNames, defaultLocale, type Locale, getLocaleFromPathname, removeLocaleFromPathname, addLocaleToPathname } from "@/lib/i18n"
import { preserveThemeOnLanguageChange } from "@/lib/theme-utils"

interface CompactLanguageSwitcherProps {
  currentLocale?: Locale
}

export function CompactLanguageSwitcher({ currentLocale }: CompactLanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<Locale>(currentLocale || defaultLocale)

  useEffect(() => {
    if (currentLocale) {
      setLocale(currentLocale)
    } else {
      // Fallback: extract from pathname
      const detectedLocale = getLocaleFromPathname(pathname)
      setLocale(detectedLocale)
    }
  }, [currentLocale, pathname])

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) return

    // Set cookie to remember preference
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year

    // Preserve theme before language change
    preserveThemeOnLanguageChange()

    // Get the current path without locale
    const pathWithoutLocale = removeLocaleFromPathname(pathname)
    
    // Create new path with the selected locale
    const newPath = addLocaleToPathname(pathWithoutLocale, newLocale)
    
    setLocale(newLocale)
    
    // Navigate to the new path
    router.push(newPath)
    
    // Preserve theme after navigation
    setTimeout(() => {
      preserveThemeOnLanguageChange()
    }, 200)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 px-2 py-1 h-8 text-muted-foreground hover:text-primary hover:bg-muted"
        >
          <span className="text-xs font-medium uppercase">{locale}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`cursor-pointer ${loc === locale ? 'bg-muted' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{localeNames[loc].flag}</span>
              <span className="text-sm">{localeNames[loc].nativeName}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
