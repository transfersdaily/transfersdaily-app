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
import { Sidebar } from "@/components/Sidebar"
import { TransferGridSkeleton } from "@/components/TransferCardSkeleton"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { Filter, MessageCircle } from "lucide-react"
import { transfersApi, type Transfer } from "@/lib/api"
import { ResultsInfo } from "@/components/ResultsInfo"

interface RumorsPageProps {
  params: {
    locale: string
  }
}

export default function RumorsPage({ params }: RumorsPageProps) {
  const { locale } = params
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLeague, setSelectedLeague] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  
  const itemsPerPage = 15
  
  useEffect(() => {
    loadTransfers()
  }, [currentPage, selectedLeague])

  const loadTransfers = async () => {
    try {
      setIsLoading(true)
      const offset = (currentPage - 1) * itemsPerPage
      
      // Filter for rumor transfers
      const response = await transfersApi.getByStatusWithPagination('rumor', itemsPerPage, offset)
      
      // Further filter by league if selected
      const filteredData = selectedLeague === "all" 
        ? response.transfers 
        : response.transfers.filter(t => t.league?.toLowerCase().includes(selectedLeague.toLowerCase()))
      
      setTransfers(filteredData)
      setTotalPages(response.pagination?.totalPages || 1)
      setTotalArticles(response.pagination?.total || 0)
    } catch (error) {
      console.error('Error loading transfer rumors:', error)
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
  
  const handleFilterChange = (league: string) => {
    setSelectedLeague(league)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedLeague("all")
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          <div className="lg:col-span-7">
            <section className="py-3 border-b bg-muted/30 -mx-4 px-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <MessageCircle className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                  <h1 className="text-xl font-bold">Transfer Rumors</h1>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filter by:</span>
                  </div>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <Select value={selectedLeague} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-40">
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
                    primaryBadge="Rumor"
                    timeAgo={formatTimeAgo(transfer.publishedAt)}
                    href={`/${locale}/article/${transfer.slug}`}
                    imageUrl={transfer.imageUrl}
                    imageAlt={transfer.title}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No transfer rumors found</h3>
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

          {/* Sidebar - 30% */}
          <div className="hidden lg:block lg:col-span-3">
            {isLoading ? (
              <div className="bg-muted/10 border-l -mr-4 pr-4">
                <div className="p-4">
                  <SidebarSkeleton />
                </div>
              </div>
            ) : (
              <Sidebar />
            )}
          </div>
        </div>
      </div>

    </main>
  )
}
