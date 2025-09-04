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
      console.log('🎉 Translations completed, reloading article...')
      fetchArticle()
    }
  }, [translationStatus?.isComplete])

  // Dropdown data states
  const [clubs, setClubs] = useState<Array<{id: string, name: string, league_id?: string}>>([])
  const [leagues, setLeagues] = useState<Array<{id: string, name: string, country?: string}>>([])
  const [countries, setCountries] = useState<Array<string>>([])
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true)

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
    console.log('🚀 Edit page useEffect triggered');
    console.log('Article ID:', articleId);
    fetchArticle()
    fetchDropdownData()
  }, [articleId])

  const fetchDropdownData = async () => {
    try {
      setIsLoadingDropdowns(true)
      
      // Fetch clubs, leagues, and countries in parallel
      const [clubsResponse, leaguesResponse] = await Promise.all([
        fetch(getApiUrl('/admin/clubs'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('transfersdaily_id_token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(getApiUrl('/admin/leagues'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('transfersdaily_id_token')}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (clubsResponse.ok) {
        const clubsData = await clubsResponse.json()
        if (clubsData.success && clubsData.clubs) {
          // Deduplicate clubs by name (case-insensitive)
          const uniqueClubs = clubsData.clubs.reduce((acc: any[], club: any) => {
            const existing = acc.find(c => c.name.toLowerCase() === club.name.toLowerCase())
            if (!existing) {
              acc.push(club)
            }
            return acc
          }, [])
          setClubs(uniqueClubs)
        }
      }

      if (leaguesResponse.ok) {
        const leaguesData = await leaguesResponse.json()
        if (leaguesData.success && leaguesData.leagues) {
          // Deduplicate leagues by name (case-insensitive)
          const uniqueLeagues = leaguesData.leagues.reduce((acc: any[], league: any) => {
            const existing = acc.find(l => l.name.toLowerCase() === league.name.toLowerCase())
            if (!existing) {
              acc.push(league)
            }
            return acc
          }, [])
          setLeagues(uniqueLeagues)
          // Extract unique countries from leagues
          const uniqueCountries = [...new Set(uniqueLeagues.map((league: any) => league.country).filter(Boolean))] as string[]
          setCountries(uniqueCountries.sort())
        }
      }

    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    } finally {
      setIsLoadingDropdowns(false)
    }
  }

  const fetchArticle = async () => {
    try {
      setIsLoading(true)
      console.log('🚀 Edit page useEffect triggered');
      console.log('Article ID:', articleId);
      
      // Check if we have a valid auth token
      const authToken = localStorage.getItem('transfersdaily_id_token');
      if (!authToken) {
        console.error('❌ No auth token found');
        setError("Authentication required. Please log in again.");
        router.push('/login');
        return;
      }
      
      const fullUrl = getApiUrl(`${API_CONFIG.endpoints.admin.articles}/${articleId}`);
      console.log('🌐 Full URL:', fullUrl);
      
      console.log('📡 Making fetch request...');
      const startTime = Date.now();
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const endTime = Date.now();
      console.log(`⏱️ Request took ${endTime - startTime}ms`);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      
      if (!response.ok) {
        console.error('❌ Response not ok');
        if (response.status === 401) {
          console.error('401 - Unauthorized');
          setError("Session expired. Please log in again.");
          localStorage.clear();
          router.push('/login');
          return;
        }
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
      console.log('🌍 Article translations:', fetchedArticle.translations);
      
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
      
      const response = await fetch(getApiUrl(`${API_CONFIG.endpoints.admin.articles}/${articleId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('transfersdaily_id_token')}`
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

  // Mobile editor handlers
  const handleBack = () => router.back()
  const handlePreview = () => window.open(`/article/${articleId}?preview=true`, '_blank')
  const handlePublish = () => window.location.href = `/admin/articles/publish/${articleId}/edit`
  
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
    
    console.log('🔍 [getTranslationCount] Article data:', {
      hasTitle: !!article.title,
      hasContent: !!article.content,
      hasTranslations: !!article.translations,
      translationsType: typeof article.translations,
      translationKeys: article.translations ? Object.keys(article.translations) : []
    })
    
    // Always count English if title and content exist
    if (article.title && article.content) {
      completed = 1
      console.log('✅ [getTranslationCount] English counted: 1')
    }
    
    // Check if article has translations field from database
    if (article.translations && typeof article.translations === 'object') {
      console.log('🌍 [getTranslationCount] Checking translations:', article.translations)
      
      languages.forEach(langCode => {
        if (langCode === 'en') return // Already counted English above
        
        const translation = article.translations?.[langCode]
        console.log(`🔍 [getTranslationCount] ${langCode}:`, {
          exists: !!translation,
          hasTitle: translation?.title,
          hasContent: translation?.content
        })
        
        if (translation && translation.title && translation.content) {
          completed++
          console.log(`✅ [getTranslationCount] ${langCode} counted, total now: ${completed}`)
        }
      })
    } else {
      console.log('❌ [getTranslationCount] No translations object found')
    }
    
    console.log(`🎯 [getTranslationCount] Final count: ${completed}/5`)
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
        onPublish={handlePublish}
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
                    <Select 
                      value={formData.player_country} 
                      onValueChange={(value) => setFormData({ ...formData, player_country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="league">League</Label>
                    <Select 
                      value={formData.league_id || formData.league} 
                      onValueChange={(value) => {
                        const selectedLeague = leagues.find(l => l.id === value || l.name === value)
                        setFormData({ 
                          ...formData, 
                          league_id: selectedLeague?.id || '',
                          league: selectedLeague?.name || value
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select league" />
                      </SelectTrigger>
                      <SelectContent>
                        {leagues.map((league) => (
                          <SelectItem key={league.id} value={league.id}>
                            {league.name} {league.country && `(${league.country})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_club">Current Club</Label>
                    <Select 
                      value={formData.current_club_id || formData.current_club} 
                      onValueChange={(value) => {
                        const selectedClub = clubs.find(c => c.id === value || c.name === value)
                        setFormData({ 
                          ...formData, 
                          current_club_id: selectedClub?.id || '',
                          current_club: selectedClub?.name || value
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select current club" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Manual input fallback */}
                    <Input
                      className="mt-2"
                      placeholder="Or type club name manually"
                      value={formData.current_club}
                      onChange={(e) => setFormData({ ...formData, current_club: e.target.value, current_club_id: '' })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination_club">Destination Club</Label>
                    <Select 
                      value={formData.destination_club_id || formData.destination_club} 
                      onValueChange={(value) => {
                        const selectedClub = clubs.find(c => c.id === value || c.name === value)
                        setFormData({ 
                          ...formData, 
                          destination_club_id: selectedClub?.id || '',
                          destination_club: selectedClub?.name || value
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination club" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Manual input fallback */}
                    <Input
                      className="mt-2"
                      placeholder="Or type club name manually"
                      value={formData.destination_club}
                      onChange={(e) => setFormData({ ...formData, destination_club: e.target.value, destination_club_id: '' })}
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Translations:</span>
                  <div className="flex items-center gap-1">
                    <Languages className="h-3 w-3" />
                    <span>{getTranslationCount()}/5</span>
                  </div>
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