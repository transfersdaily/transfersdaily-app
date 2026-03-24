"use client"

import { useAuth } from "@/lib/auth"
import { usePathname } from "next/navigation"
import { adminMobileClasses, adminMobileSpacing } from "@/lib/mobile-utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  FileText,
  LogOut,
  ChevronUp,
  Edit,
  Eye,
  Search,
  MessageSquare,
  Activity,
  LayoutDashboard,
  Menu,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Menu configuration
// ---------------------------------------------------------------------------

const overviewItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
]

const contentItems = [
  {
    title: "Drafts",
    url: "/admin/articles/drafts",
    icon: Edit,
  },
  {
    title: "Published",
    url: "/admin/articles/published",
    icon: Eye,
  },
]

const systemItems = [
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: Search,
  },
  {
    title: "Messages",
    url: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Pipeline",
    url: "/admin/pipeline",
    icon: Activity,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isActive(pathname: string, url: string, exact?: boolean) {
  if (exact) return pathname === url
  return pathname.startsWith(url)
}

// ---------------------------------------------------------------------------
// Nav Item (shared between mobile and desktop)
// ---------------------------------------------------------------------------

function NavItem({
  item,
  pathname,
  compact,
}: {
  item: { title: string; url: string; icon: any; exact?: boolean }
  pathname: string
  compact?: boolean
}) {
  const active = isActive(pathname, item.url, item.exact)
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          "h-9 px-3 rounded-lg transition-all duration-200",
          active
            ? "bg-primary/10 text-primary font-semibold border border-primary/20"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <Link href={item.url}>
          <Icon
            className={cn(
              "size-4 flex-shrink-0",
              active ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span className="text-sm">{item.title}</span>
          {active && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// ---------------------------------------------------------------------------
// Mobile Navigation
// ---------------------------------------------------------------------------

function MobileAdminMenu() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <div className="py-6 h-full flex flex-col">
      {/* Brand header */}
      <div className="px-6 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Zap className="size-4" />
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-tight text-foreground">
              TransfersDaily
            </p>
            <p className="text-[11px] text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {/* Overview */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Overview
          </p>
          <div className="space-y-1">
            {overviewItems.map((item) => {
              const active = isActive(pathname, item.url, item.exact)
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
                    active
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.title}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Content
          </p>
          <div className="space-y-1">
            {contentItems.map((item) => {
              const active = isActive(pathname, item.url)
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
                    active
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.title}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </div>
        </div>

        {/* System */}
        <div>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            System
          </p>
          <div className="space-y-1">
            {systemItems.map((item) => {
              const active = isActive(pathname, item.url)
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
                    active
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.title}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pt-4 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-all duration-200"
        >
          <FileText className="size-4" />
          <span>View Site</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground text-xs font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-xs text-muted-foreground truncate">{user?.email || 'Admin'}</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile Header
// ---------------------------------------------------------------------------

function MobileAdminHeader() {
  return (
    <div className={`${adminMobileClasses.mobileOnly} ${adminMobileClasses.stickyTop} bg-background/95 backdrop-blur-md border-b border-border ${adminMobileSpacing.card} z-50`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
            <Zap className="size-3.5" />
          </div>
          <span className="font-display text-sm font-bold uppercase tracking-tight text-foreground">
            Admin
          </span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-accent">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={adminMobileClasses.mobileDrawer}>
            <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
            <MobileAdminMenu />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Desktop Sidebar
// ---------------------------------------------------------------------------

function DesktopAdminSidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <Sidebar className="bg-card border-r border-border">
      {/* Brand header */}
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Zap className="size-4" />
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-tight text-foreground">
              TransfersDaily
            </p>
            <p className="text-[11px] text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Overview */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {overviewItems.map((item) => (
                <NavItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {contentItems.map((item) => (
                <NavItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {systemItems.map((item) => (
                <NavItem key={item.title} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border space-y-1">
        {/* View site link */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-9 px-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
            >
              <Link href="/">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm">View Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* User dropdown */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-10 px-3 rounded-lg hover:bg-accent transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary text-xs font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-sm text-foreground">
                      {user?.email || 'Admin'}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      Administrator
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-3 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="size-4 mr-2" />
                  <span className="font-medium text-sm">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// ---------------------------------------------------------------------------
// Exported Component
// ---------------------------------------------------------------------------

export function AdminSidebarMobile() {
  return (
    <>
      <MobileAdminHeader />
      <div className={adminMobileClasses.desktopOnly}>
        <DesktopAdminSidebar />
      </div>
    </>
  )
}
