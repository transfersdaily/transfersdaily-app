"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface DashboardCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: LucideIcon
  description?: string
  className?: string
  delay?: number
}

export function DashboardCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  description,
  className,
  delay = 0,
}: DashboardCardProps) {
  const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#64748b"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <GlassCard
        title={title}
        accentColor={trendColor}
        hoverable
        className={cn("shadow-sm group", className)}
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
            <Icon className="h-4 w-4 text-white/30" />
          </div>
        }
      >
          <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
          {change && (
            <span className={cn(
              "text-[11px] font-medium mt-1 inline-block",
              trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-white/30"
            )}>
              {change}
            </span>
          )}
          {description && (
            <p className="text-[11px] text-white/30 mt-1">{description}</p>
          )}
      </GlassCard>
    </motion.div>
  )
}
