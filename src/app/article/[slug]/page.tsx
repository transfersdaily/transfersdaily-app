"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/Footer"
import { Sidebar } from "@/components/Sidebar"
import { TransferCard } from "@/components/TransferCard"
import { SidebarSkeleton } from "@/components/SidebarSkeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Clock, 
  Share2, 
  Bookmark, 
  Twitter, 
  Facebook, 
  Link as LinkIcon,
  ArrowLeft,
  User,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { articlesApi, transfersApi, type Article, type Transfer } from "@/lib/api"

// Mock article data - in real app, this would come from API
const mockArticle = {
  id: 1,
  title: "Kylian Mbappé Completes €180M Move to Real Madrid",
  slug: "mbappe-real-madrid-transfer",
  excerpt: "Real Madrid have officially announced the signing of Kylian Mbappé from Paris Saint-Germain in a deal worth €180 million plus bonuses.",
  content: `
    <p>Real Madrid have officially announced the signing of Kylian Mbappé from Paris Saint-Germain in a deal worth €180 million plus bonuses. The 25-year-old French forward has signed a six-year contract with the Spanish giants, ending one of football's longest-running transfer sagas.</p>

    <p>The move comes after months of speculation and negotiations between the two clubs. Mbappé had been heavily linked with a move to the Santiago Bernabéu for over two years, with Real Madrid making multiple attempts to secure his signature.</p>

    <h2>Record-Breaking Deal</h2>
    
    <p>The transfer fee makes Mbappé the second most expensive player in football history, behind only Neymar's €222 million move to PSG in 2017. The deal includes various performance-related bonuses that could see the total value rise to €200 million.</p>

    <p>"I am incredibly excited to join Real Madrid," Mbappé said in his first interview as a Madrid player. "This is a dream come true for me. Real Madrid is the biggest club in the world, and I can't wait to contribute to their success."</p>

    <h2>Impact on Both Clubs</h2>

    <p>For Real Madrid, the signing represents a statement of intent as they look to reclaim their position at the top of European football. The French striker will join a formidable attacking lineup alongside Vinícius Jr. and Jude Bellingham.</p>

    <p>PSG, meanwhile, will need to rebuild their attack following the departure of their star player. The French champions are already being linked with several high-profile replacements, including Victor Osimhen and Rafael Leão.</p>

    <h2>What This Means for La Liga</h2>

    <p>Mbappé's arrival in La Liga is expected to significantly boost the league's global profile and commercial value. The rivalry between Real Madrid and Barcelona is set to intensify, with both clubs now boasting world-class attacking talent.</p>

    <p>The French forward is expected to make his debut in Real Madrid's upcoming El Clásico against Barcelona, a fixture that could break viewership records worldwide.</p>

    <p>With this signing, Real Madrid have sent a clear message to their rivals both domestically and in Europe. The upcoming season promises to be one of the most exciting in recent memory.</p>
  `,
  author: {
    name: "James Rodriguez",
    avatar: "/avatars/james.jpg",
    bio: "Senior Football Correspondent with 10+ years covering European transfers"
  },
  publishedAt: "2024-07-15T14:30:00Z",
  readTime: "4 min read",
  category: "La Liga",
  tags: ["Real Madrid", "PSG", "Transfer News", "La Liga"],
  image: "/images/mbappe-real-madrid.jpg"
}

// Related articles
const relatedArticles = [
  {
    id: 2,
    title: "Barcelona Respond to Mbappé Signing with €120M Osimhen Bid",
    excerpt: "The Catalan giants are reportedly preparing a massive offer for the Napoli striker...",
    primaryBadge: "La Liga",
    timeAgo: "3 hours ago"
  },
  {
    id: 3,
    title: "PSG Begin Search for Mbappé Replacement",
    excerpt: "Paris Saint-Germain have identified several targets to fill the void left by their departing star...",
    primaryBadge: "Ligue 1",
    timeAgo: "5 hours ago"
  },
  {
    id: 4,
    title: "Real Madrid's Transfer Window: Complete Analysis",
    excerpt: "A comprehensive look at Los Blancos' summer signings and their impact on the squad...",
    primaryBadge: "La Liga",
    timeAgo: "1 day ago"
  }
]

export default function ArticlePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true'
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Transfer[]>([])

  useEffect(() => {
    loadArticle()
  }, [params.slug])

  const loadArticle = async () => {
    try {
      setIsLoading(true)
      const articleSlug = params.slug as string
      
      // Load article and related articles in parallel
      const [articleData, relatedData] = await Promise.all([
        articlesApi.getBySlug(articleSlug),
        transfersApi.getLatest(3) // Get 3 latest for related
      ])
      
      setArticle(articleData)
      setRelatedArticles(relatedData)
    } catch (error) {
      console.error('Error loading article:', error)
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

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = mockArticle.title
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        // You could add a toast notification here
        break
    }
  }

  if (isLoading || !article) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
            <div className="lg:col-span-7">
              <div className="py-8">
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-8" />
                <Skeleton className="h-64 w-full mb-8" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 bg-muted/10 border-l -mr-4 pr-4">
              <div className="p-4">
                <SidebarSkeleton />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Article Content - 70% */}
          <article className="lg:col-span-7">
            <div className="py-8">
              {/* Back Button */}
              {isPreview ? (
                <div className="flex items-center justify-between mb-6">
                  <Link href={`/admin/articles/edit/${params.slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Edit</span>
                  </Link>
                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                    DRAFT PREVIEW
                  </Badge>
                </div>
              ) : (
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              )}

              {/* Article Header */}
              <header className="mb-8">
                <Badge variant="outline" className="mb-4 bg-gray-100 text-gray-800 border-gray-200">
                  {article.league || 'Transfer News'}
                </Badge>
                
                <h1 className="text-4xl font-bold leading-tight mb-6 text-foreground">
                  {article.title}
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>5 min read</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-sm font-medium text-muted-foreground">Share:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className="gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="gap-2"
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>

                <Separator />
              </header>

              {/* Featured Image */}
              <div className="mb-8">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-muted-foreground">Article Image</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4">
                {article.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                      {tag}
                    </Badge>
                  )) || []}
                </div>
              </div>

              {/* Related Articles */}
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((transfer) => (
                    <TransferCard
                      key={transfer.id}
                      title={transfer.title}
                      excerpt={transfer.excerpt}
                      primaryBadge={transfer.league}
                      timeAgo={formatTimeAgo(transfer.publishedAt)}
                      href={`/article/${transfer.slug || transfer.id}`}
                    />
                  ))}
                </div>
              </section>
            </div>
          </article>

          {/* Sidebar - 30% */}
          <Sidebar />
        </div>
      </div>

      <Footer />
    </main>
  )
}
