import React from 'react'
import Image from 'next/image'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  icon?: LucideIcon
  iconClassName?: string
  logoSrc?: string
  logoAlt?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  icon: Icon, 
  iconClassName = "w-5 h-5 text-red-600 dark:text-red-500",
  logoSrc,
  logoAlt,
  children,
  className = ""
}: PageHeaderProps) {
  return (
    <section className={`py-3 border-b bg-muted/30 -mx-8 px-8 mb-6 ${className}`} aria-labelledby="page-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {logoSrc ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <Image
                src={logoSrc}
                alt={logoAlt || 'Logo'}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          ) : Icon ? (
            <Icon className={iconClassName} />
          ) : null}
          <h1 id="page-header" className="text-base md:text-lg lg:text-xl font-bold">{title}</h1>
        </div>
        
        {children && (
          <div className="flex gap-3 items-center">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
