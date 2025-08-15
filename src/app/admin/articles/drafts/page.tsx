"use client"

import { useState } from "react"
import { ArticlesPageLayout } from "@/components/admin/ArticlesPageLayout"
import { BulkTranslationDialog } from "@/components/admin/BulkTranslationDialog"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DraftArticlesPage() {
  const [showBulkTranslation, setShowBulkTranslation] = useState(false)
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const { toast } = useToast()

  const handleAddClick = () => {
    // TODO: Navigate to add article page
    console.log('Add article clicked')
  }

  const handleBulkTranslation = () => {
    if (selectedArticles.length === 0) {
      toast({
        title: "No articles selected",
        description: "Please select at least one article to translate.",
        variant: "destructive",
      })
      return
    }
    setShowBulkTranslation(true)
  }

  const handleBulkTranslationSuccess = (summary: any) => {
    toast({
      title: "Bulk translation started",
      description: `Translation started for ${summary.started} out of ${summary.total} articles.`,
    })
    setSelectedArticles([]) // Clear selection
    setShowBulkTranslation(false)
  }

  const handleBulkTranslationError = (error: string) => {
    toast({
      title: "Bulk translation failed",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <>
      <ArticlesPageLayout
        title="Draft Articles"
        pageType="draft"
        status="draft"
        initialSortBy="created_at"
        initialSortOrder="asc"
        showAddButton={true}
        onAddClick={handleAddClick}
        selectedArticles={selectedArticles}
        onSelectArticles={setSelectedArticles}
        bulkActions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkTranslation}
            disabled={selectedArticles.length === 0}
            className="min-h-[44px]"
          >
            <Languages className="mr-2 h-4 w-4" />
            Generate Translations ({selectedArticles.length})
          </Button>
        }
      />

      <BulkTranslationDialog
        open={showBulkTranslation}
        onOpenChange={setShowBulkTranslation}
        selectedArticleIds={selectedArticles}
        onSuccess={handleBulkTranslationSuccess}
        onError={handleBulkTranslationError}
      />
    </>
  )
}