"use client"

import { usePathname } from "next/navigation"
import { MobileBottomNav } from "@/components/MobileBottomNav"
import { MobileSidebarDrawer } from "@/components/MobileSidebarDrawer"
import { useDictionary } from "@/lib/dictionary-provider"
import { useParams } from "next/navigation"
import { Footer } from "@/components/Footer"
import { type Locale } from "@/lib/i18n"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as Locale
  const { dict } = useDictionary()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <MobileSidebarDrawer />
    </>
  )
}