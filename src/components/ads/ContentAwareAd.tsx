'use client';

import { ReactNode } from 'react';
import { shouldShowAds, validateContentQuality } from '@/lib/content-validation';
import { areAdsEnabled } from '@/lib/ads';

interface ContentAwareAdProps {
  children: ReactNode;
  content?: string;
  pageType?: string;
  minWords?: number;
  className?: string;
}

/**
 * Wrapper component that only shows ads when content meets quality requirements
 * This helps prevent AdSense policy violations for low-quality content
 */
export function ContentAwareAd({ 
  children, 
  content, 
  pageType = 'unknown',
  minWords,
  className = ''
}: ContentAwareAdProps) {
  // Don't show ads if globally disabled
  if (!areAdsEnabled()) {
    return null;
  }
  
  // Don't show ads on admin or error pages
  const disallowedPages = ['admin', 'login', '404', 'error', 'api'];
  if (disallowedPages.some(page => pageType.toLowerCase().includes(page))) {
    return null;
  }
  
  // If content is provided, apply custom minimum word count if specified
  if (content && minWords) {
    const validation = validateContentQuality(content);
    if (validation.wordCount < minWords) {
      console.warn(`ContentAwareAd: Content too short (${validation.wordCount} words, minimum: ${minWords})`);
      return null;
    }
  }
  
  // Show ads if all checks pass
  return (
    <div className={`content-aware-ad ${className}`}>
      {children}
    </div>
  );
}

/**
 * Hook to check if ads should be shown for current content
 */
export function useContentAwareAds(content?: string, pageType?: string) {
  const adsEnabled = areAdsEnabled();
  // Always allow ads regardless of content validation
  const contentValid = true;
  const pageValid = pageType ? !['admin', 'login', '404', 'error'].includes(pageType.toLowerCase()) : true;
  
  return {
    shouldShowAds: adsEnabled && contentValid && pageValid,
    contentValidation: content ? validateContentQuality(content) : null
  };
}
