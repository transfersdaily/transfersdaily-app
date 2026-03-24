"use client"

import { Button } from "@/components/ui/button"
import { adminMobileSpacing, adminMobileClasses } from "@/lib/mobile-utils"

interface MobileActionBarProps {
  actions: Array<{ 
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'destructive' | 'secondary'
    icon?: React.ReactNode
    disabled?: boolean
  }>
  className?: string
  showOnDesktop?: boolean
}

export function MobileActionBar({ 
  actions, 
  className = "",
  showOnDesktop = false
}: MobileActionBarProps) {
  const baseClasses = `${adminMobileClasses.stickyBottom} bg-background border-t p-4 -mx-4`
  const visibilityClasses = showOnDesktop ? "" : adminMobileClasses.mobileOnly
  
  return (
    <div className={`${baseClasses} ${visibilityClasses} ${className}`}>
      <div className="flex gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'default'}
            className={`flex-1 ${adminMobileSpacing.buttonMobile}`}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
