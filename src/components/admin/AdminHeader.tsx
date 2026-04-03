"use client"

import { usePathname } from "next/navigation"
import { useDashboardStats } from "@/hooks/use-dashboard"

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Content overview and pipeline health" },
  "/admin/articles/drafts": { title: "Drafts", subtitle: "Articles awaiting review and publication" },
  "/admin/articles/published": { title: "Published", subtitle: "Live articles on the site" },
  "/admin/analytics": { title: "Analytics", subtitle: "Site traffic and audience insights" },
  "/admin/pipeline": { title: "Pipeline", subtitle: "Content pipeline monitoring" },
  "/admin/messages": { title: "Messages", subtitle: "Contact submissions and inquiries" },
  "/admin/image-mappings": { title: "Image Mappings", subtitle: "Club and league image configuration" },
  "/admin/content": { title: "Content", subtitle: "Distribution and translation analytics" },
}

function getPageInfo(pathname: string): { title: string; subtitle: string } {
  if (pageTitles[pathname]) return pageTitles[pathname]
  const entries = Object.entries(pageTitles)
  for (let i = entries.length - 1; i >= 0; i--) {
    const [path, info] = entries[i]
    if (path !== "/admin" && pathname.startsWith(path)) return info
  }
  // Article edit page
  if (pathname.startsWith("/admin/articles/edit/")) {
    return { title: "Edit Article", subtitle: "Modify article content and metadata" }
  }
  return pageTitles["/admin"]
}

export function AdminHeader() {
  const pathname = usePathname()
  const { title, subtitle } = getPageInfo(pathname)
  const { data } = useDashboardStats()
  const pipelineHealth = data?.pipelineHealth

  const pipelineColor = !pipelineHealth
    ? "bg-white/20"
    : pipelineHealth.successRate24h >= 90
      ? "bg-emerald-400"
      : pipelineHealth.successRate24h >= 70
        ? "bg-amber-400"
        : "bg-red-400"

  const pipelineLabel = !pipelineHealth
    ? "Idle"
    : pipelineHealth.successRate24h >= 90
      ? "Healthy"
      : pipelineHealth.successRate24h >= 70
        ? "Warning"
        : "Issues"

  return (
    <header className="border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-sm px-4 md:px-6 lg:px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-white/30 mb-1 font-medium tracking-wide">
            Admin / {title}
          </p>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span className={`h-2 w-2 rounded-full ${pipelineColor} ${pipelineHealth && pipelineHealth.totalProcessed24h > 0 ? 'animate-pulse' : ''}`} />
            <span className="text-xs text-white/50 font-medium">{pipelineLabel}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
