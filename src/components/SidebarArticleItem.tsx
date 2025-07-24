'use client';

import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { type Transfer } from '@/lib/api';
import { type Locale } from '@/lib/i18n';
import { typography } from '@/lib/typography';

interface SidebarArticleItemProps {
  article: Transfer;
  locale: Locale;
  formatTimeAgo: (dateString: string) => string;
  cardStyle?: boolean;
}

export function SidebarArticleItem({
  article,
  locale,
  formatTimeAgo,
  cardStyle,
}: SidebarArticleItemProps) {
  const content = (
    <div className="flex gap-3 items-start">
      {/* Article Image - Consistent fixed size, centered, fills space */}
      <div className="flex-shrink-0 w-[50px] h-[70px] rounded-lg overflow-hidden bg-muted">
        {article.imageUrl ? (
          <img
            className="w-full h-full object-cover object-center block group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            src={article.imageUrl}
            alt={article.title}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-sm text-muted-foreground font-medium">
              {article.league?.charAt(0) || 'T'}
            </span>
          </div>
        )}
      </div>
      {/* Article Content - Better spacing and readability */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Article title - Slightly smaller to compensate for narrow container */}
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors text-foreground">
          {article.title}
        </h3>
        {/* Meta information - Better organized */}
        <div className="flex items-center justify-between gap-2">
          {article.league && (
            <span className={`${typography.badge} px-2 py-0.5 h-5 rounded bg-muted text-muted-foreground border border-border flex-shrink-0`}>
              {article.league}
            </span>
          )}
          <div className={`flex items-center gap-1 ${typography.card.meta} ml-4`}>
            <Clock className="h-3 w-3" />
            <span className="truncate">
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (cardStyle) {
    return (
      <Link
        href={`/${locale}/article/${article.slug}`}
        className="block group bg-card border border-border shadow-sm rounded-xl p-3 hover:shadow-md transition-shadow"
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/article/${article.slug}`}
      className="block group hover:bg-muted/50 dark:hover:bg-muted/30 rounded-lg p-3 -m-3 transition-colors"
    >
      {content}
    </Link>
  );
}
