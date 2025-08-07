import { TransferCard } from '@/components/TransferCard';
import { NativeAd } from '@/components/ads';
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

  // For search results, show all transfers in a flexible grid
  if (adPosition === 'in-search-results') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {transfers.map((transfer) => (
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

  // For homepage sections, create strict 3x2 grid (6 items total)
  // Take first 5 transfers + 1 ad = 6 total items
  const displayTransfers = transfers.slice(0, 5);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Row 1: 3 transfers */}
      {displayTransfers.slice(0, 3).map((transfer) => (
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
      
      {/* Row 2: 2 transfers + 1 ad */}
      {displayTransfers.slice(3, 5).map((transfer) => (
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
      
      {/* Native ad in the 6th position (bottom right) */}
      <div className="col-span-1">
        <NativeAd 
          position={adPosition}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
