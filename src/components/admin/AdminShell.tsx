"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminMobileNav } from "@/components/admin/AdminMobileNav"
import { AdminHeader } from "@/components/admin/AdminHeader"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30 border-r border-white/[0.06] bg-[#0e0e14]/80 backdrop-blur-xl"
      >
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        />
      </motion.aside>

      {/* Main content */}
      <motion.div
        animate={{ paddingLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex-1 hidden lg:block"
      >
        <AdminHeader />
        <main className="p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Mobile layout */}
      <div className="flex-1 lg:hidden">
        <div className="sticky top-0 z-40 bg-[#0e0e14]/90 backdrop-blur-xl border-b border-white/[0.06]">
          <AdminMobileNav />
        </div>
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
