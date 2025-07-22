'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageDebuggerProps {
  imageUrl?: string;
}

export function ImageDebugger({ imageUrl }: ImageDebuggerProps) {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const runImageTests = async () => {
    if (!imageUrl) {
      setTestResults({ error: 'No image URL provided' });
      return;
    }

    setIsLoading(true);
    const results: any = {
      url: imageUrl,
      timestamp: new Date().toISOString(),
    };

    try {
      // Test 1: HEAD request
      console.log('🔍 Testing HEAD request...');
      const headResponse = await fetch(imageUrl, { method: 'HEAD' });
      results.headRequest = {
        status: headResponse.status,
        statusText: headResponse.statusText,
        headers: Object.fromEntries(headResponse.headers.entries()),
      };
      console.log('✅ HEAD request result:', results.headRequest);

      // Test 2: GET request
      console.log('🔍 Testing GET request...');
      const getResponse = await fetch(imageUrl);
      results.getRequest = {
        status: getResponse.status,
        statusText: getResponse.statusText,
        headers: Object.fromEntries(getResponse.headers.entries()),
        size: getResponse.headers.get('content-length'),
      };
      console.log('✅ GET request result:', results.getRequest);

      // Test 3: Image loading test
      console.log('🔍 Testing image loading...');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
            complete: img.complete,
          });
        };
        img.onerror = (error) => {
          reject(error);
        };
        img.src = imageUrl;
      });

      try {
        const imageLoadResult = await imageLoadPromise;
        results.imageLoad = { success: true, ...imageLoadResult };
        console.log('✅ Image load result:', results.imageLoad);
      } catch (imageError) {
        results.imageLoad = { success: false, error: imageError };
        console.error('❌ Image load failed:', imageError);
      }

    } catch (error) {
      results.error = error;
      console.error('❌ Test failed:', error);
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    if (imageUrl) {
      runImageTests();
    }
  }, [imageUrl]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Image Debug Results
          <Button 
            onClick={runImageTests} 
            disabled={isLoading || !imageUrl}
            size="sm"
          >
            {isLoading ? 'Testing...' : 'Retest'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Image URL:</strong>
            <div className="bg-gray-100 p-2 rounded text-sm font-mono break-all">
              {imageUrl || 'No URL provided'}
            </div>
          </div>

          {testResults.headRequest && (
            <div>
              <strong>HEAD Request:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(testResults.headRequest, null, 2)}
              </pre>
            </div>
          )}

          {testResults.getRequest && (
            <div>
              <strong>GET Request:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(testResults.getRequest, null, 2)}
              </pre>
            </div>
          )}

          {testResults.imageLoad && (
            <div>
              <strong>Image Load Test:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(testResults.imageLoad, null, 2)}
              </pre>
            </div>
          )}

          {testResults.error && (
            <div>
              <strong>Error:</strong>
              <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(testResults.error, null, 2)}
              </pre>
            </div>
          )}

          {imageUrl && (
            <div>
              <strong>Direct Image Test:</strong>
              <div className="border p-4 rounded">
                <img 
                  src={imageUrl} 
                  alt="Test image"
                  className="max-w-full h-auto"
                  onLoad={() => console.log('✅ Direct image loaded')}
                  onError={(e) => console.error('❌ Direct image failed:', e)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
