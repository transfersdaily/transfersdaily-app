import React from 'react'

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  children,
  className = ""
}: PageHeaderProps) {
  return (
    <section className={`py-4 md:py-6 ${className}`} aria-labelledby="page-header">
      <div className="flex items-center justify-between">
        <h1 id="page-header" className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground">{title}</h1>
        {children && (
          <div className="flex gap-3 items-center">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
