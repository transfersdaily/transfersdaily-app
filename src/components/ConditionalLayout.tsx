"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/Footer"
import { MobileBottomNav } from "@/components/MobileBottomNav"
import { MobileSidebarDrawer } from "@/components/MobileSidebarDrawer"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <MobileSidebarDrawer />
    </>
  )
}