"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trophy, Building, Users, Calendar } from "lucide-react"
import { getLeagues, League } from "@/lib/leagues-api"

export default function AdminLeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [filteredLeagues, setFilteredLeagues] = useState<League[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLeagues()
  }, [])

  useEffect(() => {
    const filtered = leagues.filter(league =>
      league.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.country?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLeagues(filtered)
  }, [leagues, searchTerm])

  const loadLeagues = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getLeagues()
      setLeagues(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leagues')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClick = () => {
    console.log('Add league clicked')
  }

  if (isLoading) {
    return (
      <AdminPageLayout title="Leagues">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminPageLayout>
    )
  }

  if (error) {
    return (
      <AdminPageLayout title="Leagues">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadLeagues}>Retry</Button>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Leagues"
      actions={
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add League
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{leagues.length}</p>
                  <p className="text-sm text-muted-foreground">Total Leagues</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{leagues.reduce((sum, league) => sum + (league.club_count || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Clubs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{leagues.reduce((sum, league) => sum + (league.player_count || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Players</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{leagues.reduce((sum, league) => sum + (league.article_count || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeagues.map((league) => (
            <Card key={league.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {league.name?.charAt(0) || 'L'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{league.name || 'Unknown League'}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">{league.country}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{league.club_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Clubs</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{league.player_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Players</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">{league.article_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Articles</p>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    Tier {league.tier_level || 1}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeagues.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No leagues found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}