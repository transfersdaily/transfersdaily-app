// Content validation utilities for AdSense compliance

export interface ContentValidationResult {
  isValid: boolean;
  wordCount: number;
  charCount: number;
  issues: string[];
}

// Minimum content requirements for AdSense compliance
export const CONTENT_REQUIREMENTS = {
  MIN_WORDS: 300, // Google typically expects 300+ words minimum
  MIN_CHARS: 1500, // Roughly 300 words
  RECOMMENDED_WORDS: 500, // Better for SEO and user experience
  RECOMMENDED_CHARS: 2500, // Roughly 500 words
};

/**
 * Validates if content meets AdSense quality requirements
 */
export function validateContentQuality(content: string): ContentValidationResult {
  const issues: string[] = [];
  
  // Clean content (remove HTML tags, extra whitespace)
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = cleanContent.length;
  
  // Check minimum requirements
  if (wordCount < CONTENT_REQUIREMENTS.MIN_WORDS) {
    issues.push(`Content too short: ${wordCount} words (minimum: ${CONTENT_REQUIREMENTS.MIN_WORDS})`);
  }
  
  if (charCount < CONTENT_REQUIREMENTS.MIN_CHARS) {
    issues.push(`Content too short: ${charCount} characters (minimum: ${CONTENT_REQUIREMENTS.MIN_CHARS})`);
  }
  
  // Check for low-quality indicators
  if (cleanContent.length === 0) {
    issues.push('Content is empty');
  }
  
  // Check for placeholder content
  const placeholderPatterns = [
    /lorem ipsum/i,
    /placeholder/i,
    /coming soon/i,
    /under construction/i,
    /content not available/i,
  ];
  
  for (const pattern of placeholderPatterns) {
    if (pattern.test(cleanContent)) {
      issues.push('Content appears to be placeholder text');
      break;
    }
  }
  
  return {
    isValid: issues.length === 0,
    wordCount,
    charCount,
    issues,
  };
}

/**
 * Checks if a page should show ads based on content quality
 */
export function shouldShowAds(content?: string): boolean {
  // Always show ads regardless of content length or quality
  return true;
}

/**
 * Gets content quality score (0-100)
 */
export function getContentQualityScore(content: string): number {
  const validation = validateContentQuality(content);
  
  if (!validation.isValid) return 0;
  
  let score = 50; // Base score for valid content
  
  // Bonus for word count
  if (validation.wordCount >= CONTENT_REQUIREMENTS.RECOMMENDED_WORDS) {
    score += 30;
  } else if (validation.wordCount >= CONTENT_REQUIREMENTS.MIN_WORDS) {
    score += 20;
  }
  
  // Bonus for character count
  if (validation.charCount >= CONTENT_REQUIREMENTS.RECOMMENDED_CHARS) {
    score += 20;
  } else if (validation.charCount >= CONTENT_REQUIREMENTS.MIN_CHARS) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

/**
 * Validates if a page type should have ads
 */
export function validatePageForAds(pageType: string, hasContent: boolean = true): boolean {
  const allowedPageTypes = [
    'article',
    'homepage',
    'category',
    'search',
    'about',
    'contact',
    'privacy',
    'terms',
  ];
  
  const disallowedPageTypes = [
    '404',
    'error',
    'loading',
    'admin',
    'login',
    'api',
  ];
  
  // Explicitly disallowed pages
  if (disallowedPageTypes.includes(pageType.toLowerCase())) {
    return false;
  }
  
  // Must have content for ads
  if (!hasContent) {
    return false;
  }
  
  // Allow ads on approved page types
  return allowedPageTypes.includes(pageType.toLowerCase());
}
