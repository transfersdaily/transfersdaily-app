"use client"

import { ArticlesPageLayout } from "@/components/admin/ArticlesPageLayout"

export default function PublishedArticlesPage() {
  return (
    <ArticlesPageLayout
      title="Published Articles"
      pageType="published"
      status="published"
      initialSortBy="published_at"
      initialSortOrder="desc"
      showAddButton={false}
    />
  )
}