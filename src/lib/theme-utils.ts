"use client"

// Utility functions for theme management
export const THEME_STORAGE_KEY = 'transfers-daily-theme'

export function getStoredTheme(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(THEME_STORAGE_KEY)
}

export function setStoredTheme(theme: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function clearStoredTheme(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(THEME_STORAGE_KEY)
}

// Function to ensure theme persists across language changes
export function preserveThemeOnLanguageChange(): void {
  if (typeof window === 'undefined') return
  
  const currentTheme = getStoredTheme()
  if (currentTheme) {
    // Re-apply the theme after a short delay to ensure it persists
    setTimeout(() => {
      document.documentElement.classList.remove('light', 'dark')
      if (currentTheme !== 'system') {
        document.documentElement.classList.add(currentTheme)
      }
    }, 100)
  }
}
