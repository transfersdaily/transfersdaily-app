"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Building, Users, Calendar } from "lucide-react"
import { adminApi } from "@/lib/api"
import { Pagination } from "@/components/ui/pagination"

interface Club {
  id: number
  name: string
  league_id?: number
  league_name?: string
  country?: string
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

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
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
    totalClubs: 0,
    totalPlayers: 0,
    totalArticles: 0
  })

  useEffect(() => {
    loadClubs(1)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      // Reset to page 1 when searching
      loadClubs(1, searchTerm)
    } else {
      loadClubs(pagination.page)
    }
  }, [searchTerm])

  const loadClubs = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await adminApi.getClubs({
        page,
        limit: 50,
        search: search || searchTerm
      })
      
      setClubs(response.clubs)
      setPagination(response.pagination)
      
      // Calculate stats from all clubs data
      setStats({
        totalClubs: response.pagination.total,
        totalPlayers: response.clubs.reduce((sum, club) => sum + (club.player_count || 0), 0),
        totalArticles: response.clubs.reduce((sum, club) => sum + (club.article_count || 0), 0)
      })
      
    } catch (err) {
      console.error('Failed to load clubs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load clubs')
      setClubs([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadClubs(newPage)
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
            <h1 className="text-3xl font-bold">Clubs</h1>
            <p className="text-muted-foreground">Manage football clubs and their information</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Club
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-medium">Failed to load clubs</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => loadClubs(1)}>
                Retry
              </Button>
            </div>
          </div>
        )}

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

        {/* Clubs Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Clubs ({pagination.total})</CardTitle>
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
                      <TableHead>League</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clubs.map((club) => (
                      <TableRow key={club.id}>
                        <TableCell className="font-mono text-sm">{club.id}</TableCell>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>{club.league_name || '-'}</TableCell>
                        <TableCell>{club.country || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{club.player_count || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{club.article_count || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(club.created_at)}
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
                  itemName="clubs"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
