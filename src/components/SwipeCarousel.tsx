"use client"

import React, { Children } from "react"
import { cn } from "@/lib/utils"

interface SwipeCarouselProps {
  children: React.ReactNode
  className?: string
  /** Override default item width (default: w-[75vw]) */
  itemClassName?: string
}

export function SwipeCarousel({
  children,
  className,
  itemClassName,
}: SwipeCarouselProps) {
  return (
    <div className={cn("md:hidden", className)}>
      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-2 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {Children.map(children, (child) => (
          <div
            className={cn(
              "flex-shrink-0 snap-start",
              itemClassName || "w-[75vw]"
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
