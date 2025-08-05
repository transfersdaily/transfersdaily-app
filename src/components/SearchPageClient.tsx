"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, TrendingUp, History } from "lucide-react"
import { searchApi, transfersApi, type Transfer } from "@/lib/api"
import { TransferCard } from "@/components/TransferCard"
import { TransferGridWithAds } from "@/components/TransferGridWithAds"
import { Sidebar } from "@/components/Sidebar"
import { addRecentSearch } from "@/components/TrendingTopics"
import { type Locale } from "@/lib/i18n"
import { createTranslator } from "@/lib/dictionary-server"
import { adminMobileClasses } from "@/lib/mobile-utils"
// Ad components
import { RectangleAd, LeaderboardAd, NativeAd } from "@/components/ads"

const trendingSearches = [
  "Kylian Mbappé", "Manchester United transfers", "Real Madrid", "Premier League", 
  "Chelsea signings", "Liverpool news", "Barcelona transfers", "Arsenal deals"
]

const recentSearches = [
  "Haaland contract", "PSG transfers", "Serie A moves", "Bundesliga news"
]

interface SearchPageClientProps {
  locale: Locale
  dict: any
  initialSearchQuery: string
  initialLeague: string
  initialStatus: string
  initialSortBy: string
}

export function SearchPageClient({ 
  locale, 
  dict, 
  initialSearchQuery,
  initialLeague,
  initialStatus,
  initialSortBy
}: SearchPageClientProps) {
  const router = useRouter()
  const t = createTranslator(dict)
  
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery)
  const [selectedLeague, setSelectedLeague] = useState(initialLeague)
  const [selectedStatus, setSelectedStatus] = useState(initialStatus)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Transfer[]>([])
  const [hasSearched, setHasSearched] = useState(!!initialSearchQuery)

  // Helper function to format time ago with translations
  function formatTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return t('common.justNow') || 'Just now'
    if (diffInHours < 24) return `${diffInHours} ${t('common.hoursAgo') || 'hours ago'}`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ${t('common.daysAgo') || 'days ago'}`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} ${t('common.weeksAgo') || 'weeks ago'}`
  }

  // Update URL when search parameters change
  const updateURL = (query: string, league: string, status: string, sort: string) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (league !== 'all') params.set('league', league)
    if (status !== 'all') params.set('status', status)
    if (sort !== 'relevance') params.set('sort', sort)
    
    const newURL = `/${locale}/search${params.toString() ? `?${params.toString()}` : ''}`
    router.push(newURL, { scroll: false })
  }

  // Perform search
  const performSearch = async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setHasSearched(true)
    
    try {
      // Track the search query in the database
      searchApi.trackSearch(query.trim(), {
        league: selectedLeague === 'all' ? undefined : selectedLeague,
        status: selectedStatus === 'all' ? undefined : selectedStatus
      }).catch(error => {
        // Don't let tracking failures affect search functionality
        console.warn('Failed to track search:', error)
      })

      const results = await transfersApi.search(query.trim(), {
        league: selectedLeague === 'all' ? undefined : selectedLeague,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        language: locale
      })
      
      setSearchResults(results)
      addRecentSearch(query.trim())
      updateURL(query.trim(), selectedLeague, selectedStatus, sortBy)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchTerm)
  }

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case 'league':
        setSelectedLeague(value)
        break
      case 'status':
        setSelectedStatus(value)
        break
      case 'sort':
        setSortBy(value)
        break
    }
    
    if (hasSearched && searchTerm) {
      performSearch(searchTerm)
    }
  }

  // Handle trending search click
  const handleTrendingClick = (query: string) => {
    setSearchTerm(query)
    performSearch(query)
  }

  // Perform initial search if there's a query
  useEffect(() => {
    if (initialSearchQuery) {
      performSearch(initialSearchQuery)
    }
  }, [])

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
        <div className="lg:col-span-7">
          {/* Header Section */}
          <header className="py-8">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li>
                  <a href={`/${locale}`} className="hover:text-primary transition-colors">
                    {t('navigation.home')}
                  </a>
                </li>
                <li className="before:content-['/'] before:mx-2" aria-current="page">
                  {t('navigation.search')}
                </li>
              </ol>
            </nav>
            
            <h1 className="text-3xl font-bold mb-6">
              {hasSearched && searchTerm 
                ? `${t('search.resultsFor')} "${searchTerm}"`
                : t('search.title') || 'Search Transfer News'
              }
            </h1>
          </header>

          {/* Search Form */}
          <section className="mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={t('search.placeholder') || 'Search players, clubs, or transfer news...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? t('common.searching') || 'Searching...' : t('common.search') || 'Search'}
                </Button>
              </div>
              
              {/* Filters */}
              <div className={`flex flex-wrap gap-4 items-center ${adminMobileClasses.desktopOnly}`}>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('search.filters') || t('common.filter') || 'Filters'}:</span>
                </div>
                
                <Select value={selectedLeague} onValueChange={(value) => handleFilterChange('league', value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('navigation.leagues')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')} {t('navigation.leagues')}</SelectItem>
                    <SelectItem value="Premier League">Premier League</SelectItem>
                    <SelectItem value="La Liga">La Liga</SelectItem>
                    <SelectItem value="Serie A">Serie A</SelectItem>
                    <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                    <SelectItem value="Ligue 1">Ligue 1</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={t('search.status') || 'Status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="confirmed">{t('search.confirmed') || t('transfers.confirmed') || 'Confirmed'}</SelectItem>
                    <SelectItem value="rumor">{t('search.rumor') || t('transfers.rumors') || 'Rumors'}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={t('search.sortBy') || 'Sort by'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">{t('search.relevance') || 'Relevance'}</SelectItem>
                    <SelectItem value="date">{t('search.newest') || 'Newest'}</SelectItem>
                    <SelectItem value="popularity">{t('search.popular') || 'Popular'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </section>

          {/* Trending Searches */}
          {!hasSearched && (
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{t('search.trending')}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleTrendingClick(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <History className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{t('search.recent')}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => handleTrendingClick(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Search Results */}
          {hasSearched && (
            <section aria-labelledby="search-results">
              <h2 id="search-results" className="sr-only">Search Results</h2>
              
              {isSearching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-48"></div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    {searchResults.length} {t('search.resultsFound')} for &quot;{searchTerm}&quot;
                  </div>
                  
                  {/* Ad: Rectangle after search info */}
                  <div className="mb-6">
                    <RectangleAd position="after-header" />
                  </div>
                  
                  <TransferGridWithAds
                    transfers={searchResults}
                    locale={locale}
                    dict={dict}
                    adPosition="in-search-results"
                  />
                  
                  {/* Ad: Leaderboard after search results */}
                  <div className="mt-8">
                    <LeaderboardAd position="mid-content" />
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">{t('search.noResults')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('search.tryDifferent')} &quot;{searchTerm}&quot;
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('')
                      setHasSearched(false)
                      setSearchResults([])
                    }}
                    variant="outline"
                  >
                    {t('search.newSearch')}
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3" aria-label="Sidebar">
          <div className="sticky top-8">
            <Sidebar locale={locale} dict={dict} />
          </div>
        </aside>
      </div>
    </div>
  )
}
