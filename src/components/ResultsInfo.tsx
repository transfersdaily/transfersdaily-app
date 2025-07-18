interface ResultsInfoProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  isLoading: boolean
}

export function ResultsInfo({ currentPage, itemsPerPage, totalItems, isLoading }: ResultsInfoProps) {
  if (isLoading || totalItems === 0) return null

  const startItem = ((currentPage - 1) * itemsPerPage) + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="mb-4 text-sm text-muted-foreground">
      Showing {startItem}-{endItem} of {totalItems} articles
    </div>
  )
}