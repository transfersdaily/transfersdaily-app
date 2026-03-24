import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config';
import { validateAuth } from '@/lib/supabase/auth-guard';

const API_BASE_URL = API_CONFIG.baseUrl;
const API_KEY = process.env.API_GATEWAY_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth();
    if (authError) return authError;

    // Forward query params from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/admin/articles${queryString ? `?${queryString}` : ''}`;

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
      console.error('Articles list proxy error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const raw = await response.json();

    // Transform Lambda response to frontend expected format
    // Lambda returns: { items: [...], total: 123, page: 1, limit: 20, pages: 7 }
    // Frontend expects: { success: true, data: { articles: [...], pagination: { page, limit, total, totalPages } } }
    return NextResponse.json({
      success: true,
      data: {
        articles: raw.items || [],
        pagination: {
          page: raw.page || 1,
          limit: raw.limit || 20,
          total: raw.total || 0,
          totalPages: raw.pages || 1,
        },
      },
    });
  } catch (error) {
    console.error('Articles list proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
