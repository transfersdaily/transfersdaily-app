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
    <div className={`w-full space-y-8 ${className}`}>
      {/* Recommended Articles Section */}
      <div className="bg-card/60 backdrop-blur-sm rounded-2xl shadow-sm border-0 p-6 hover:shadow-md transition-all duration-300">
        <RecommendedArticles locale={locale} dict={dict} />
      </div>

      {/* Most Searched / Trending Topics Section */}
      <div className="bg-gradient-to-br from-muted/50 to-card rounded-2xl shadow-sm border-0 overflow-hidden hover:shadow-md transition-all duration-300">
        <TrendingTopics locale={locale} dict={dict} />
      </div>
    </div>
  );
}
