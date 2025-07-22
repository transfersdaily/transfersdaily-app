'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Smartphone, 
  Search, 
  Twitter,
  Facebook,
  Instagram,
  Eye,
  Clock,
  User,
  Globe
} from 'lucide-react';
import { API_CONFIG, getApiUrl } from '@/lib/config';
import { ImageDebugger } from '@/components/ImageDebugger';

interface ArticleData {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  image_url?: string; // Add image URL field
  translations: {
    [key: string]: {
      title: string;
      content: string;
      meta_description: string;
    };
  };
}

interface PreviewData {
  title: string;
  content: string;
  metaDescription: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
}

export default function ContentPreviewStep({ articleId }: { articleId: string }) {
  const [activePreview, setActivePreview] = useState('website');
  const [deviceView, setDeviceView] = useState('desktop');
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadArticle();
  }, [articleId]);
  
  const loadArticle = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Loading article with ID:', articleId);
      
      const url = getApiUrl(`${API_CONFIG.endpoints.admin.articles}/${articleId}`);
      console.log('🔍 Loading article from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        
        let errorText;
        try {
          errorText = await response.text();
          console.error('Error response body:', errorText);
        } catch (e) {
          console.error('Could not read error response body');
        }
        
        throw new Error(`Failed to load article: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (!data.success || !data.data?.article) {
        console.error('❌ Invalid response structure');
        throw new Error('Article not found in response');
      }
      
      const foundArticle = data.data.article;
      console.log('✅ Found article:', foundArticle.title);
      console.log('🖼️ Image URL from backend:', foundArticle.image_url);
      console.log('🖼️ Image URL type:', typeof foundArticle.image_url);
      console.log('🖼️ Image URL length:', foundArticle.image_url?.length);
      
      // Test if the image URL is accessible
      if (foundArticle.image_url) {
        console.log('🔍 Testing image URL accessibility...');
        
        // Test with different methods
        const testMethods = ['HEAD', 'GET'];
        
        for (const method of testMethods) {
          try {
            const response = await fetch(foundArticle.image_url, { 
              method,
              mode: 'cors',
              cache: 'no-cache'
            });
            console.log(`🖼️ ${method} test - Status:`, response.status, response.statusText);
            console.log(`🖼️ ${method} test - Headers:`, Object.fromEntries(response.headers.entries()));
            
            if (method === 'GET' && response.ok) {
              const contentLength = response.headers.get('content-length');
              console.log(`🖼️ Content length: ${contentLength} bytes`);
            }
          } catch (error) {
            console.error(`❌ ${method} test failed:`, error);
          }
        }
        
        // Test with Image constructor
        const testImg = new Image();
        testImg.crossOrigin = 'anonymous';
        testImg.onload = () => {
          console.log('✅ Image constructor test passed:', {
            width: testImg.naturalWidth,
            height: testImg.naturalHeight,
            complete: testImg.complete
          });
        };
        testImg.onerror = (error) => {
          console.error('❌ Image constructor test failed:', error);
        };
        testImg.src = foundArticle.image_url;
      }
      
      // Initialize translations structure
      const translations: Record<string, any> = {
        en: {
          title: foundArticle.title || '',
          content: foundArticle.content || '',
          meta_description: foundArticle.meta_description || ''
        },
        es: { title: '', content: '', meta_description: '' },
        fr: { title: '', content: '', meta_description: '' },
        de: { title: '', content: '', meta_description: '' },
        it: { title: '', content: '', meta_description: '' }
      };
      
      // Merge existing translations if available
      if (foundArticle.translations && typeof foundArticle.translations === 'object') {
        console.log('📝 Found translations in article:', foundArticle.translations);
        
        Object.keys(foundArticle.translations).forEach(langCode => {
          if (translations[langCode] && foundArticle.translations[langCode]) {
            translations[langCode] = {
              ...translations[langCode],
              ...foundArticle.translations[langCode]
            };
          }
        });
      }
      
      setArticle({
        id: foundArticle.uuid,
        title: foundArticle.title || '',
        content: foundArticle.content || '',
        category: foundArticle.category || 'Transfer',
        tags: [], // Tags will be handled in social media step
        created_at: foundArticle.created_at,
        image_url: foundArticle.image_url, // Include image URL
        translations: translations
      });
      
      console.log('✅ Article loaded successfully for preview');
      
    } catch (err) {
      console.error('💥 Error loading article:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCurrentContent = (): PreviewData => {
    if (!article) {
      return {
        title: 'Loading...',
        content: 'Loading article content...',
        metaDescription: '',
        category: 'Transfer',
        tags: [],
        publishDate: new Date().toLocaleDateString(),
        readTime: 0
      };
    }
    
    let currentData;
    if (activeLanguage === 'en') {
      currentData = {
        title: article.title,
        content: article.content,
        metaDescription: article.translations['en']?.meta_description || ''
      };
    } else {
      const translation = article.translations[activeLanguage];
      currentData = {
        title: translation?.title || article.title,
        content: translation?.content || article.content,
        metaDescription: translation?.meta_description || ''
      };
    }
    
    const wordCount = currentData.content.replace(/[#*_`\[\]()]/g, '').split(' ').filter(word => word.length > 0).length;
    const readTime = Math.ceil(wordCount / 200);
    
    return {
      title: currentData.title,
      content: currentData.content,
      metaDescription: currentData.metaDescription,
      category: article.category,
      tags: article.tags,
      publishDate: new Date(article.created_at).toLocaleDateString(),
      readTime: readTime
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadArticle}>Retry</Button>
      </div>
    );
  }
  
  const previewData = getCurrentContent();

  const renderWebsitePreview = () => (
    <div className={`mx-auto transition-all duration-300 ${
      deviceView === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
    }`}>
      <article className="bg-white rounded-lg shadow-sm border">
        {/* Article Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Badge variant="secondary">{previewData.category}</Badge>
            <span>•</span>
            <span>{previewData.publishDate}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{previewData.readTime} min read</span>
            </div>
          </div>
          <h1 className={`font-bold text-slate-900 mb-4 ${
            deviceView === 'mobile' ? 'text-2xl' : 'text-4xl'
          }`}>
            {previewData.title}
          </h1>
          <div className="flex flex-wrap gap-1 mb-4">
            {previewData.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="w-4 h-4" />
            <span>By TransfersDaily</span>
            <span>•</span>
            <span className="capitalize">{activeLanguage === 'en' ? 'English' : activeLanguage}</span>
          </div>
        </div>

        {/* Featured Image */}
        {article?.image_url ? (
          <div className="relative">
            <img 
              src={article.image_url} 
              alt={previewData.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                console.error('Failed to load featured image:', article.image_url);
                const img = e.currentTarget;
                
                // Create a fallback div
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'w-full h-64 bg-slate-100 flex items-center justify-center';
                fallbackDiv.innerHTML = `
                  <div class="text-center text-slate-500">
                    <div class="w-16 h-16 bg-slate-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <p>Image failed to load</p>
                    <p class="text-sm">URL: ${article.image_url}</p>
                  </div>
                `;
                img.parentNode?.replaceChild(fallbackDiv, img);
              }}
              onLoad={() => {
                console.log('✅ Preview image loaded successfully:', article.image_url);
              }}
            />
            <div className="absolute bottom-4 right-4">
              <Badge className="bg-black/50 text-white">
                Featured Image
              </Badge>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 h-64 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Eye className="w-8 h-8" />
              </div>
              <p>No Featured Image</p>
              <p className="text-sm">Upload an image in the Edit step</p>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <div 
              className="text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: previewData.content.replace(/\n/g, '<br>') }}
            />
          </div>
        </div>
      </article>
    </div>
  );

  const renderSEOPreview = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-medium mb-4">Search Engine Preview</h3>
        <div className="space-y-4">
          {/* Google Search Result */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-green-700">transfersdaily.com</span>
            </div>
            <h4 className="text-blue-600 text-lg hover:underline cursor-pointer mb-1">
              {previewData.title}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {previewData.metaDescription || 'No meta description available'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialPreview = (platform: string) => {
    const platformConfig = {
      twitter: {
        icon: <Twitter className="w-5 h-5 text-blue-500" />,
        name: 'Twitter/X',
        bgColor: 'bg-slate-50',
        maxChars: 280
      },
      facebook: {
        icon: <Facebook className="w-5 h-5 text-blue-600" />,
        name: 'Facebook',
        bgColor: 'bg-blue-50',
        maxChars: 500
      },
      instagram: {
        icon: <Instagram className="w-5 h-5 text-pink-500" />,
        name: 'Instagram',
        bgColor: 'bg-pink-50',
        maxChars: 2200
      }
    };

    const config = platformConfig[platform as keyof typeof platformConfig];
    const postText = `🚨 BREAKING: ${previewData.title}\n\n${previewData.metaDescription}\n\n${previewData.tags.map(tag => `#${tag}`).join(' ')}`;

    return (
      <div className="max-w-md mx-auto">
        <div className={`${config.bgColor} p-4 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-3">
            {config.icon}
            <span className="font-medium">{config.name} Preview</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-medium text-sm">TransfersDaily</p>
                <p className="text-xs text-slate-500">@transfersdaily</p>
              </div>
            </div>
            
            <p className="text-sm mb-3">{postText}</p>
            
            {/* Link Preview Card */}
            <div className="border rounded-lg overflow-hidden">
              {article?.image_url ? (
                <img 
                  src={article.image_url} 
                  alt={previewData.title}
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    console.error('Failed to load social preview image:', article.image_url);
                    const img = e.currentTarget;
                    img.style.display = 'none';
                    // Show the placeholder
                    const placeholder = img.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                  onLoad={() => {
                    console.log('✅ Social preview image loaded successfully');
                    // Hide the placeholder
                    const img = e.currentTarget;
                    const placeholder = img.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'none';
                    }
                  }}
                />
              ) : null}
              <div className={`bg-slate-100 h-32 items-center justify-center ${article?.image_url ? 'hidden' : 'flex'}`}>
                <Eye className="w-8 h-8 text-slate-400" />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm line-clamp-2">{previewData.title}</p>
                <p className="text-xs text-slate-500 mt-1">transfersdaily.com</p>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 mt-2">
            Characters: {postText.length}/{config.maxChars}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Debug Component - Remove in production */}
      {article?.image_url && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">🐛 Image Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageDebugger imageUrl={article.image_url} />
          </CardContent>
        </Card>
      )}
      
      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Preview Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language Selector */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Preview Language
            </label>
            <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="es">Español</TabsTrigger>
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="de">Deutsch</TabsTrigger>
                <TabsTrigger value="it">Italiano</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Preview Type Selector */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Preview Type
            </label>
            <Tabs value={activePreview} onValueChange={setActivePreview}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="website">Website</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Preview Content */}
      <div className="min-h-[600px]">
        {activePreview === 'website' && (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              <Button
                variant={deviceView === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceView('desktop')}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={deviceView === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceView('mobile')}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Mobile
              </Button>
            </div>
            {renderWebsitePreview()}
          </div>
        )}

        {activePreview === 'seo' && renderSEOPreview()}

        {activePreview === 'social' && (
          <div className="space-y-6">
            <Tabs defaultValue="twitter">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
              </TabsList>
              <TabsContent value="twitter">{renderSocialPreview('twitter')}</TabsContent>
              <TabsContent value="facebook">{renderSocialPreview('facebook')}</TabsContent>
              <TabsContent value="instagram">{renderSocialPreview('instagram')}</TabsContent>
            </Tabs>
          </div>
        )}

        {activePreview === 'performance' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1.2s</div>
                    <div className="text-sm text-slate-600">Load Time</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">95</div>
                    <div className="text-sm text-slate-600">Mobile Score</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">98</div>
                    <div className="text-sm text-slate-600">SEO Score</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">92</div>
                    <div className="text-sm text-slate-600">Accessibility</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}