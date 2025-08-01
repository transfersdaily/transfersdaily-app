"use client"


import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronDown,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  Upload,
  ArrowUpDown,
  Archive,
} from "lucide-react"

interface Article {
  id: string
  title: string
  category: string
  subcategory: string
  league: string
  player_name: string
  transfer_fee: number | null
  transfer_status: string
  created_at: string        // Backend returns created_at
  published_at?: string     // Backend returns published_at (optional)
  tags: string[]
}

interface ArticlesTableProps {
  articles: Article[]
  totalArticles: number
  currentPage: number
  onPageChange: (page: number) => void
  selectedArticles: string[]
  onSelectArticles: (ids: string[]) => void
  onSelectAll: (checked: boolean) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  onSearch?: () => void
  onSearchKeyPress?: (e: React.KeyboardEvent) => void
  onResetFilters?: () => void
  categoryFilter: string
  onCategoryChange: (category: string) => void
  leagueFilter: string
  onLeagueChange: (league: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  pageType: "draft" | "published" | "scheduled"
  onDeleteArticle?: (id: string) => void
  onPublishArticle?: (id: string) => void
  sortBy?: string
  sortOrder?: string
  onSort?: (column: string) => void
  itemsPerPage?: number
  onItemsPerPageChange?: (items: number) => void
}

export function ArticlesTable({
  articles,
  totalArticles,
  currentPage,
  onPageChange,
  selectedArticles,
  onSelectArticles,
  onSelectAll,
  searchTerm,
  onSearchChange,
  onSearch,
  onSearchKeyPress,
  onResetFilters,
  categoryFilter,
  onCategoryChange,
  leagueFilter,
  onLeagueChange,
  statusFilter,
  onStatusChange,
  pageType,
  onDeleteArticle,
  onPublishArticle,
  sortBy = 'created_at',
  sortOrder = 'asc',
  onSort,
  itemsPerPage = 20,
  onItemsPerPageChange,
}: ArticlesTableProps) {
  const totalPages = Math.ceil(totalArticles / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(startIndex + articles.length - 1, totalArticles)

  const handleSelectArticle = (articleId: string, checked: boolean) => {
    if (checked) {
      onSelectArticles([...selectedArticles, articleId])
    } else {
      onSelectArticles(selectedArticles.filter(id => id !== articleId))
    }
  }

  const formatTransferFee = (fee: number | null) => {
    if (!fee || fee === 0) return "Free"
    return fee.toString()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "rumour": return "secondary"
      case "confirmed": return "default"
      case "completed": return "default"
      case "failed": return "destructive"
      default: return "secondary"
    }
  }



  const handleBulkDelete = () => {
    selectedArticles.forEach(id => onDeleteArticle?.(id))
    onSelectArticles([])
  }

  const getRowActions = (article: Article) => {
    switch (pageType) {
      case "draft":
        return (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/admin/articles/edit/${article.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = `/admin/articles/publish/${article.id}/edit`}>
              <Upload className="mr-2 h-4 w-4" />
              Publish
            </DropdownMenuItem>
          </>
        )
      case "published":
        return (
          <>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </>
        )
      case "scheduled":
        return (
          <>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Upload className="mr-2 h-4 w-4" />
              Publish Now
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Unschedule
            </DropdownMenuItem>
          </>
        )
    }
  }

  return (
    <Card className="focus-within:ring-0 focus-within:ring-offset-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>
            Showing {startIndex}-{endIndex} of {totalArticles} articles
          </CardDescription>
          <div className="flex items-center space-x-2">
            {selectedArticles.length > 0 && (
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedArticles.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={onSearchKeyPress}
                className="pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button onClick={onSearch} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px] focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="loan">Loan</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="rumour">Rumour</SelectItem>
            </SelectContent>
          </Select>
          <Select value={leagueFilter} onValueChange={onLeagueChange}>
            <SelectTrigger className="w-[140px] focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="League" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leagues</SelectItem>
              <SelectItem value="Premier League">Premier League</SelectItem>
              <SelectItem value="La Liga">La Liga</SelectItem>
              <SelectItem value="Serie A">Serie A</SelectItem>
              <SelectItem value="Bundesliga">Bundesliga</SelectItem>
              <SelectItem value="Ligue 1">Ligue 1</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px] focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="rumour">Rumour</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="done-deal">Done Deal</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onResetFilters} variant="outline" size="sm" className="border-red-500 text-red-600 hover:bg-red-50">
            Reset
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={articles.length > 0 && selectedArticles.length === articles.length}
                    ref={(el) => {
                      if (el) {
                        (el as any).indeterminate = selectedArticles.length > 0 && selectedArticles.length < articles.length
                      }
                    }}
                    onCheckedChange={onSelectAll}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 p-0"
                    onClick={() => onSort?.('title')}
                  >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 p-0"
                    onClick={() => onSort?.('league')}
                  >
                    League
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 p-0"
                    onClick={() => onSort?.('player_name')}
                  >
                    Player
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 p-0"
                    onClick={() => onSort?.('transfer_fee')}
                  >
                    Transfer Fee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 p-0"
                    onClick={() => onSort?.(pageType === 'published' ? 'published_at' : 'created_at')}
                  >
                    {pageType === 'published' ? 'Published Date' : 'Created Date'}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedArticles.includes(article.id)}
                      onCheckedChange={(checked) => handleSelectArticle(article.id, checked as boolean)}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link 
                      href={`/admin/articles/edit/${article.id}`}
                      className="max-w-[300px] truncate block text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {article.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.category}</Badge>
                  </TableCell>
                  <TableCell>{article.league}</TableCell>
                  <TableCell>{article.player_name}</TableCell>
                  <TableCell>{formatTransferFee(article.transfer_fee)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(article.transfer_status)}>
                      {article.transfer_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* For draft articles, show created_at. For published articles, show published_at or created_at as fallback */}
                    {(() => {
                      const createdAt = (article as any).created_at
                      const publishedAt = (article as any).published_at
                      
                      // For published articles, prefer published_at, fallback to created_at
                      // For draft articles, use created_at
                      const dateToShow = pageType === 'published' 
                        ? (publishedAt || createdAt)
                        : createdAt
                      
                      return dateToShow 
                        ? new Date(dateToShow).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'No date'
                    })()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {getRowActions(article)}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => onDeleteArticle?.(article.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            {selectedArticles.length} of {articles.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange?.(parseInt(value))}>
              <SelectTrigger className="h-8 w-[70px] focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}