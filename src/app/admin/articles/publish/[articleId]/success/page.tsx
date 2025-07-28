'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowLeft,
  Share2,
  Eye
} from 'lucide-react';
import { API_CONFIG } from '@/lib/config';
import { getAuthHeaders } from '@/lib/api';

// Helper function to generate slug from title (same as in api.ts)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim() // Remove leading/trailing whitespace
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

interface ArticleData {
  uuid: string;
  title: string;
  content: string;
  category: string;
  player_name?: string;
  from_club?: string;
  to_club?: string;
  league?: string;
  transfer_status?: string;
  image_url?: string;
  created_at: string;
  published_at?: string;
  slug?: string; // Add slug field
  translations?: {
    [key: string]: {
      title: string;
      content: string;
      slug: string;
      meta_description: string;
    };
  };
}

export default function PublishSuccessPage({ 
  params 
}: { 
  params: Promise<{ articleId: string }> 
}) {
  const router = useRouter();
  const { articleId } = use(params);
  
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔍 Loading published article:', articleId);
      
      // Get authentication headers
      const authHeaders = await getAuthHeaders();
      
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.articles}/${articleId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeaders
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load article: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data?.article) {
        throw new Error('Article not found in response');
      }
      
      const fetchedArticle = data.data.article;
      console.log('📅 Article date debugging:', {
        created_at: fetchedArticle.created_at,
        published_at: fetchedArticle.published_at,
        created_at_type: typeof fetchedArticle.created_at,
        published_at_type: typeof fetchedArticle.published_at,
        created_at_parsed: fetchedArticle.created_at ? new Date(fetchedArticle.created_at) : null,
        published_at_parsed: fetchedArticle.published_at ? new Date(fetchedArticle.published_at) : null
      });
      setArticle(fetchedArticle);
      
    } catch (err) {
      console.error('💥 Error loading article:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };

  const getArticleUrl = () => {
    if (!article) return `https://transfersdaily.com/en/article/loading-${articleId}`;
    
    // Try to get slug from translations (English first, then any available)
    let slug = '';
    if (article.translations?.en?.slug) {
      slug = article.translations.en.slug;
    } else if (article.slug) {
      slug = article.slug;
    } else {
      // Generate slug from title as fallback
      slug = generateSlug(article.title);
    }
    
    // Use slug instead of UUID for the URL
    return `https://transfersdaily.com/en/article/${slug}`;
  };

  const generateHashtags = () => {
    if (!article) return [];
    
    const hashtags = [];
    
    // Add player name (remove spaces and special characters)
    if (article.player_name) {
      const playerTag = article.player_name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(playerTag);
    }
    
    // Add clubs
    if (article.from_club) {
      const fromClubTag = article.from_club.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(fromClubTag);
    }
    if (article.to_club && article.to_club !== article.from_club) {
      const toClubTag = article.to_club.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(toClubTag);
    }
    
    // Add league
    if (article.league) {
      const leagueTag = article.league.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(leagueTag);
    }
    
    // Add transfer status
    if (article.transfer_status) {
      hashtags.push(`${article.transfer_status}Transfer`);
    }
    
    // Add general hashtags
    hashtags.push('Football', 'TransfersDaily', 'TransferNews');
    
    return hashtags.slice(0, 8); // Limit to 8 hashtags
  };

  const handleTwitterPost = () => {
    if (!article) return;
    
    const hashtags = generateHashtags();
    const tweetText = `${article.title}\n\n${getArticleUrl()}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;
    
    // Twitter Web Intent URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    // Open in new tab
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleViewArticle = () => {
    window.open(getArticleUrl(), '_blank');
  };

  const handleBackToDrafts = () => {
    router.push('/admin/articles/drafts');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">{error || 'Article not found'}</p>
            <Button onClick={handleBackToDrafts}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Drafts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Article Published Successfully!</h1>
            <p className="text-muted-foreground">Your article is now live and visible to readers</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground font-bold">Published Article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{article.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{article.category}</Badge>
                  {article.transfer_status && (
                    <Badge variant="outline">{article.transfer_status}</Badge>
                  )}
                </div>
              </div>

              {article.image_url && (
                <div>
                  <Image 
                    src={article.image_url} 
                    alt={article.title}
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="font-medium text-foreground">
                    {(() => {
                      const publishedAt = article.published_at;
                      const createdAt = article.created_at;
                      
                      // Try published_at first, then created_at
                      const dateToUse = publishedAt || createdAt;
                      
                      if (!dateToUse) {
                        return 'Date not available';
                      }
                      
                      try {
                        const date = new Date(dateToUse);
                        // Check if date is valid
                        if (isNaN(date.getTime())) {
                          return 'Invalid date';
                        }
                        
                        return date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      } catch (error) {
                        console.error('Date parsing error:', error);
                        return 'Date parsing error';
                      }
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">URL:</span>
                  <span className="font-medium text-primary break-all text-xs">
                    {getArticleUrl()}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  onClick={handleViewArticle}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Live Article
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Your Article
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your published article on social media to reach more readers.
              </p>

              {/* Twitter Preview */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">TD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-foreground">TransfersDaily</span>
                      <span className="text-muted-foreground text-sm">@transfersdaily</span>
                    </div>
                    <div className="text-sm mb-3 break-words">
                      <p className="mb-2 text-foreground">{article.title}</p>
                      <p className="text-primary break-all text-xs">{getArticleUrl()}</p>
                    </div>
                    <div className="text-primary text-sm mb-3 break-words">
                      {generateHashtags().map(tag => `#${tag}`).join(' ')}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTwitterPost}
                className="w-full bg-black hover:bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 text-white flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Post to Twitter
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Opens Twitter with your content pre-filled
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleBackToDrafts}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
