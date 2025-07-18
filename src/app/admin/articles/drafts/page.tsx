"use client"

import { ArticlesPageLayout } from "@/components/admin/ArticlesPageLayout"

export default function DraftArticlesPage() {
  const handleAddClick = () => {
    // TODO: Navigate to add article page
    console.log('Add article clicked')
  }

  return (
    <ArticlesPageLayout
      title="Draft Articles"
      pageType="draft"
      status="draft"
      initialSortBy="created_at"
      initialSortOrder="asc"
      showAddButton={true}
      onAddClick={handleAddClick}
    />
  )
}