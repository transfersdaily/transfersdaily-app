"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Building, Users, Calendar } from "lucide-react"
import { getClubs, Club } from "@/lib/clubs-api"

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClubs()
  }, [])

  useEffect(() => {
    const filtered = clubs.filter(club =>
      club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.league_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.country?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredClubs(filtered)
  }, [clubs, searchTerm])

  const loadClubs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getClubs()
      setClubs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clubs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClick = () => {
    console.log('Add club clicked')
  }

  if (isLoading) {
    return (
      <AdminPageLayout title="Clubs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminPageLayout>
    )
  }

  if (error) {
    return (
      <AdminPageLayout title="Clubs">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadClubs}>Retry</Button>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout
      title="Clubs"
      actions={
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Club
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{clubs.length}</p>
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
                  <p className="text-2xl font-bold">{clubs.reduce((sum, club) => sum + (club.player_count || 0), 0)}</p>
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
                  <p className="text-2xl font-bold">{clubs.reduce((sum, club) => sum + (club.article_count || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {club.name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{club.name || 'Unknown Club'}</CardTitle>
                    {club.league_name && (
                      <Badge variant="outline" className="mt-1 text-xs">{club.league_name}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {club.country && (
                  <p className="text-sm text-muted-foreground">{club.country}</p>
                )}
                {club.stadium && (
                  <p className="text-xs text-muted-foreground">Stadium: {club.stadium}</p>
                )}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Players: {club.player_count || 0}</span>
                  <span>Articles: {club.article_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClubs.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No clubs found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}