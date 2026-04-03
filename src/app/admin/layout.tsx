"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getQueryClient } from "@/lib/query-client"
import { AdminShell } from "@/components/admin/AdminShell"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f]">
        <div className="hidden lg:block lg:w-[260px] border-r border-white/[0.06] bg-[#0e0e14]/80" />
        <div className="flex-1 p-8">
          <div className="space-y-4">
            <div className="h-8 w-48 rounded-lg bg-white/[0.04] animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[150px] rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AdminShell>
        {children}
      </AdminShell>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
