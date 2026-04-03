"use client"

import { motion } from "framer-motion"

interface AdminPageLayoutProps {
  title?: string
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
    <div className={className}>
      {/* Header */}
      {(title || actions) && (
        <div className="mb-6">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-3">
              <div className="flex items-center space-x-1 text-[11px] text-white/30 overflow-x-auto">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center space-x-1 whitespace-nowrap">
                    {index > 0 && <span>/</span>}
                    {crumb.href ? (
                      <a href={crumb.href} className="hover:text-white/50 transition-colors">
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-white/50 font-medium">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h1 className="text-lg md:text-xl font-bold text-white">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs text-white/30 mt-1">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex flex-col md:flex-row gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
