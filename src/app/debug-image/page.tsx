'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function DebugImagePage() {
  const [imageUrl, setImageUrl] = useState('https://d2w4vhlo0um37d.cloudfront.net/articles/9a4960ce-a2d8-484f-b8cf-62ff8c2ba99d/featured/1752998014899.png');
  const [imageStatus, setImageStatus] = useState('');
  const [imageInfo, setImageInfo] = useState<any>({});

  const testImage = () => {
    setImageStatus('Testing...');
    
    const img = new window.Image();
    
    img.onload = () => {
      setImageStatus('✅ Image loaded successfully');
      setImageInfo({
        width: img.naturalWidth,
        height: img.naturalHeight,
        complete: img.complete
      });
    };
    
    img.onerror = (error) => {
      setImageStatus('❌ Image failed to load');
      setImageInfo({ error: error.toString() });
      console.error('Image load error:', error);
    };
    
    img.src = imageUrl;
  };

  const testFetch = async () => {
    try {
      setImageStatus('Testing with fetch...');
      const response = await fetch(imageUrl, { method: 'HEAD' });
      setImageStatus(`Fetch response: ${response.status} ${response.statusText}`);
      setImageInfo({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (error: any) {
      setImageStatus('❌ Fetch failed');
      setImageInfo({ error: error.toString() });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Image Debug Tool</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={testImage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Image Load
          </button>
          <button
            onClick={testFetch}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Fetch
          </button>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">Status:</h3>
          <p>{imageStatus}</p>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">Image Info:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(imageInfo, null, 2)}
          </pre>
        </div>
        
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Direct Image Display:</h3>
          <Image
            src={imageUrl}
            alt="Test"
            width={400}
            height={300}
            className="max-w-full h-auto border"
            onLoad={() => console.log('Direct img onLoad triggered')}
            onError={(e) => {
              console.error('Direct img onError triggered:', e);
              e.currentTarget.style.border = '2px solid red';
            }}
          />
        </div>
        
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Background Image Display:</h3>
          <div
            className="w-full h-64 bg-cover bg-center border"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </div>
      </div>
    </div>
  );
}
