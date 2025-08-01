/**
 * Date utility functions for consistent date handling across the application
 */

/**
 * Checks if a date string is valid and not from the Unix epoch
 */
export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString || dateString === 'null' || dateString === 'undefined') {
    return false;
  }

  const date = new Date(dateString);
  
  // Check if date is valid and not too old (likely epoch)
  return !isNaN(date.getTime()) && date.getFullYear() >= 2020;
}

/**
 * Gets the best available date from multiple date fields with special handling for published articles
 */
export function getBestDate(
  published_at?: string | null,
  updated_at?: string | null,
  created_at?: string | null,
  isPublishedArticle: boolean = true
): string {
  console.log('🔍 getBestDate called with:', {
    published_at,
    updated_at,
    created_at,
    isPublishedArticle,
  });
  
  // For published articles, if published_at is missing but created_at exists, use created_at
  // This handles the case where articles are published but don't have proper published_at dates
  if (isPublishedArticle && !isValidDate(published_at) && created_at) {
    console.log('🔍 getBestDate: Published article without valid published_at, using created_at:', created_at);
    return created_at;
  }
  
  const dates = [published_at, updated_at, created_at];
  
  for (const date of dates) {
    if (isValidDate(date)) {
      console.log('🔍 getBestDate returning valid date:', date);
      return date!;
    }
  }
  
  // If no valid dates found, use current time as last resort
  console.log('🔍 getBestDate: No valid dates found, using current time');
  return new Date().toISOString();
}

/**
 * Formats a date string for display, with fallback for invalid dates
 */
export function formatDisplayDate(
  dateString: string | null | undefined,
  locale: string = 'en',
  fallback: string = 'Recently published'
): string {
  if (!isValidDate(dateString)) {
    return fallback;
  }

  const date = new Date(dateString!);
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formats time ago with proper validation
 */
export function formatTimeAgo(
  dateString: string | null | undefined,
  t: any,
  fallback: string = 'just now'
): string {
  if (!isValidDate(dateString)) {
    return t ? t('common.justNow') : fallback;
  }

  const date = new Date(dateString!);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return t ? t('common.justNow') : 'just now';
  if (diffInHours < 24) return `${diffInHours} ${t ? t('common.hoursAgo') : 'hours ago'}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ${t ? t('common.daysAgo') : 'days ago'}`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} ${t ? t('common.weeksAgo') : 'weeks ago'}`;
}

/**
 * Gets a valid date for metadata (returns undefined if invalid)
 */
export function getValidDateForMeta(dateString: string | null | undefined): string | undefined {
  return isValidDate(dateString) ? dateString! : undefined;
}
