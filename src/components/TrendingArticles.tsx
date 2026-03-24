'use client';

import { useState, useEffect } from 'react';
import { articlesApi, type Transfer, type Article } from '@/lib/api';
import { ArticleCard, ArticleCardSkeleton } from '@/components/ArticleCard';
import { type Locale, type Dictionary, getTranslation } from '@/lib/i18n';
import { getTranslation as getCommonTranslation } from '@/lib/translations';
import { formatTimeAgo } from '@/lib/date-utils';

interface TrendingArticlesProps {
  locale?: Locale;
  dict?: Dictionary;
}

export function TrendingArticles({
  locale = 'en',
  dict,
}: TrendingArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Enhanced translation function with fallbacks
  const t = (key: string, fallback?: string) => {
    if (dict) {
      const dictTranslation = getTranslation(dict, key);
      if (dictTranslation && dictTranslation !== key) {
        return dictTranslation;
      }
    }

    const commonTranslation = getCommonTranslation(locale, key);
    if (commonTranslation && commonTranslation !== key) {
      return commonTranslation;
    }

    return fallback || key.split('.').pop() || key;
  };

  useEffect(() => {
    loadTrendingArticles();
  }, [locale]);

  const loadTrendingArticles = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const trending = await articlesApi.getTrending(5, locale);
      if (trending && trending.length > 0) {
        setArticles(trending);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Error loading trending articles:', error);
      setHasError(true);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-4">
        {t('sidebar.trendingArticles', 'Trending')}
      </h3>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ArticleCardSkeleton key={i} variant="mini" />
          ))}
        </div>
      ) : hasError ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            {t('sidebar.errorLoadingArticles', 'Error loading articles')}
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            {t('sidebar.noTrendingArticles')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              variant="mini"
              title={article.title}
              href={`/${locale}/article/${article.slug}`}
              imageUrl={article.imageUrl}
              league={article.league}
              timeAgo={formatTimeAgo(article.publishedAt, t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
