import { TransferCard } from '@/components/TransferCard';
import { NativeAd } from '@/components/ads';
import { type Locale, type Dictionary } from '@/lib/i18n';

interface Transfer {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  imageUrl?: string;
  league?: string;
  status: string;
}

interface TransferGridWithAdsProps {
  transfers: Transfer[];
  locale: Locale;
  dict: Dictionary;
  adPosition: 'in-latest' | 'in-trending';
}

export function TransferGridWithAds({ 
  transfers, 
  locale, 
  dict, 
  adPosition 
}: TransferGridWithAdsProps) {
  if (!transfers || transfers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transfers available</p>
      </div>
    );
  }

  // Insert native ad at position 3 (after 2 articles)
  const adInsertPosition = 2;
  const transfersWithAd = [...transfers];
  
  // Only insert ad if we have enough transfers and ad is enabled
  if (transfers.length > adInsertPosition) {
    transfersWithAd.splice(adInsertPosition, 0, { 
      id: `native-ad-${adPosition}`, 
      isAd: true 
    } as any);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {transfersWithAd.map((item, index) => {
        // Render native ad
        if ((item as any).isAd) {
          return (
            <div key={item.id} className="col-span-1">
              <NativeAd 
                position={adPosition}
                className="h-full"
              />
            </div>
          );
        }

        // Render transfer card
        const transfer = item as Transfer;
        return (
          <div key={transfer.id} className="col-span-1">
            <TransferCard
              transfer={transfer}
              locale={locale}
              dict={dict}
            />
          </div>
        );
      })}
    </div>
  );
}
