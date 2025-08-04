"use client"

import { useAuth } from "@/lib/auth"
import { useIsMobile, adminMobileClasses, adminMobileSpacing } from "@/lib/mobile-utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  FileText,
  Settings,
  Users,
  LogOut,
  ChevronUp,
  User2,
  Edit,
  Eye,
  ChevronDown,
  Building,
  Trophy,
  Search,
  MessageSquare,
  Mail,
  Home,
  Menu
} from "lucide-react"
import Link from "next/link"

// Menu items configuration (same as original)
const mainMenuItems = [
  {
    title: "Homepage",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
  },
]

const articleMenuItems = [
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

const entityMenuItems = [
  {
    title: "Clubs",
    url: "/admin/clubs",
    icon: Building,
  },
  {
    title: "Leagues",
    url: "/admin/leagues", 
    icon: Trophy,
  },
  {
    title: "Players",
    url: "/admin/players",
    icon: Users,
  },
]

const systemMenuItems = [
  {
    title: "Search Analytics",
    url: "/admin/analytics",
    icon: Search,
  },
  {
    title: "Contact Messages",
    url: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Newsletter",
    url: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

// Mobile Navigation Menu Component
function MobileAdminMenu() {
  const { user, signOut } = useAuth()

  return (
    <div className="py-6 h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pb-6 border-b">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FileText className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-foreground">TransfersDaily</span>
            <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {/* Main Menu Items */}
          {mainMenuItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span>{item.title}</span>
            </Link>
          ))}
          
          {/* Divider */}
          <div className="h-px bg-border my-3" />
          
          {/* Articles Section */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-left hover:bg-accent rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span>Articles</span>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1 mt-1">
              {articleMenuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Divider */}
          <div className="h-px bg-border my-3" />
          
          {/* Entity Management */}
          {entityMenuItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span>{item.title}</span>
            </Link>
          ))}
          
          {/* Divider */}
          <div className="h-px bg-border my-3" />
          
          {/* System Management */}
          {systemMenuItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-3 h-auto"
            >
              <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                <span className="truncate font-semibold">{user?.email || 'Admin'}</span>
                <span className="truncate text-xs text-muted-foreground">Administrator</span>
              </div>
              <ChevronUp className="ml-auto size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="top" align="start">
            <DropdownMenuItem asChild>
              <Link href="/admin/profile" className="flex items-center">
                <User2 className="size-4 mr-2" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
              <LogOut className="size-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Mobile Header Component
function MobileAdminHeader() {
  return (
    <div className={`${adminMobileClasses.mobileOnly} ${adminMobileClasses.stickyTop} bg-background border-b ${adminMobileSpacing.card} z-50`}>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={adminMobileClasses.mobileDrawer}>
            <MobileAdminMenu />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

// Desktop Sidebar Component (original functionality)
function DesktopAdminSidebar() {
  const { user, signOut } = useAuth()

  return (
    <Sidebar className="bg-card/50 backdrop-blur-sm border-border shadow-lg">
      <SidebarHeader className="bg-card/80 border-border p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FileText className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-foreground">TransfersDaily</span>
            <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-card/50 backdrop-blur-sm px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {/* Dashboard */}
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9 px-3 rounded-md hover:bg-accent focus:bg-accent text-foreground hover:text-accent-foreground transition-all duration-200">
                    {item.url.startsWith('http') ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <item.icon className="size-4 text-muted-foreground hover:text-accent-foreground" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </a>
                    ) : (
                      <Link href={item.url}>
                        <item.icon className="size-4 text-muted-foreground hover:text-accent-foreground" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Divider */}
              <SidebarMenuItem>
                <div className="h-px bg-border my-2" />
              </SidebarMenuItem>
              
              {/* Articles */}
              <SidebarMenuItem>
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-9 px-3 rounded-md hover:bg-accent focus:bg-accent text-foreground hover:text-accent-foreground transition-all duration-200">
                      <FileText className="size-4 text-muted-foreground hover:text-accent-foreground" />
                      <span className="font-medium text-sm">Articles</span>
                      <ChevronDown className="ml-auto size-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="mt-1 space-y-0.5">
                      {articleMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild className="h-8 pl-10 pr-3 rounded-md hover:bg-accent focus:bg-accent text-muted-foreground hover:text-accent-foreground transition-all duration-200">
                            <Link href={item.url}>
                              <item.icon className="size-3" />
                              <span className="font-medium text-sm">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
              
              {/* Divider */}
              <SidebarMenuItem>
                <div className="h-px bg-border my-2" />
              </SidebarMenuItem>
              
              {/* Entity Management */}
              {entityMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9 px-3 rounded-md hover:bg-accent focus:bg-accent text-foreground hover:text-accent-foreground transition-all duration-200">
                    <Link href={item.url}>
                      <item.icon className="size-4 text-muted-foreground hover:text-accent-foreground" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Divider */}
              <SidebarMenuItem>
                <div className="h-px bg-border my-2" />
              </SidebarMenuItem>
              
              {/* System Management */}
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-9 px-3 rounded-md hover:bg-accent focus:bg-accent text-foreground hover:text-accent-foreground transition-all duration-200">
                    <Link href={item.url}>
                      <item.icon className="size-4 text-muted-foreground hover:text-accent-foreground" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-card/80 backdrop-blur-sm border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10 px-3 rounded-md hover:bg-accent focus:bg-accent text-foreground hover:text-accent-foreground transition-all duration-200"
                >
                  <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sm">{user?.email || 'Admin'}</span>
                    <span className="truncate text-xs text-muted-foreground">Administrator</span>
                  </div>
                  <ChevronUp className="ml-auto size-3" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover border-border shadow-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <div className="p-1">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile" className="flex items-center px-2 py-2 rounded-md hover:bg-accent focus:bg-accent transition-colors cursor-pointer">
                      <User2 className="size-4 mr-2 text-muted-foreground" />
                      <span className="font-medium text-sm text-foreground">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-1" />
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-destructive/10 focus:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4 mr-2 text-destructive" />
                    <span className="font-medium text-sm text-destructive">Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// Main Mobile-Responsive AdminSidebar Component
export function AdminSidebarMobile() {
  const isMobile = useIsMobile()

  return (
    <>
      {/* Mobile Header */}
      <MobileAdminHeader />
      
      {/* Desktop Sidebar */}
      <div className={adminMobileClasses.desktopOnly}>
        <DesktopAdminSidebar />
      </div>
    </>
  )
}
