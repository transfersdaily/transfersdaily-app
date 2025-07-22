'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Image, 
  Globe, 
  Eye,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { API_CONFIG, getApiUrl } from '@/lib/config';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ArticleData {
  title: string;
  content: string;
  category: string;
  player_name?: string;
  from_club?: string;
  to_club?: string;
  league?: string;
  transfer_status?: string;
  featuredImage?: string;
  translations: {
    [key: string]: {
      title: string;
      content: string;
    };
  };
}

export default function ContentEditingStep({ 
  articleId, 
  onSave 
}: { 
  articleId: string;
  onSave?: (data: ArticleData) => void;
}) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' }
  ];

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  // Update word count when content changes
  useEffect(() => {
    if (article && article.translations[activeLanguage]) {
      const content = article.translations[activeLanguage].content || '';
      const textContent = content.replace(/[#*_`\[\]()]/g, '').trim();
      setWordCount(textContent.split(' ').filter(word => word.length > 0).length);
    }
  }, [article?.translations, activeLanguage]);

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
      
      const fetchedArticle = data.data.article;
      console.log('✅ Found article:', fetchedArticle.title);
      
      // Initialize translations structure for the 5 languages
      let translations: Record<string, any> = {
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
        console.log('📝 Found translations in article:', fetchedArticle.translations);
        
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
        title: fetchedArticle.title || '',
        content: fetchedArticle.content || '',
        category: fetchedArticle.category || 'Transfer',
        player_name: fetchedArticle.player_name || '',
        from_club: fetchedArticle.from_club || '',
        to_club: fetchedArticle.to_club || '',
        league: fetchedArticle.league || '',
        transfer_status: fetchedArticle.transfer_status || '',
        translations: translations
      };
      
      console.log('🎯 Final article data for publishing UI:', articleData);
      setArticle(articleData);
      setFeaturedImage(fetchedArticle.image_url || null);
      
      console.log('✅ Article loaded successfully for publishing workflow');
      
    } catch (err) {
      console.error('💥 Error loading article:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTranslation = (field: 'title' | 'content', value: string) => {
    if (!article) return;
    
    setArticle(prev => ({
      ...prev!,
      translations: {
        ...prev!.translations,
        [activeLanguage]: {
          ...prev!.translations[activeLanguage],
          [field]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    console.log('📁 File selected:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      console.log('🚀 Starting image upload...');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('articleId', articleId);
      formData.append('type', 'featured');
      
      // Use the correct API endpoint
      const uploadUrl = getApiUrl(API_CONFIG.endpoints.admin.media.upload);
      console.log('📤 Uploading to:', uploadUrl);
      console.log('📦 FormData contents:', {
        file: file.name,
        articleId: articleId,
        type: 'featured'
      });
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });
      
      console.log('📡 Upload response status:', uploadResponse.status);
      console.log('📡 Upload response ok:', uploadResponse.ok);
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ Upload error response:', errorText);
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      }
      
      const uploadData = await uploadResponse.json();
      console.log('✅ Upload response data:', uploadData);
      
      if (uploadData.success && uploadData.data?.url) {
        console.log('🖼️ Setting featured image URL:', uploadData.data.url);
        setFeaturedImage(uploadData.data.url);
        setHasUnsavedChanges(true);
        
        // Update article in database with new image URL
        await updateArticleImage(uploadData.data.url);
        
        // Show success message
        alert('Image uploaded successfully!');
      } else {
        throw new Error('Upload succeeded but no URL returned');
      }
      
    } catch (err) {
      console.error('💥 Error uploading image:', err);
      alert(`Failed to upload image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const updateArticleImage = async (imageUrl: string) => {
    try {
      const url = getApiUrl(`${API_CONFIG.endpoints.admin.articles}/${articleId}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl
        }),
      });
      
      if (response.ok) {
        console.log('✅ Article image updated in database');
      }
    } catch (err) {
      console.error('Error updating article image:', err);
    }
  };

  const handleSave = async () => {
    if (!article) return;
    
    try {
      setIsSaving(true);
      console.log('💾 Saving article changes...');
      
      // Save article data
      const url = getApiUrl(`${API_CONFIG.endpoints.admin.articles}/${articleId}`);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.translations[activeLanguage]?.title || article.title,
          content: article.translations[activeLanguage]?.content || article.content,
          // Add other fields as needed
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Article saved successfully:', data);
      
      setHasUnsavedChanges(false);
      
      // Call parent save handler if provided
      if (onSave) {
        onSave(article);
      }
      
    } catch (err) {
      console.error('💥 Error saving article:', err);
      alert(`Failed to save article: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getLanguageCompletionStats = () => {
    if (!article) return { completed: 0, total: 5 };
    
    let completed = 0;
    languages.forEach(lang => {
      const translation = article.translations[lang.code];
      if (translation && translation.title && translation.content) {
        completed++;
      }
    });
    
    return { completed, total: 5 };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!article) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Article not found</AlertDescription>
      </Alert>
    );
  }

  const stats = getLanguageCompletionStats();
  const currentTranslation = article.translations[activeLanguage] || { title: '', content: '' };

  return (
    <div className="flex gap-8">
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Language Tabs */}
        <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
          <TabsList className="grid w-full grid-cols-5">
            {languages.map((lang) => {
              const translation = article.translations[lang.code];
              const isComplete = translation && translation.title && translation.content;
              
              return (
                <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                  {isComplete && <CheckCircle className="h-3 w-3 text-green-500" />}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {languages.map((lang) => (
            <TabsContent key={lang.code} value={lang.code} className="space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle>Title ({lang.name})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={currentTranslation.title}
                    onChange={(e) => updateTranslation('title', e.target.value)}
                    placeholder={`Enter title in ${lang.name}...`}
                    className="text-lg"
                  />
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content ({lang.name})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div data-color-mode="light">
                    <MDEditor
                      value={currentTranslation.content}
                      onChange={(value) => updateTranslation('content', value || '')}
                      preview="edit"
                      height={400}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Unsaved changes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 space-y-6">
        {/* Content Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Languages</span>
              </div>
              <span className="font-semibold">{stats.completed}/{stats.total}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="text-sm">Word Count</span>
              </div>
              <span className="font-semibold">{wordCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Image</span>
              </div>
              <span className="font-semibold">{featuredImage ? '✓' : '✗'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="h-4 w-4" />
              Featured Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredImage && (
              <div className="space-y-2">
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      console.error('Failed to load featured image:', featuredImage);
                      const img = e.currentTarget;
                      
                      // Try image proxy as fallback
                      if (!img.src.includes('/api/image-proxy')) {
                        console.log('🔄 Trying image proxy fallback...');
                        img.src = `/api/image-proxy?url=${encodeURIComponent(featuredImage)}`;
                        return;
                      }
                      
                      // If proxy also fails, try placeholder
                      if (!img.src.includes('placeholder')) {
                        console.log('🔄 Trying placeholder fallback...');
                        img.src = '/placeholder-image.svg';
                        img.alt = 'Image not available';
                        return;
                      }
                      
                      // If everything fails, show error message
                      console.error('❌ All image loading attempts failed');
                      img.style.display = 'none';
                      
                      // Create error message
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'w-full h-32 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center text-red-600';
                      errorDiv.innerHTML = `
                        <div class="text-center">
                          <div class="text-2xl mb-2">⚠️</div>
                          <div class="text-sm font-medium">Image failed to load</div>
                          <div class="text-xs mt-1 opacity-75">Check console for details</div>
                        </div>
                      `;
                      img.parentNode?.replaceChild(errorDiv, img);
                    }}
                    onLoad={() => {
                      console.log('✅ Featured image loaded successfully:', featuredImage);
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uploaded
                    </Badge>
                  </div>
                </div>
                
                {/* Debug info */}
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded border">
                  <div className="font-medium mb-1">Image URL:</div>
                  <div className="break-all font-mono">{featuredImage}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => window.open(featuredImage, '_blank')}
                      className="text-blue-600 hover:underline"
                    >
                      Open in new tab
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(featuredImage)}
                      className="text-blue-600 hover:underline"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Uploading image...
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
              />
              <Button
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={isUploading}
                variant="outline"
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {featuredImage ? 'Change Image' : 'Upload Image'}
                  </>
                )}
              </Button>
              
              {!featuredImage && !isUploading && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Supported: JPG, PNG, GIF, WebP (max 5MB)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
