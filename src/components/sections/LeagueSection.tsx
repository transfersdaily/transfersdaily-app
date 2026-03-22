import { ArticleCard } from '@/components/ArticleCard';
import { ViewAllButton } from '@/components/ViewAllButton';
import { formatTimeAgo } from '@/lib/date-utils';
import { type Transfer } from '@/lib/api';
import { type Locale, type Dictionary } from '@/lib/i18n';

interface LeagueSectionProps {
  title: string;
  slug: string;
  transfers: Transfer[];
  locale: Locale;
  dict: Dictionary;
  t: (key: string, fallback?: string) => string;
}

export function LeagueSection({
  title,
  slug,
  transfers,
  locale,
  dict,
  t,
}: LeagueSectionProps) {
  return (
    <section className="py-4 md:py-6" aria-label={`${title} transfers`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-foreground">
          {title}
        </h2>
        <ViewAllButton href={`/${locale}/league/${slug}`}>
          {t('common.viewAll', 'View All')}
        </ViewAllButton>
      </div>

      {transfers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {transfers.slice(0, 4).map((transfer) => (
            <ArticleCard
              key={transfer.id}
              variant="compact"
              title={transfer.title}
              href={`/${locale}/article/${transfer.slug}`}
              imageUrl={transfer.imageUrl}
              timeAgo={formatTimeAgo(transfer.publishedAt, t)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">{t('common.noTransfersFound', 'No transfers found')}</p>
        </div>
      )}
    </section>
  );
}
