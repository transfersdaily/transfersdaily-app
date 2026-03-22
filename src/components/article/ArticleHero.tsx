import Image from "next/image"
import { typography } from "@/lib/typography"

const leagueColorMap: Record<string, string> = {
  "Premier League": "bg-league-premier-league",
  "La Liga": "bg-league-la-liga",
  "Serie A": "bg-league-serie-a",
  Bundesliga: "bg-league-bundesliga",
  "Ligue 1": "bg-league-ligue-1",
}

interface ArticleHeroProps {
  title: string
  imageUrl?: string
  league?: string
}

/**
 * Article hero section with full-width image, gradient overlay, and title.
 * Falls back to a bg-card container with title when no image is available.
 * Server component -- no 'use client'.
 */
export function ArticleHero({ title, imageUrl, league }: ArticleHeroProps) {
  if (!imageUrl) {
    // D-05: No image fallback
    return (
      <div className="bg-card rounded-lg p-6 md:p-8 lg:p-10">
        <h1 className={`${typography.article.title} text-foreground`}>
          {title}
        </h1>
      </div>
    )
  }

  // D-01 through D-04: Full hero with gradient overlay
  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-lg">
      {/* Hero image */}
      <Image
        src={imageUrl}
        alt={`${title} - ${league || "Transfer News"}`}
        fill
        className="object-cover"
        priority={true}
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Title + league badge positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10">
        {/* D-02: League badge above title */}
        {league && (
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm text-white mb-3 ${
              leagueColorMap[league] ?? "bg-primary"
            }`}
          >
            {league}
          </span>
        )}

        {/* D-03: Title over gradient */}
        <h1 className={`${typography.article.title} text-white`}>
          {title}
        </h1>
      </div>
    </div>
  )
}
