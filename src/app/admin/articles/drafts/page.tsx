"use client"

import { useState } from "react"
import { ArticlesPageLayout } from "@/components/admin/ArticlesPageLayout"
import { BulkTranslationDialog } from "@/components/admin/BulkTranslationDialog"
import { useToast } from "@/hooks/use-toast"

export default function DraftArticlesPage() {
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [showBulkTranslation, setShowBulkTranslation] = useState(false)
  const { toast } = useToast()

  const handleBulkTranslation = (articleIds: string[]) => {
    if (articleIds.length === 0) {
      toast({
        title: "No articles selected",
        description: "Please select at least one article to translate.",
        variant: "destructive",
      })
      return
    }
    setShowBulkTranslation(true)
  }

  const handleBulkPublish = (articleIds: string[]) => {
    // TODO: Implement bulk publish functionality
    console.log('Bulk publish:', articleIds)
    toast({
      title: "Bulk publish",
      description: `Publishing ${articleIds.length} articles...`,
    })
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
        showAddButton={false}
        selectedArticles={selectedArticles}
        onSelectArticles={setSelectedArticles}
        onBulkTranslate={handleBulkTranslation}
        onBulkPublish={handleBulkPublish}
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