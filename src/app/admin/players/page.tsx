"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Users, Building, Calendar } from "lucide-react"
import { adminApi } from "@/lib/api"
import { Pagination } from "@/components/ui/pagination"

interface Player {
  id: number
  full_name: string
  current_club_id?: number
  current_club_name?: string
  league_name?: string
  country?: string
  article_count?: number
  created_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalClubs: 0,
    totalArticles: 0
  })

  useEffect(() => {
    loadPlayers(1)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      // Reset to page 1 when searching
      loadPlayers(1, searchTerm)
    } else {
      loadPlayers(pagination.page)
    }
  }, [searchTerm])

  const loadPlayers = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await adminApi.getPlayers({
        page,
        limit: 50,
        search: search || searchTerm
      })
      
      setPlayers(response.players)
      setPagination(response.pagination)
      
      // Calculate stats from all players data
      const uniqueClubs = new Set(response.players.filter(p => p.current_club_id).map(p => p.current_club_id))
      setStats({
        totalPlayers: response.pagination.total,
        totalClubs: uniqueClubs.size,
        totalArticles: response.players.reduce((sum, player) => sum + (player.article_count || 0), 0)
      })
      
    } catch (err) {
      console.error('Failed to load players:', err)
      setError(err instanceof Error ? err.message : 'Failed to load players')
      setPlayers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadPlayers(newPage)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Players</h1>
            <p className="text-muted-foreground">Manage football players and their information</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-medium">Failed to load players</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => loadPlayers(1)}>
                Retry
              </Button>
            </div>
          </div>
        )}

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalPlayers}</p>
                  <p className="text-sm text-muted-foreground">Total Players</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalClubs}</p>
                  <p className="text-sm text-muted-foreground">Active Clubs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalArticles}</p>
                  <p className="text-sm text-muted-foreground">Total Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Players ({pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Current Club</TableHead>
                      <TableHead>League</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-mono text-sm">{player.id}</TableCell>
                        <TableCell className="font-medium">{player.full_name}</TableCell>
                        <TableCell>{player.current_club_name || '-'}</TableCell>
                        <TableCell>{player.league_name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.article_count || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(player.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                  itemName="players"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
