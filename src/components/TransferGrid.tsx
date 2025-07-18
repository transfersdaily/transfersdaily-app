import { TransferCard } from "./TransferCard"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface Transfer {
  id: number
  title: string
  excerpt: string
  primaryBadge: string // league or club name
  timeAgo: string
}

interface TransferGridProps {
  transfers: Transfer[]
  accentColor?: string
  gradientFrom?: string
  gradientTo?: string
  onClearFilters?: () => void
  emptyStateTitle?: string
  emptyStateDescription?: string
}

export function TransferGrid({
  transfers,
  accentColor = "primary",
  gradientFrom,
  gradientTo,
  onClearFilters,
  emptyStateTitle = "No transfers found",
  emptyStateDescription = "Try adjusting your search terms or filters"
}: TransferGridProps) {
  if (transfers.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">{emptyStateTitle}</h3>
            <p className="text-muted-foreground mb-6">
              {emptyStateDescription}
            </p>
            {onClearFilters && (
              <Button variant="outline" onClick={onClearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {transfers.map((transfer) => (
            <TransferCard
              key={transfer.id}
              title={transfer.title}
              excerpt={transfer.excerpt}
              primaryBadge={transfer.primaryBadge}
              timeAgo={transfer.timeAgo}
              accentColor={accentColor}
              gradientFrom={gradientFrom}
              gradientTo={gradientTo}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
