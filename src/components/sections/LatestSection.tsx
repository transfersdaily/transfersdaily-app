import { ArticleCard } from '@/components/ArticleCard';
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

      {/* Mobile: swipeable carousel */}
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

      {/* Desktop: grid */}
      <div className="hidden md:block">
        <TransferGrid
          transfers={transfers}
          locale={locale}
          dict={dict}
          limit={6}
        />
      </div>
    </section>
  );
}
