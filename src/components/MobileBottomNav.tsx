"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Home, Trophy, Search, Newspaper } from "lucide-react"
import { cn } from "@/lib/theme"
import { CommandSearch } from "@/components/CommandSearch"
import type { Locale } from "@/lib/i18n"

interface NavItem {
  icon: typeof Home
  label: string
  href?: string
  action?: "search"
  isActive?: (pathname: string) => boolean
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as Locale) || "en"
  const [searchOpen, setSearchOpen] = useState(false)

  const getLocalizedPath = (path: string) => {
    return locale === "en" ? path : `/${locale}${path}`
  }

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: "Home",
      href: getLocalizedPath("/"),
      isActive: (p) => p === `/${locale}` || p === `/${locale}/` || p === "/" || p === "/en",
    },
    {
      icon: Trophy,
      label: "Leagues",
      href: getLocalizedPath("/league/premier-league"),
      isActive: (p) => p.includes("/league/"),
    },
    {
      icon: Search,
      label: "Search",
      action: "search",
    },
    {
      icon: Newspaper,
      label: "Latest",
      href: getLocalizedPath("/latest"),
      isActive: (p) => p.includes("/latest"),
    },
  ]

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border lg:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.isActive ? item.isActive(pathname) : false

            if (item.action === "search") {
              return (
                <button
                  key={item.label}
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1 rounded-lg",
                    "cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    "text-muted-foreground"
                  )}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <CommandSearch locale={locale} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
