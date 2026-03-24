import Link from "next/link"
import { type Dictionary, getTranslation } from "@/lib/i18n"

interface ArticleBreadcrumbProps {
  locale: string
  league?: string
  articleTitle: string
  dict?: Dictionary
}

/**
 * Breadcrumb navigation for article pages.
 * Path: Home > League Name > Article Title (truncated to 50 chars).
 * Server component -- no 'use client'.
 */
export function ArticleBreadcrumb({ locale, league, articleTitle, dict }: ArticleBreadcrumbProps) {
  const t = (key: string, fallback: string) => {
    if (dict) {
      const val = getTranslation(dict, key)
      if (val && val !== key) return val
    }
    return fallback
  }

  const truncatedTitle =
    articleTitle.length > 50
      ? articleTitle.substring(0, 50) + "..."
      : articleTitle

  const leagueSlug = league
    ? league.toLowerCase().replace(/\s+/g, "-")
    : null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground flex-wrap">
        {/* Home */}
        <li>
          <Link
            href={`/${locale}`}
            className="hover:text-foreground transition-colors"
          >
            {t('article.home', 'Home')}
          </Link>
        </li>

        {/* League (optional) */}
        {league && leagueSlug && (
          <>
            <li aria-hidden="true" className="select-none">
              &gt;
            </li>
            <li>
              <Link
                href={`/${locale}/league/${leagueSlug}`}
                className="hover:text-foreground transition-colors"
              >
                {league}
              </Link>
            </li>
          </>
        )}

        {/* Current article title (not a link) */}
        <li aria-hidden="true" className="select-none">
          &gt;
        </li>
        <li>
          <span aria-current="page">{truncatedTitle}</span>
        </li>
      </ol>
    </nav>
  )
}
