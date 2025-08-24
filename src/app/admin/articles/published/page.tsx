"use client"

import { useState } from "react"
import { ArticlesPageLayout } from "@/components/admin/ArticlesPageLayout"
import { BulkTranslationDialog } from "@/components/admin/BulkTranslationDialog"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export default function PublishedArticlesPage() {
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [showBulkTranslation, setShowBulkTranslation] = useState(false)

  const handleBulkTranslate = (articleIds: string[]) => {
    setSelectedArticles(articleIds)
    setShowBulkTranslation(true)
  }

  const handleTranslationSuccess = (summary: any) => {
    console.log('Bulk translation started:', summary)
    setShowBulkTranslation(false)
    setSelectedArticles([])
    // Show success message or refresh data
  }

  const handleTranslationError = (error: string) => {
    console.error('Bulk translation error:', error)
    // Show error message
  }

  const bulkActions = selectedArticles.length > 0 ? (
    <Button
      onClick={() => handleBulkTranslate(selectedArticles)}
      variant="outline"
      size="sm"
    >
      <Languages className="mr-2 h-4 w-4" />
      Translate ({selectedArticles.length})
    </Button>
  ) : null

  return (
    <>
      <ArticlesPageLayout
        title="Published Articles"
        pageType="published"
        status="published"
        initialSortBy="published_at"
        initialSortOrder="desc"
        showAddButton={false}
        bulkActions={bulkActions}
        selectedArticles={selectedArticles}
        onSelectArticles={setSelectedArticles}
        onBulkTranslate={handleBulkTranslate}
      />
      
      <BulkTranslationDialog
        open={showBulkTranslation}
        onOpenChange={setShowBulkTranslation}
        selectedArticleIds={selectedArticles}
        onSuccess={handleTranslationSuccess}
        onError={handleTranslationError}
      />
    </>
  )
}