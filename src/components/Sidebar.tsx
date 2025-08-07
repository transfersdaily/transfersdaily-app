import { RecommendedArticles } from '@/components/RecommendedArticles';
import TrendingTopics from '@/components/TrendingTopics';
import { RectangleAd, ConditionalAdContainer } from '@/components/ads';
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
      <ConditionalAdContainer position="sidebar-top">
        <RectangleAd position="sidebar-top" />
      </ConditionalAdContainer>

      {/* Recommended Articles Section */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <RecommendedArticles locale={locale} dict={dict} />
      </div>

      {/* Ad: Sidebar middle */}
      <ConditionalAdContainer position="sidebar-middle">
        <RectangleAd position="sidebar-middle" />
      </ConditionalAdContainer>

      {/* Most Searched / Trending Topics Section */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <TrendingTopics locale={locale} dict={dict} />
      </div>

      {/* Ad: Sidebar bottom 1 */}
      <ConditionalAdContainer position="sidebar-bottom-1">
        <RectangleAd position="sidebar-bottom-1" />
      </ConditionalAdContainer>

      {/* Ad: Sidebar bottom 2 */}
      <ConditionalAdContainer position="sidebar-bottom-2">
        <RectangleAd position="sidebar-bottom-2" />
      </ConditionalAdContainer>
    </div>
  );
}
