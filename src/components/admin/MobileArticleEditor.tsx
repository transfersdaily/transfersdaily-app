"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { MobileFormLayout, MobileInput, MobileSelect, MobileTextarea, MobileFormActions } from "@/components/admin/MobileFormLayout"
import { MobileRichTextEditor } from "@/components/admin/MobileRichTextEditor"
import { MobileImageUpload } from "@/components/admin/MobileImageUpload"
import { MobileActionBar } from "@/components/admin/MobileActionBar"
import { 
  Save, 
  ArrowLeft, 
  Trash2, 
  Eye, 
  Upload,
  Loader2
} from "lucide-react"
import { useIsMobile, adminMobileGrid } from "@/lib/mobile-utils"

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

interface MobileArticleEditorProps {
  article: Article | null
  formData: any
  setFormData: (data: any) => void
  onSave: () => void
  onDelete: () => void
  onBack: () => void
  onPreview: () => void
  onPublish: () => void
  isSaving: boolean
  isDeleting: boolean
  error: string
}

export function MobileArticleEditor({
  article,
  formData,
  setFormData,
  onSave,
  onDelete,
  onBack,
  onPreview,
  onPublish,
  isSaving,
  isDeleting,
  error
}: MobileArticleEditorProps) {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<'content' | 'details' | 'settings'>('content')

  const formatTransferFee = (fee: string) => {
    if (!fee || fee === "0") return "Free"
    const numFee = parseInt(fee)
    if (numFee >= 1000000) return `€${(numFee / 1000000).toFixed(1)}M`
    if (numFee >= 1000) return `€${(numFee / 1000).toFixed(0)}K`
    return `€${numFee}`
  }

  const categoryOptions = [
    { value: "Transfer", label: "Transfer" },
    { value: "Loan", label: "Loan" },
    { value: "Contract", label: "Contract" }
  ]

  const subcategoryOptions = [
    { value: "Rumor", label: "Rumor" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Official", label: "Official" }
  ]

  const leagueOptions = [
    { value: "Premier League", label: "Premier League" },
    { value: "La Liga", label: "La Liga" },
    { value: "Serie A", label: "Serie A" },
    { value: "Bundesliga", label: "Bundesliga" },
    { value: "Ligue 1", label: "Ligue 1" }
  ]

  const transferTypeOptions = [
    { value: "permanent", label: "Permanent" },
    { value: "loan", label: "Loan" },
    { value: "free", label: "Free" }
  ]

  const transferStatusOptions = [
    { value: "rumour", label: "Rumour" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" }
  ]

  // Mobile Tab Navigation
  const MobileTabNavigation = () => (
    <div className="flex border-b bg-background sticky top-0 z-10">
      {[
        { id: 'content', label: 'Content' },
        { id: 'details', label: 'Details' },
        { id: 'settings', label: 'Settings' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )

  // Content Tab
  const ContentTab = () => (
    <div className="space-y-6">
      <MobileInput
        label="Article Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter article title..."
      />

      <div>
        <label className="text-sm font-medium mb-2 block">
          Content <span className="text-destructive">*</span>
        </label>
        <MobileRichTextEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          placeholder="Write your article content here..."
          minHeight={isMobile ? "250px" : "400px"}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Images</label>
        <MobileImageUpload
          onUpload={(files) => {
            // Handle image upload
            console.log('Images uploaded:', files)
          }}
          maxFiles={5}
          maxFileSize={10}
        />
      </div>
    </div>
  )

  // Details Tab
  const DetailsTab = () => (
    <div className="space-y-6">
      <div className={adminMobileGrid.formGrid}>
        <MobileInput
          label="Player Name"
          required
          value={formData.player_name}
          onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
          placeholder="Enter player name..."
        />

        <MobileSelect
          label="League"
          required
          value={formData.league}
          onValueChange={(value) => setFormData({ ...formData, league: value })}
          options={leagueOptions}
          placeholder="Select league"
        />
      </div>

      <div className={adminMobileGrid.formGrid}>
        <MobileInput
          label="Current Club"
          value={formData.current_club}
          onChange={(e) => setFormData({ ...formData, current_club: e.target.value })}
          placeholder="Enter current club..."
        />

        <MobileInput
          label="Destination Club"
          value={formData.destination_club}
          onChange={(e) => setFormData({ ...formData, destination_club: e.target.value })}
          placeholder="Enter destination club..."
        />
      </div>

      <div className={adminMobileGrid.formGrid}>
        <MobileInput
          label="Transfer Fee (€)"
          type="number"
          value={formData.transfer_fee}
          onChange={(e) => setFormData({ ...formData, transfer_fee: e.target.value })}
          placeholder="0"
        />

        <MobileSelect
          label="Transfer Type"
          value={formData.transfer_type}
          onValueChange={(value) => setFormData({ ...formData, transfer_type: value })}
          options={transferTypeOptions}
          placeholder="Select type"
        />
      </div>

      <MobileSelect
        label="Transfer Status"
        value={formData.transfer_status}
        onValueChange={(value) => setFormData({ ...formData, transfer_status: value })}
        options={transferStatusOptions}
        placeholder="Select status"
      />

      {formData.transfer_fee && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Display: <span className="font-medium text-foreground">{formatTransferFee(formData.transfer_fee)}</span>
          </p>
        </div>
      )}
    </div>
  )

  // Settings Tab
  const SettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publication Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge variant={formData.status === "published" ? "default" : "secondary"}>
              {formData.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          
          {formData.status === "draft" && (
            <Button 
              onClick={onPublish}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Publish Article
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground">
            {formData.status === "published" 
              ? "Article is live. Use publishing workflow to update."
              : "Use the publishing workflow to publish this article."
            }
          </p>
        </CardContent>
      </Card>

      <div className={adminMobileGrid.formGrid}>
        <MobileSelect
          label="Category"
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          options={categoryOptions}
          placeholder="Select category"
        />

        <MobileSelect
          label="Subcategory"
          value={formData.subcategory}
          onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
          options={subcategoryOptions}
          placeholder="Select subcategory"
        />
      </div>

      {article && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Article Information</CardTitle>
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
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentTab />
      case 'details':
        return <DetailsTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <ContentTab />
    }
  }

  return (
    <AdminPageLayout
      title={article ? "Edit Article" : "New Article"}
      actions={
        !isMobile ? (
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={onPreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        ) : undefined
      }
    >
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Mobile Tab Navigation */}
      {isMobile && <MobileTabNavigation />}

      {/* Content */}
      <div className="space-y-6">
        {isMobile ? (
          <div className="pb-20">
            {renderTabContent()}
          </div>
        ) : (
          <div className={adminMobileGrid.contentGrid}>
            <div className="space-y-6">
              <ContentTab />
              <DetailsTab />
            </div>
            <div>
              <SettingsTab />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Action Bar */}
      {isMobile && (
        <MobileActionBar
          actions={[
            {
              label: "Save",
              onClick: onSave,
              disabled: isSaving,
              icon: isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />
            },
            {
              label: "Preview",
              onClick: onPreview,
              variant: "outline",
              icon: <Eye className="w-4 h-4" />
            }
          ]}
        />
      )}
    </AdminPageLayout>
  )
}
