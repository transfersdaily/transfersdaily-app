"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MotionCardProps {
  children: React.ReactNode
  /** Index for stagger calculation (50ms per card) */
  index?: number
  className?: string
}

export function MotionCard({ children, index = 0, className }: MotionCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{
        duration: 0.3,
        ease: [0, 0, 0.2, 1],
        delay: index * 0.05,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
