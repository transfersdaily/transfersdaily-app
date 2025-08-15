import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

const API_BASE_URL = API_CONFIG.baseUrl;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Frontend API: Starting bulk translation workflow...');
    
    // Parse request body
    const body = await request.json();
    console.log('📥 Frontend received body:', JSON.stringify(body, null, 2));
    
    const { articleIds, targetLanguages } = body;

    // Validate input
    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      console.error('❌ Missing or invalid articleIds:', articleIds);
      return NextResponse.json(
        { success: false, error: 'articleIds must be a non-empty array' },
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

    if (!targetLanguages || !Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      console.error('❌ Missing or invalid targetLanguages:', targetLanguages);
      return NextResponse.json(
        { success: false, error: 'targetLanguages must be a non-empty array' },
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

    console.log(`📡 Forwarding bulk translation for ${articleIds.length} articles to backend...`);

    // Prepare payload for backend
    const backendPayload = {
      articleIds,
      targetLanguages
    };

    console.log('📤 Sending to backend:', {
      url: `${API_BASE_URL}/bulk-translate`,
      payload: backendPayload,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Forward to backend API (Step Function integration)
    const backendUrl = `${API_BASE_URL}/bulk-translate`;
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
      console.error('❌ Backend bulk translation failed:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to start bulk translation' },
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

    console.log('✅ Bulk translation workflow started successfully:', data);

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
