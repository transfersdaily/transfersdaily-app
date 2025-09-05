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
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-gray-700/30 p-5">
        <RecommendedArticles locale={locale} dict={dict} />
      </div>

      {/* Most Searched / Trending Topics Section */}
      <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <TrendingTopics locale={locale} dict={dict} />
      </div>
    </div>
  );
}
