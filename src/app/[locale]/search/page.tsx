"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Search, Filter, TrendingUp, History, X } from "lucide-react"
import { transfersApi, searchApi, type Transfer } from "@/lib/api"
import { TransferCard } from "@/components/TransferCard"
import { Sidebar } from "@/components/Sidebar"
import { addRecentSearch } from "@/components/TrendingTopics"
import { type Locale, getDictionary, getTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const trendingSearches = [
  "Kylian Mbappé", "Manchester United transfers", "Real Madrid", "Premier League", 
  "Chelsea signings", "Liverpool news", "Barcelona transfers", "Arsenal deals"
]

const recentSearches = [
  "Haaland contract", "PSG transfers", "Serie A moves", "Bundesliga news"
]

// Helper function to format time ago with translations
function formatTimeAgo(dateString: string, t: (key: string, fallback?: string) => string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return t('common.justNow', 'Just now')
  if (diffInHours < 24) return `${diffInHours} ${t('common.hoursAgo', 'hours ago')}`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ${t('common.daysAgo', 'days ago')}`
  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks} ${t('common.weeksAgo', 'weeks ago')}`
}

function SearchContent() {
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = params.locale as Locale
  
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || "")
  const [selectedLeague, setSelectedLeague] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Transfer[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dict, setDict] = useState<any>({})
  const [translationsLoaded, setTranslationsLoaded] = useState(false)

  // Load dictionary
  useEffect(() => {
    loadDictionary()
  }, [locale])

  const loadDictionary = async () => {
    try {
      setTranslationsLoaded(false)
      const dictionary = await getDictionary(locale)
      setDict(dictionary)
      setTranslationsLoaded(true)
    } catch (error) {
      console.error('Error loading dictionary:', error)
      setTranslationsLoaded(true)
    }
  }

  const t = (key: string, fallback?: string) => {
    if (!translationsLoaded) return fallback || ''
    return getTranslation(dict, key) || fallback || key
  }

  // Real search function using API
  const performSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    setError(null)
    
    // Add to recent searches
    addRecentSearch(searchTerm.trim())
    
    try {
      // Build filters object
      const filters: any = {}
      
      if (selectedLeague !== "all") {
        filters.league = selectedLeague
      }
      
      if (selectedStatus !== "all") {
        // Map frontend status values to backend values
        const statusMapping: Record<string, string> = {
          "Confirmed": "confirmed",
          "Rumor": "rumor", 
          "In Progress": "rumor", // Map to rumor as fallback
          "Completed": "completed"
        }
        filters.status = statusMapping[selectedStatus] || selectedStatus.toLowerCase()
      }

      // Track the search (async, don't wait for it)
      searchApi.trackSearch(searchTerm, filters).catch(err => 
        console.warn('Failed to track search:', err)
      )

      // Call real API
      const results = await transfersApi.search(searchTerm, filters)
      
      // Sort results on frontend since backend might not support all sort options
      if (sortBy === "newest") {
        results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      } else if (sortBy === "oldest") {
        results.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      }
      // relevance is default from API
      
      setSearchResults(results)
    } catch (err) {
      console.error('Search error:', err)
      setError('Search failed. Please try again.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  // Search on initial load if query param exists
  useEffect(() => {
    if (searchParams?.get('q') && translationsLoaded) {
      performSearch()
    }
  }, [translationsLoaded])

  if (!translationsLoaded) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
            <div className="lg:col-span-7">
              <div className="py-8">
                <div className="h-8 w-64 bg-muted rounded animate-pulse mb-6"></div>
                <div className="h-12 w-full bg-muted rounded animate-pulse mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-muted/10 border-l -mr-4 pr-4">
                <div className="p-4">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 w-full bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Main Layout with Sidebar */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Content Area - Full width on mobile, 70% on desktop */}
          <div className="col-span-1 lg:col-span-7">
            {/* Search Header */}
            <section className="py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">{t('search.title', 'Search Transfer News')}</h1>
                <p className="text-muted-foreground">
                  {t('search.description', 'Find the latest transfer news, rumors, and confirmed deals from all major leagues')}
                </p>
              </div>
            
              {/* Main Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('search.placeholder', 'Search for players, clubs, transfers...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={cn(
                    "pl-12 h-12 text-base border focus:border-primary",
                    "focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  )}
                />
                <Button 
                  onClick={performSearch}
                  disabled={isSearching || !searchTerm.trim()}
                  className={cn(
                    "absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "text-sm font-medium"
                  )}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-2" />
                      {t('search.searching', 'Searching...')}
                    </>
                  ) : (
                    t('search.searchButton', 'Search')
                  )}
                </Button>
              </div>
              
              {/* Search Filters */}
              <div className="flex flex-wrap gap-3 items-center justify-center mb-8">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('search.filters', 'Filters')}:</span>
                </div>
                
                <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder={t('search.league', 'League')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('search.allLeagues', 'All Leagues')}</SelectItem>
                    <SelectItem value="Premier League">Premier League</SelectItem>
                    <SelectItem value="La Liga">La Liga</SelectItem>
                    <SelectItem value="Serie A">Serie A</SelectItem>
                    <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                    <SelectItem value="Ligue 1">Ligue 1</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder={t('search.status', 'Status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('search.allStatus', 'All Status')}</SelectItem>
                    <SelectItem value="Confirmed">{t('search.confirmed', 'Confirmed')}</SelectItem>
                    <SelectItem value="Rumor">{t('search.rumor', 'Rumor')}</SelectItem>
                    <SelectItem value="In Progress">{t('search.inProgress', 'In Progress')}</SelectItem>
                    <SelectItem value="Completed">{t('search.completed', 'Completed')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder={t('search.sortBy', 'Sort by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">{t('search.relevance', 'Relevance')}</SelectItem>
                    <SelectItem value="newest">{t('search.newest', 'Newest First')}</SelectItem>
                    <SelectItem value="oldest">{t('search.oldest', 'Oldest First')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Search Results Section */}
            <section className="py-4">
              {!hasSearched ? (
                /* Pre-search State */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Trending Searches */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{t('search.trending', 'Trending Searches')}</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((term, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchTerm(term)
                              setTimeout(performSearch, 100)
                            }}
                            className="text-sm"
                          >
                            {term}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Searches */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <History className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{t('search.recent', 'Recent Searches')}</h2>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((term, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer">
                            <span 
                              className="text-sm"
                              onClick={() => {
                                setSearchTerm(term)
                                setTimeout(performSearch, 100)
                              }}
                            >
                              {term}
                            </span>
                            <Button variant="ghost" size="sm">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                /* Search Results */
                <div>
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {isSearching ? t('search.searching', 'Searching...') : `${t('search.resultsFor', 'Search Results for')} "${searchTerm}"`}
                      </h2>
                      {!isSearching && (
                        <p className="text-muted-foreground text-sm">
                          {t('search.foundResults', 'Found {{count}} results').replace('{{count}}', searchResults.length.toString())}
                        </p>
                      )}
                    </div>
                    
                    {searchResults.length > 0 && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("")
                          setHasSearched(false)
                          setSearchResults([])
                        }}
                      >
                        {t('search.newSearch', 'New Search')}
                      </Button>
                    )}
                  </div>

                  {/* Loading State */}
                  {isSearching && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="aspect-[4/3] bg-muted animate-pulse" />
                          <CardContent className="p-4">
                            <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                            <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2" />
                            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Error Display */}
                  {!isSearching && error && (
                    <div className="text-center py-12">
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-destructive mb-2">{t('search.error', 'Search Error')}</h3>
                        <p className="text-sm text-destructive/80 mb-4">{error}</p>
                        <Button onClick={performSearch} variant="outline">
                          {t('search.tryAgain', 'Try Again')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Search Results - Using TransferCard */}
                  {!isSearching && !error && searchResults.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.map((result) => (
                        <TransferCard
                          key={result.id}
                          title={result.title}
                          excerpt={result.excerpt}
                          primaryBadge={result.league}
                          timeAgo={formatTimeAgo(result.publishedAt, t)}
                          href={`/${locale}/article/${result.slug}?language=${locale}`}
                          imageUrl={result.imageUrl}
                          imageAlt={result.title}
                        />
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearching && !error && searchResults.length === 0 && hasSearched && (
                    <div className="text-center py-12">
                      <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">{t('search.noResults', 'No results found')}</h3>
                      <p className="text-muted-foreground mb-6">
                        {t('search.tryAdjusting', 'Try adjusting your search terms or filters')}
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedLeague("all")
                            setSelectedStatus("all")
                            setSortBy("relevance")
                          }}
                        >
                          {t('search.clearFilters', 'Clear Filters')}
                        </Button>
                        <Button 
                          onClick={() => {
                            setSearchTerm("")
                            setHasSearched(false)
                          }}
                        >
                          {t('search.newSearch', 'New Search')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - 30% - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar locale={locale} dict={dict} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
