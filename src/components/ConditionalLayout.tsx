"use client"

import { usePathname } from "next/navigation"
import { MobileBottomNav } from "@/components/MobileBottomNav"
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
      <main id="main-content" className="pb-16 lg:pb-0" style={{ scrollMarginTop: 'var(--navbar-height)' }}>
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}