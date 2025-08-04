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
    <div className={`w-full space-y-6 mt-8 ${className}`}>
      {/* Recommended Articles Section */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <RecommendedArticles locale={locale} dict={dict} />
      </div>

      {/* Most Searched / Trending Topics Section */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <TrendingTopics locale={locale} dict={dict} />
      </div>
    </div>
  );
}
