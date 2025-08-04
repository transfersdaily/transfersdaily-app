"use client"

import { adminMobileTypography, adminMobileSpacing, useIsMobile } from "@/lib/mobile-utils"

interface AdminPageLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  className?: string
}

export function AdminPageLayout({ 
  title, 
  subtitle, 
  children, 
  actions,
  breadcrumbs,
  className = ""
}: AdminPageLayoutProps) {
  const isMobile = useIsMobile()
  
  return (
    <div className={`${adminMobileSpacing.container} ${className}`}>
      {/* Mobile Header */}
      <div className={`${adminMobileSpacing.section} border-b`}>
        {/* Breadcrumbs - Mobile optimized */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-3">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground overflow-x-auto">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center space-x-1 whitespace-nowrap">
                  {index > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a 
                      href={crumb.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          </nav>
        )}
        
        {/* Title and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className={adminMobileTypography.pageTitle}>
              {title}
            </h1>
            {subtitle && (
              <p className={`${adminMobileTypography.small} mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Actions - Stack on mobile */}
          {actions && (
            <div className={isMobile ? "flex flex-col gap-2 min-w-0" : "flex gap-2"}>
              {actions}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className={adminMobileSpacing.section}>
        {children}
      </div>
    </div>
  )
}
