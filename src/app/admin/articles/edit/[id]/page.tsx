"use client"

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
import {
  Save,
  ArrowLeft,
  Trash2,
  Loader2,
  Eye,
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
import { API_CONFIG } from "@/lib/config"

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
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: articleId } = use(params)

  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    subcategory: "",
    player_name: "",
    current_club: "",
    destination_club: "",
    league: "",
    transfer_fee: "",
    transfer_type: "",
    transfer_status: "",
    status: "draft",
    featured: false
  })
  
  useEffect(() => {
    console.log('🚀 Edit page useEffect triggered');
    console.log('Article ID:', articleId);
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      setIsLoading(true)
      console.log('🔍 Starting fetchArticle...');
      console.log('Article ID:', articleId);
      console.log('API Base URL:', API_CONFIG.baseUrl);
      console.log('Admin Articles Endpoint:', API_CONFIG.endpoints.admin.articles);
      
      const fullUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.articles}/${articleId}`;
      console.log('🌐 Full URL:', fullUrl);
      
      console.log('📡 Making fetch request...');
      const startTime = Date.now();
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const endTime = Date.now();
      console.log(`⏱️ Request took ${endTime - startTime}ms`);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      
      if (!response.ok) {
        console.error('❌ Response not ok');
        if (response.status === 404) {
          console.error('404 - Article not found');
          setError("Article not found")
          return
        }
        
        let errorText;
        try {
          errorText = await response.text();
          console.error('Error response body:', errorText);
        } catch (_e) {
          console.error('Could not read error response body');
        }
        
        throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`)
      }
      
      console.log('📥 Reading response data...');
      const data = await response.json()
      console.log('✅ Response data received:', JSON.stringify(data, null, 2));
      
      if (!data.success || !data.data?.article) {
        console.error('❌ Invalid response structure');
        setError("Article not found")
        return
      }
      
      const fetchedArticle = data.data.article
      setArticle(fetchedArticle)
      console.log('✅ Article set successfully:', fetchedArticle.title);
      
      setFormData({
        title: fetchedArticle.title || "",
        content: fetchedArticle.content || "",
        category: fetchedArticle.category || "Transfer",
        subcategory: fetchedArticle.subcategory || "rumour",
        player_name: fetchedArticle.player_name || "",
        current_club: fetchedArticle.from_club || "",
        destination_club: fetchedArticle.to_club || "",
        league: fetchedArticle.league || "",
        transfer_fee: fetchedArticle.transfer_fee?.toString().replace(/[^0-9]/g, '') || "",
        transfer_type: fetchedArticle.transfer_type || "permanent",
        transfer_status: fetchedArticle.transfer_status || "rumour",
        status: fetchedArticle.status || "draft",
        featured: fetchedArticle.featured || false
      })
      
      console.log('✅ Form data initialized successfully');
      
    } catch (err) {
      console.error('💥 Error in fetchArticle:', err)
      setError(`Failed to fetch article: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      console.log('🏁 fetchArticle completed, setting loading to false');
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      console.log('Saving article with data:', formData)
      
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.articles}/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      console.log('Save response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('Save error response:', errorData)
        throw new Error(`Failed to save article: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Save response data:', data)
      
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

  if (isLoading) {
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
                    <Label htmlFor="league">League</Label>
                    <Select value={formData.league} onValueChange={(value) => setFormData({ ...formData, league: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Premier League">Premier League</SelectItem>
                        <SelectItem value="La Liga">La Liga</SelectItem>
                        <SelectItem value="Serie A">Serie A</SelectItem>
                        <SelectItem value="Bundesliga">Bundesliga</SelectItem>
                        <SelectItem value="Ligue 1">Ligue 1</SelectItem>
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
                      onChange={(e) => setFormData({ ...formData, current_club: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination_club">Destination Club</Label>
                    <Input
                      id="destination_club"
                      value={formData.destination_club}
                      onChange={(e) => setFormData({ ...formData, destination_club: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="transfer_fee">Transfer Fee (€)</Label>
                    <Input
                      id="transfer_fee"
                      type="number"
                      value={formData.transfer_fee}
                      onChange={(e) => setFormData({ ...formData, transfer_fee: e.target.value })}
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
                  <div className="flex items-center gap-2">
                    <Badge variant={formData.status === "published" ? "default" : "secondary"}>
                      {formData.status === "published" ? "Published" : "Draft"}
                    </Badge>
                    {formData.status === "draft" && (
                      <Button 
                        size="sm" 
                        onClick={() => window.location.href = `/admin/articles/publish/${articleId}/edit`}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.status === "published" 
                      ? "Article is live. Use publishing workflow to update."
                      : "Use the publishing workflow to publish this article."
                    }
                  </p>
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