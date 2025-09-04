import { TransferCard } from '@/components/TransferCard';
import { AdInFeed } from '@/components/ads';
import { type Locale, type Dictionary } from '@/lib/i18n';
import { type Transfer } from '@/lib/api';
import { formatTimeAgo } from '@/lib/date-utils';
import { createTranslator } from '@/lib/dictionary-server';

interface TransferGridProps {
  transfers: Transfer[];
  locale: Locale;
  dict: Dictionary;
  limit?: number;
}

export function TransferGrid({ 
  transfers, 
  locale, 
  dict, 
  limit
}: TransferGridProps) {
  const t = createTranslator(dict);
  
  if (!transfers || transfers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transfers available</p>
      </div>
    );
  }

  const displayTransfers = limit ? transfers.slice(0, limit) : transfers;
  const gridItems = [];

  displayTransfers.forEach((transfer, index) => {
    // Add transfer card
    gridItems.push(
      <div key={transfer.id} className="col-span-1">
        <TransferCard
          title={transfer.title}
          excerpt={transfer.excerpt}
          primaryBadge={transfer.league}
          timeAgo={formatTimeAgo(transfer.publishedAt, t)}
          href={`/${locale}/article/${transfer.slug || 'no-slug'}`}
          imageUrl={transfer.imageUrl}
        />
      </div>
    );

    // Add in-feed ad every 6 articles
    if ((index + 1) % 6 === 0 && index < displayTransfers.length - 1) {
      gridItems.push(
        <div key={`ad-${index}`} className="col-span-1 md:col-span-2 lg:col-span-3">
          <AdInFeed />
        </div>
      );
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {gridItems}
    </div>
  );
}
