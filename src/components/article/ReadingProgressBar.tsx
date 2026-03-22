'use client'

import { useState, useEffect, useRef } from 'react'

interface ReadingProgressBarProps {
  targetSelector?: string
}

export function ReadingProgressBar({ targetSelector = 'article' }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Check prefers-reduced-motion
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    mql.addEventListener('change', handleMotionChange)

    return () => {
      mql.removeEventListener('change', handleMotionChange)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const handleScroll = () => {
      if (rafRef.current !== null) return

      rafRef.current = requestAnimationFrame(() => {
        const el = document.querySelector(targetSelector)
        if (!el) {
          rafRef.current = null
          return
        }

        const rect = el.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementHeight = rect.height

        if (elementHeight <= 0) {
          rafRef.current = null
          return
        }

        const scrollProgress = (window.scrollY - elementTop) / elementHeight
        const clamped = Math.min(1, Math.max(0, scrollProgress))
        setProgress(clamped)

        rafRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [targetSelector, reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      className={`fixed top-0 left-0 h-[3px] bg-primary z-50 transition-[width] duration-150 ease-out ${
        progress <= 0 || progress >= 1 ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ width: `${progress * 100}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}
