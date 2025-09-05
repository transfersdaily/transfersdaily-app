'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { type Transfer } from '@/lib/api';
import { type Locale } from '@/lib/i18n';

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
      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/80 shadow-sm">
        {article.imageUrl ? (
          <Image
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={article.imageUrl}
            alt={article.title}
            width={64}
            height={64}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">
              {article.league?.charAt(0) || 'T'}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        
        <div className="flex items-center gap-2 text-xs">
          {article.league && (
            <span className="px-2 py-0.5 font-medium bg-primary/10 text-primary rounded-md">
              {article.league}
            </span>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const linkClass = cardStyle 
    ? "block group bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl p-4 hover:bg-card/70 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-0.5"
    : "block group hover:bg-muted/50 rounded-lg p-3 -m-3 transition-all duration-200";

  return (
    <Link href={`/${locale}/article/${article.slug}`} className={linkClass}>
      {content}
    </Link>
  );
}
