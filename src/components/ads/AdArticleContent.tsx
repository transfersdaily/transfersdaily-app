'use client';

import { AdInContent } from './AdInContent';
import { AD_SLOTS } from '../../lib/ads';

interface AdArticleContentProps {
  content: string;
  className?: string;
}

export function AdArticleContent({ content, className = '' }: AdArticleContentProps) {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  
  // Insert ads after specific paragraphs
  const contentWithAds = [];
  
  paragraphs.forEach((paragraph, index) => {
    contentWithAds.push(
      <p key={`p-${index}`} className="mb-4 leading-relaxed">
        {paragraph}
      </p>
    );
    
    // Insert ads after specific paragraphs
    if (index === 0) {
      // After 1st paragraph
      contentWithAds.push(
        <AdInContent 
          key="ad-1" 
          slot={AD_SLOTS.ARTICLE.PARAGRAPH_1} 
          type="article" 
        />
      );
    } else if (index === 2) {
      // After 3rd paragraph
      contentWithAds.push(
        <AdInContent 
          key="ad-3" 
          slot={AD_SLOTS.ARTICLE.PARAGRAPH_3} 
          type="article" 
        />
      );
    } else if (index === 5) {
      // After 6th paragraph
      contentWithAds.push(
        <AdInContent 
          key="ad-6" 
          slot={AD_SLOTS.ARTICLE.PARAGRAPH_6} 
          type="article" 
        />
      );
    } else if (index === paragraphs.length - 2) {
      // Before conclusion (second to last paragraph)
      contentWithAds.push(
        <AdInContent 
          key="ad-conclusion" 
          slot={AD_SLOTS.ARTICLE.BEFORE_CONCLUSION} 
          type="article" 
        />
      );
    }
  });
  
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {contentWithAds}
    </div>
  );
}
