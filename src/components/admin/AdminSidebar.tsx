"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useDashboardStats } from "@/hooks/use-dashboard"
import Link from "next/link"
import {
  LayoutDashboard,
  Edit,
  Eye,
  BarChart3,
  Activity,
  MessageSquare,
  Image,
  Settings,
  LogOut,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Nav configuration (per D-12)
// ---------------------------------------------------------------------------

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  disabled?: boolean
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
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Drafts", url: "/admin/articles/drafts", icon: Edit },
      { title: "Published", url: "/admin/articles/published", icon: Eye },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
      { title: "Pipeline", url: "/admin/pipeline", icon: Activity },
      {
        title: "Messages",
        url: "/admin/messages",
        icon: MessageSquare,
        badge: "unread",
      },
      { title: "Image Mappings", url: "/admin/image-mappings", icon: Image },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        disabled: true,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isActive(pathname: string, url: string, exact?: boolean): boolean {
  if (exact) return pathname === url
  return pathname === url || pathname.startsWith(url + "/")
}

// ---------------------------------------------------------------------------
// AdminSidebar (desktop fixed sidebar)
// ---------------------------------------------------------------------------

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { data } = useDashboardStats()
  const unreadCount = data?.unreadMessages ?? 0

  return (
    <div className="flex h-full flex-col bg-[#1a1a1a]">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#2a2a2a]">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white text-sm font-bold">
            T
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">
              TransfersDaily
            </p>
            <p className="text-[11px] text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.url, item.exact)
                const Icon = item.icon
                return (
                  <li key={item.url}>
                    {item.disabled ? (
                      <span className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 cursor-not-allowed">
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                    ) : (
                      <Link
                        href={item.url}
                        className={
                          active
                            ? "flex items-center gap-3 rounded-md border-l-2 border-red-500 bg-white/5 px-3 py-2 text-sm font-medium text-white"
                            : "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        }
                      >
                        <Icon
                          className={
                            active
                              ? "h-4 w-4 text-red-500"
                              : "h-4 w-4 text-gray-500"
                          }
                        />
                        <span>{item.title}</span>
                        {item.badge === "unread" && unreadCount > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white px-1.5">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#2a2a2a] px-3 py-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>View Site</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#222222] text-gray-400 text-xs font-semibold">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <span className="text-xs text-gray-500 truncate max-w-[160px]">
            {user?.email || "Admin"}
          </span>
        </div>
      </div>
    </div>
  )
}
