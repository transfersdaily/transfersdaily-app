import { TransferCard } from '@/components/TransferCard';
import { type Locale, type Dictionary } from '@/lib/i18n';
import { type Transfer } from '@/lib/api';
import { formatTimeAgo } from '@/lib/date-utils';
import { createTranslator } from '@/lib/dictionary-server';

interface TransferGridProps {
  transfers: Transfer[];
  locale: Locale;
  dict: Dictionary;
  limit?: number; // Optional limit, if not provided shows all transfers
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

  // Apply limit if provided, otherwise show all
  const displayTransfers = limit ? transfers.slice(0, limit) : transfers;

  return (
    // Improved mobile spacing: 16px gap on mobile, 24px on desktop
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
