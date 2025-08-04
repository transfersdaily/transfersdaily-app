"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { adminMobileTypography, adminMobileSpacing } from "@/lib/mobile-utils"

interface MobileDataCardProps {
  title: string
  subtitle?: string
  metadata: Array<{ label: string; value: string | React.ReactNode }>
  actions: Array<{ 
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'destructive' | 'secondary'
    icon?: React.ReactNode
  }>
  badge?: { 
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  className?: string
  isSelected?: boolean
  onSelect?: (selected: boolean) => void
}

export function MobileDataCard({ 
  title, 
  subtitle, 
  metadata, 
  actions, 
  badge,
  className = "",
  isSelected = false,
  onSelect
}: MobileDataCardProps) {
  return (
    <Card className={`${adminMobileSpacing.card} ${className} ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      {/* Header with title and badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`${adminMobileTypography.cardTitle} line-clamp-2 leading-tight`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`${adminMobileTypography.small} mt-1 line-clamp-1`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-3">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
            />
          )}
          {badge && (
            <Badge variant={badge.variant || 'default'} className="text-xs whitespace-nowrap">
              {badge.text}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Metadata */}
      {metadata.length > 0 && (
        <div className="space-y-1 mb-4">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium min-w-0 flex-shrink-0">
                {item.label}:
              </span>
              <span className="text-foreground ml-2 truncate text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant || 'outline'}
              className={`${actions.length > 2 ? 'flex-1' : ''} ${adminMobileSpacing.touchTarget} text-xs`}
              onClick={action.onClick}
            >
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  )
}
