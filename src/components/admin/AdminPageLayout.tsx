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
      {/* Actions bar — title is already in AdminHeader */}
      {actions && (
        <div className="mb-6 flex justify-end">
          <div className="flex flex-col md:flex-row gap-2">
            {actions}
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
