"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { TransferCard } from "@/components/TransferCard"
import { Footer } from "@/components/Footer"
import { Sidebar } from "@/components/Sidebar"
import { TransferGridSkeleton } from "@/components/TransferCardSkeleton"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { Filter } from "lucide-react"
import { transfersApi, type Transfer } from "@/lib/api"
import { ResultsInfo } from "@/components/ResultsInfo"

export default function Ligue1Page() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClub, setSelectedClub] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)

  const itemsPerPage = 15

  useEffect(() => {
    loadTransfers()
  }, [currentPage, selectedClub])

  const loadTransfers = async () => {
    try {
      setIsLoading(true)
      const offset = (currentPage - 1) * itemsPerPage
      const response = await transfersApi.getByLeagueWithPagination('ligue-1', itemsPerPage, offset)
      
      const filteredData = selectedClub === "all" 
        ? response.transfers 
        : response.transfers.filter(t => t.currentClub?.toLowerCase().includes(selectedClub.toLowerCase()) || 
                                         t.destinationClub?.toLowerCase().includes(selectedClub.toLowerCase()))
      
      setTransfers(filteredData)
      setTotalPages(response.pagination?.totalPages || 1)
      setTotalArticles(response.pagination?.total || 0)
    } catch (error) {
      console.error('Error loading Ligue 1 transfers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const handleFilterChange = (club: string) => {
    setSelectedClub(club)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedClub("all")
    setCurrentPage(1)
  }

  const clubs = ["Paris Saint-Germain", "Olympique Marseille", "AS Monaco", "Olympique Lyonnais", "Lille OSC", "OGC Nice", "Stade Rennais", "RC Strasbourg", "Montpellier HSC", "FC Nantes", "Stade Brestois", "RC Lens", "Angers SCO", "FC Lorient", "Clermont Foot", "ES Troyes AC", "FC Metz", "Girondins Bordeaux", "AS Saint-Étienne", "Stade Reims"]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
          <div className="lg:col-span-8">
            <section className="py-3 border-b bg-muted/30 -mx-4 px-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <img 
                    src="/logos/leagues/ligue-1.png"
                    alt="Ligue 1 logo"
                    className="w-8 h-8 object-contain"
                  />
                  <h1 className="text-xl font-bold">Ligue 1 Transfers</h1>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filter by:</span>
                  </div>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <Select value={selectedClub} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Clubs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clubs</SelectItem>
                      {clubs.map((club) => (
                        <SelectItem key={club} value={club}>{club}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <ResultsInfo 
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalArticles}
              isLoading={isLoading}
            />

            {isLoading ? (
              <TransferGridSkeleton count={15} />
            ) : transfers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {transfers.map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    title={transfer.title}
                    excerpt={transfer.excerpt}
                    primaryBadge={transfer.currentClub || 'Ligue 1'}
                    timeAgo={formatTimeAgo(transfer.publishedAt)}
                    href={`/article/${transfer.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No transfers found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters
                </p>
                <button 
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <div className="pb-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1)
                          }
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(pageNum)
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1)
                          }
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="lg:col-span-3 bg-muted/10 border-l -mr-4 pr-4">
              <div className="p-4">
                <SidebarSkeleton />
              </div>
            </div>
          ) : (
            <Sidebar />
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}