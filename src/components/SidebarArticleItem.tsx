'use client';

import Image from 'next/image';
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
    <div className="flex gap-4 items-start">
      {/* Article Image - Larger, more prominent */}
      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-sm">
        {article.imageUrl ? (
          <Image
            className="w-full h-full object-cover object-center block group-hover:scale-110 transition-transform duration-300"
            src={article.imageUrl}
            alt={article.title}
            width={64}
            height={64}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-lg text-primary/60 font-bold">
              {article.league?.charAt(0) || 'T'}
            </span>
          </div>
        )}
      </div>
      {/* Article Content - Better hierarchy and spacing */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Article title - Better typography */}
        <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 text-foreground">
          {article.title}
        </h3>
        {/* Meta information - Cleaner layout */}
        <div className="flex items-center gap-3">
          {article.league && (
            <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border-0">
              {article.league}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (cardStyle) {
    return (
      <Link
        href={`/${locale}/article/${article.slug}`}
        className="block group bg-card/40 backdrop-blur-sm border-0 shadow-sm rounded-xl p-4 hover:shadow-md hover:bg-card/60 transition-all duration-300"
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/article/${article.slug}`}
      className="block group hover:bg-muted/60 rounded-xl p-4 -m-4 transition-all duration-200"
    >
      {content}
    </Link>
  );
}
