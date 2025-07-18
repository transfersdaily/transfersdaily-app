'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Twitter, 
  Calendar,
  Clock,
  Hash,
  Sparkles
} from 'lucide-react';
import { API_CONFIG } from '@/lib/config';

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
      console.log('🔍 Loading article for social media:', articleId);
      
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
      
      const articleData = {
        title: fetchedArticle.title || '',
        content: fetchedArticle.content || '',
        category: fetchedArticle.category || 'Transfer',
        player_name: fetchedArticle.player_name || '',
        from_club: fetchedArticle.from_club || '',
        to_club: fetchedArticle.to_club || '',
        league: fetchedArticle.league || '',
        transfer_status: fetchedArticle.transfer_status || '',
        image_url: fetchedArticle.image_url || null
      };
      
      setArticle(articleData);
      
      // Auto-generate hashtags when article loads
      generateHashtags(articleData);
      
    } catch (err) {
      console.error('💥 Error loading article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHashtags = (articleData: ArticleData) => {
    const hashtags = [];
    
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
    // Generate the public URL for the article
    return `https://transfersdaily.com/articles/${articleId}`;
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

                {/* Single Combined Preview */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-medium mb-3">Social Media Preview:</p>
                  
                  {/* Twitter Post Preview */}
                  <div className="bg-white border rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Twitter className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">TransfersDaily</span>
                          <span className="text-gray-500 text-sm">@transfersdaily</span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap mb-3">
                          {platform.customMessage}
                        </div>
                        <div className="text-blue-500 text-sm mb-2">
                          {platform.hashtags.map(tag => `#${tag}`).join(' ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Twitter Card Preview */}
                  {article && (
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <div className="flex">
                        {article.image_url && (
                          <img 
                            src={article.image_url} 
                            alt="Article preview" 
                            className="w-24 h-24 object-cover"
                          />
                        )}
                        <div className="flex-1 p-3">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-1">{article.title}</h3>
                          <p className="text-xs text-gray-500 mb-1">transfersdaily.com</p>
                          <p className="text-xs text-gray-400">{getArticleUrl()}</p>
                        </div>
                      </div>
                    </div>
                  )}
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
