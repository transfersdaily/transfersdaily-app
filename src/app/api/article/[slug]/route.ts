import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    console.log(`🔍 Local API: Fetching article ${slug} for language ${language}`);

    if (!API_CONFIG.baseUrl) {
      return NextResponse.json(
        { success: false, error: 'API configuration missing' },
        { status: 500 }
      );
    }

    const apiUrl = `${API_CONFIG.baseUrl}/public/articles/${slug}?language=${language}`;
    console.log(`📡 Local API: Calling ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // No Origin header for server-to-server calls
      },
      signal: AbortSignal.timeout(10000)
    });

    console.log(`📊 Local API: Response status ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Local API: Error response: ${errorText}`);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ Local API: Success, article found: ${!!data.data?.article}`);

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Local API: Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
