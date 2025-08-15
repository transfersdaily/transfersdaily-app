import { useState, useCallback, useRef, useEffect } from 'react';
import { getApiUrl, API_CONFIG } from '@/lib/config';
import { getAuthHeaders } from '@/lib/api';

export interface TranslationProgress {
  status: string;
  message: string;
  progress: {
    percentage: number;
    completed: number;
    total: number;
  };
  translations?: Array<{
    language_code: string;
    title: string;
    content_length: number;
    created_at: string;
  }>;
  isComplete: boolean;
  isFailed: boolean;
}

export interface TranslationResult {
  success: boolean;
  data?: {
    articleId: number;
    executionArn: string;
    targetLanguages: string[];
    status: string;
    statusEndpoint: string;
  };
  error?: string;
}

export const useTranslation = () => {
  const [translationStatus, setTranslationStatus] = useState<TranslationProgress | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const maxPollingTime = 5 * 60 * 1000; // 5 minutes
  const pollingFrequency = 20 * 1000; // 20 seconds

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const getStatusMessage = useCallback((status: string): string => {
    const messages: Record<string, string> = {
      'not_started': 'Translation not started',
      'translating': 'AI is translating the article...',
      'saving': 'Saving translations to database...',
      'completed': 'Translation completed successfully!',
      'partial': 'Translation partially completed',
      'failed': 'Translation failed'
    };
    return messages[status] || `Status: ${status}`;
  }, []);

  const checkTranslationStatus = useCallback(async (articleId: string): Promise<TranslationProgress | null> => {
    try {
      console.log(`📊 Checking translation status for article ID: ${articleId}`);
      
      const authHeaders = await getAuthHeaders();
      console.log('🔐 Auth headers for status check:', authHeaders);
      
      const apiUrl = getApiUrl(`/admin/translation-status/${articleId}`);
      console.log('🌐 Status check API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });

      console.log('📥 Status check response status:', response.status);
      console.log('📥 Status check response headers:', [...response.headers.entries()]);
      
      const responseText = await response.text();
      console.log('📥 Raw status check response:', responseText);

      if (!response.ok) {
        console.error('❌ Status check error:', response.status, response.statusText);
        throw new Error(`Failed to check status: ${response.status}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📥 Parsed status check response:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.error('❌ Failed to parse status response as JSON:', e);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get translation status');
      }

      const statusData = data.data;
      
      return {
        status: statusData.translationStatus,
        message: getStatusMessage(statusData.translationStatus),
        progress: statusData.progress,
        translations: statusData.translations,
        isComplete: statusData.isComplete,
        isFailed: statusData.isFailed
      };
    } catch (err) {
      console.error('Error checking translation status:', err);
      return null;
    }
  }, [getStatusMessage]);

  const startTranslation = useCallback(async (
    articleId: string, 
    targetLanguages: string[] = ['es', 'fr', 'de', 'it'],
    articleData?: { title: string; content: string }
  ): Promise<TranslationResult> => {
    try {
      setIsTranslating(true);
      setError(null);
      setTranslationStatus({
        status: 'starting',
        message: 'Starting translation workflow...',
        progress: { percentage: 0, completed: 0, total: targetLanguages.length },
        isComplete: false,
        isFailed: false
      });

      // Validate articleId (can be numeric or UUID)
      if (!articleId || articleId.trim() === '') {
        throw new Error('Article ID is required');
      }
      
      // Check if it's a valid UUID or numeric ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(articleId);
      const isNumeric = /^\d+$/.test(articleId);
      
      if (!isUUID && !isNumeric) {
        throw new Error('Article ID must be a valid number or UUID');
      }

      // Validate article data is provided
      if (!articleData?.title || !articleData?.content) {
        throw new Error('Article title and content must be provided');
      }

      // Sanitize title - replace various dash characters with regular hyphen
      const sanitizedTitle = articleData.title
        .replace(/[–—−]/g, '-') // Replace en dash, em dash, minus sign with regular hyphen
        .replace(/[""]/g, '"') // Replace smart quotes with regular quotes
        .replace(/['']/g, "'") // Replace smart apostrophes with regular apostrophes
        .trim();

      console.log(`🚀 Starting translation for article ${articleId}...`);
      
      const requestPayload = {
        articleId: articleId, // Keep as string to support both numeric and UUID
        articleTitle: sanitizedTitle,
        articleContent: articleData.content,
        targetLanguages
      };
      
      console.log('📤 Request payload being sent to API Gateway:', JSON.stringify(requestPayload, null, 2));
      
      const apiUrl = getApiUrl(API_CONFIG.endpoints.admin.startTranslation);
      console.log('🌐 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('📥 API Gateway response status:', response.status);
      console.log('📥 API Gateway response headers:', [...response.headers.entries()]);
      
      const responseText = await response.text();
      console.log('📥 Raw API Gateway response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('📥 Parsed API Gateway response:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.error('❌ Failed to parse response as JSON:', e);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (!response.ok) {
        console.error('❌ API Gateway error response:', response.status, response.statusText);
        console.error('❌ Error response body:', responseText);
        throw new Error(result?.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (!result.success) {
        console.error('❌ API Gateway returned success=false:', result);
        throw new Error(result.error || 'Failed to start translation');
      }

      console.log('✅ Translation workflow started:', result);

      // Start polling for status updates
      const startTime = Date.now();
      let pollCount = 0;

      const poll = async () => {
        try {
          pollCount++;
          console.log(`📊 Polling attempt ${pollCount} for article ${articleId}...`);

          const status = await checkTranslationStatus(articleId.toString());
          
          if (status) {
            setTranslationStatus(status);
            
            console.log('📈 Translation status:', {
              status: status.status,
              progress: status.progress,
              isComplete: status.isComplete
            });

            // Check if completed
            if (status.isComplete) {
              console.log('✅ Translation completed successfully!');
              setIsTranslating(false);
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              return;
            }

            // Check if failed
            if (status.isFailed) {
              console.log('❌ Translation failed');
              setError(`Translation failed: ${status.message}`);
              setIsTranslating(false);
              if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
              return;
            }
          }

          // Check timeout
          if (Date.now() - startTime > maxPollingTime) {
            console.log('⏰ Translation polling timeout');
            setError('Translation is taking longer than expected. Please check back later.');
            setIsTranslating(false);
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            return;
          }

        } catch (pollError) {
          console.error('❌ Polling error:', pollError);
          // Don't stop polling for individual poll errors, just log them
        }
      };

      // Start polling immediately, then every 20 seconds
      poll();
      pollingRef.current = setInterval(poll, pollingFrequency);

      return result;

    } catch (err) {
      console.error('❌ Translation start failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsTranslating(false);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }, [checkTranslationStatus, maxPollingTime, pollingFrequency]);

  const stopTranslation = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsTranslating(false);
    console.log('🛑 Stopped translation polling');
  }, []);

  return {
    translationStatus,
    isTranslating,
    error,
    startTranslation,
    stopTranslation,
    checkTranslationStatus
  };
};
