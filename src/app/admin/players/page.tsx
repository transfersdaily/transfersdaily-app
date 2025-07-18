"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, UserCheck, Users, Calendar, TrendingUp } from "lucide-react"
import { getPlayers, Player } from "@/lib/players-api"

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlayers()
  }, [])

  useEffect(() => {
    const filtered = players.filter(player =>
      player.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.club_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPlayers(filtered)
  }, [players, searchTerm])

  const loadPlayers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getPlayers()
      setPlayers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClick = () => {
    console.log('Add player clicked')
  }

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (isLoading) {
    return (
      <AdminPageLayout title="Players">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminPageLayout>
    )
  }

  if (error) {
    return (
      <AdminPageLayout title="Players">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadPlayers}>Retry</Button>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Players"
      actions={
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
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
                <UserCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{players.length}</p>
                  <p className="text-sm text-muted-foreground">Total Players</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{new Set(players.map(p => p.club_name).filter(Boolean)).size}</p>
                  <p className="text-sm text-muted-foreground">Unique Clubs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{players.reduce((sum, player) => sum + (player.total_articles || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    €{Math.round(players.reduce((sum, p) => sum + (p.market_value || 0), 0) / 1000000)}M
                  </p>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <Card key={player.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {player.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{player.full_name || 'Unknown Player'}</CardTitle>
                    <div className="flex gap-1 mt-1">
                      {player.position && (
                        <Badge variant="outline" className="text-xs">{player.position}</Badge>
                      )}
                      {player.nationality && (
                        <Badge variant="outline" className="text-xs">{player.nationality}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {player.club_name && (
                  <p className="text-sm font-medium">{player.club_name}</p>
                )}
                {player.league_name && (
                  <p className="text-xs text-muted-foreground">{player.league_name}</p>
                )}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Age: {calculateAge(player.date_of_birth) || 'N/A'}</span>
                  <span>Articles: {player.total_articles || 0}</span>
                </div>
                {player.market_value && (
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      €{(player.market_value / 1000000).toFixed(1)}M
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlayers.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No players found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}