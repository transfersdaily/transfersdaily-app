"use client"

import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminMobileNav } from "@/components/admin/AdminMobileNav"
import { AdminHeader } from "@/components/admin/AdminHeader"

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Desktop sidebar: hidden below lg breakpoint */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[#2a2a2a] bg-[#1a1a1a] z-30">
        <AdminSidebar />
      </aside>

      {/* Main content: offset by sidebar width on desktop */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile header: hamburger nav, sticky, hidden on lg+ */}
        <div className="lg:hidden sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]">
          <AdminMobileNav />
        </div>

        {/* Page header with breadcrumbs */}
        <AdminHeader />

        {/* Page content — responsive padding per D-03 */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
