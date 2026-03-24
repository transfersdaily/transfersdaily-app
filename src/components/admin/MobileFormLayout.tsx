"use client"

import { adminMobileSpacing, adminMobileTouchTargets, useIsMobile } from "@/lib/mobile-utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, required, error, children, className = "" }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
  error?: string
}

export function MobileInput({ label, required, error, className = "", ...props }: MobileInputProps) {
  return (
    <FormField label={label} required={required} error={error}>
      <Input 
        className={`${adminMobileTouchTargets.input} ${className}`}
        {...props}
      />
    </FormField>
  )
}

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  required?: boolean
  error?: string
}

export function MobileTextarea({ label, required, error, className = "", ...props }: MobileTextareaProps) {
  return (
    <FormField label={label} required={required} error={error}>
      <Textarea 
        className={`min-h-[100px] resize-y ${className}`}
        {...props}
      />
    </FormField>
  )
}

interface MobileSelectProps {
  label: string
  required?: boolean
  error?: string
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  options: Array<{ value: string; label: string }>
  className?: string
}

export function MobileSelect({ 
  label, 
  required, 
  error, 
  placeholder, 
  value, 
  onValueChange, 
  options,
  className = ""
}: MobileSelectProps) {
  return (
    <FormField label={label} required={required} error={error}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`${adminMobileTouchTargets.select} ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}

interface MobileFormLayoutProps {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}

export function MobileFormLayout({ children, onSubmit, className = "" }: MobileFormLayoutProps) {
  const isMobile = useIsMobile()
  
  return (
    <form 
      onSubmit={onSubmit}
      className={`${adminMobileSpacing.form} ${className}`}
    >
      {children}
    </form>
  )
}

interface MobileFormActionsProps {
  primaryAction: {
    label: string
    onClick?: () => void
    type?: 'button' | 'submit'
    disabled?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    variant?: 'outline' | 'ghost'
  }
  className?: string
}

export function MobileFormActions({ 
  primaryAction, 
  secondaryAction, 
  className = "" 
}: MobileFormActionsProps) {
  const isMobile = useIsMobile()
  
  return (
    <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row-reverse'} ${className}`}>
      <Button
        type={primaryAction.type || 'submit'}
        onClick={primaryAction.onClick}
        disabled={primaryAction.disabled}
        className={`${adminMobileTouchTargets.button} ${isMobile ? 'w-full' : ''}`}
      >
        {primaryAction.label}
      </Button>
      {secondaryAction && (
        <Button
          type="button"
          variant={secondaryAction.variant || 'outline'}
          onClick={secondaryAction.onClick}
          className={`${adminMobileTouchTargets.button} ${isMobile ? 'w-full' : ''}`}
        >
          {secondaryAction.label}
        </Button>
      )}
    </div>
  )
}
