"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useDashboardStats } from "@/hooks/use-dashboard"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Edit,
  Eye,
  BarChart3,
  Activity,
  MessageSquare,
  Image,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  badge?: "unread"
}

interface NavSection {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Drafts", url: "/admin/articles/drafts", icon: Edit },
      { title: "Published", url: "/admin/articles/published", icon: Eye },
      { title: "Content", url: "/admin/content", icon: Layers },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
      { title: "Pipeline", url: "/admin/pipeline", icon: Activity },
      { title: "Messages", url: "/admin/messages", icon: MessageSquare, badge: "unread" },
      { title: "Image Mappings", url: "/admin/image-mappings", icon: Image },
    ],
  },
]

function isActive(pathname: string, url: string, exact?: boolean): boolean {
  if (exact) return pathname === url
  return pathname === url || pathname.startsWith(url + "/")
}

interface AdminSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function AdminSidebar({ collapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { data } = useDashboardStats()
  const unreadCount = data?.unreadMessages ?? 0

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="px-4 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white text-sm font-bold shadow-lg shadow-red-500/20">
              T
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-sm font-bold tracking-tight text-white truncate">
                  TransfersDaily
                </p>
                <p className="text-[10px] text-white/40">Admin</p>
              </motion.div>
            )}
          </Link>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">
                  {section.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.url, item.exact)
                  const Icon = item.icon

                  const linkContent = (
                    <Link
                      href={item.url}
                      className={`
                        group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                        ${active
                          ? "bg-white/[0.08] text-white shadow-sm"
                          : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                        }
                        ${collapsed ? "justify-center px-0" : ""}
                      `}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                          active ? "text-red-400" : "text-white/40 group-hover:text-white/60"
                        }`}
                      />
                      {!collapsed && (
                        <>
                          <span className="truncate">{item.title}</span>
                          {item.badge === "unread" && unreadCount > 0 && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white px-1.5 shadow-sm shadow-red-500/30">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && item.badge === "unread" && unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Link>
                  )

                  if (collapsed) {
                    return (
                      <li key={item.url} className="relative">
                        <Tooltip>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" sideOffset={8}>
                            {item.title}
                            {item.badge === "unread" && unreadCount > 0 && ` (${unreadCount})`}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    )
                  }

                  return <li key={item.url}>{linkContent}</li>
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.06] px-3 py-3 space-y-1">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex items-center justify-center rounded-xl py-2.5 text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
                >
                  <Eye className="h-[18px] w-[18px]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">View Site</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
            >
              <Eye className="h-[18px] w-[18px]" />
              <span>View Site</span>
            </Link>
          )}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center justify-center rounded-xl py-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-[18px] w-[18px]" />
              <span>Sign out</span>
            </button>
          )}
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-white/50 text-xs font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <span className="text-xs text-white/40 truncate max-w-[160px]">
                {user?.email || "Admin"}
              </span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
