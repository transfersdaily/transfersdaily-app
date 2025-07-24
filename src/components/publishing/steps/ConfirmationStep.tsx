'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft,
  Eye
} from 'lucide-react';
import { API_CONFIG } from '@/lib/config';
import ReactMarkdown from 'react-markdown';

// Helper function to generate slug from title
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
  slug?: string;
  translations: {
    [key: string]: {
      title: string;
      content: string;
      slug?: string;
      meta_description?: string;
    };
  };
}

export default function ConfirmationStep({ 
  articleId, 
  onConfirmationChange 
}: { 
  articleId: string;
  onConfirmationChange?: (allConfirmed: boolean) => void;
}) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState({
    contentReviewed: false,
    socialConfigured: false,
    finalApproval: false
  });
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  // Notify parent when confirmation state changes
  useEffect(() => {
    const allConfirmed = Object.values(confirmations).every(Boolean);
    if (onConfirmationChange) {
      onConfirmationChange(allConfirmed);
    }
  }, [confirmations]); // Remove onConfirmationChange from dependencies to prevent infinite loop

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Loading article for confirmation:', articleId);
      
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.admin.articles}/${articleId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
      
      // Initialize translations structure
      const translations: Record<string, any> = {
        en: {
          title: fetchedArticle.title || '',
          content: fetchedArticle.content || ''
        },
        es: { title: '', content: '' },
        fr: { title: '', content: '' },
        de: { title: '', content: '' },
        it: { title: '', content: '' }
      };
      
      // Merge existing translations if available
      if (fetchedArticle.translations && typeof fetchedArticle.translations === 'object') {
        Object.keys(fetchedArticle.translations).forEach(langCode => {
          if (translations[langCode] && fetchedArticle.translations[langCode]) {
            translations[langCode] = {
              ...translations[langCode],
              ...fetchedArticle.translations[langCode]
            };
          }
        });
      }
      
      const articleData = {
        uuid: fetchedArticle.uuid,
        title: fetchedArticle.title || '',
        content: fetchedArticle.content || '',
        category: fetchedArticle.category || 'Transfer',
        player_name: fetchedArticle.player_name || '',
        from_club: fetchedArticle.from_club || '',
        to_club: fetchedArticle.to_club || '',
        league: fetchedArticle.league || '',
        transfer_status: fetchedArticle.transfer_status || '',
        image_url: fetchedArticle.image_url || null,
        created_at: fetchedArticle.created_at,
        translations: translations
      };
      
      setArticle(articleData);
      
    } catch (err) {
      console.error('💥 Error loading article:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationChange = (key: string, checked: boolean) => {
    setConfirmations(prev => ({ ...prev, [key]: checked }));
  };

  const allConfirmed = Object.values(confirmations).every(Boolean);

  const handleTwitterPost = () => {
    if (!article) return;
    
    const hashtags = generateHashtags();
    const tweetText = `${article.title}\n\n${getArticleUrl()}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;
    
    // Twitter Web Intent URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    // Open in new tab
    window.open(twitterUrl, '_blank', 'width=550,height=420');
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

  const handleFinish = () => {
    // Route back to drafts page
    window.location.href = '/admin/articles';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!article) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Article not found</AlertDescription>
      </Alert>
    );
  }

  const hashtags = generateHashtags();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="heading text-black font-bold flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Article Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
              {/* Article Header */}
              <div className="mb-3">
                <span className="text-xs text-rose-600 font-medium uppercase tracking-wide">
                  {article.category}
                </span>
                <h1 className="heading text-black font-bold text-lg mt-1 mb-2">
                  {article.title}
                </h1>
                <div className="text-xs text-gray-500 mb-3">
                  {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Featured Image */}
              {article.image_url && (
                <div className="mb-4">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-xs max-w-none text-sm">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Twitter Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="heading text-black font-bold flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Twitter Post */}
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-600">TD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">TransfersDaily</span>
                      <span className="text-gray-500 text-sm">@transfersdaily</span>
                      <span className="text-gray-500 text-sm">·</span>
                      <span className="text-gray-500 text-sm">now</span>
                    </div>
                    <div className="text-sm mb-3 break-words">
                      <p className="mb-2">{article.title}</p>
                      <p className="text-blue-600 break-all">{getArticleUrl()}</p>
                    </div>
                    <div className="text-blue-500 text-sm mb-3 break-words">
                      {hashtags.map(tag => `#${tag}`).join(' ')}
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span>💬 12</span>
                      <span>🔄 45</span>
                      <span>❤️ 128</span>
                      <span>📊 2.1K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Twitter Card Preview */}
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="flex">
                  {article.image_url && (
                    <img 
                      src={article.image_url} 
                      alt="Article preview" 
                      className="w-32 h-32 object-cover"
                    />
                  )}
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{article.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">transfersdaily.com</p>
                    <p className="text-xs text-gray-400">{getArticleUrl()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warnings */}
      {!article.image_url && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> No featured image has been added. This may impact social media sharing.
          </AlertDescription>
        </Alert>
      )}

      {/* Final Confirmation Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="heading text-black font-bold">Final Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="contentReviewed"
                checked={confirmations.contentReviewed}
                onCheckedChange={(checked) => 
                  handleConfirmationChange('contentReviewed', checked as boolean)
                }
                className="mt-1"
              />
              <label htmlFor="contentReviewed" className="text-sm font-medium leading-relaxed">
                I have reviewed the article content and confirm it is accurate and ready for publication
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="socialConfigured"
                checked={confirmations.socialConfigured}
                onCheckedChange={(checked) => 
                  handleConfirmationChange('socialConfigured', checked as boolean)
                }
                className="mt-1"
              />
              <label htmlFor="socialConfigured" className="text-sm font-medium leading-relaxed">
                Social media settings have been configured and are ready for sharing
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="finalApproval"
                checked={confirmations.finalApproval}
                onCheckedChange={(checked) => 
                  handleConfirmationChange('finalApproval', checked as boolean)
                }
                className="mt-1"
              />
              <label htmlFor="finalApproval" className="text-sm font-medium leading-relaxed">
                <strong>I authorize the publication of this article</strong>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
