"use client"

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
  return (
    <div className={`px-4 md:px-6 lg:px-8 ${className}`}>
      {/* Header */}
      <div className="py-4 md:py-6 border-b border-border">
        {/* Breadcrumbs */}
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
            <h1 className="text-lg md:text-xl font-bold">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions - Stack on mobile via CSS */}
          {actions && (
            <div className="flex flex-col md:flex-row gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="py-4 md:py-6">
        {children}
      </div>
    </div>
  )
}
