import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { LEAGUE_BG_CLASSES } from "@/lib/constants"

// ---------------------------------------------------------------------------
// CVA variant definitions
// ---------------------------------------------------------------------------

const cardVariants = cva(
  "group cursor-pointer transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        hero: "relative rounded-lg overflow-hidden h-full",
        standard:
          "flex flex-col h-full overflow-hidden bg-card border border-border/50 rounded-lg hover:-translate-y-0.5 hover:border-border",
        compact: "flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors",
        mini: "flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors",
      },
    },
    defaultVariants: {
      variant: "standard",
    },
  }
)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ArticleCardProps extends VariantProps<typeof cardVariants> {
  title: string
  href: string
  imageUrl?: string
  league?: string
  timeAgo?: string
  excerpt?: string
  priority?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function LeagueBadge({ league }: { league: string }) {
  const bg = LEAGUE_BG_CLASSES[league] ?? "bg-primary"
  return (
    <span
      className={cn(
        "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm text-white",
        bg
      )}
    >
      {league}
    </span>
  )
}

function isValidImageUrl(url?: string): boolean {
  if (!url) return false
  // Allow CloudFront-hosted placeholder images (real images, not client-side SVGs)
  if (url.includes('cloudfront.net')) return true
  if (url.includes('default-transfer')) return false
  if (url.includes('placeholder')) return false
  return true
}

function CardImage({
  imageUrl,
  alt,
  league,
  className,
  sizes,
  priority,
  width,
  height,
  fill,
}: {
  imageUrl?: string
  alt: string
  league?: string
  className?: string
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
  fill?: boolean
}) {
  if (isValidImageUrl(imageUrl)) {
    return (
      <Image
        src={imageUrl!}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        style={!fill ? { width: '100%', height: 'auto' } : undefined}
        className={cn(
          "object-cover object-top group-hover:scale-[1.03] transition-transform duration-200",
          className
        )}
      />
    )
  }

  // Placeholder when no image or broken default image
  return (
    <div
      className={cn(
        "w-full h-full bg-muted flex items-center justify-center",
        className
      )}
    >
      <span className="text-lg font-bold text-muted-foreground">
        {league?.charAt(0) || "T"}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Variant layouts
// ---------------------------------------------------------------------------

function HeroLayout({
  title,
  excerpt,
  imageUrl,
  league,
  timeAgo,
  priority,
}: Omit<ArticleCardProps, "href" | "variant" | "className">) {
  return (
    <>
      <CardImage
        imageUrl={imageUrl}
        alt={title}
        league={league}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 66vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 space-y-2">
        {league && <LeagueBadge league={league} />}
        <h2 className="font-display text-xl md:text-2xl font-bold uppercase leading-tight tracking-tight text-white">
          {title}
        </h2>
        {excerpt && (
          <p className="text-white/80 text-sm line-clamp-2">{excerpt}</p>
        )}
        {timeAgo && <span className="text-xs text-white/60">{timeAgo}</span>}
      </div>
    </>
  )
}

function StandardLayout({
  title,
  excerpt,
  imageUrl,
  league,
  timeAgo,
}: Omit<ArticleCardProps, "href" | "variant" | "className" | "priority">) {
  return (
    <>
      <div className="aspect-video relative overflow-hidden">
        <CardImage
          imageUrl={imageUrl}
          alt={title}
          league={league}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex-grow space-y-2">
        {league && <LeagueBadge league={league} />}
        <h3 className="text-base font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm line-clamp-2 text-muted-foreground">
            {excerpt}
          </p>
        )}
        {timeAgo && (
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        )}
      </div>
    </>
  )
}

function CompactLayout({
  title,
  imageUrl,
  league,
  timeAgo,
}: Omit<
  ArticleCardProps,
  "href" | "variant" | "className" | "priority" | "excerpt"
>) {
  return (
    <>
      <div className="w-32 h-20 flex-shrink-0 rounded-md overflow-hidden relative">
        <CardImage
          imageUrl={imageUrl}
          alt={title}
          league={league}
          width={128}
          height={80}
          sizes="128px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {timeAgo && (
          <span className="text-xs text-muted-foreground mt-1 block">
            {timeAgo}
          </span>
        )}
      </div>
    </>
  )
}

function MiniLayout({
  title,
  imageUrl,
  league,
  timeAgo,
}: Omit<
  ArticleCardProps,
  "href" | "variant" | "className" | "priority" | "excerpt"
>) {
  return (
    <>
      <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden relative">
        <CardImage
          imageUrl={imageUrl}
          alt={title}
          league={league}
          fill
          sizes="96px"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-2">
          {league && <LeagueBadge league={league} />}
          {timeAgo && (
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          )}
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ArticleCard({
  variant = "standard",
  title,
  href,
  imageUrl,
  league,
  timeAgo,
  excerpt,
  priority,
  className,
}: ArticleCardProps) {
  const layoutProps = { title, imageUrl, league, timeAgo, excerpt, priority }

  return (
    <Link
      href={href}
      className={cn("block", (variant === "standard" || variant === "hero") && "h-full")}
    >
      <article className={cn(cardVariants({ variant }), className)}>
        {variant === "hero" && <HeroLayout {...layoutProps} />}
        {variant === "standard" && <StandardLayout {...layoutProps} />}
        {variant === "compact" && <CompactLayout {...layoutProps} />}
        {variant === "mini" && <MiniLayout {...layoutProps} />}
      </article>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export function ArticleCardSkeleton({
  variant = "standard",
}: {
  variant?: "hero" | "standard" | "compact" | "mini"
}) {
  if (variant === "hero") {
    return <Skeleton className="w-full h-full rounded-lg" />
  }

  if (variant === "standard") {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-card border border-border rounded-lg">
        <Skeleton className="aspect-video w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-3 p-3">
        <Skeleton className="w-32 h-20 flex-shrink-0 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }

  // mini
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="w-24 h-16 flex-shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
