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
      {/* Article Image - Larger and more prominent */}
      <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-sm">
        {article.imageUrl ? (
          <Image
            className="w-full h-full object-cover object-center block group-hover:scale-110 transition-transform duration-300"
            src={article.imageUrl}
            alt={article.title}
            width={80}
            height={80}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-xl text-primary/60 font-bold">
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
        className="block group bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-md shadow-black/5 dark:shadow-black/20 rounded-2xl p-4 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300 hover:-translate-y-0.5"
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/article/${article.slug}`}
      className="block group hover:bg-white/60 dark:hover:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-3 -m-3 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
    >
      {content}
    </Link>
  );
}
