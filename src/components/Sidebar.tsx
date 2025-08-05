import { RecommendedArticles } from '@/components/RecommendedArticles';
import TrendingTopics from '@/components/TrendingTopics';
import { RectangleAd } from '@/components/ads';
import { type Locale, type Dictionary } from '@/lib/i18n';

interface SidebarProps {
  className?: string;
  locale: Locale;
  dict: Dictionary;
}

export function Sidebar({ className = '', locale, dict }: SidebarProps) {
  return (
    <div className={`w-full space-y-6 mt-8 ${className}`}>
      {/* Ad: Sidebar top */}
      <RectangleAd position="sidebar-top" />

      {/* Recommended Articles Section */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <RecommendedArticles locale={locale} dict={dict} />
      </div>

      {/* Ad: Sidebar middle */}
      <RectangleAd position="sidebar-middle" />

      {/* Most Searched / Trending Topics Section */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <TrendingTopics locale={locale} dict={dict} />
      </div>

      {/* Ad: Sidebar bottom 1 */}
      <RectangleAd position="sidebar-bottom-1" />

      {/* Ad: Sidebar bottom 2 */}
      <RectangleAd position="sidebar-bottom-2" />
    </div>
  );
}
