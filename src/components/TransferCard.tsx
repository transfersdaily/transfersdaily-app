"use client"

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
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
            <div className="text-muted-foreground text-sm">No Image</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {primaryBadge}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-2">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
