import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TransferCardProps {
  title: string
  excerpt: string
  primaryBadge: string // league or club name
  timeAgo: string
  onClick?: () => void
  href?: string
  accentColor?: string
  gradientFrom?: string
  gradientTo?: string
  imageUrl?: string
  imageAlt?: string
}

export function TransferCard({
  title,
  excerpt,
  primaryBadge,
  timeAgo,
  onClick,
  href = "/article/sample-article",
  accentColor,
  gradientFrom,
  gradientTo,
  imageUrl,
  imageAlt
}: TransferCardProps) {
  const cardContent = (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer min-h-[44px]"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs bg-muted text-foreground border-border hover:bg-muted/80 truncate inline-block">
            {primaryBadge}
          </Badge>
        </div>
        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>{timeAgo}</span>
        </div>
      </CardContent>
    </Card>
  )

  if (onClick) {
    return cardContent
  }

  return (
    <Link 
      href={href}
      className="focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-lg"
      aria-label={`Read article: ${title}`}
    >
      {cardContent}
    </Link>
  )
}
