'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Twitter, 
  Calendar,
  Sparkles,
  Copy,
  ExternalLink
} from 'lucide-react';
import { API_CONFIG } from '@/lib/config';
import { getAuthHeaders } from '@/lib/api';
import { locales, localeNames, type Locale } from '@/lib/i18n';

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
  title: string;
  content: string;
  category: string;
  player_name?: string;
  from_club?: string;
  to_club?: string;
  league?: string;
  transfer_status?: string;
  image_url?: string;
  slug?: string;
  translations?: {
    [key: string]: {
      title: string;
      content: string;
      slug: string;
      meta_description: string;
    };
  };
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  maxChars: number;
  customMessage: string;
  hashtags: string[];
  scheduledTime?: string;
}

interface SocialMediaState {
  platforms: SocialPlatform[];
  publishNow: boolean;
  scheduledDate: string;
  scheduledTime: string;
}

const initialPlatforms: SocialPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: <Twitter className="w-5 h-5 text-blue-500" />,
    enabled: true,
    maxChars: 280,
    customMessage: '', // Will be populated with article title + URL
    hashtags: []
  }
];

export default function SocialMediaStep({ articleId }: { articleId: string }) {
  const [socialState, setSocialState] = useState<SocialMediaState>({
    platforms: initialPlatforms,
    publishNow: true,
    scheduledDate: '',
    scheduledTime: ''
  });
  
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newHashtag, setNewHashtag] = useState('');

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  // Auto-update Twitter message when article loads
  useEffect(() => {
    if (article) {
      const twitterMessage = `${article.title}\n\n${getArticleUrl()}`;
      
      setSocialState(prev => ({
        ...prev,
        platforms: prev.platforms.map(platform =>
          platform.id === 'twitter'
            ? { ...platform, customMessage: twitterMessage }
            : platform
        )
      }));
      
      // Auto-generate hashtags
      generateHashtags(article);
    }
  }, [article]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔍 Loading article for social media:', articleId);
      
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
      
      const articleData = {
        title: fetchedArticle.title || '',
        content: fetchedArticle.content || '',
        category: fetchedArticle.category || 'Transfer',
        player_name: fetchedArticle.player_name || '',
        from_club: fetchedArticle.from_club || '',
        to_club: fetchedArticle.to_club || '',
        league: fetchedArticle.league || '',
        transfer_status: fetchedArticle.transfer_status || '',
        image_url: fetchedArticle.image_url || null,
        slug: fetchedArticle.slug || '',
        translations: fetchedArticle.translations || {}
      };
      
      setArticle(articleData);
      
      // Auto-generate hashtags when article loads
      generateHashtags(articleData);
      
    } catch (err) {
      console.error('💥 Error loading article:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };

  const generateHashtags = (articleData: ArticleData) => {
    const hashtags: string[] = [];
    
    // Add player name (remove spaces and special characters)
    if (articleData.player_name) {
      const playerTag = articleData.player_name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(playerTag);
    }
    
    // Add clubs (remove spaces and special characters)
    if (articleData.from_club) {
      const fromClubTag = articleData.from_club.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(fromClubTag);
    }
    if (articleData.to_club && articleData.to_club !== articleData.from_club) {
      const toClubTag = articleData.to_club.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(toClubTag);
    }
    
    // Add league (remove spaces and special characters)
    if (articleData.league) {
      const leagueTag = articleData.league.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      hashtags.push(leagueTag);
    }
    
    // Add transfer status
    if (articleData.transfer_status) {
      hashtags.push(`${articleData.transfer_status}Transfer`);
    }
    
    // Add category
    if (articleData.category) {
      hashtags.push(articleData.category);
    }
    
    // Add general football hashtags
    hashtags.push('Football', 'TransfersDaily', 'TransferNews');
    
    // Update the Twitter platform with generated hashtags
    setSocialState(prev => ({
      ...prev,
      platforms: prev.platforms.map(platform =>
        platform.id === 'twitter'
          ? { ...platform, hashtags }
          : platform
      )
    }));
  };

  const togglePlatform = (platformId: string) => {
    setSocialState(prev => ({
      ...prev,
      platforms: prev.platforms.map(platform =>
        platform.id === platformId
          ? { ...platform, enabled: !platform.enabled }
          : platform
      )
    }));
  };

  const updatePlatformMessage = (platformId: string, message: string) => {
    setSocialState(prev => ({
      ...prev,
      platforms: prev.platforms.map(platform =>
        platform.id === platformId
          ? { ...platform, customMessage: message }
          : platform
      )
    }));
  };

  const addHashtag = (platformId: string, hashtag: string) => {
    if (!hashtag.trim()) return;
    
    const cleanHashtag = hashtag.replace('#', '').trim();
    
    setSocialState(prev => ({
      ...prev,
      platforms: prev.platforms.map(platform =>
        platform.id === platformId
          ? { 
              ...platform, 
              hashtags: [...platform.hashtags, cleanHashtag]
            }
          : platform
      )
    }));
    
    setNewHashtag('');
  };

  const removeHashtag = (platformId: string, hashtagIndex: number) => {
    setSocialState(prev => ({
      ...prev,
      platforms: prev.platforms.map(platform =>
        platform.id === platformId
          ? { 
              ...platform, 
              hashtags: platform.hashtags.filter((_, index) => index !== hashtagIndex)
            }
          : platform
      )
    }));
  };

  const getCharacterCount = (platform: SocialPlatform) => {
    const hashtagText = platform.hashtags.map(tag => `#${tag}`).join(' ');
    const totalText = `${platform.customMessage} ${hashtagText}`.trim();
    return totalText.length;
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

  // Generate Twitter post for specific language
  const generateTwitterPost = (locale: string = 'en') => {
    if (!article) return '';
    
    let title = article.title;
    let articleUrl = getArticleUrl();
    
    // Use translation if available
    if (locale !== 'en' && article.translations?.[locale]) {
      title = article.translations[locale].title;
      // Update URL to use localized version
      const slug = article.translations[locale].slug || generateSlug(title);
      articleUrl = `https://transfersdaily.com/${locale}/article/${slug}`;
    } else if (locale !== 'en') {
      // If no translation available, use localized URL with English slug
      const slug = article.slug || generateSlug(article.title);
      articleUrl = `https://transfersdaily.com/${locale}/article/${slug}`;
    }
    
    // Get hashtags from the current Twitter platform
    const twitterPlatform = socialState.platforms.find(p => p.id === 'twitter');
    const hashtags = twitterPlatform?.hashtags || [];
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
    
    return `${title}\n\n${articleUrl}\n\n${hashtagString}`;
  };

  const copyToClipboard = async (text: string, locale: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Simple feedback
      console.log(`Copied ${locale.toUpperCase()} Twitter post to clipboard`);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleTwitterPost = (locale: string = 'en') => {
    const tweetText = generateTwitterPost(locale);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Social Media Platforms */}
      <div className="space-y-4">
        {socialState.platforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={platform.enabled}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                  {platform.icon}
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            {platform.enabled && (
              <CardContent className="space-y-4">
                {/* Custom Message */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Post Content
                  </label>
                  <Textarea
                    value={platform.customMessage}
                    onChange={(e) => updatePlatformMessage(platform.id, e.target.value)}
                    placeholder="Loading article title..."
                    rows={4}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      Title and link will create a rich preview
                    </span>
                    <span className={`text-xs ${
                      getCharacterCount(platform) > platform.maxChars 
                        ? 'text-red-500' 
                        : 'text-muted-foreground'
                    }`}>
                      {getCharacterCount(platform)}/{platform.maxChars}
                    </span>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Hashtags</label>
                    <Button
                      onClick={() => article && generateHashtags(article)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      Regenerate
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      placeholder="Add custom hashtag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addHashtag(platform.id, newHashtag);
                        }
                      }}
                    />
                    <Button
                      onClick={() => addHashtag(platform.id, newHashtag)}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {platform.hashtags.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        #{hashtag}
                        <button
                          onClick={() => removeHashtag(platform.id, index)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Multi-Language Twitter Posts Preview */}
                <div className="border rounded-lg p-4 bg-muted">
                  <p className="text-sm font-medium mb-4">Multi-Language Twitter Posts:</p>
                  
                  <div className="space-y-3">
                    {locales.map((locale) => {
                      const twitterPost = generateTwitterPost(locale);
                      const hasTranslation = locale === 'en' || (article && article.translations && article.translations[locale]);
                      
                      return (
                        <div key={locale} className="bg-white border rounded-lg p-3">
                          {/* Language Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{localeNames[locale].flag}</span>
                              <span className="font-semibold text-xs">
                                {localeNames[locale].nativeName}
                              </span>
                              {!hasTranslation && locale !== 'en' && (
                                <Badge variant="secondary" className="text-xs py-0 px-1">
                                  English
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(twitterPost, locale)}
                                className="text-xs h-6 px-2"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleTwitterPost(locale)}
                                className="bg-black hover:bg-gray-800 text-white text-xs h-6 px-2"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Tweet
                              </Button>
                            </div>
                          </div>

                          {/* Twitter Preview */}
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Twitter className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="font-semibold text-xs">TransfersDaily</span>
                                <span className="text-gray-500 text-xs">@transfersdaily_{locale}</span>
                              </div>
                              <div className="text-xs break-words whitespace-pre-line text-gray-800">
                                {twitterPost}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Each language has its own Twitter post ready to copy and paste!
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Publishing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="publish-now"
              checked={socialState.publishNow}
              onCheckedChange={(checked) => 
                setSocialState(prev => ({ ...prev, publishNow: checked as boolean }))
              }
            />
            <label htmlFor="publish-now" className="text-sm font-medium">
              Publish immediately
            </label>
          </div>
          
          {!socialState.publishNow && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  type="date"
                  value={socialState.scheduledDate}
                  onChange={(e) => 
                    setSocialState(prev => ({ ...prev, scheduledDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Input
                  type="time"
                  value={socialState.scheduledTime}
                  onChange={(e) => 
                    setSocialState(prev => ({ ...prev, scheduledTime: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
