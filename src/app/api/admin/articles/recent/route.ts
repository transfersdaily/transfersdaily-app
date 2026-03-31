import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;
const API_KEY = process.env.API_GATEWAY_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '5';
    const url = `${API_BASE_URL}/admin/articles?sortBy=created_at&sortOrder=desc&limit=${limit}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user!.id,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Recent articles proxy error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const raw = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        articles: raw.items || [],
      },
    });
  } catch (error) {
    console.error('Recent articles proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent articles' },
      { status: 500 }
    );
  }
}
