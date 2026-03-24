import { Clock } from "lucide-react"
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
  const displayDate = formatDisplayDate(bestDate, locale, "Recently published")
  const minReadLabel = getTranslation(dict, "article.minRead", "min read")

  const hasTransferDetails = playerName || fromClub || toClub || transferStatus || transferFee

  return (
    <div className="flex flex-col gap-3">
      {/* Primary meta row: date | reading time | league badge */}
      <div className="flex items-center gap-4 font-sans text-sm text-muted-foreground flex-wrap">
        <time dateTime={bestDate}>{displayDate}</time>

        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {readingTime} {minReadLabel}
        </span>

        {league && (
          <span
            className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm text-white ${
              LEAGUE_BG_CLASSES[league] ?? "bg-primary"
            }`}
          >
            {league}
          </span>
        )}
      </div>

      {/* Transfer details row (conditional) */}
      {hasTransferDetails && (
        <div className="flex items-center gap-3 font-sans text-xs text-muted-foreground flex-wrap">
          {playerName && <span className="font-semibold text-foreground">{playerName}</span>}
          {fromClub && toClub && (
            <span>
              {fromClub} &rarr; {toClub}
            </span>
          )}
          {transferStatus && (
            <span className="uppercase tracking-wide text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-muted">
              {transferStatus}
            </span>
          )}
          {transferFee && <span>{transferFee}</span>}
        </div>
      )}
    </div>
  )
}
