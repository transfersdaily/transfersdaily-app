'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface Stat {
  value: number | null  // null = not countable (e.g. "24/7")
  display: string       // final display string
  label: string
  suffix?: string       // e.g. "+"
}

interface CountUpStatsProps {
  stats: { value: string; label: string }[]
}

function parseStatValue(value: string): { numValue: number | null; suffix: string; display: string } {
  // "1000+" → { numValue: 1000, suffix: "+", display: "1000+" }
  // "24/7"  → { numValue: null, suffix: "", display: "24/7" }
  // "5"     → { numValue: 5, suffix: "", display: "5" }
  const match = value.match(/^(\d+)(\+?)$/)
  if (match) {
    return { numValue: parseInt(match[1]), suffix: match[2], display: value }
  }
  return { numValue: null, suffix: '', display: value }
}

function CountUpNumber({ target, suffix, duration = 1.5 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = target
    const stepTime = Math.max(16, (duration * 1000) / end)
    const increment = Math.max(1, Math.ceil(end / (duration * 60)))

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return (
    <div ref={ref} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-none tracking-tight">
      {isInView ? count.toLocaleString() : '0'}{suffix}
    </div>
  )
}

export function CountUpStats({ stats }: CountUpStatsProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, i) => {
          const { numValue, suffix, display } = parseStatValue(stat.value)

          return (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {numValue !== null && !prefersReduced ? (
                <CountUpNumber target={numValue} suffix={suffix} duration={numValue > 100 ? 2 : 1} />
              ) : (
                <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-none tracking-tight">
                  {display}
                </div>
              )}
              <div className="font-sans text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
