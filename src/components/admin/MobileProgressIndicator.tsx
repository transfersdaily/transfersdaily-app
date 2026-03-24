"use client"

import { adminMobileTypography } from "@/lib/mobile-utils"

interface MobileProgressIndicatorProps {
  steps: Array<{ 
    id: number
    name: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}

export function MobileProgressIndicator({ 
  steps, 
  currentStep, 
  onStepClick,
  className = ""
}: MobileProgressIndicatorProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step) => {
          const isActive = step.id <= currentStep
          const isCurrent = step.id === currentStep
          const Icon = step.icon
          
          return (
            <button
              key={step.id}
              onClick={() => onStepClick?.(step.id)}
              disabled={!onStepClick}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              } ${onStepClick ? 'cursor-pointer hover:text-primary' : 'cursor-default'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                {Icon ? (
                  <Icon className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span className={`${adminMobileTypography.small} text-center max-w-[60px] leading-tight`}>
                {step.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
