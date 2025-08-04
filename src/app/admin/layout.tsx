"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminSidebarMobile } from "@/components/AdminSidebarMobile"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useIsMobile } from "@/lib/mobile-utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebarMobile />
        <main className={`flex-1 ${isMobile ? 'pt-0' : ''}`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}