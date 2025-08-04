/**
 * Mobile Utility Functions and Typography System
 * Based on the Admin Mobile Optimization Plan
 */

import { useEffect, useState } from 'react'

// Mobile breakpoint detection hook
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkIsMobile()

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [breakpoint])

  return isMobile
}

// Admin Mobile Typography System
export const adminMobileTypography = {
  // Page titles - smaller for mobile admin
  pageTitle: "text-lg md:text-xl font-bold",
  
  // Section headers
  sectionTitle: "text-base md:text-lg font-semibold",
  
  // Card titles
  cardTitle: "text-sm md:text-base font-medium",
  
  // Body text
  body: "text-sm md:text-base",
  
  // Small text/metadata
  small: "text-xs md:text-sm text-muted-foreground",
  
  // Button text
  button: "text-sm font-medium",
  
  // Form labels
  label: "text-sm font-medium",
  
  // Input text
  input: "text-base", // Prevents zoom on iOS
}

// Admin Mobile Spacing System
export const adminMobileSpacing = {
  container: "px-4 md:px-6 lg:px-8",
  section: "py-4 md:py-6",
  card: "p-4 md:p-6",
  form: "space-y-4 md:space-y-6",
  touchTarget: "min-h-[44px] min-w-[44px]",
  buttonMobile: "min-h-[44px] px-4 py-2",
}

// Mobile-first responsive grid utilities
export const adminMobileGrid = {
  statsCards: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
  quickActions: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4",
  contentGrid: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  formGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
}

// Touch-friendly interaction utilities
export const adminMobileTouchTargets = {
  button: "min-h-[44px] px-4 py-2 touch-manipulation",
  input: "min-h-[44px] text-base touch-manipulation",
  checkbox: "min-h-[44px] min-w-[44px] touch-manipulation",
  select: "min-h-[44px] touch-manipulation",
}

// Mobile-specific CSS classes
export const adminMobileClasses = {
  // Hide on mobile, show on desktop
  desktopOnly: "hidden md:block",
  
  // Show on mobile, hide on desktop
  mobileOnly: "md:hidden",
  
  // Mobile-first responsive visibility
  tabletUp: "hidden sm:block",
  desktopUp: "hidden lg:block",
  
  // Mobile drawer/sheet
  mobileDrawer: "w-80 sm:w-96",
  
  // Mobile sticky elements
  stickyTop: "sticky top-0 z-10",
  stickyBottom: "sticky bottom-0 z-10",
  
  // Mobile-optimized scrolling
  scrollArea: "overflow-y-auto overscroll-contain",
}

// Format utilities for mobile displays
export const formatForMobile = {
  // Truncate text for mobile cards
  truncateTitle: (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  },
  
  // Format dates for mobile
  formatMobileDate: (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1d ago'
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  },
  
  // Format numbers for mobile display
  formatMobileNumber: (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  },
}

// Mobile performance utilities
export const mobilePerformance = {
  // Debounce function for search inputs
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },
  
  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
}

// Mobile accessibility utilities
export const mobileA11y = {
  // Screen reader only text
  srOnly: "sr-only",
  
  // Focus visible utilities
  focusVisible: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  
  // Touch target accessibility
  touchTarget: "min-h-[44px] min-w-[44px] flex items-center justify-center",
  
  // High contrast mode support
  highContrast: "contrast-more:border-2 contrast-more:border-current",
}
