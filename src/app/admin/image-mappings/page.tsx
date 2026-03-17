"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Search, Image, CheckCircle, XCircle, Pencil } from "lucide-react"
import { adminApi, ClubImageMapping } from "@/lib/api"

const LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
]

interface MappingFormData {
  club_name: string
  club_name_variants: string
  league: string
  domain: string
  news_url: string
  image_css_selector: string
  fallback_css_selector: string
  crest_url: string
  jersey_url: string
}

const emptyFormData: MappingFormData = {
  club_name: "",
  club_name_variants: "",
  league: "",
  domain: "",
  news_url: "",
  image_css_selector: "",
  fallback_css_selector: "",
  crest_url: "",
  jersey_url: "",
}

export default function AdminImageMappingsPage() {
  const [mappings, setMappings] = useState<ClubImageMapping[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [leagueFilter, setLeagueFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMapping, setEditingMapping] = useState<ClubImageMapping | null>(null)
  const [formData, setFormData] = useState<MappingFormData>(emptyFormData)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadMappings()
  }, [leagueFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMappings()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadMappings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await adminApi.getImageMappings({
        search: searchTerm || undefined,
        league: leagueFilter || undefined,
      })

      setMappings(response.mappings)
      setTotal(response.total)
    } catch (err) {
      console.error("Failed to load image mappings:", err)
      setError(err instanceof Error ? err.message : "Failed to load image mappings")
      setMappings([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingMapping(null)
    setFormData(emptyFormData)
    setDialogOpen(true)
  }

  const handleEdit = (mapping: ClubImageMapping) => {
    setEditingMapping(mapping)
    setFormData({
      club_name: mapping.club_name,
      club_name_variants: (mapping.club_name_variants || []).join(", "),
      league: mapping.league,
      domain: mapping.domain,
      news_url: mapping.news_url,
      image_css_selector: mapping.image_css_selector,
      fallback_css_selector: mapping.fallback_css_selector || "",
      crest_url: mapping.crest_url || "",
      jersey_url: mapping.jersey_url || "",
    })
    setDialogOpen(true)
  }

  const handleToggleActive = async (mapping: ClubImageMapping) => {
    try {
      await adminApi.updateImageMapping(mapping.id, {
        is_active: !mapping.is_active,
      })
      await loadMappings()
    } catch (err) {
      console.error("Failed to toggle mapping:", err)
      setError(err instanceof Error ? err.message : "Failed to toggle mapping")
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const variants = formData.club_name_variants
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)

      const payload = {
        club_name: formData.club_name,
        club_name_variants: variants,
        league: formData.league,
        domain: formData.domain,
        news_url: formData.news_url,
        image_css_selector: formData.image_css_selector,
        fallback_css_selector: formData.fallback_css_selector || null,
        crest_url: formData.crest_url || null,
        jersey_url: formData.jersey_url || null,
        is_active: editingMapping ? editingMapping.is_active : true,
      }

      if (editingMapping) {
        await adminApi.updateImageMapping(editingMapping.id, payload)
      } else {
        await adminApi.createImageMapping(payload)
      }

      setDialogOpen(false)
      await loadMappings()
    } catch (err) {
      console.error("Failed to save mapping:", err)
      setError(err instanceof Error ? err.message : "Failed to save mapping")
    } finally {
      setIsSaving(false)
    }
  }

  const formatRelativeDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 30) return `${diffDays}d ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
    return `${Math.floor(diffDays / 365)}y ago`
  }

  const truncate = (text: string, maxLen: number) => {
    if (text.length <= maxLen) return text
    return text.slice(0, maxLen) + "..."
  }

  const activeCount = mappings.filter((m) => m.is_active).length
  const inactiveCount = mappings.filter((m) => !m.is_active).length

  return (
    <AdminPageLayout title="Image Mappings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Image Mappings</h1>
            <p className="text-muted-foreground">
              Manage club website CSS selectors for image fetching
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Mapping
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setError(null); loadMappings() }}>
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={leagueFilter} onValueChange={(val) => setLeagueFilter(val === "all" ? "" : val)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Leagues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leagues</SelectItem>
              {LEAGUES.map((league) => (
                <SelectItem key={league} value={league}>
                  {league}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-sm text-muted-foreground">Total Mappings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{inactiveCount}</p>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mappings Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Club Name</TableHead>
                    <TableHead>League</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>CSS Selector</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Last Verified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No image mappings found. Click &quot;Add Mapping&quot; to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    mappings.map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell className="font-medium">{mapping.club_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{mapping.league}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{mapping.domain}</TableCell>
                        <TableCell
                          className="font-mono text-sm max-w-[200px]"
                          title={mapping.image_css_selector}
                        >
                          {truncate(mapping.image_css_selector, 30)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={mapping.is_active ? "default" : "destructive"}
                            className="cursor-pointer"
                            onClick={() => handleToggleActive(mapping)}
                          >
                            {mapping.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatRelativeDate(mapping.last_verified_at)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(mapping)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMapping ? "Edit Image Mapping" : "Add Image Mapping"}
              </DialogTitle>
              <DialogDescription>
                {editingMapping
                  ? "Update the CSS selectors and URLs for this club."
                  : "Add a new club image mapping with CSS selectors for image fetching."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="club_name">Club Name *</Label>
                  <Input
                    id="club_name"
                    value={formData.club_name}
                    onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
                    placeholder="e.g., Manchester United"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="league">League *</Label>
                  <Select
                    value={formData.league}
                    onValueChange={(val) => setFormData({ ...formData, league: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select league" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAGUES.map((league) => (
                        <SelectItem key={league} value={league}>
                          {league}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="club_name_variants">Name Variants (comma-separated)</Label>
                <Input
                  id="club_name_variants"
                  value={formData.club_name_variants}
                  onChange={(e) => setFormData({ ...formData, club_name_variants: e.target.value })}
                  placeholder="e.g., Man Utd, Man United, MUFC"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain *</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g., manutd.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news_url">News URL *</Label>
                  <Input
                    id="news_url"
                    value={formData.news_url}
                    onChange={(e) => setFormData({ ...formData, news_url: e.target.value })}
                    placeholder="e.g., https://www.manutd.com/en/news"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_css_selector">Image CSS Selector *</Label>
                <Input
                  id="image_css_selector"
                  value={formData.image_css_selector}
                  onChange={(e) => setFormData({ ...formData, image_css_selector: e.target.value })}
                  placeholder="e.g., article img.hero-image"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallback_css_selector">Fallback CSS Selector</Label>
                <Input
                  id="fallback_css_selector"
                  value={formData.fallback_css_selector}
                  onChange={(e) => setFormData({ ...formData, fallback_css_selector: e.target.value })}
                  placeholder="e.g., .article-body img:first-child"
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crest_url">Crest URL</Label>
                  <Input
                    id="crest_url"
                    value={formData.crest_url}
                    onChange={(e) => setFormData({ ...formData, crest_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jersey_url">Jersey URL</Label>
                  <Input
                    id="jersey_url"
                    value={formData.jersey_url}
                    onChange={(e) => setFormData({ ...formData, jersey_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !formData.club_name ||
                  !formData.league ||
                  !formData.domain ||
                  !formData.news_url ||
                  !formData.image_css_selector
                }
              >
                {isSaving ? "Saving..." : editingMapping ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  )
}
