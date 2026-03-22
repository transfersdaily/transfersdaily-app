import { Suspense } from 'react';
import { ArticleCard, ArticleCardSkeleton } from '@/components/ArticleCard';
import { SwipeCarousel } from '@/components/SwipeCarousel';
import { TransferGrid } from '@/components/TransferGrid';
import { ViewAllButton } from '@/components/ViewAllButton';
import { formatTimeAgo } from '@/lib/date-utils';
import { type Transfer } from '@/lib/api';
import { type Locale, type Dictionary } from '@/lib/i18n';

interface LatestSectionProps {
  transfers: Transfer[];
  locale: Locale;
  dict: Dictionary;
  t: (key: string, fallback?: string) => string;
}

export function LatestSection({
  transfers,
  locale,
  dict,
  t,
}: LatestSectionProps) {
  return (
    <section className="py-4 md:py-6" aria-labelledby="latest-transfers">
      <div className="flex justify-between items-center mb-4">
        <h2
          id="latest-transfers"
          className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground"
        >
          {t('homepage.latestTransfers')}
        </h2>
        <ViewAllButton href={`/${locale}/latest`}>
          {t('common.viewAll')}
        </ViewAllButton>
      </div>

      <SwipeCarousel>
        {transfers.slice(0, 6).map((transfer) => (
          <ArticleCard
            key={transfer.id}
            variant="standard"
            title={transfer.title}
            excerpt={transfer.excerpt}
            league={transfer.league}
            timeAgo={formatTimeAgo(transfer.publishedAt, t)}
            href={`/${locale}/article/${transfer.slug || 'no-slug'}`}
            imageUrl={transfer.imageUrl}
          />
        ))}
      </SwipeCarousel>

      <div className="hidden md:block">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} variant="standard" />
            ))}
          </div>
        }>
          <TransferGrid
            transfers={transfers}
            locale={locale}
            dict={dict}
            limit={6}
          />
        </Suspense>
      </div>
    </section>
  );
}
