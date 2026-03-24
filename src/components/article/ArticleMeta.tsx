import { Clock, ArrowRight } from "lucide-react"
import { getBestDate, formatDisplayDate } from "@/lib/date-utils"
import { LEAGUE_BG_CLASSES } from "@/lib/constants"

// Helper to traverse dict object with dot-separated key
function getTranslation(dict: Record<string, unknown>, key: string, fallback?: string): string {
  const keys = key.split(".")
  let result: unknown = dict

  for (const k of keys) {
    if (result && typeof result === "object" && k in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[k]
    } else {
      return fallback || key
    }
  }

  return typeof result === "string" ? result : fallback || key
}

interface ArticleMetaProps {
  publishedAt: string
  updatedAt?: string
  createdAt: string
  readingTime: number
  locale: string
  league?: string
  playerName?: string
  fromClub?: string
  toClub?: string
  transferStatus?: string
  transferFee?: string
  dict: Record<string, unknown>
}

/**
 * Article metadata bar: date, reading time, league badge, transfer details.
 * Server component -- no 'use client'.
 */
export function ArticleMeta({
  publishedAt,
  updatedAt,
  createdAt,
  readingTime,
  locale,
  league,
  playerName,
  fromClub,
  toClub,
  transferStatus,
  transferFee,
  dict,
}: ArticleMetaProps) {
  const bestDate = getBestDate(publishedAt, updatedAt, createdAt)
  const displayDate = formatDisplayDate(bestDate, locale, getTranslation(dict, "article.recentlyPublished", "Recently published"))
  const minReadLabel = getTranslation(dict, "article.minRead", "min read")

  const hasTransferDetails = playerName || fromClub || toClub || transferStatus || transferFee

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-border">
      {/* Primary meta row: date | reading time | league badge */}
      <div className="flex items-center gap-4 font-sans text-sm md:text-base text-muted-foreground flex-wrap">
        <time dateTime={bestDate} className="font-medium">
          {displayDate}
        </time>

        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />

        <span className="flex items-center gap-1.5 font-medium">
          <Clock className="h-4 w-4" />
          {readingTime} {minReadLabel}
        </span>

        {league && (
          <>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-sm text-white ${
                LEAGUE_BG_CLASSES[league] ?? "bg-primary"
              }`}
            >
              {league}
            </span>
          </>
        )}
      </div>

      {/* Transfer details row (conditional) */}
      {hasTransferDetails && (
        <div className="flex items-center gap-3 font-sans text-sm text-foreground flex-wrap">
          {playerName && (
            <span className="font-display text-base font-bold uppercase tracking-tight">
              {playerName}
            </span>
          )}
          {fromClub && toClub && (
            <span className="flex items-center gap-2 text-muted-foreground">
              {fromClub}
              <ArrowRight className="h-3.5 w-3.5" />
              {toClub}
            </span>
          )}
          {transferStatus && (
            <span className="uppercase tracking-wide text-[10px] font-bold px-2 py-0.5 rounded-sm bg-muted text-muted-foreground">
              {transferStatus}
            </span>
          )}
          {transferFee && (
            <span className="font-semibold text-primary">{transferFee}</span>
          )}
        </div>
      )}
    </div>
  )
}
