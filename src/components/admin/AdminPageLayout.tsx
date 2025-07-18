"use client"

import { AdminPageHeader } from "@/components/AdminPageHeader"
import { ReactNode } from "react"

interface AdminPageLayoutProps {
  title: string
  actions?: ReactNode
  children: ReactNode
}

export function AdminPageLayout({ title, actions, children }: AdminPageLayoutProps) {
  return (
    <>
      <AdminPageHeader 
        title={title}
        actions={actions}
      />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        {children}
      </div>
    </>
  )
}