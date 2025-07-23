"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Menu, 
  ChevronDown,
  X
} from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const leagues = [
    { name: "Premier League", slug: "premier-league" },
    { name: "La Liga", slug: "la-liga" },
    { name: "Serie A", slug: "serie-a" },
    { name: "Bundesliga", slug: "bundesliga" },
    { name: "Ligue 1", slug: "ligue-1" },
  ]

  const transferTypes = [
    { name: "Confirmed", slug: "confirmed" },
    { name: "Rumors", slug: "rumors" },
    { name: "Completed", slug: "completed" },
    { name: "Loan Moves", slug: "loan-moves" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
          <Link 
            href="/latest" 
            className="text-sm font-medium text-muted-foreground px-3 py-2"
          >
            Latest
          </Link>

          {/* Leagues Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1 px-3 py-2 text-muted-foreground">
                <span>Leagues</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {leagues.map((league) => (
                <DropdownMenuItem key={league.name} asChild>
                  <Link href={`/league/${league.slug}`}>
                    {league.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Transfer Types Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1 px-3 py-2 text-muted-foreground">
                <span>Transfers</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {transferTypes.map((type) => (
                <DropdownMenuItem key={type.name} asChild>
                  <Link href={`/transfers/${type.slug}`}>
                    {type.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            href="/about" 
            className="text-sm font-medium text-muted-foreground px-3 py-2"
          >
            About
          </Link>

          <Link 
            href="/contact" 
            className="text-sm font-medium text-muted-foreground px-3 py-2"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle className="hidden sm:inline-flex text-muted-foreground" />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-lg font-semibold">Menu</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col space-y-6 mt-6">
                <div className="bg-muted rounded-lg p-4">
                  <Link 
                    href="/latest" 
                    className="text-lg font-medium block"
                    onClick={() => setIsOpen(false)}
                  >
                    Latest Transfers
                  </Link>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
                    Leagues
                  </h3>
                  <div className="bg-muted rounded-lg p-2">
                    {leagues.map((league) => (
                      <Link
                        key={league.name}
                        href={`/league/${league.slug}`}
                        className="block text-sm py-2 px-2 rounded hover:bg-background transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {league.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
                    Transfer Types
                  </h3>
                  <div className="bg-muted rounded-lg p-2">
                    {transferTypes.map((type) => (
                      <Link
                        key={type.name}
                        href={`/transfers/${type.slug}`}
                        className="block text-sm py-2 px-2 rounded hover:bg-background transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {type.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="bg-muted rounded-lg p-2 space-y-2">
                    <Link 
                      href="/about" 
                      className="block text-sm py-2 px-2 rounded hover:bg-background transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      About
                    </Link>
                    <Link 
                      href="/contact" 
                      className="block text-sm py-2 px-2 rounded hover:bg-background transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}