"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"
import { getStoredTheme, setStoredTheme, THEME_STORAGE_KEY } from "@/lib/theme-utils"

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Store theme preference in localStorage with a key that persists across language changes
  const setThemeWithPersistence = (newTheme: string) => {
    setTheme(newTheme)
    setStoredTheme(newTheme)
  }

  // Load theme preference on mount and ensure it persists
  useEffect(() => {
    if (mounted) {
      const savedTheme = getStoredTheme()
      if (savedTheme && savedTheme !== theme) {
        setTheme(savedTheme)
      }
    }
  }, [mounted, theme, setTheme])

  // Listen for storage changes (when theme is changed in another tab)
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue && e.newValue !== theme) {
        setTheme(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [mounted, theme, setTheme])

  return {
    theme: mounted ? theme : undefined,
    setTheme: setThemeWithPersistence,
    systemTheme: mounted ? systemTheme : undefined,
    mounted
  }
}
