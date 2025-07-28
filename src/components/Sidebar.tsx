import { RecommendedArticles } from '@/components/RecommendedArticles';
import { TrendingTopics } from '@/components/TrendingTopics';
import { type Locale, type Dictionary } from '@/lib/i18n';

interface SidebarProps {
  className?: string;
  locale: Locale;
  dict: Dictionary;
}

export function Sidebar({ className = '', locale, dict }: SidebarProps) {
  return (
    <div
      className={`bg-card rounded-lg shadow-sm border border-border min-w-[280px] ${className}`}
    >
      <div className="p-4 space-y-6">
        {/* Recommended Articles */}
        <RecommendedArticles locale={locale} dict={dict} />

        {/* Most Searched (Trending Topics) */}
        <TrendingTopics locale={locale} dict={dict} />
      </div>
    </div>
  );
}
