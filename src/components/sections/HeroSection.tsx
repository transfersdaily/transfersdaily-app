import { Suspense } from 'react';
import { ArticleCard, ArticleCardSkeleton } from '@/components/ArticleCard';
import { MotionCard } from '@/components/MotionCard';
import { formatTimeAgo } from '@/lib/date-utils';
import { type Transfer } from '@/lib/api';
import { type Locale } from '@/lib/i18n';

interface HeroSectionProps {
  featuredTransfer: Transfer | null;
  latestTransfers: Transfer[];
  locale: Locale;
  t: (key: string, fallback?: string) => string;
}

export function HeroSection({
  featuredTransfer,
  latestTransfers,
  locale,
  t,
}: HeroSectionProps) {
  return (
    <section className="pt-6 pb-4" aria-labelledby="featured-transfer">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[420px]">
            <div className="md:col-span-2 h-full">
              <ArticleCardSkeleton variant="hero" />
            </div>
            <div className="hidden md:flex flex-col gap-3">
              <ArticleCardSkeleton variant="hero" />
              <ArticleCardSkeleton variant="hero" />
            </div>
          </div>
        }
      >
        <MotionCard index={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[420px]">
            {/* Main Featured Article */}
            {featuredTransfer ? (
              <div className="md:col-span-2 h-full">
                <ArticleCard
                  variant="hero"
                  title={featuredTransfer.title}
                  href={`/${locale}/article/${featuredTransfer.slug}`}
                  imageUrl={featuredTransfer.imageUrl}
                  league={featuredTransfer.league}
                  timeAgo={formatTimeAgo(featuredTransfer.publishedAt, t)}
                  excerpt={featuredTransfer.excerpt}
                  priority
                />
              </div>
            ) : (
              <div className="md:col-span-2 h-full rounded-lg bg-card flex items-center justify-center">
                <p className="text-sm text-muted-foreground">{t('common.noFeaturedTransfer')}</p>
              </div>
            )}

            {/* Side Articles */}
            <div className="hidden md:flex flex-col gap-3">
              {latestTransfers?.slice(0, 2).map((transfer: any) => (
                <div key={transfer.id} className="flex-1">
                  <ArticleCard
                    variant="hero"
                    title={transfer.title}
                    href={`/${locale}/article/${transfer.slug}`}
                    imageUrl={transfer.imageUrl}
                    league={transfer.league}
                  />
                </div>
              )) || (
                <>
                  <div className="flex-1 rounded-lg bg-card" />
                  <div className="flex-1 rounded-lg bg-card" />
                </>
              )}
            </div>
          </div>
        </MotionCard>
      </Suspense>
    </section>
  );
}
