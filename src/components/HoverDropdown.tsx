"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HoverDropdownProps {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
}

export function HoverDropdown({ children, trigger, className }: HoverDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  
  const enhancedTrigger = React.cloneElement(trigger as React.ReactElement, {
    className: `${(trigger as React.ReactElement).props.className} [&_svg]:transition-transform [&_svg]:duration-200 ${open ? '[&_svg]:rotate-180' : ''}`
  })

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 300)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative"
        >
          {enhancedTrigger}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}