"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Trophy, Building, Users, Calendar } from "lucide-react"
import { adminApi } from "@/lib/api"
import { Pagination } from "@/components/ui/pagination"

interface League {
  id: number
  name: string
  country: string
  club_count?: number
  player_count?: number
  article_count?: number
  created_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminLeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([])
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
    totalLeagues: 0,
    totalClubs: 0,
    totalPlayers: 0,
    totalArticles: 0
  })

  useEffect(() => {
    loadLeagues(1)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      // Reset to page 1 when searching
      loadLeagues(1, searchTerm)
    } else {
      loadLeagues(pagination.page)
    }
  }, [searchTerm])

  const loadLeagues = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await adminApi.getLeagues({
        page,
        limit: 50,
        search: search || searchTerm
      })
      
      setLeagues(response.leagues)
      setPagination(response.pagination)
      
      // Calculate stats from all leagues data
      setStats({
        totalLeagues: response.pagination.total,
        totalClubs: response.leagues.reduce((sum, league) => sum + (league.club_count || 0), 0),
        totalPlayers: response.leagues.reduce((sum, league) => sum + (league.player_count || 0), 0),
        totalArticles: response.leagues.reduce((sum, league) => sum + (league.article_count || 0), 0)
      })
      
    } catch (err) {
      console.error('Failed to load leagues:', err)
      setError(err instanceof Error ? err.message : 'Failed to load leagues')
      setLeagues([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadLeagues(newPage)
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
            <h1 className="text-3xl font-bold">Leagues</h1>
            <p className="text-muted-foreground">Manage football leagues and their information</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add League
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-medium">Failed to load leagues</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => loadLeagues(1)}>
                Retry
              </Button>
            </div>
          </div>
        )}

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
                  <p className="text-2xl font-bold">{stats.totalLeagues}</p>
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
                  <p className="text-2xl font-bold">{stats.totalClubs}</p>
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
                  <p className="text-2xl font-bold">{stats.totalPlayers}</p>
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
                  <p className="text-2xl font-bold">{stats.totalArticles}</p>
                  <p className="text-sm text-muted-foreground">Total Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leagues Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leagues ({pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
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
                      <TableHead>Country</TableHead>
                      <TableHead>Clubs</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leagues.map((league) => (
                      <TableRow key={league.id}>
                        <TableCell className="font-mono text-sm">{league.id}</TableCell>
                        <TableCell className="font-medium">{league.name}</TableCell>
                        <TableCell>{league.country}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{league.club_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{league.player_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{league.article_count || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(league.created_at)}
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
                  itemName="leagues"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
