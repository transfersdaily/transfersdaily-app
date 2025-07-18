"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Search } from "lucide-react"
import { LeagueHero } from "@/components/LeagueHero"
import { SearchAndFilter } from "@/components/SearchAndFilter"

interface Transfer {
  id: number
  title: string
  excerpt: string
  club: string
  timeAgo: string
}

interface LeaguePageProps {
  leagueName: string
  logoSrc: string
  badgeText: string
  title: string
  description: string
  accentColor: string
  clubs: string[]
  transfers: Transfer[]
}

export function LeaguePage({
  leagueName,
  logoSrc,
  badgeText,
  title,
  description,
  accentColor,
  clubs,
  transfers
}: LeaguePageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState("all")

  // Filter transfers
  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClub = selectedClub === "all" || transfer.club === selectedClub
    
    return matchesSearch && matchesClub
  })

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedClub("all")
  }

  const filters = [
    {
      label: "Club",
      value: selectedClub,
      onChange: setSelectedClub,
      options: [
        { value: "all", label: "All Clubs" },
        ...clubs.map(club => ({ value: club, label: club }))
      ]
    }
  ]

  // Get the appropriate gradient and hover color classes
  const getGradientClass = () => {
    switch (accentColor) {
      case "purple": return "from-purple-500/10 to-purple-600/5"
      case "orange": return "from-orange-500/10 to-orange-600/5"
      case "green": return "from-green-500/10 to-green-600/5"
      case "red": return "from-red-500/10 to-red-600/5"
      case "blue": return "from-blue-500/10 to-blue-600/5"
      default: return "from-primary/5 to-primary/10"
    }
  }

  const getHoverColorClass = () => {
    switch (accentColor) {
      case "purple": return "group-hover:text-purple-600"
      case "orange": return "group-hover:text-orange-600"
      case "green": return "group-hover:text-green-600"
      case "red": return "group-hover:text-red-600"
      case "blue": return "group-hover:text-blue-600"
      default: return "group-hover:text-primary"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <LeagueHero
        logoSrc={logoSrc}
        logoAlt={`${leagueName} logo`}
        badgeText={badgeText}
        title={title}
        description={description}
        accentColor={accentColor}
      />

      {/* Search and Filters */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={`Search ${leagueName} transfers...`}
        filters={filters}
        resultCount={filteredTransfers.length}
      />

      {/* Transfers Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredTransfers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTransfers.map((transfer) => (
                <Card key={transfer.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className={`aspect-video bg-gradient-to-br ${getGradientClass()} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{transfer.club}</Badge>
                    </div>
                    <h3 className={`font-semibold mb-2 line-clamp-2 ${getHoverColorClass()} transition-colors`}>
                      {transfer.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {transfer.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{transfer.timeAgo}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No transfers found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
