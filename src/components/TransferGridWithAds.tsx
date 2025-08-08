import { TransferCard } from '@/components/TransferCard';
import { type Locale, type Dictionary } from '@/lib/i18n';
import { type Transfer } from '@/lib/api';
import { formatTimeAgo } from '@/lib/date-utils';
import { createTranslator } from '@/lib/dictionary-server';

interface TransferGridWithAdsProps {
  transfers: Transfer[];
  locale: Locale;
  dict: Dictionary;
  adPosition: 'in-latest' | 'in-trending' | 'in-search-results';
}

export function TransferGridWithAds({ 
  transfers, 
  locale, 
  dict, 
  adPosition 
}: TransferGridWithAdsProps) {
  const t = createTranslator(dict);
  
  if (!transfers || transfers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transfers available</p>
      </div>
    );
  }

  // For homepage sections (latest/trending), show 6 pure article cards
  // For search results, show all transfers in a flexible grid
  const displayTransfers = adPosition === 'in-search-results' 
    ? transfers 
    : transfers.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {displayTransfers.map((transfer) => (
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
      ))}
    </div>
  );
}
