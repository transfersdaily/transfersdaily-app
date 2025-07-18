"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy } from "lucide-react"
import { Footer } from "@/components/Footer"
import { TransferCard } from "@/components/TransferCard"
import { Sidebar } from "@/components/Sidebar"
import { TransferGridSkeleton } from "@/components/TransferCardSkeleton"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useState, useEffect } from "react"
import { transfersApi, articlesApi, leaguesApi, type Transfer, type Article, type League } from "@/lib/api"
import { ViewAllButton } from "@/components/ViewAllButton"
import { NewsletterSection } from "@/components/NewsletterSection"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [featuredTransfer, setFeaturedTransfer] = useState<Transfer | null>(null)
  const [latestTransfers, setLatestTransfers] = useState<Transfer[]>([])
  const [trendingTransfers, setTrendingTransfers] = useState<Transfer[]>([])
  const [leagues, setLeagues] = useState<League[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load data in parallel
      const [
        latestTransfersData,
        trendingArticlesData,
        leaguesData
      ] = await Promise.all([
        transfersApi.getLatest(7), // Get 7 latest transfers (1 for hero + 6 for latest section)
        articlesApi.getTrending(6), // Get 6 trending articles
        leaguesApi.getAll()
      ])

      // Set featured transfer (first from latest)
      if (latestTransfersData.length > 0) {
        setFeaturedTransfer(latestTransfersData[0])
        setLatestTransfers(latestTransfersData.slice(1, 7)) // Next 6 for latest section
      }

      // Convert trending articles to transfer format for display
      const trendingAsTransfers: Transfer[] = trendingArticlesData.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        league: article.league || 'General',
        status: 'confirmed' as const,
        publishedAt: article.publishedAt,
        imageUrl: article.imageUrl,
        tags: article.tags
      }))
      
      setTrendingTransfers(trendingAsTransfers.slice(0, 6))
      setLeagues(leaguesData.slice(0, 5)) // Top 5 leagues
      
    } catch (error) {
      console.error('Error loading home page data:', error)
      // Fallback to empty arrays - components will handle empty states
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

  return (
    <main className="min-h-screen bg-background">
      {/* Main Layout with Sidebar */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Content Area - Full width on mobile, 70% on desktop */}
          <div className="col-span-1 lg:col-span-7">
            {/* Hero Section with Main Story */}
            <section className="py-8">
              {isLoading ? (
                <Card className="overflow-hidden h-[500px] relative">
                  <Skeleton className="w-full h-full" />
                </Card>
              ) : featuredTransfer ? (
                <Link 
                  href={`/article/${featuredTransfer.id}`}
                  className="focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg"
                  aria-label={`Read full article: ${featuredTransfer.title}`}
                >
                  <Card className="overflow-hidden h-[500px] relative cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                    <div className="h-full bg-muted relative">
                      {featuredTransfer.imageUrl && (
                        <img 
                          src={featuredTransfer.imageUrl} 
                          alt={`Featured transfer news: ${featuredTransfer.title} - ${featuredTransfer.league}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      {/* Overlay gradient - Enhanced for better contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                      
                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                        <Badge variant="outline" className="mb-4 bg-black/60 text-white border-white/50 animate-fade-in">
                          {featuredTransfer.league.toUpperCase()}
                        </Badge>
                        <h1 className="text-2xl font-bold mb-4 leading-tight animate-fade-in-up text-white drop-shadow-lg">
                          {featuredTransfer.title}
                        </h1>
                        <p className="text-white text-base leading-relaxed line-clamp-2 mb-6 animate-fade-in-up animation-delay-100 drop-shadow-md">
                          {featuredTransfer.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-white animate-fade-in-up animation-delay-200 drop-shadow-md">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(featuredTransfer.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card className="overflow-hidden h-[500px] relative">
                  <div className="h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No featured transfer available</p>
                  </div>
                </Card>
              )}
            </section>

            {/* Latest News Section */}
            <section className="bg-muted/30 py-8 -mx-4 px-4 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Transfer News</h2>
                <ViewAllButton href="/latest">
                  View All
                </ViewAllButton>
              </div>
              {isLoading ? (
                <TransferGridSkeleton count={6} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestTransfers.length > 0 ? (
                    latestTransfers.map((transfer) => (
                      <TransferCard
                        key={transfer.id}
                        title={transfer.title}
                        excerpt={transfer.excerpt}
                        primaryBadge={transfer.league}
                        timeAgo={formatTimeAgo(transfer.publishedAt)}
                        href={`/article/${transfer.id}`}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No latest transfers available</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Leagues Navigation */}
            <section className="py-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Browse by League</h2>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 text-center">
                        <Skeleton className="w-12 h-12 mx-auto mb-3 rounded-full" />
                        <Skeleton className="h-4 w-20 mx-auto mb-1" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {leagues.map((league) => (
                    <Link 
                      key={league.id} 
                      href={`/league/${league.slug}`}
                      className="focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg"
                      aria-label={`View ${league.name} transfers and news`}
                    >
                      <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                            {league.logoUrl ? (
                              <img 
                                src={league.logoUrl}
                                alt={`${league.name} official league logo`}
                                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                              />
                            ) : (
                              <div 
                                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                                role="img"
                                aria-label={`${league.name} league icon`}
                              >
                                <Trophy className="w-5 h-5 text-primary" aria-hidden="true" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{league.name}</h3>
                          <p className="text-xs text-muted-foreground">{league.country}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Trending News Section */}
            <section className="bg-muted/30 py-8 -mx-4 px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Trending News</h2>
                <ViewAllButton href="/search">
                  View All
                </ViewAllButton>
              </div>
              {isLoading ? (
                <TransferGridSkeleton count={6} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingTransfers.length > 0 ? (
                    trendingTransfers.map((transfer) => (
                      <TransferCard
                        key={transfer.id}
                        title={transfer.title}
                        excerpt={transfer.excerpt}
                        primaryBadge={transfer.league}
                        timeAgo={formatTimeAgo(transfer.publishedAt)}
                        href={`/article/${transfer.id}`}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No trending transfers available</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Newsletter Section */}
            <NewsletterSection />
          </div>

          {/* Sidebar - 30% - Desktop Only */}
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
