"use client"

import { useAuth } from "@/lib/auth"
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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
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
  Calendar,
  ChevronDown,
  Building,
  Trophy,
  UserCheck,
  Home,
} from "lucide-react"
import Link from "next/link"

const mainMenuItems = [
  {
    title: "Back to Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
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
    icon: UserCheck,
  },
]

const systemMenuItems = [
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

const articleMenuItems = [
  {
    title: "Draft",
    url: "/admin/articles/drafts",
    icon: Edit,
  },
  {
    title: "Published",
    url: "/admin/articles/published",
    icon: Eye,
  },
]

export function AdminSidebar() {
  const { user, signOut } = useAuth()

  return (
    <Sidebar className="bg-card border-border shadow-lg rounded-r-lg">
      <SidebarHeader className="bg-card border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FileText className="size-5" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-foreground text-base">TransfersDaily</span>
            <span className="truncate text-sm text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-card px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Dashboard */}
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 px-4 rounded-lg hover:bg-muted focus:bg-muted text-foreground hover:text-primary transition-all duration-200">
                    {item.title === "Back to Home" ? (
                      <a href={item.url}>
                        <item.icon className="size-5 text-muted-foreground hover:text-primary" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    ) : (
                      <Link href={item.url}>
                        <item.icon className="size-5 text-muted-foreground hover:text-primary" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <div className="h-px bg-border my-3" />
              
              {/* Articles */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-11 px-4 rounded-lg hover:bg-muted text-foreground hover:text-primary transition-all duration-200">
                      <FileText className="size-5 text-muted-foreground" />
                      <span className="font-medium">Articles</span>
                      <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenu className="mt-2 space-y-1">
                      {articleMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild className="h-10 pl-12 pr-4 rounded-lg hover:bg-muted focus:bg-muted text-muted-foreground hover:text-primary transition-all duration-200">
                            <Link href={item.url}>
                              <item.icon className="size-4" />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              
              <div className="h-px bg-border my-3" />
              
              {/* Entity Management */}
              {entityMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 px-4 rounded-lg hover:bg-muted focus:bg-muted text-foreground hover:text-primary transition-all duration-200">
                    <Link href={item.url}>
                      <item.icon className="size-5 text-muted-foreground hover:text-primary" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <div className="h-px bg-border my-3" />
              
              {/* System */}
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 px-4 rounded-lg hover:bg-muted focus:bg-muted text-foreground hover:text-primary transition-all duration-200">
                    <Link href={item.url}>
                      <item.icon className="size-5 text-muted-foreground hover:text-primary" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-card p-4 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-14 px-4 rounded-lg hover:bg-muted data-[state=open]:bg-muted text-foreground transition-all duration-200"
                >
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <User2 className="size-5" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-semibold text-slate-100">Admin</span>
                    <span className="truncate text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-xl border-0 bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-black/5"
                side="bottom"
                align="end"
                sideOffset={8}
              >
                <div className="p-2">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <User2 className="size-4 mr-3 text-muted-foreground" />
                      <span className="font-medium text-foreground">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-2" />
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4 mr-3 text-red-500" />
                    <span className="font-medium text-red-600">Log out</span>
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