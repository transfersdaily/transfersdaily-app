import { RecommendedArticles } from '@/components/RecommendedArticles';
import TrendingTopics from '@/components/TrendingTopics';
import { type Locale, type Dictionary } from '@/lib/i18n';

interface SidebarProps {
  className?: string;
  locale: Locale;
  dict: Dictionary;
}

export function Sidebar({ className = '', locale, dict }: SidebarProps) {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Recommended Articles Section */}
      <RecommendedArticles locale={locale} dict={dict} />

      {/* Most Searched / Trending Topics Section */}
      <TrendingTopics locale={locale} dict={dict} />
    </div>
  );
}
