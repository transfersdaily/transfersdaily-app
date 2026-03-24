"use client"

import { useState } from "react"
import { ArticlesPageLayout } from "@/components/admin/ArticlesPageLayout"
import { BulkTranslationDialog } from "@/components/admin/BulkTranslationDialog"
import { useToast } from "@/hooks/use-toast"

export default function DraftArticlesPage() {
  const [showBulkTranslation, setShowBulkTranslation] = useState(false)
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const { toast } = useToast()

  const handleBulkTranslate = (articleIds: string[]) => {
    setSelectedArticleIds(articleIds)
    setShowBulkTranslation(true)
  }

  const handleBulkPublish = (articleIds: string[]) => {
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
    setSelectedArticleIds([])
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
        initialSortOrder="desc"
        showAddButton={false}
        onBulkTranslate={handleBulkTranslate}
        onBulkPublish={handleBulkPublish}
      />

      <BulkTranslationDialog
        open={showBulkTranslation}
        onOpenChange={setShowBulkTranslation}
        selectedArticleIds={selectedArticleIds}
        onSuccess={handleBulkTranslationSuccess}
        onError={handleBulkTranslationError}
      />
    </>
  )
}