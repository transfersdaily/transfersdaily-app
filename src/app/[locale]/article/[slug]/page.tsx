"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
import { type Locale, getDictionary, getTranslation, type Dictionary } from "@/lib/i18n"

interface ArticlePageProps {
  params: { locale: Locale; slug: string }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const searchParams = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true'
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Transfer[]>([])
  const [dict, setDict] = useState<Dictionary>({})

  useEffect(() => {
    loadData()
  }, [params.slug, params.locale])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load translations and article data in parallel
      const [dictionary, articleData, relatedData] = await Promise.all([
        getDictionary(params.locale),
        articlesApi.getBySlug(params.slug, params.locale),
        transfersApi.getLatest(3)
      ])
      
      setDict(dictionary)
      
      console.log('Article data received:', articleData)
      
      if (articleData) {
        setArticle(articleData)
      } else {
        console.warn('No article data received for slug:', params.slug)
      }
      
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
    const title = article?.title || ''
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
  }

  const t = (key: string) => getTranslation(dict, key)

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
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-muted/10 border-l -mr-4 pr-4">
                <div className="p-4">
                  <SidebarSkeleton />
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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 min-h-screen">
          {/* Main Article Content - 70% */}
          <article className="lg:col-span-7 bg-white">
            <div className="py-8">
              {/* Back Button */}
              {isPreview ? (
                <div className="flex items-center justify-between mb-6">
                  <Link href={`/${params.locale}/admin/articles/edit/${params.slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t('article.backToEdit')}</span>
                  </Link>
                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                    {t('article.draftPreview')}
                  </Badge>
                </div>
              ) : (
                <Link href={`/${params.locale}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('common.backToHome')}</span>
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
                    <span>5 {t('article.minRead')}</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-sm font-medium text-muted-foreground">{t('common.share')}:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    {t('article.twitter')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    {t('article.facebook')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className="gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {t('common.copyLink')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="gap-2"
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? t('common.saved') : t('common.save')}
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
                <h3 className="text-lg font-semibold mb-4">{t('article.tags')}</h3>
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
                <h2 className="text-2xl font-bold mb-6">{t('article.relatedArticles')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((transfer) => (
                    <TransferCard
                      key={transfer.id}
                      title={transfer.title}
                      excerpt={transfer.excerpt}
                      primaryBadge={transfer.league}
                      timeAgo={formatTimeAgo(transfer.publishedAt)}
                      href={`/${params.locale}/article/${transfer.slug || transfer.id}`}
                    />
                  ))}
                </div>
              </section>
            </div>
          </article>

          {/* Sidebar - 30% */}
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar locale={params.locale} dict={dict} />
          </div>
        </div>
      </div>

    </main>
  )
}
