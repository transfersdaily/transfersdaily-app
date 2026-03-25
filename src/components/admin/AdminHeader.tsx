"use client"

import { usePathname } from "next/navigation"

// ---------------------------------------------------------------------------
// Page title mapping from pathname
// ---------------------------------------------------------------------------

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/articles/drafts": "Drafts",
  "/admin/articles/published": "Published",
  "/admin/analytics": "Analytics",
  "/admin/pipeline": "Pipeline",
  "/admin/messages": "Messages",
  "/admin/image-mappings": "Image Mappings",
  "/admin/settings": "Settings",
}

function getPageTitle(pathname: string): string {
  // Try exact match first
  if (pageTitles[pathname]) return pageTitles[pathname]
  // Try prefix match for nested routes
  const entries = Object.entries(pageTitles)
  for (let i = entries.length - 1; i >= 0; i--) {
    const [path, title] = entries[i]
    if (path !== "/admin" && pathname.startsWith(path)) return title
  }
  return "Dashboard"
}

// ---------------------------------------------------------------------------
// AdminHeader
// ---------------------------------------------------------------------------

export function AdminHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="border-b border-[#2a2a2a] bg-[#0a0a0a] px-4 md:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          {/* Breadcrumbs */}
          <p className="text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">{pageTitle}</span>
          </p>
          {/* Page title */}
          <h1 className="text-xl font-semibold text-white tracking-tight">
            {pageTitle}
          </h1>
        </div>

        {/* Pipeline status placeholder (per D-02, Phase 4 live indicator) */}
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-gray-600" />
          Pipeline
        </span>
      </div>
    </header>
  )
}
