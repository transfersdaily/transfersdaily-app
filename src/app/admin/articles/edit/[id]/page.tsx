"use client"

import { LEAGUES } from "@/lib/constants"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AdminPageHeader } from "@/components/AdminPageHeader"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { MobileArticleEditor } from "@/components/admin/MobileArticleEditor"
import {
  Save,
  ArrowLeft,
  Trash2,
  Loader2,
  Eye,
  Globe,
  Languages,
} from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { API_CONFIG, getApiUrl } from "@/lib/config"
import { useIsMobile } from "@/lib/mobile-utils"
import { useTranslation } from "@/hooks/useTranslation"
import { TranslationProgress } from "@/components/ui/translation-progress"
import { SocialPostStatus } from "@/components/admin/SocialPostStatus"

interface Article {
  uuid: string
  title: string
  slug: string
  content: string
  status: string
  category: string
  subcategory: string
  player_name: string
  current_club: string
  destination_club: string
  league: string
  transfer_fee: string
  transfer_type: string
  transfer_status: string
  featured: boolean
  created_at: string
  published_at: string
  social_media_data?: Record<string, unknown> | null
  translations?: {
    [key: string]: {
      title: string
      content: string
    }
  }
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: articleId } = use(params)
  const isMobile = useIsMobile()

  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  
  // Translation functionality
  const { translationStatus, isTranslating, error: translationError, startTranslation, stopTranslation } = useTranslation()
  
  // Listen for translation completion and reload article
  useEffect(() => {
    if (translationStatus?.isComplete) {
      fetchArticle()
    }
  }, [translationStatus?.isComplete])

  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    subcategory: "",
    player_name: "",
    player_country: "", // New field
    current_club: "",
    current_club_id: "", // New field for club ID
    destination_club: "",
    destination_club_id: "", // New field for club ID
    league: "",
    league_id: "", // New field for league ID
    transfer_fee: "",
    transfer_type: "",
    transfer_status: "",
    status: "draft",
    featured: false
  })
  
  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      setIsLoading(true)

      const fullUrl = getApiUrl(`${API_CONFIG.endpoints.admin.articles}/${articleId}`);

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          router.push('/login');
          return;
        }
        if (response.status === 404) {
          setError("Article not found")
          return
        }
        throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`)
      }

      const data = await response.json();
      
      if (!data.success || !data.data?.article) {
        setError("Article not found")
        return
      }

      const fetchedArticle = data.data.article
      setArticle(fetchedArticle)
      
      setFormData({
        title: fetchedArticle.title || "",
        content: fetchedArticle.content || "",
        category: fetchedArticle.category || "Transfer",
        subcategory: fetchedArticle.subcategory || "rumour",
        player_name: fetchedArticle.player_name || "",
        player_country: fetchedArticle.player_country || "",
        current_club: fetchedArticle.from_club || "",
        current_club_id: fetchedArticle.from_club_id?.toString() || "",
        destination_club: fetchedArticle.to_club || "",
        destination_club_id: fetchedArticle.to_club_id?.toString() || "",
        league: fetchedArticle.league || "",
        league_id: fetchedArticle.league_id?.toString() || "",
        transfer_fee: fetchedArticle.transfer_fee?.toString() || "",
        transfer_type: fetchedArticle.transfer_type || "permanent",
        transfer_status: fetchedArticle.transfer_status || "rumour",
        status: fetchedArticle.status || "draft",
        featured: fetchedArticle.featured || false
      })
      
    } catch (err) {
      console.error('Error in fetchArticle:', err)
      setError(`Failed to fetch article: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await fetch(getApiUrl(`${API_CONFIG.endpoints.admin.articles}/${articleId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Failed to save article: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setError("")
        await fetchArticle()
      } else {
        throw new Error(data.message || 'Failed to save article')
      }
      
    } catch (err) {
      console.error('Save error:', err)
      setError(`Failed to save article: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      console.log("Deleting article:", articleId)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/admin/articles')
    } catch (_err) {
      setError("Failed to delete article")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatTransferFee = (fee: string) => {
    if (!fee || fee === "0") return "Free"
    const numFee = parseInt(fee)
    if (numFee >= 1000000) return `€${(numFee / 1000000).toFixed(1)}M`
    if (numFee >= 1000) return `€${(numFee / 1000).toFixed(0)}K`
    return `€${numFee}`
  }

  // Mobile editor handlers
  const handleBack = () => router.back()
  const handlePreview = () => window.open(`/article/${articleId}?preview=true`, '_blank')
  const handleGenerateTranslations = async () => {
    if (!article?.title || !article?.content) {
      setError('Article title and content are required for translation')
      return
    }
    
    try {
      const result = await startTranslation(articleId, ['es', 'fr', 'de', 'it'], {
        title: article.title,
        content: article.content
      })
      
      if (result.success) {
        setError('')
      } else {
        setError(result.error || 'Failed to start translation')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed')
    }
  }
  
  const getTranslationCount = () => {
    if (!article) return 0

    let completed = 0
    const languages = ['en', 'es', 'fr', 'de', 'it']

    if (article.title && article.content) {
      completed = 1
    }

    if (article.translations && typeof article.translations === 'object') {
      languages.forEach(langCode => {
        if (langCode === 'en') return
        const translation = article.translations?.[langCode]
        if (translation && translation.title && translation.content) {
          completed++
        }
      })
    }

    return completed
  }

  // Use mobile editor on mobile devices
  if (isMobile && !isLoading && article) {
    return (
      <MobileArticleEditor
        article={article}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onDelete={handleDelete}
        onBack={handleBack}
        onPreview={handlePreview}
        isSaving={isSaving}
        isDeleting={isDeleting}
        error={error}
      />
    )
  }

  if (isLoading || isLoadingDropdowns) {
    return (
      <div className="flex flex-col">
        <AdminPageHeader title="Edit Article" />
        <div className="flex-1 space-y-6 p-4 md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border bg-card">
                <div className="p-6 pb-2">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="p-6 pt-4 space-y-4">
                  <div>
                    <Skeleton className="h-4 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-card">
                <div className="p-6 pb-2">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="p-6 pt-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-xl border bg-card">
                <div className="p-6 pb-2">
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="p-6 pt-4 space-y-4">
                  <div>
                    <Skeleton className="h-4 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col">
        <AdminPageHeader title="Edit Article" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Article Not Found</h2>
            <p className="text-muted-foreground mt-2">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Button className="mt-4" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AdminPageHeader 
        title="Edit Article"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Article</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{article?.title}&quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Article
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" asChild>
              <Link href={`/article/${articleId}?preview=true`}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button 
              onClick={handleGenerateTranslations} 
              disabled={isTranslating || !article?.title || !article?.content}
              variant="outline"
            >
              {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
              Generate Translations
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        }
      />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {/* Translation Progress */}
        {translationStatus && (
          <div className="mb-6">
            <TranslationProgress 
              status={translationStatus} 
              targetLanguages={['es', 'fr', 'de', 'it']} 
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>Edit the main article information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write your article content here..."
                    minHeight={400}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
                <CardDescription>Player and transfer information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="player_name">Player Name</Label>
                    <Input
                      id="player_name"
                      value={formData.player_name}
                      onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="player_country">Player Country</Label>
                    <Input
                      id="player_country"
                      value={formData.player_country}
                      onChange={(e) => setFormData({ ...formData, player_country: e.target.value })}
                      placeholder="e.g. England"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="league">League</Label>
                    <Select
                      value={formData.league}
                      onValueChange={(value) => setFormData({ ...formData, league: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select league" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAGUES.map(league => (
                          <SelectItem key={league.slug} value={league.name}>{league.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_club">Current Club</Label>
                    <Input
                      id="current_club"
                      value={formData.current_club}
                      onChange={(e) => setFormData({ ...formData, current_club: e.target.value, current_club_id: '' })}
                      placeholder="Type club name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination_club">Destination Club</Label>
                    <Input
                      id="destination_club"
                      value={formData.destination_club}
                      onChange={(e) => setFormData({ ...formData, destination_club: e.target.value, destination_club_id: '' })}
                      placeholder="Type club name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="transfer_fee">Transfer Fee (€)</Label>
                    <Input
                      id="transfer_fee"
                      type="text"
                      value={formData.transfer_fee}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, transfer_fee: value })
                      }}
                      placeholder="Enter amount in euros"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Display: {formatTransferFee(formData.transfer_fee)}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="transfer_type">Transfer Type</Label>
                    <Select value={formData.transfer_type} onValueChange={(value) => setFormData({ ...formData, transfer_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="loan">Loan</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transfer_status">Transfer Status</Label>
                    <Select value={formData.transfer_status} onValueChange={(value) => setFormData({ ...formData, transfer_status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rumour">Rumour</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Badge variant={formData.status === "published" ? "default" : "secondary"}>
                    {formData.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                      <SelectItem value="Loan">Loan</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={formData.subcategory} onValueChange={(value) => setFormData({ ...formData, subcategory: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rumor">Rumor</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Official">Official</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Article Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={formData.status === "published" ? "default" : "secondary"}>
                    {formData.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transfer Fee:</span>
                  <span>{formatTransferFee(formData.transfer_fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Translations:</span>
                  <div className="flex items-center gap-1">
                    <Languages className="h-3 w-3" />
                    <span>{getTranslationCount()}/5</span>
                  </div>
                </div>
                {article.status === "published" && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1.5">Social Media:</span>
                      <SocialPostStatus socialMediaData={article.social_media_data} />
                    </div>
                  </>
                )}
                <Separator />
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Additional features like tags and images will be added in future updates.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}