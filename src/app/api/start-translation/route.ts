import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

const API_BASE_URL = API_CONFIG.baseUrl;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Frontend API: Starting translation workflow...');
    
    // Parse request body
    const body = await request.json();
    console.log('📥 Frontend received body:', JSON.stringify(body, null, 2));
    
    const { articleId, articleTitle, articleContent, targetLanguages } = body;

    // Validate input
    if (!articleId || !articleTitle || !articleContent) {
      console.error('❌ Missing required fields:', { articleId: !!articleId, articleTitle: !!articleTitle, articleContent: !!articleContent });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: articleId, articleTitle, or articleContent' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    // Ensure articleId is a number
    const numericArticleId = parseInt(articleId);
    if (isNaN(numericArticleId)) {
      console.error('❌ Invalid articleId:', articleId);
      return NextResponse.json(
        { success: false, error: 'articleId must be a valid number' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    console.log('📡 Forwarding to backend translation endpoint...');

    // Prepare payload for backend
    const backendPayload = {
      articleId: numericArticleId,
      articleTitle,
      articleContent,
      targetLanguages: targetLanguages || ['es', 'fr', 'de', 'it']
    };

    console.log('📤 Sending to backend:', {
      url: `${API_CONFIG.backendUrl}/start-translation`,
      payload: {
        ...backendPayload,
        articleContent: `${articleContent.substring(0, 100)}...` // Truncate for logging
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Forward to backend API (Step Function integration)
    const backendUrl = `${API_BASE_URL}/start-translation`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
    });

    console.log('📨 Backend response status:', response.status);
    console.log('📨 Backend response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    try {
      data = await response.json();
      console.log('📨 Backend response data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse backend response as JSON:', parseError);
      const textResponse = await response.text();
      console.error('❌ Raw backend response:', textResponse);
      data = { success: false, error: 'Invalid response format', rawResponse: textResponse };
    }

    if (!response.ok) {
      console.error('❌ Backend translation failed:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to start translation' },
        { 
          status: response.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    console.log('✅ Translation workflow started successfully:', data);

    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('💥 Frontend API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
