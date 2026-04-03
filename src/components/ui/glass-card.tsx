"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  title?: string
  subtitle?: string
  accentColor?: string
  hoverable?: boolean
  className?: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export function GlassCard({
  title,
  subtitle,
  accentColor = "#64748b",
  hoverable = false,
  className,
  icon,
  children,
}: GlassCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md",
        hoverable && "hover:bg-white/[0.05] transition-colors duration-300",
        className
      )}
    >
      <CardContent className="p-5">
        {(title || subtitle || icon) && (
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && (
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-white/20 mt-0.5">{subtitle}</p>
              )}
            </div>
            {icon && <>{icon}</>}
          </div>
        )}
        {children}
      </CardContent>
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
    </Card>
  )
}
