"use client"

import { useState } from "react"
import { ArticlesPageLayout } from "@/components/admin/ArticlesPageLayout"
import { BulkTranslationDialog } from "@/components/admin/BulkTranslationDialog"

export default function PublishedArticlesPage() {
  const [showBulkTranslation, setShowBulkTranslation] = useState(false)
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])

  const handleBulkTranslate = (articleIds: string[]) => {
    setSelectedArticleIds(articleIds)
    setShowBulkTranslation(true)
  }

  const handleTranslationSuccess = (summary: any) => {
    console.log('Bulk translation started:', summary)
    setShowBulkTranslation(false)
    setSelectedArticleIds([])
  }

  const handleTranslationError = (error: string) => {
    console.error('Bulk translation error:', error)
  }

  return (
    <>
      <ArticlesPageLayout
        title="Published Articles"
        pageType="published"
        status="published"
        initialSortBy="published_at"
        initialSortOrder="desc"
        showAddButton={false}
        onBulkTranslate={handleBulkTranslate}
      />
      
      <BulkTranslationDialog
        open={showBulkTranslation}
        onOpenChange={setShowBulkTranslation}
        selectedArticleIds={selectedArticleIds}
        onSuccess={handleTranslationSuccess}
        onError={handleTranslationError}
      />
    </>
  )
}